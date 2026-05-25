const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

// ── Config file discovery ────────────────────────────────────────────
const DEFAULT_CONFIG_PATHS = [
  'claude_desktop_config.json',
  '.cursor/mcp.json',
  '.vscode/mcp.json',
  'mcp.json',
  '.mcp.json',
  'cline_mcp_settings.json',
  '.claude/settings.json',
  '.claude/settings.local.json',
  '.claude.json',
];

function discoverConfigFiles(workspace, extraPaths) {
  const found = [];
  const allPaths = [...DEFAULT_CONFIG_PATHS];

  if (extraPaths) {
    allPaths.push(...extraPaths.split(',').map(p => p.trim()).filter(Boolean));
  }

  for (const configPath of allPaths) {
    const fullPath = path.join(workspace, configPath);
    if (fs.existsSync(fullPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        found.push({ path: configPath, content });
        core.info(`Found config: ${configPath}`);
      } catch (e) {
        core.warning(`Failed to parse ${configPath}: ${e.message}`);
      }
    }
  }

  return found;
}

// ── Server extraction ────────────────────────────────────────────────
function extractServers(configs) {
  const servers = new Map(); // name -> { source, identifiers[] }

  for (const { path: configPath, content } of configs) {
    // Strategy: look for mcpServers key at any level, or treat top-level keys as servers
    const mcpServers = findMcpServers(content);

    if (mcpServers && typeof mcpServers === 'object') {
      for (const [name, config] of Object.entries(mcpServers)) {
        if (typeof config !== 'object' || config === null) continue;

        const identifiers = [name];

        // Extract URL if present
        if (config.url) identifiers.push(config.url);
        if (config.endpoint) identifiers.push(config.endpoint);

        // Extract npm package from args
        if (config.args && Array.isArray(config.args)) {
          for (const arg of config.args) {
            if (typeof arg === 'string' && (arg.startsWith('@') || arg.includes('mcp'))) {
              identifiers.push(arg);
            }
          }
        }

        // Extract from command if it's a known server
        if (config.command && typeof config.command === 'string') {
          if (config.command !== 'npx' && config.command !== 'node' && config.command !== 'uvx' && config.command !== 'python') {
            identifiers.push(config.command);
          }
        }

        servers.set(name, {
          source: configPath,
          identifiers: [...new Set(identifiers)],
        });
      }
    }
  }

  return servers;
}

function findMcpServers(obj) {
  if (!obj || typeof obj !== 'object') return null;

  // Direct mcpServers key
  if (obj.mcpServers) return obj.mcpServers;

  // servers key (some formats)
  if (obj.servers && typeof obj.servers === 'object' && !Array.isArray(obj.servers)) {
    return obj.servers;
  }

  // Check if top-level keys look like server configs (have command/url/type)
  const topKeys = Object.keys(obj);
  const looksLikeServers = topKeys.some(k => {
    const v = obj[k];
    return v && typeof v === 'object' && (v.command || v.url || v.type || v.endpoint || v.transport);
  });
  if (looksLikeServers) return obj;

  // Search one level deep
  for (const key of topKeys) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const found = obj[key].mcpServers;
      if (found) return found;
    }
  }

  return null;
}

// ── API calls ────────────────────────────────────────────────────────
const API_BASE = 'https://dominionobservatory.com/api/trust';
const API_TIMEOUT = 10000;

