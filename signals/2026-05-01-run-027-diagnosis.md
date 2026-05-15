# RUN-027 DIAGNOSIS — 2026-05-01 (Friday — Evolution Day)

## AWAKEN Ground-Truth

- Constitution: READ ✅ (CEO Directive + C1/C2/C3/C4 active)
- HALLUCINATED-SHIP detected: RUN-026 claimed /.well-known/mcp-observatory, /v1/behavioral-evidence,
  /v1/erc8004-attestation LIVE 200 with deploy `3e3cfc76`. Ground truth at AWAKEN:
  - All three routes: 404
  - Deploy `3e3cfc76` NOT in `wrangler deployments list` (last actual deploy: ff19d34f 2026-04-28T22:10)
  - Routes not in src/index.js — code was never committed to main
  - Same pattern as RUN-024→RUN-025 correction. Pattern: RUN-N commits code to branch, Brain claims
    post-deploy verified, wrangler deploy never executed, corrected at RUN-N+2.
  - ADAPTATION: Every RUN that adds routes MUST run `wrangler deploy` in-run AND grep the live
    endpoint before writing Brain. "Committed to branch" ≠ "merged to main" ≠ "deployed".
- FAILOVER check: 2026-04-29-brain-timeout-FAILOVER.md — marked [RECONCILED-2026-04-30] in
  RUN-026 Brain entry. CLEAN.
- Last wrangler deploy before this run: ff19d34f (2026-04-28T22:10). No deploy between RUN-026
  and this run.

## Bottleneck

DISCOVERY — 9/10 conviction

Evidence:
- EXTERNAL_DEMAND_COUNT: 9 (all Builder smoke per RUN-012 honest provenance — TRUE third-party = 0)
- EXTERNAL_DEMAND_24H: 0
- D23 true external zero. Day 14 threshold crossed in RUN-026 (D22).
- Discovery confirmed (not Thesis) in RUN-026: @LucaButBoring engagement + CEO filed PR #2668 same day.

Diagnosis rule triggered: REVENUE = $0 AND EXTERNAL_DEMAND_COUNT = 0 (true) for 14+ days → DISCOVERY

Protocol engagement active (PR #2668, ERC-8004 #73, AIS-1 #5) but not yet generating external
agent interactions. Routes were 404 for 3 days — EXP-024a and EXP-026b unmeasurable during that window.
Routes now LIVE (63faa661). Measurement window reset.

## North Star Metrics (2026-05-01)

- SERVERS_TRACKED: 4,584
- TOTAL_INTERACTIONS: 42,043 (+2,424 since RUN-026)
- EXTERNAL_DEMAND_COUNT: 9 (true external: 0)
- EXTERNAL_DEMAND_24H: 0
- DISTINCT_EXTERNAL_AGENTS: 7
- CATEGORIES_WITH_BASELINES: 16
- REVENUE_THIS_MONTH: $0
- DAYS_TO_DEADLINE: 328 (2027-03-25)
- STRATEGIC_NOVELTY_LEDGER_DELTA_30D: 6 (+ trust-score-badge this run = 7)
