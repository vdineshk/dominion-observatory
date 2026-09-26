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

function classifyResult(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { state: 'API_ERROR', found: false, trust_score: null, error: 'Invalid API payload' };
  }
  if (data.error) return { ...data, state: 'API_ERROR', trust_score: null };
  if (data.found === false) return { ...data, state: 'NOT_FOUND', trust_score: null };
  if (typeof data.trust_score === 'number' && Number.isFinite(data.trust_score) && data.trust_score >= 0 && data.trust_score <= 100) {
    return { ...data, state: 'MEASURED', found: true };
  }
  if ((data.trust_score === null || data.trust_score === undefined) &&
      (data.found === true || data.verdict === 'UNRATED' || data.status === 'UNRATED')) {
    return { ...data, state: 'UNRATED', trust_score: null };
  }
  return { ...data, state: 'API_ERROR', trust_score: null, error: 'Missing or invalid trust score/state' };
}

async function checkTrust(identifier) {
  const url = `${API_BASE}?url=${encodeURIComponent(identifier)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (response.status === 404) return { state: 'NOT_FOUND', found: false, trust_score: null };
    if (!response.ok) return { state: 'API_ERROR', found: false, trust_score: null, error: `HTTP ${response.status}` };
    return classifyResult(await response.json());
  } catch (e) {
    return { state: 'API_ERROR', found: false, trust_score: null, error: e.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function queryAllServers(servers) {
  const results = [];
  for (const [name, { source, identifiers }] of servers.entries()) {
    let bestResult = null;
    for (const id of identifiers) {
      core.info(`Checking "${name}" with identifier: ${id}`);
      const result = await checkTrust(id);
      if (result.state === 'MEASURED' || result.state === 'UNRATED') {
        bestResult = result;
        break;
      }
      // Preserve an API failure over a not-found fallback; neither passes.
      if (!bestResult || result.state === 'API_ERROR') bestResult = result;
    }
    results.push({ name, source, identifiers, ...(bestResult || {
      state: 'API_ERROR', found: false, trust_score: null, error: 'No API response',
    }) });
  }
  return results;
}

function readPolicy(name, defaultValue = 'fail') {
  const value = core.getInput(name) || defaultValue;
  if (!['fail', 'warn'].includes(value)) throw new Error(`${name} must be fail or warn`);
  return value;
}

function evaluateResults(results, threshold, policies) {
  return results.map(r => {
    const result = { ...r, ...classifyResult(r) };
    // Fetch failures have a distinct state even when found:false.
    if (r.state === 'API_ERROR' || r.state === 'NOT_FOUND') result.state = r.state;
    const measured = result.state === 'MEASURED';
    const below = measured && result.trust_score < threshold;
    const policy = measured ? (policies.failBelowThreshold ? 'fail' : 'warn') : policies[result.state];
    return { ...result, passed: measured && !below,
      action: measured && !below ? 'pass' : policy,
      below_threshold: below };
  });
}

// ── Grade helper ─────────────────────────────────────────────────────
function getGrade(score) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return '--';
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
  const belowThreshold = results.filter(r => r.state === 'MEASURED' && r.trust_score < threshold);
  const unknown = results.filter(r => r.state !== 'MEASURED');

  let md = marker ? `${marker}\n` : '';
  md += `## :shield: MCP Trust Check\n\n`;
  md += `> Behavioral trust scores from [Dominion Observatory](https://dominionobservatory.com) | `;
  md += `Threshold: **${threshold}** | Servers: **${serverCount}**\n\n`;

  if (belowThreshold.length > 0) {
    md += `:rotating_light: **${belowThreshold.length} server(s) below trust threshold (${threshold})**\n\n`;
  } else if (serverCount > 0 && unknown.length === 0) {
    md += `:white_check_mark: **All measured servers meet the score threshold (not a safety guarantee)**\n\n`;
  }

  md += `| Server | Score | Grade | Category | Config | Status |\n`;
  md += `|--------|-------|-------|----------|--------|--------|\n`;

  if (unknown.length) md += `**${unknown.length} server(s) have unknown results; these are not passing checks.**\n\n`;
  for (const r of results) {
    const measured = r.state === 'MEASURED';
    const score = measured ? r.trust_score : '--';
    const grade = measured ? `**${getGrade(r.trust_score)}**` : '--';
    const category = r.category || '--';
    const emoji = measured ? getEmoji(r.trust_score, threshold) : ':grey_question:';
    const status = measured ? (r.trust_score >= threshold ? 'MEASURED / PASS' : 'MEASURED / BELOW THRESHOLD') : r.state;
    md += `| ${r.name} | ${score} | ${grade} | ${category} | \`${r.source}\` | ${emoji} ${status} (${r.action || 'unevaluated'}) |\n`;
  }

  md += `\n---\n`;
  md += `<sub>Powered by [Dominion Observatory](https://dominionobservatory.com) — MCP projects indexed; behavioral scores only where runtime measurements exist. Others are UNRATED. `;
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
    const threshold = Number(core.getInput('threshold') || '50');
    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) throw new Error('threshold must be a number from 0 to 100');
    const failBelowThreshold = core.getInput('fail_below_threshold') === 'true';
    const policies = { failBelowThreshold, UNRATED: readPolicy('unrated_policy'), NOT_FOUND: readPolicy('not_found_policy'), API_ERROR: readPolicy('api_error_policy') };
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
      core.setOutput('servers_unknown', '0');
      core.setOutput('servers_passed', '0');
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
      core.setOutput('servers_unknown', '0');
      core.setOutput('servers_passed', '0');
      return;
    }

    core.info(`Discovered ${serverCount} MCP server(s)`);

    // Phase 3: Query API
    const results = evaluateResults(await queryAllServers(servers), threshold, policies);

    // Phase 4: Report
    const belowThreshold = results.filter(r =>
      r.state === 'MEASURED' && r.trust_score < threshold
    );

    // Set outputs
    core.setOutput('servers_found', String(serverCount));
    core.setOutput('servers_below_threshold', String(belowThreshold.length));
    core.setOutput('results_json', JSON.stringify(results));
    core.setOutput('servers_unknown', String(results.filter(r => r.state !== 'MEASURED').length));
    core.setOutput('servers_passed', String(results.filter(r => r.passed).length));

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

    for (const r of results) {
      const msg = `${r.name}: ${r.state}${r.state === 'MEASURED' ? ` score ${r.trust_score}` : ''} — ${r.action}${r.error ? ` (${r.error})` : ''}`;
      if (r.passed) core.info(msg); else core.warning(msg);
    }
    const failures = results.filter(r => r.action === 'fail');
    if (failures.length) core.setFailed(`${failures.length} server(s) blocked by policy: ` + failures.map(r => `${r.name} (${r.state})`).join(', '));

  } catch (error) {
    core.setFailed(`MCP Trust Check failed: ${error.message}`);
  }
}

if (require.main === module) run();
module.exports = { run, checkTrust, classifyResult, queryAllServers, evaluateResults, formatResultsMarkdown, getGrade };