async function checkTrust(identifier) {
  const url = `${API_BASE}?url=${encodeURIComponent(identifier)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return { found: false, error: `HTTP ${response.status}` };
    }

    return await response.json();
  } catch (e) {
    return { found: false, error: e.message };
  }
}

async function queryAllServers(servers) {
  const results = [];
  const entries = Array.from(servers.entries());

  for (const [name, { source, identifiers }] of entries) {
    let bestResult = null;

    // Try each identifier, use the first one that returns found:true
    for (const id of identifiers) {
      core.info(`Checking "${name}" with identifier: ${id}`);
      const result = await checkTrust(id);

      if (result.found || result.trust_score !== undefined) {
        bestResult = result;
        break;
      }

      // Keep the first result as fallback (may have suggestions)
      if (!bestResult) bestResult = result;
    }

    results.push({
      name,
      source,
      identifiers,
      ...(bestResult || { found: false, error: 'No API response' }),
    });

    // Small delay between servers to be polite
    if (entries.indexOf([name, { source, identifiers }]) < entries.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return results;
}

// ── Grade helper ─────────────────────────────────────────────────────
function getGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function getEmoji(score, threshold) {
  if (score === null || score === undefined) return ':grey_question:';
  if (score >= 80) return ':white_check_mark:';
  if (score >= threshold) return ':warning:';
  return ':x:';
}

// ── Reporting ────────────────────────────────────────────────────────
async function postPRComment(results, threshold, octokit, context) {
  const marker = '<!-- mcp-trust-check -->';
  const { owner, repo } = context.repo;
  const prNumber = context.payload.pull_request?.number;

  if (!prNumber) {
    core.info('Not a PR event, skipping PR comment');
    return;
  }

  const body = formatResultsMarkdown(results, threshold, marker);

  // Find existing comment
  const { data: comments } = await octokit.rest.issues.listComments({
    owner, repo, issue_number: prNumber,
  });

  const existing = comments.find(c => c.body && c.body.includes(marker));

  if (existing) {
    await octokit.rest.issues.updateComment({
      owner, repo, comment_id: existing.id, body,
    });
    core.info('Updated existing PR comment');
  } else {
    await octokit.rest.issues.createComment({
      owner, repo, issue_number: prNumber, body,
    });
    core.info('Created new PR comment');
  }
}

function formatResultsMarkdown(results, threshold, marker = '') {
  const serverCount = results.length;
  const belowThreshold = results.filter(r => r.trust_score !== undefined && r.trust_score < threshold);
  const notFound = results.filter(r => !r.found && r.trust_score === undefined);

  let md = marker ? `${marker}\n` : '';
  md += `## :shield: MCP Trust Check\n\n`;
  md += `> Behavioral trust scores from [Dominion Observatory](https://dominionobservatory.com) | `;
  md += `Threshold: **${threshold}** | Servers: **${serverCount}**\n\n`;

  if (belowThreshold.length > 0) {
    md += `:rotating_light: **${belowThreshold.length} server(s) below trust threshold (${threshold})**\n\n`;
  } else if (serverCount > 0 && notFound.length < serverCount) {
    md += `:white_check_mark: **All servers pass trust threshold**\n\n`;
  }

  md += `| Server | Score | Grade | Category | Config | Status |\n`;
  md += `|--------|-------|-------|----------|--------|--------|\n`;

  for (const r of results) {
    const score = r.trust_score !== undefined ? r.trust_score : '--';
    const grade = r.trust_score !== undefined ? `**${r.grade || getGrade(r.trust_score)}**` : '--';
    const category = r.category || '--';
    const emoji = r.trust_score !== undefined ? getEmoji(r.trust_score, threshold) : ':grey_question:';
    const status = r.trust_score !== undefined
      ? (r.trust_score >= threshold ? 'PASS' : 'FAIL')
      : (r.error ? 'NOT FOUND' : 'UNKNOWN');

    md += `| ${r.name} | ${score} | ${grade} | ${category} | \`${r.source}\` | ${emoji} ${status} |\n`;
  }

  md += `\n---\n`;
  md += `<sub>Powered by [Dominion Observatory](https://dominionobservatory.com) — behavioral trust scoring for 14,800+ MCP servers. `;
  md += `[Check any server](https://dominionobservatory.com/check) | [Browse directory](https://dominionobservatory.com/servers/) | `;
  md += `[API](https://dominionobservatory.com/api/trust?url=brave-search)</sub>\n`;

  return md;
}

function writeJobSummary(results, threshold) {
  const md = formatResultsMarkdown(results, threshold);
  core.summary.addRaw(md).write();
}

// ── Main ─────────────────────────────────────────────────────────────
async function run() {
  try {
    const threshold = parseInt(core.getInput('threshold') || '50', 10);
    const failBelowThreshold = core.getInput('fail_below_threshold') === 'true';
    const configPaths = core.getInput('config_paths') || '';
    const commentOnPR = core.getInput('comment_on_pr') !== 'false';
    const token = core.getInput('github_token');

    const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
    core.info(`Scanning for MCP configs in: ${workspace}`);
    core.info(`Trust threshold: ${threshold}`);

    // Phase 1: Discover config files
    const configs = discoverConfigFiles(workspace, configPaths);

    if (configs.length === 0) {
      core.info('No MCP configuration files found. Nothing to check.');
      core.setOutput('servers_found', '0');
      core.setOutput('servers_below_threshold', '0');
      core.setOutput('results_json', '[]');
      return;
    }

    core.info(`Found ${configs.length} config file(s)`);

    // Phase 2: Extract servers
    const servers = extractServers(configs);
    const serverCount = servers.size;

    if (serverCount === 0) {
      core.info('No MCP servers found in config files.');
      core.setOutput('servers_found', '0');
      core.setOutput('servers_below_threshold', '0');
      core.setOutput('results_json', '[]');
      return;
    }

    core.info(`Discovered ${serverCount} MCP server(s)`);

    // Phase 3: Query API
    const results = await queryAllServers(servers);

    // Phase 4: Report
    const belowThreshold = results.filter(r =>
      r.trust_score !== undefined && r.trust_score < threshold
    );

    // Set outputs
    core.setOutput('servers_found', String(serverCount));
    core.setOutput('servers_below_threshold', String(belowThreshold.length));
    core.setOutput('results_json', JSON.stringify(results));

    // Write job summary
    writeJobSummary(results, threshold);

    // Post PR comment
    if (commentOnPR && token) {
      try {
        const octokit = github.getOctokit(token);
        await postPRComment(results, threshold, octokit, github.context);
      } catch (e) {
        core.warning(`Failed to post PR comment: ${e.message}`);
      }
    }

    // Log results
    for (const r of results) {
      if (r.trust_score !== undefined) {
        const msg = `${r.name}: score ${r.trust_score} (${r.grade || getGrade(r.trust_score)})`;
        if (r.trust_score < threshold) {
          core.warning(msg + ` — BELOW THRESHOLD (${threshold})`);
        } else {
          core.info(msg + ' — PASS');
        }
      } else {
        core.warning(`${r.name}: not found in Dominion Observatory`);
      }
    }

    // Fail if configured
    if (failBelowThreshold && belowThreshold.length > 0) {
      core.setFailed(
        `${belowThreshold.length} server(s) scored below trust threshold (${threshold}): ` +
        belowThreshold.map(r => `${r.name} (${r.trust_score})`).join(', ')
      );
    }

  } catch (error) {
    core.setFailed(`MCP Trust Check failed: ${error.message}`);
  }
}

run();
