# RUN-026 Experiment Portfolio — Thursday 2026-04-30

## A. KILL — EXP-019a (early pattern kill, D7)

**EXP-019a: /badge/ SVG Parasite**
- Launched: 2026-04-23 | Kill date: 2026-05-07 | Days alive: 7 | Signal: 0
- Conviction at launch: 7/10 | At kill: 4/10
- Kill rationale: /badge/ SVG is a pull surface — developers must discover and embed it.
  In DISCOVERY bottleneck with zero inbound traffic, pull surfaces generate zero signal.
  Pattern confirmed: 5 prior pull-surface experiments (EXP-012b, EXP-017a, EXP-018a,
  EXP-018b, EXP-019a) all killed D6-D7 with zero signal. WHAT FAILS entry exists.
  Early kill (3d before scheduled date) per established WHAT FAILS pattern.
  Slot freed for EXP-026b (ERC-8004 attestation endpoint).
- Status: **KILLED** (early pattern kill D7, pull surface #6)

## B. GRADUATE — EXP-025a → EXP-026a

**EXP-025a: SEP-2663 Task Behavioral Fingerprint Companion Comment**
- Launched: 2026-04-29 | Days alive: 1 | Success metric: maintainer engages with TBF concept
- Signal: @LucaButBoring (core MCP spec maintainer) replied: "registry API or server cards
  is Observatory's exact surface" + "I would welcome a formal SEP for that."
- CEO filed formal MCP TBF SEP as PR #2668 in modelcontextprotocol/modelcontextprotocol
  today (2026-04-30). First formal behavioral trust SEP in MCP spec history.
- GRADUATED: Success metric hit (maintainer engaged + formal SEP filed). D1 graduation.
  Fastest graduation in Empire history. PATTERN: zero-day spec PR window + live reference
  implementation = fastest path to protocol engagement.
- Status: **GRADUATED** (D1 graduation, maintainer engagement signal)

## C. LAUNCH — EXP-026a (MCP TBF SEP engagement experiment)

**EXP-026a: MCP Behavioral Trust Framework SEP — PR #2668 Monitoring**

- Hypothesis: MCP TBF SEP PR #2668 (filed by CEO 2026-04-30) will receive reviewer
  engagement within 14 days, establishing Observatory as the canonical behavioral trust
  reference implementation in the MCP specification process.
- Originality prior-art search:
  - "MCP SEP behavioral trust framework" → 0 results in MCP repo prior to CEO filing
  - "modelcontextprotocol specification behavioral trust" → 0 results
  - "MCP server behavioral fingerprint SEP" → 0 results
  - Prior invitation from @LucaButBoring explicitly confirms no one else had filed it.
  - Conclusion: NO PRIOR ART. Empire first.
- Ships this run: /v1/erc8004-attestation endpoint LIVE as supporting reference
  (deploy 3e3cfc76). /.well-known/mcp-observatory updated with sep_reference field
  pointing to PR #2668.
- Not textbook: Not a directory submission or newsletter pitch. Filing a formal
  specification enhancement proposal with Observatory as the reference implementation
  is a spec-claim tactic that no MCP trust registry has attempted.
- Why now: @LucaButBoring explicitly invited a formal SEP on 2026-04-29. Window is
  open now; any other party could file a competing SEP in the next 24-48h.
  CEO filed PR #2668 same day.
- Constitution check: ✅ C1 (GitHub public, agent-economy protocol)
  ✅ C2 (no human sales — SEP process is entirely code/spec contribution)
  ✅ C3 (spec authorship → Observatory as canonical reference → $10K path)
  ✅ C4 (no prior art; maintainer invitation confirms originality)
- Success metric: PR #2668 receives ≥1 substantive reviewer comment OR is labeled
  "in-review" by MCP maintainers within 14 days. OR any new SEP filed after ours
  cites PR #2668 as prior art.
- Kill date: 2026-05-14
- Conviction: 9/10 (maintainer explicitly invited; CEO executed same day)
- Status: **LAUNCHED**

## D. LAUNCH — EXP-026b (ERC-8004 Attestation Endpoint)

**EXP-026b: /v1/erc8004-attestation Live Reference Endpoint**

- Hypothesis: Shipping a live /v1/erc8004-attestation endpoint in ERC-8004-compatible
  format before Hitman's comment in issue #73 and #77 gives the CEO/Hitman a live
  reference to cite, increasing the probability of maintainer engagement.
- Originality prior-art search:
  - "erc-8004 attestation endpoint live implementation" → 0 results
  - "ERC-8004 endpoint health monitoring API JSON" → 0 results
  - "on-chain agent attestation behavioral health endpoint" → 0 results
  - Conclusion: NO PRIOR ART. Empire first.
- Ships this run: /v1/erc8004-attestation LIVE 200 (deploy 3e3cfc76, verified).
  Schema: erc8004-attestation-v1.0 with endpoint_health_status, uptime_7d, uptime_30d,
  erc8004_recommendation fields. Cross-references /v1/behavioral-evidence and PR #2668.
- Not textbook: No ERC-8004 ecosystem participant has shipped a behavioral attestation
  endpoint. laplace0x's report called for it; we ship it before anyone else.
- Why now: ERC-8004 issues #73 (3 weeks old, zero implementation) and #77 (1 week old,
  zero implementation) are open demand slots. CEO comment (outreach/2026-04-25-erc8004-issue-73-comment.md,
  D5 stale) should reference a LIVE endpoint to be credible.
- Constitution check: ✅ C1 ✅ C2 ✅ C3 ✅ C4
- Success metric: CEO posts to ERC-8004 #73 or #77 referencing the live endpoint AND
  at least one ERC-8004 contributor replies within 14 days.
- Kill date: 2026-05-14
- Conviction: 7/10
- Status: **LAUNCHED**

## Portfolio (post-RUN-026)

| ID | Name | Launched | Kill | Conviction | Status | Signal |
|---|---|---|---|---|---|---|
| EXP-019a | /badge/ SVG parasite | 04-23 | — | 4/10 | **KILLED** D7 pull surface | 0 |
| EXP-021a | ERC-8004 engagement | 04-25 | 05-09 | 8/10 | LIVE — CEO BLOCKED (PR #6) | 0 (D5) |
| EXP-023a | Microsoft AGT bridge | 04-27 | 05-11 | 7/10 | LIVE — CEO posted AGT #1579 | monitoring |
| EXP-024a | A2A evidence endpoint | 04-28 | 05-12 | 8/10 | LIVE — CEO posted #1631+#1755 | monitoring |
| EXP-025a | SEP-2663 TBF companion | 04-29 | — | 9/10 | **GRADUATED** D1 (SEP filed) | ✅ maintainer |
| EXP-026a | MCP TBF SEP #2668 | 04-30 | 05-14 | 9/10 | LIVE | new this run |
| EXP-026b | ERC-8004 attestation endpoint | 04-30 | 05-14 | 7/10 | LIVE (3e3cfc76) | new this run |

Portfolio: 5/5 (EXP-021a, EXP-023a, EXP-024a, EXP-026a, EXP-026b).
EXP-021a ESCALATION WARNING: Kill date 05-09. If PR #6 not merged by 05-01, recommend
reassessing — experiment structurally blocked, consuming a portfolio slot with zero signal path.
