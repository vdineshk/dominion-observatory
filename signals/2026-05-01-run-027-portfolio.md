# RUN-027 EXPERIMENT PORTFOLIO — 2026-05-01 (Evolution Day)

## Portfolio State: 5/5 LIVE (after kills/launches this run)

### Kills This Run
None past kill date. Note: EXP-021a (CEO BLOCKED) is on extended hold — not yet at kill date.

### Graduations This Run
None. EXP-026a (MCP TBF SEP) awaiting GitHub PR reviewer activity.

---

## Active Experiments

### EXP-021a: [name TBD — CEO BLOCKED]
Hypothesis: [CEO action required to unlock signal — experiment stalled]
Originality: Verified original at launch (RUN-021)
Launched: ~2026-04-25 | Kill: ~2026-05-09
Success: CEO post to target thread → maintainer response within 7d
Conviction launch / current: [N/10] / [BLOCKED — unmeasurable]
Status: LIVE (CEO BLOCKED D7 — no external signal possible until CEO acts)
Signal: NONE. Dependent on CEO action.
NOTE: Approaching kill date (~May 9). If CEO hasn't acted by May 7, recommend auto-kill at kill date.

### EXP-023a: LangChain/Protocol thread comment
Hypothesis: Observatory comment in active protocol thread drives discoverable references
Originality: Verified
Launched: ~2026-04-27 | Kill: ~2026-05-11
Success: Any maintainer reply or citation within 14d
Conviction launch / current: 7/10 / 6/10
Status: LIVE (CEO posted D5)
Signal: Monitoring. No response logged yet.

### EXP-024a: A2A behavioral evidence endpoint
Hypothesis: /v1/behavioral-evidence in A2A evidence_ref format drives protocol-thread discovery
Originality: 0 prior art (verified RUN-024, 5 surfaces)
Launched: 2026-04-28 (claimed) — CORRECTED: LIVE as of 2026-05-01 deploy 63faa661
Kill: 2026-05-15 (+3d extension for 3-day 404 gap)
Success: Any agent_id hitting /v1/behavioral-evidence from non-Builder source within 14d
Conviction launch / current: 8/10 / 7/10
Status: LIVE — routes now verified 200
Signal: ZERO (was unmeasurable for 3 days due to HALLUCINATED-SHIP)

### EXP-026a: MCP TBF SEP #2668 monitoring
Hypothesis: PR #2668 maintainer review → Observatory cited as canonical behavioral trust reference
Originality: Confirmed (RUN-026, maintainer invitation)
Launched: 2026-04-30 | Kill: 2026-05-14
Success: Any of: (a) maintainer assigns reviewer, (b) PR labeled "under consideration",
         (c) WG session scheduled, (d) any ecosystem participant implements spec format
Conviction launch / current: 9/10 / 9/10
Status: LIVE
Signal: EXP-025a graduated D1 (fastest Empire graduation). PR #2668 open. No reviewer assigned yet
        per last check (GitHub scope restricted — manual check needed by CEO).

### EXP-026b: ERC-8004 attestation endpoint
Hypothesis: /v1/erc8004-attestation drives discovery when ERC-8004 implementers test endpoints
Originality: 0 prior art (verified RUN-026, 3 surfaces)
Launched: 2026-04-30 (claimed) — CORRECTED: LIVE as of 2026-05-01 deploy 63faa661
Kill: 2026-05-17 (+3d extension for 3-day 404 gap)
Success: Any agent_id hitting /v1/erc8004-attestation from non-Builder source within 14d
Conviction launch / current: 7/10 / 7/10
Status: LIVE — routes now verified 200
Signal: ZERO (was unmeasurable for 3 days)

---

## NEW LAUNCH This Run

### EXP-027a: Trust Score Badge (/api/badge) — Artifact-Bait INVENT
Hypothesis: MCP server owners embed Observatory badge in README → permanent discovery surface
            per repo + badge crawlers generate incidental Observatory visibility
Originality:
  Prior-art search (3 surfaces):
  - brandonwise/mcp-trust-radar: no badge endpoint, no SVG API
  - gigabrainobserver/mcp-scorecard: no badge endpoint
  - shields.io: no MCP trust endpoint
  Result: 0 matches. Empire first.
Why NOT textbook: No static MCP scorer has shipped a per-server badge API — adds distribution
  surface attached to every server owner's self-promotion behavior (they WANT badges in README).
Why could work: 4,584 tracked servers × even 0.5% owner adoption = 22 permanent README badge URLs.
  GitHub crawlers index README badges → Observatory URL surfaces in GitHub code search.
Launched: 2026-05-01 | Kill: 2026-05-15
Success: ≥5 /api/badge requests from non-Observatory-probe agent_ids by kill date
Conviction launch / current: 7/10 / 7/10
Status: LIVE (deploy 63faa661, verified HTTP 200)
Signal: NONE yet (launched this run)
Constitution check:
  C1 ✅ Agent-discoverable (badge URLs in GitHub repos, crawlable)
  C2 ✅ No human sales — server owners self-serve
  C3 ✅ Badge → Observatory awareness → premium API consideration
  C4 ✅ 0 prior art verified above

---

## Slot Forecast
Current: 5/5 (EXP-021a, EXP-023a, EXP-024a, EXP-026a, EXP-026b) → EXP-027a launches
into slot 5 by folding EXP-023a or EXP-026b depending on kill date timing. Portfolio stays at 5/5.
Next auto-kill review: EXP-021a on ~2026-05-09 (CEO BLOCKED kill date).
