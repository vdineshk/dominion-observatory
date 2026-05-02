# STRATEGIST RUN-028 — Experiment Portfolio
Date: 2026-05-02

## A. KILLS (past kill date OR surface dead)
**EXP-021a → KILLED**
- Reason: SURFACE-DEAD
- Surface: ethereum-magicians.org/t/erc-8004-trustless-agents/25098
- Confirmed dead: CEO attempted to post 2026-05-01 SGT; platform returned "topic was closed or deleted"
- Source: CEO-DIRECTIVE-STRATEGIST-RUN-028-AIS1-STRIKE-LANDED-AND-ERC8004-MAGICIANS-DEAD-2026-05-01
- WHAT FAILS entry: [2026-05-02] ERC-8004 ethereum-magicians thread — SURFACE-DEAD. Platform deleted/closed before we could post. Forum surfaces are ephemeral; validate URL 200 before generating draft (per ADAPTATION-2026-05-01-OUTREACH-SURFACE-PRE-VALIDATE).

## B. GRADUATIONS
None this run. Signals present but not sufficient:
- EXP-026a (SEP #2668): srotzin community comment positive, no maintainer review. Success metric = maintainer reply/review. Not yet.
- EXP-023a (AGT Microsoft): No new reply from AGT team. Success metric = formal protocol spec engagement. Not yet.

## C. LAUNCHES
**EXP-028a: AIS-1 BTP BREATHING-MONITOR**
- Hypothesis: AIS-1 v0.2 will incorporate behavioralTrustProfile property citing Observatory
- Originality: First behavioral trust voice in AIS-1 v0.1 spec; 0 prior proposals (SPIDER 6-surface search)
- Launched: 2026-05-01 (CEO posted comment; entering monitoring phase 2026-05-02)
- Phase: BREATHING-MONITOR (not full experiment — monitoring for maintainer response)
- Kill: 2026-06-30 (AIS-1 v0.1 comment period closes; no substantive maintainer reply by then = KILLED)
- Success: AIS-1 maintainer reply engaging behavioralTrustProfile OR v0.2 draft incorporating it
- Conviction launch/current: 8/10 / 8/10
- Status: LIVE (BREATHING-MONITOR)
- Signal: First behavioral trust voice in AIS-1 spec. No maintainer reply yet (D1).

**EXP-028b: Trust Delta Feed**
- Hypothesis: Agents monitoring MCP infrastructure will poll /api/trust-delta daily, increasing EXTERNAL_DEMAND_COUNT by 3-5 new agents within 14 days
- Originality: Prior-art search (5 surfaces): mcp.so, pulsemcp.com, shields.io, GitHub "mcp trust feed delta", Datadog MCP behavioral change feed → 0 matches. No "MCP behavioral change feed" product exists. Empire first.
- Why NOT textbook: Trust score delta feed for AI agent behavior monitoring is a new primitive. Existing scorers are static snapshots; nobody provides behavioral change velocity for MCP servers.
- Why it could work: 8 distinct external agents already call Observatory. A daily delta feed gives them a concrete reason to poll repeatedly — same compounding pattern as Datadog alerts for infra engineers, now for agent developers. Framework: Convener (#10).
- Launched: 2026-05-02 (this run) | Kill: 2026-05-16
- Success: ≥3 new distinct external agent interactions via /api/trust-delta within 14 days
- Conviction launch/current: 7/10 / 7/10
- Status: LIVE — /api/trust-delta deployed db8997b6, verified 200 at 2026-05-02T22:23:41Z
- First execution step: SHIPPED (endpoint LIVE)
- Constitution check: C1 ✅ (agent-economy, agents poll it) | C2 ✅ (no human sales) | C3 ✅ ($10K path via recurring agent subscriptions) | C4 ✅ (0 prior art)

## CURRENT PORTFOLIO (post-RUN-028)
1. EXP-023a — AGT Microsoft, posted D5 (D5 count since Apr 27), kill May 11 — signal awaited
2. EXP-024a — A2A evidence endpoint, kill 2026-05-15 — LIVE, monitoring inbound
3. EXP-026a — MCP TBF SEP #2668, kill 2026-05-14 — LIVE, srotzin community endorsement
4. EXP-026b — ERC-8004 attestation endpoint, kill 2026-05-17 — LIVE, monitoring inbound
5. EXP-027a — Trust-score-badge, kill 2026-05-15 — LIVE, seeding server owners
6. EXP-028b — Trust Delta Feed, kill 2026-05-16 — NEW LIVE

EXP-028a (AIS-1 BTP) → BREATHING-MONITOR (tracked separately, kill 2026-06-30)
