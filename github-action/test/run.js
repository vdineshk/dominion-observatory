const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const inputs = { threshold: '70', fail_below_threshold: 'true', comment_on_pr: 'false' };
let outputs, failure, summary;
const mockCore = {
  getInput: name => inputs[name] || '', setOutput: (k,v) => { outputs[k] = v; },
  info() {}, warning() {}, setFailed: msg => { failure = msg; },
  summary: { addRaw: md => { summary = md; return { write: async () => {} }; } },
};
require.cache[require.resolve('@actions/core')] = { exports: mockCore };
const { run, checkTrust, evaluateResults, formatResultsMarkdown, getGrade } = require('../index');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'dominion-action-'));
fs.writeFileSync(path.join(workspace, 'mcp.json'), JSON.stringify({mcpServers:{sample:{url:'https://example.org/mcp?a=1&b=2'}}}));
process.env.GITHUB_WORKSPACE = workspace;
const fixtures = [
  ['500', () => new Response('backend failure', {status:500}), 'API_ERROR', true],
  ['invalid JSON', () => new Response('<html>error</html>'), 'API_ERROR', true],
  ['UNRATED null', () => Response.json({found:true, trust_score:null, verdict:'UNRATED'}), 'UNRATED', true],
  ['UNRATED missing', () => Response.json({found:true}), 'UNRATED', true],
  ['rated below', () => Response.json({found:true, trust_score:42}), 'MEASURED', true],
  ['rated above', () => Response.json({found:true, trust_score:82}), 'MEASURED', false],
  ['zero score', () => Response.json({found:true, trust_score:0}), 'MEASURED', true],
  ['404', () => new Response('missing', {status:404}), 'NOT_FOUND', true],
  ['not found body', () => Response.json({found:false}), 'NOT_FOUND', true],
  ['invalid score', () => Response.json({found:true, trust_score:'82'}), 'API_ERROR', true],
  ['network error', () => { throw new Error('offline'); }, 'API_ERROR', true],
  ['empty object', () => Response.json({}), 'API_ERROR', true],
];
(async () => {
  for (const [name, response, state, fails] of fixtures) {
    global.fetch = async () => response(); outputs = {}; failure = null; summary = '';
    await run();
    const [result] = JSON.parse(outputs.results_json);
    assert.equal(result.state, state, name);
    assert.equal(Boolean(failure), fails, name);
    assert.equal(result.passed, !fails, name);
    assert.equal(outputs.servers_passed, fails ? '0' : '1', name);
    if (state !== 'MEASURED') {
      assert.equal(result.trust_score, null, name);
      assert.equal(outputs.servers_below_threshold, '0', name);
      assert.equal(outputs.servers_unknown, '1', name);
      assert.doesNotMatch(summary, /All measured servers meet|\*\*F\*\*/, name);
    }
  }
  for (const state of ['UNRATED','NOT_FOUND','API_ERROR']) {
    const policies = { failBelowThreshold:true, UNRATED:'warn', NOT_FOUND:'warn', API_ERROR:'warn' };
    const result = evaluateResults([{state, found:state==='UNRATED', trust_score:null, ...(state==='API_ERROR'?{error:'offline'}:{})}],70,policies)[0];
    assert.equal(result.action,'warn'); assert.equal(result.passed,false);
  }
  // Exercise warn policy through the complete entry point, independent from numeric threshold policy.
  inputs.unrated_policy = 'warn'; inputs.fail_below_threshold = 'false';
  global.fetch = async () => Response.json({found:true, trust_score:null}); outputs={}; failure=null;
  await run(); assert.equal(failure,null); assert.equal(outputs.servers_passed,'0');
  inputs.unrated_policy = 'fail'; outputs={}; failure=null;
  await run(); assert.ok(failure); // unknown still fails even if numeric gating disabled
  inputs.unrated_policy = 'maybe'; outputs={}; failure=null;
  await run(); assert.match(failure,/unrated_policy/);
  delete inputs.unrated_policy; inputs.threshold = '70garbage'; failure=null;
  await run(); assert.match(failure,/threshold/);
  inputs.threshold='70';
  let requested;
  global.fetch = async url => {requested=url; return Response.json({found:true,trust_score:82});};
  await checkTrust('https://example.org/mcp?a=1&b=2');
  assert.equal(new URL(requested).searchParams.get('url'),'https://example.org/mcp?a=1&b=2');
  assert.equal(getGrade(null),'--');
  const mixed = formatResultsMarkdown([{name:'rated', state:'MEASURED',trust_score:82},{name:'missing', state:'NOT_FOUND',trust_score:null}],70);
  assert.doesNotMatch(mixed,/All measured servers meet/);
  console.log(`PASS: ${fixtures.length} full-action HTTP/result scenarios plus policies, validation, URL encoding, and mixed reporting`);
})().catch(e => { console.error(e); process.exitCode=1; }).finally(() => fs.rmSync(workspace,{recursive:true,force:true}));
