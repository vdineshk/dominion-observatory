# ERC-8004 Issue #73 — Updated Comment (RUN-026, replaces 2026-04-25 draft)

**Target issue:** https://github.com/erc-8004/erc-8004-contracts/issues/73
**D5 stale — now has live /v1/erc8004-attestation endpoint to reference (NEW)**
**Estimated CEO time: 90 seconds**

---

## Comment to post (copy-paste exactly into GitHub issue #73)

> Cross-posting from the MCP / off-chain reputation side: this is exactly the failure mode
> Dominion Observatory has been quantifying for the MCP server ecosystem since April 2026.
> Across 4,584 registered MCP servers we've observed 39,000+ runtime interactions; the
> reliability distribution looks structurally identical to your 119,675-vs-~50 finding —
> registration is free, sustained reliable behavior is rare.
>
> We shipped an ERC-8004-compatible endpoint health attestation endpoint today:
>
> `GET /v1/erc8004-attestation?url={agent_endpoint}`
> → Returns `endpoint_health_status` (active / degraded / inactive / untracked),
> `uptime_7d`, `uptime_30d`, `avg_latency_ms`, `total_observations`, and
> `erc8004_recommendation` from 22 days of cross-ecosystem runtime telemetry.
>
> Example:
> https://dominion-observatory.sgdata.workers.dev/v1/erc8004-attestation?url=https://example-agent.workers.dev/mcp
>
> Schema version: `erc8004-attestation-v1.0`. Designed to serve as an off-chain behavioral
> feed for ERC-8004 reputation hooks. The output also cross-references
> `/v1/behavioral-evidence` (A2A evidence_ref compatible) so the same primitive plugs into
> both on-chain (ERC-8004) and off-chain (A2A, MCP) reputation systems.
>
> Other relevant primitives:
> - `GET /api/leaderboard` — top servers by composite trust score
>   https://dominion-observatory.sgdata.workers.dev/api/leaderboard
> - `GET /api/compliance` — EU AI Act / IMDA audit trail JSON
>   https://dominion-observatory.sgdata.workers.dev/api/compliance
> - Discovery: https://dominion-observatory.sgdata.workers.dev/.well-known/mcp-observatory
>
> The doctrine is composition: signing-layer projects keep crypto + receipts; runtime
> behavioral telemetry feeds in as policy_source. The `/v1/erc8004-attestation` endpoint
> is the targeted JSON shape for whatever hooks ERC-8004 would consume.
>
> Disclosure: I built this. Posting because the ratio in the issue matches what we measure
> on the MCP side, and we now have the exact output format that fills the gap you described.

---

## Notes for Dinesh

- Updated from 2026-04-25 draft to include /v1/erc8004-attestation live endpoint (NEW today).
- This is the credible version — you're now citing a live endpoint with the exact schema.
- Don't use the 2026-04-25 draft (it pre-dates the attestation endpoint).
- Estimated time to post: 90 seconds.
- After posting, also consider posting to ERC-8004 issue #77 (aeoess) — Hitman will
  draft that comment. Point them to this file for context.

## CEO Action after posting
Log URL to Dinesh tasks (copy format from other CEO action posts).
Feed URL back to Strategist via signals/ file commit.
