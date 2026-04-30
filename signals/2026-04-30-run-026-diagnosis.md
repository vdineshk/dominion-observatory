# RUN-026 Bottleneck Diagnosis — Thursday 2026-04-30

## AWAKEN Ground-Truth Verification
- /.well-known/mcp-observatory → 200 ✅ LIVE
- /v1/behavioral-evidence → 200 ✅ LIVE
- /v1/erc8004-attestation → 200 ✅ LIVE (NEW this run, deploy ID: 3e3cfc76)
- RUN-025 claimed deploy ID f572246d — HALLUCINATED. Wrangler deployment list showed
  last deploy was 2026-04-28T02:07 (698d9ca1). Routes were live from 2026-04-28 deploy.
  No regression. Flag logged.
- PR #2668 "SEP: Behavioral Trust Extension for MCP Registry" in
  modelcontextprotocol/modelcontextprotocol → REAL ✅ (CEO filed today 2026-04-30).
  EXP-025a GRADUATED → EXP-026a LAUNCHED (MCP TBF SEP tracking experiment).
- Brain: 219K chars (pruned from 290K+ by CEO). Writeable confirmed.
- Constitution read: DAEE-CONSTITUTION-V1-2026-04-25. All 4 constraints screened.
  0 violations this run.

## Observatory State (live API, 2026-04-30)
- Servers tracked: 4,584
- Total interactions: 39,619 (+2,390 since RUN-025)
- Interactions last 24h: 2,444 (all probe/keeper synthetic)
- External demand count: 9 (all Builder smoke per RUN-012 honest provenance — TRUE external = 0)
- External demand 24h: 0
- Distinct external agents: 7

## Bottleneck Diagnosis
**DISCOVERY-OR-THESIS** — Day 22 of true-zero external demand
- Conviction: 9/10
- Evidence: TRUE external_demand_count = 0 for 22 consecutive days. Day 14 threshold crossed.
  All 9 "external" rows are Builder smoke (confirmed RUN-012 honest provenance check).
- Discovery vs Thesis test: EXP-025a (@LucaButBoring redirect + "I would welcome a formal SEP")
  = DISCOVERY confirmed. Maintainer engaged. Flat → Thesis test NOT triggered.
  CEO filed MCP TBF SEP PR #2668 same day. This is the Discovery signal the Day 14 test required.
- STRATEGIC_NOVELTY_LEDGER_DELTA_30D: +4 entries in last 30d. Not in INVENT-crisis.
- Constitution check: DISCOVERY-OR-THESIS direction is C1/C2/C4-compliant (protocol spec
  filing is agent-economy, no human sales, no prior art found for MCP TBF SEP).

## Bottleneck Conviction Trajectory
- RUN-022: DISCOVERY 8/10 (D17)
- RUN-023: DISCOVERY 8/10 (D18)
- RUN-024: DISCOVERY 8/10 (D21)
- RUN-025: DISCOVERY 8/10 (D21, same day reported)
- RUN-026: DISCOVERY-OR-THESIS 9/10 (D22) — elevated conviction: Day 14 test active,
  but Discovery signal confirmed (maintainer engagement + formal SEP invitation)
