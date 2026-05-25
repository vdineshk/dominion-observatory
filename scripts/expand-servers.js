#!/usr/bin/env node
/**
 * expand-servers.js — Fetch MCP servers from external registries and import them
 * into Dominion Observatory via the /api/bulk-import endpoint.
 *
 * Sources:
 * 1. Official MCP Registry (registry.modelcontextprotocol.io)
 * 2. npm packages tagged with "mcp" or "model-context-protocol"
 * 3. GitHub search for MCP server repos
 *
 * Usage: node expand-servers.js [--dry-run]
 */

const OBSERVATORY_URL = 'https://dominionobservatory.com';
const BATCH_SIZE = 200;

async function fetchNpmMcpPackages(page = 0) {
  const servers = [];
  const keywords = ['mcp-server', 'model-context-protocol', 'mcp-tool'];

  for (const keyword of keywords) {
    try {
      const url = `https://registry.npmjs.org/-/v1/search?text=keywords:${keyword}&size=250&from=${page * 250}`;
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const data = await resp.json();
      for (const pkg of (data.objects || [])) {
        const p = pkg.package;
        servers.push({
          name: p.name,
          url: p.name, // npm package name as identifier
          description: (p.description || '').slice(0, 500),
          category: inferCategory(p.name, p.description || ''),
          github_url: extractGithubUrl(p.links)
        });
      }
    } catch (e) {
      console.error(`npm search error for ${keyword}:`, e.message);
    }
  }
  return servers;
}

async function fetchMcpRegistry() {
  const servers = [];
  try {
    const resp = await fetch('https://registry.modelcontextprotocol.io/servers');
    if (resp.ok) {
      const data = await resp.json();
      const list = Array.isArray(data) ? data : (data.servers || []);
      for (const s of list) {
        servers.push({
          name: s.name || s.id,
          url: s.url || s.npm_package || s.name || s.id,
          description: (s.description || '').slice(0, 500),
          category: s.category || inferCategory(s.name || '', s.description || ''),
          github_url: s.github_url || s.repository || null
        });
      }
    }
  } catch (e) {
    console.error('MCP Registry fetch error:', e.message);
  }
  return servers;
}

async function fetchGithubMcpRepos() {
  const servers = [];
  const queries = ['mcp-server', 'model-context-protocol server', 'mcp tool server'];

  for (const q of queries) {
    try {
      const resp = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=100`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'DominionObservatory/1.0' }
      });
      if (!resp.ok) continue;
      const data = await resp.json();
      for (const repo of (data.items || [])) {
        if (repo.archived || repo.disabled) continue;
        const name = repo.name.replace(/^mcp-server-?/i, '').replace(/-mcp$/i, '') || repo.name;
        servers.push({
          name: repo.full_name.split('/')[1] || name,
          url: repo.full_name,
          description: (repo.description || '').slice(0, 500),
          category: inferCategory(name, repo.description || ''),
          github_url: repo.html_url
        });
      }
      // Rate limit: wait between queries
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error('GitHub search error:', e.message);
    }
  }
  return servers;
}

function inferCategory(name, desc) {
  const text = `${name} ${desc}`.toLowerCase();
  if (/search|brave|google|bing|web.search/.test(text)) return 'search';
  if (/code|github|git|programming|ide|editor/.test(text)) return 'code';
  if (/database|sql|postgres|mongo|redis|sqlite/.test(text)) return 'database';
  if (/cloud|aws|azure|gcp|docker|kubernetes/.test(text)) return 'cloud';
  if (/browser|puppeteer|playwright|selenium|chrome/.test(text)) return 'browser';
  if (/file|filesystem|storage|s3|drive/.test(text)) return 'filesystem';
  if (/ai|llm|openai|anthropic|model|inference/.test(text)) return 'ai';
  if (/slack|discord|email|mail|chat|messaging/.test(text)) return 'communication';
  if (/security|auth|encrypt|firewall|scan/.test(text)) return 'security';
  if (/finance|payment|stripe|billing|accounting/.test(text)) return 'finance';
  if (/devops|ci|cd|deploy|monitor|observ/.test(text)) return 'devops';
  if (/data|analytics|scrape|fetch|api/.test(text)) return 'data';
  if (/productiv|notion|calendar|task|project/.test(text)) return 'productivity';
  return 'uncategorized';
}

function extractGithubUrl(links) {
  if (!links) return null;
  if (links.repository && links.repository.includes('github.com')) return links.repository;
  if (links.homepage && links.homepage.includes('github.com')) return links.homepage;
  return null;
}

async function bulkImport(servers, dryRun = false) {
  // Deduplicate by URL
  const seen = new Set();
  const unique = [];
  for (const s of servers) {
    const key = (s.url || s.name || '').toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      unique.push(s);
    }
  }

  console.log(`\nTotal unique servers to import: ${unique.length}`);

  if (dryRun) {
    console.log('DRY RUN — not importing. First 10:');
    unique.slice(0, 10).forEach(s => console.log(`  ${s.name} (${s.category}) — ${s.url}`));
    return;
  }

  let totalImported = 0, totalUpdated = 0, totalErrors = 0;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    try {
      const resp = await fetch(`${OBSERVATORY_URL}/api/bulk-import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servers: batch })
      });
      const data = await resp.json();
      totalImported += data.imported || 0;
      totalUpdated += data.updated || 0;
      totalErrors += data.errors || 0;
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: +${data.imported} imported, ${data.updated} updated, ${data.errors} errors`);
    } catch (e) {
      console.error(`Batch error at offset ${i}:`, e.message);
      totalErrors += batch.length;
    }
    // Rate limit between batches
    if (i + BATCH_SIZE < unique.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n=== Import Complete ===`);
  console.log(`Imported: ${totalImported}`);
  console.log(`Updated: ${totalUpdated}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Total: ${totalImported + totalUpdated + totalErrors}`);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log('Expanding Dominion Observatory server database...');
  console.log(dryRun ? '(DRY RUN mode)\n' : '\n');

  console.log('1. Fetching from npm registry...');
  const npmServers = await fetchNpmMcpPackages();
  console.log(`   Found ${npmServers.length} npm packages`);

  console.log('2. Fetching from MCP Registry...');
  const registryServers = await fetchMcpRegistry();
  console.log(`   Found ${registryServers.length} registry servers`);

  console.log('3. Fetching from GitHub...');
  const githubServers = await fetchGithubMcpRepos();
  console.log(`   Found ${githubServers.length} GitHub repos`);

  const allServers = [...npmServers, ...registryServers, ...githubServers];
  console.log(`\nTotal collected: ${allServers.length}`);

  await bulkImport(allServers, dryRun);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
