# RUN-024 Portfolio Management — Tuesday 2026-04-28

## A. KILL — EXP-018a (early pattern kill)

**EXP-018a: /compare/ citation surface**
- Launched: 2026-04-22 | Kill date: 2026-05-06 | Days alive: 6 | Signal: 0
- Conviction at launch: 5/10 | At kill: 4/10
- Kill rationale: 5th consecutive pull surface at zero signal. Pattern is definitive:
  EXP-012b (48h report), EXP-017a (/rfc JSON twin), and now EXP-018a are all pull surfaces
  deployed to an empty discovery funnel. Zero signal in 6 days on a 5th pull surface = sunk-cost kill.
  EXP-017a was killed at D6 for the same reason on Monday. EXP-018a is structurally identical.
  Slot freed for push-surface experiment (EXP-024a).
- **Status: KILLED** (early pattern kill, D6, pull surface #5)
- Genome WHAT FAILS addition: Pull-surface experiments in DISCOVERY bottleneck produce zero signal
  regardless of surface quality. Observatory has no inbound funnel. Push-surface tactics required.

## B. No graduations

No experiment has hit success metric. Status unchanged.
- EXP-021a: CEO BLOCKED (PR #6 unmerged). Still live on paper.
- EXP-023a: 1 day old. No signal yet (expected — outreach file exists, CEO post pending).

## C. LAUNCH — EXP-024a (A2A Behavioral Evidence Endpoint)

**EXP-024a: A2A-Compatible Behavioral Evidence Endpoint + Protocol Bridge**

- **Hypothesis:** Shipping a live `/v1/behavioral-evidence` endpoint in A2A evidence_ref format +
  posting CEO comments in A2A #1631/#1755 referencing the live API will get a maintainer reply
  that permanently cites Observatory in the A2A protocol discussion — converting DISCOVERY bottleneck
  by embedding Observatory in a protocol developers implement.
- **Originality prior-art search:**
  - "A2A evidence_ref MCP behavioral attestation endpoint" → no results
  - "behavioral oracle A2A a2aproject evidence_ref live endpoint" → no results
  - "mcp-behavioral-evidence-v1.0 schema" → no results
  - "/.well-known/mcp-observatory" → no results
  - Conclusion: NO PRIOR ART. Empire ships first.
- **Ships this run:**
  - `/v1/behavioral-evidence` → LIVE 200 (verified post-deploy)
  - `/.well-known/mcp-observatory` → LIVE 200 (verified post-deploy)
  - Gmail draft for CEO: A2A #1631 + #1755 comment text with live endpoint URLs
- **Not textbook:** No prior MCP trust registry has bridged to A2A evidence_ref schema or claimed
  `/.well-known/mcp-observatory` as a protocol discovery path. Cross-protocol composability claim.
- **Why now:** A2A Discussion #1631 has an open `evidence_ref` slot with no implementation.
  A2A Issue #1755 published 50-endpoint probe data with zero compliant endpoints — direct demand
  for behavioral telemetry. Slot is open; Observatory just shipped the only live implementation.
- **Constitution check:** ✅ C1 (GitHub public thread, agent-economy) | ✅ C2 (no human sales)
  | ✅ C3 (compounds toward $10K) | ✅ C4 (no prior art)
- **Success metric:** A2A maintainer (@darrelmiller or @brasseld) OR any contributor replies to
  #1631 or #1755 citing Observatory endpoint within 14 days, OR new external agent_id in
  /api/compliance with A2A referrer
- **Kill date:** 2026-05-12 (14 days)
- **Conviction:** 8/10
- **Status: LIVE**

## Portfolio (post-RUN-024)

| ID | Name | Launched | Kill | Conviction | Status | Signal |
|---|---|---|---|---|---|---|
| EXP-018a | /compare/ citation | 04-22 | — | 4/10 | **KILLED** (pattern kill D6) | 0 |
| EXP-018b | Composition-doctrine anchoring | 04-22 | 05-20 | 5/10 | LIVE | 0 (D6) |
| EXP-019a | /badge/ SVG parasite | 04-23 | 05-07 | 7/10 | LIVE | 0 (D5) |
| EXP-021a | ERC-8004 engagement | 04-25 | 05-09 | 8/10 | LIVE — CEO BLOCKED | 0 (PR #6 unmerged) |
| EXP-023a | Microsoft AGT bridge | 04-27 | 05-11 | 7/10 | LIVE | 0 (D1, CEO post pending) |
| EXP-024a | A2A evidence endpoint | 04-28 | 05-12 | 8/10 | LIVE | new this run |

Portfolio: 5/5. Three highest-conviction plays (EXP-021a, EXP-023a, EXP-024a) all require CEO action.
Escalated in Gmail brief. EXP-021a most urgent (PR #6 blocks comment that is 3d old).
