# STRATEGIST RUN-029 — Experiment Portfolio
Date: 2026-05-04

## A. KILLS

**EXP-026b → KILLED (early, surface-dead)**
- Name: ERC-8004 Attestation Endpoint
- Original hypothesis: ERC-8004 agents query /v1/erc8004-attestation for behavioral evidence
- Kill reason: Primary distribution surface (ethereum-magicians.org thread) confirmed dead
  2026-05-01. GitHub #73 done 2026-04-27. Issue #77 routed to Hitman — different surface,
  different experiment. The attestation endpoint stays LIVE but as supporting infrastructure,
  not an independent experiment. Zero inbound signal after 17 days.
- Kill date original: 2026-05-17 | Actual kill: 2026-05-04 (early — surface-dead)
- WHAT FAILS: Endpoint experiment without live distribution surface → zero signal. Never
  launch endpoint experiment without simultaneously owning a live outreach surface.

**EXP-027a → KILLED (early, no distribution mechanism)**
- Name: Trust-score-badge seeding
- Original hypothesis: Server owners embed Observatory badge, creating viral distribution
- Kill reason: "Seeding server owners" has no agent-economy distribution path (requires
  direct contact with server owners = potential C2 violation; or cold-posting their repos
  = C1/C2 edge). Badge endpoint stays LIVE (passive, anyone can discover it). No measurable
  success metric achievable without outreach. Kill date was May 15.
- Kill date original: 2026-05-15 | Actual kill: 2026-05-04 (early)
- WHAT FAILS: Passive endpoint without distribution plan cannot generate signal. Viral loops
  require a seeding mechanism; if seeding requires human contact, it violates C1/C2.

## B. GRADUATIONS
None this run.
- EXP-026a (SEP #2668): srotzin endorsement + vdineshk 7-day window proposal. No maintainer.
  Kill May 14 (10 days). Hold.
- EXP-028b (trust-delta): 2 days since launch. Too early.

## C. LAUNCHES

**EXP-029a: Agent Watchlist API**
- Hypothesis: Agents that create a personal watchlist return daily to poll their token,
  converting single-call churn into recurring retention. Target: 3 distinct external agents
  create watchlists within 14 days; 5+ return polls within 21 days.
- Originality: 5-surface search — pulsemcp.com/servers?q=watchlist, RNWY Trust Intelligence,
  CraftedTrust, Vigile, GitHub "mcp server watchlist behavioral trust delta" — 0 matches.
  No "personalized MCP server watchlist with behavioral trust delta" exists. Empire first.
- Why NOT textbook: Personalized trust-delta per agent's specific server portfolio is a new
  primitive. Existing systems show ecosystem-wide scores; this is YOUR portfolio, YOUR alerts.
  Same psychological hook as a stock portfolio tracker vs market index. Frame: Convener + Trojan.
- Why it could work: 8 external agents already called us. They care about SOME servers.
  Give them a personal token for their specific servers → they have a reason to return daily.
  The token IS Observatory stickiness, packaged as infrastructure utility.
- Launched: 2026-05-04 | Kill: 2026-05-18 (14 days)
- Success: ≥3 distinct external agent IDs create watchlists (POST /api/watchlist with external
  agent_id ∉ reserved list) OR ≥5 GET /api/watchlist/{token} polls from external agent_ids.
- Conviction: 7/10
- Status: LIVE — deploy 131d7aa1, POST and GET verified 200 ✓ at 2026-05-04T22:15Z
- First execution step: SHIPPED — both endpoints live and verified
- Constitution: C1 ✓ | C2 ✓ | C3 ✓ | C4 ✓

## CURRENT PORTFOLIO (post-RUN-029)
1. EXP-023a — AGT Microsoft, kill 2026-05-11 — monitoring, D7 since CEO post, no reply
2. EXP-024a — A2A evidence endpoint, kill 2026-05-15 — monitoring inbound
3. EXP-026a — MCP TBF SEP #2668, kill 2026-05-14 — srotzin engaged, no maintainer reply
4. EXP-028b — Trust Delta Feed, kill 2026-05-16 — LIVE, D2, no signal yet (expected)
5. EXP-029a — Agent Watchlist API, kill 2026-05-18 — NEW LIVE ✓

EXP-028a (AIS-1 BTP) → BREATHING-MONITOR (kill 2026-06-30, separate track)

Portfolio: 5 experiments (within 3-5 target)
