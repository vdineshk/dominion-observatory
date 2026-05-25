/**
 * Local test runner for MCP Trust Check
 * Usage: node test/run.js
 */
const path = require('path');
const fs = require('fs');

// Mock @actions/core
const outputs = {};
const warnings = [];
const infos = [];
let failedMsg = null;

const mockCore = {
  getInput: (name) => {
    const inputs = {
      threshold: '50',
      fail_below_threshold: 'false',
      config_paths: '',
      comment_on_pr: 'false',
      github_token: '',
    };
    return inputs[name] || '';
  },
  setOutput: (k, v) => { outputs[k] = v; },
  info: (msg) => { infos.push(msg); console.log(`  INFO: ${msg}`); },
  warning: (msg) => { warnings.push(msg); console.log(`  WARN: ${msg}`); },
  setFailed: (msg) => { failedMsg = msg; console.log(`  FAIL: ${msg}`); },
  summary: {
    addRaw: () => ({ write: () => {} }),
  },
};

// Inject mock before requiring index
require.cache[require.resolve('@actions/core')] = {
  id: '@actions/core',
  filename: require.resolve('@actions/core'),
  loaded: true,
  exports: mockCore,
};

// Override GITHUB_WORKSPACE to point at fixtures
process.env.GITHUB_WORKSPACE = path.join(__dirname, 'fixtures');

console.log('\n=== MCP Trust Check — Local Test ===\n');
console.log(`Fixtures dir: ${process.env.GITHUB_WORKSPACE}\n`);

// Run
const indexPath = path.join(__dirname, '..', 'index.js');

// Clear require cache for index.js to get fresh run
delete require.cache[indexPath];

// The index.js calls run() at module level, so just requiring it triggers execution
require(indexPath);

// Wait for async completion
setTimeout(() => {
  console.log('\n=== Results ===');
  console.log(`Servers found: ${outputs.servers_found || 0}`);
  console.log(`Below threshold: ${outputs.servers_below_threshold || 0}`);

  if (outputs.results_json) {
    const results = JSON.parse(outputs.results_json);
    console.log(`\nServer details:`);
    for (const r of results) {
      const score = r.trust_score !== undefined ? r.trust_score : 'N/A';
      const grade = r.grade || 'N/A';
      console.log(`  ${r.name}: score=${score}, grade=${grade}, source=${r.source}`);
    }
  }

  if (failedMsg) {
    console.log(`\nAction would FAIL: ${failedMsg}`);
    process.exit(1);
  }

  console.log('\nTest passed!');
}, 15000); // Wait 15s for API calls
