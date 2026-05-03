# STRATEGIST RUN-029 — Experiment Portfolio
Date: 2026-05-03 (Sunday)

## A. KILLS
None. No experiment past kill date. No zero-signal kills triggered today.
Note: Portfolio is at 6 experiments + 1 BREATHING-MONITOR = over 3-5 cap. Cannot kill prematurely per absolute kill rule. Will tighten when kill dates arrive this week (EXP-026a: May 14, EXP-023a: May 11).

## B. DOUBLE-DOWNS / SIGNAL UPDATES
**EXP-026a (MCP TBF SEP #2668):** Signal upgrade confirmed.
- PR OPEN. No maintainer review.
- Community: srotzin positive endorsement ("fills a real gap") + two-layer collaboration discussion (behavioral telemetry + crypto receipts) active as of 2026-05-03.
- vdineshk proposed combining Observatory behavioral layer with HiveMCP receipt layer.
- Conviction: 9/10 (holding).
- Kill date: 2026-05-14 (6 days). Extend if srotzin collaboration produces joint proposal.

**EXP-028b (trust-delta-feed):** Status correction — was NOT deployed (HALLUCINATED). First real deploy today (aa8594ca). Restart kill clock from today: kill 2026-05-17 (2 weeks from first real deploy). Conviction 7/10.

## C. LAUNCHES
**EXP-029a: MCP Server SLA Tier Certification**
- Hypothesis: Server operators and agent developers will query /api/sla-tier to filter production servers by certified reliability tier. Creates structural daily interaction from both sides (operators check their tier, developers filter by tier).
- Originality: Prior-art search (5 surfaces): "MCP server SLA tier certification behavioral data" → 0 matches in MCP ecosystem. Data center tier certification (Uptime Institute) exists for hardware, NOT for MCP server behavioral data. No prior art. C4 ✅.
- Why NOT textbook: Applying SLA tier certification to a behavioral data layer for AI agent MCP servers is a new primitive. Existing static scorers rank by metadata; nobody certifies operational SLA backed by live interaction data.
- Why it could work: 4,585 servers tracked, 8 Platinum-tier servers identified already. Developers need production-grade filters; "Gold+" tier is actionable shorthand. Framework pattern: Spec-claim (#8) + Convener (#10).
- Launched: 2026-05-03 | Kill: 2026-05-17
- Success: ≥3 new distinct external agent interactions via /api/sla-tier within 14 days
- Conviction launch/current: 7/10 / 7/10
- Status: LIVE — /api/sla-tier deployed 85dec99b, verified 200 with real tier data (8 Platinum, 3 Silver, 4 Bronze distribution)
- First execution step: SHIPPED (endpoint LIVE)
- Constitution check: C1 ✅ | C2 ✅ | C3 ✅ (tier-gated API access = monetization path) | C4 ✅ (0 prior art)

## CURRENT PORTFOLIO (post-RUN-029)
1. EXP-023a — AGT Microsoft (kill 2026-05-11) — monitoring, no reply D7
2. EXP-024a — A2A evidence endpoint (kill 2026-05-15) — LIVE, monitoring
3. EXP-026a — MCP TBF SEP #2668 (kill 2026-05-14) — srotzin collaboration signal, 9/10
4. EXP-026b — ERC-8004 attestation endpoint (kill 2026-05-17) — LIVE, monitoring
5. EXP-027a — Trust-score-badge (kill 2026-05-15) — LIVE, seeding
6. EXP-028b — Trust Delta Feed (kill 2026-05-17, RESET from today) — LIVE (first real deploy today)
7. EXP-029a — SLA Tier Certification (kill 2026-05-17) — NEW LIVE

EXP-028a (AIS-1 BTP) → BREATHING-MONITOR (kill 2026-06-30, no maintainer reply yet)

## NOTES
- Kill wave incoming: EXP-023a (May 11), EXP-026a (May 14), EXP-024a+027a (May 15), EXP-026b+028b+029a (May 17).
- If no signal on EXP-023a by May 11 → KILL, log WHAT FAILS.
- EXP-026a potential extension: joint srotzin/Observatory SEP proposal would be a D1 graduation event.
