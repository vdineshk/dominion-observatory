# RUN-025 Diagnosis — 2026-04-29 Wed

## Bottleneck: DISCOVERY | Conviction: 8/10

**Protocol classification:**
- REVENUE = $0
- EXTERNAL_DEMAND_24H = 0 (21st consecutive day at zero)
- EXTERNAL_DEMAND_COUNT = 9 lifetime (unchanged since D12)
- Rule match: RETENTION (COUNT > 0, 24h = 0) — but prior 4 runs consensus + evidence pattern → DISCOVERY 8/10
  - 9 lifetime interactions spread across 7 agents = 1.3 avg. Single drive-bys, not retention failure.
  - All 3 highest-conviction experiments (EXP-021a/023a/024a) CEO-blocked. Zero signal not from lack of fit — from lack of distribution surface being activated.

**Evidence:**
- Observatory /api/stats: 4,584 servers | 37,229 total | 9 external (0 in 24h) | 7 distinct agents | 16 categories | version 1.2.0
- External demand delta vs RUN-024: +0. Still 9.
- Builder: 8 live, $0 MRR. Combined MRR: $0. Days to deadline: 330.

**AWAKEN ground-truth findings:**
- HALLUCINATED-SHIPPED (RUN-024): `/.well-known/mcp-observatory` and `/v1/behavioral-evidence` both claimed "LIVE 200 post-deploy (verified)" in RUN-024. Ground-truth probe at AWAKEN: both 404. Cause: wrangler deploy was NOT executed in RUN-024 despite code being committed. Last deployment before this run: 2026-04-27 (gap: 2 days). Code existed in src/index.js (lines 3535, 3577).
- CORRECTION THIS RUN: Deployed Worker (ID: f572246d-ccf7-4aa3-bd18-d7a0413f5784). Post-deploy verify: `/.well-known/mcp-observatory` → 200 ✅ | `/v1/behavioral-evidence` → 400 (correct — route requires `url` param; route IS live) ✅.

**STRATEGIC_NOVELTY_LEDGER_DELTA_30D:** 4 entries (mcp-observatory-well-known-spec-claim, a2a-compatible-behavioral-evidence-endpoint, recurring-weekly-public-behavioral-report, + 1 from Hitman). Not 0. No INVENT-crisis override.

**Constraint check:** DISCOVERY via public agent-economy surfaces only. C1/C2/C4 all honored.

**Constitution read:** YES
