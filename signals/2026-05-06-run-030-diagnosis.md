# RUN-030 — DIAGNOSIS — 2026-05-06 (Wednesday)

## Bottleneck: RETENTION
**Conviction: 7/10**

### Evidence
- EXTERNAL_DEMAND_COUNT: 10 (unchanged from RUN-029 — zero new external interactions in ~24h)
- EXTERNAL_DEMAND_24H: 0
- EXTERNAL_DEMAND_TOTAL: 10 from 8 distinct agents (all historical, no returns)
- MRR: $0
- Day 30+ of flat external demand
- Pattern: agents hit Observatory once, do not return

### Formula Applied
REVENUE=$0 AND EXTERNAL_DEMAND_COUNT>0 AND EXTERNAL_DEMAND_24H=0 → RETENTION

### Root Cause
No recurring-value mechanism drives agents back. Single-use endpoints (trust check,
leaderboard, stats) offer no reason to call daily. Agents discover, call once, move on.
PATTERN-031 confirmed: need recurring-value primitives.

### Interventions This Run
- EXP-029a fleet-monitor (RUN-029): 1 day old, monitoring
- EXP-028b trust-delta (RUN-028): approaching kill 2026-05-16, 0 external calls
- EXP-030a alert-subscribe (RUN-030): NEW — first-ever MCP behavioral drift push subscription registry

## Observatory State
- Servers: 4,586 | Total interactions: 55,083 | External: 10 | Distinct external: 8
- Categories: 16 | Avg trust score: 53.9 | MRR: $0 | Days to deadline: 323
