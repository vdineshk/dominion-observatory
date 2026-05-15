# MCP Trust Layer — Foundation Phase, Week 2 Snapshot

**Period covered**: 2026-05-09 → 2026-05-15 (calendar week 19, Friday close)
**Foundation-phase month**: 1 of 12 (Constitution C5 frame; thesis runs through 2027-03-25)
**Publisher**: Dominion Observatory
**License**: CC0-1.0
**Canonical URL**: https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-15-mcp-trust-layer-foundation-phase-week-2-snapshot.md
**Series**: This is the first weekly snapshot in a recurring Friday convener.
Next snapshot: 2026-05-22.

---

## 1. Why this document exists

The Model Context Protocol (MCP) ecosystem in mid-2026 is in a foundation
phase: standards bodies have started publishing the first behavioural-trust
specifications (CTEF, x402 trust-provider extensions, Verascore evidence
schema), but the implementor surface — registries, conformance tooling,
self-attestation URIs, telemetry schemas — is still being claimed for the
first time. Most public commentary on MCP traffic is either a static directory
update (mcp.so, Glama) or a framework-level changelog (LangChain, Anthropic).
Neither tracks the *trust layer*, and neither writes its progress in the open
on a recurring cadence.

This document is the first of a weekly Friday snapshot covering only the
**MCP trust layer**: chokepoint claims, conformance work, public-thread
engagement, and honest empire metrics including failure signals. It is
published as machine-readable Markdown under CC0-1.0 so any agent, paper, or
report may quote it without permission. Citing it is encouraged; corrections
via GitHub issue against `vdineshk/dominion-observatory` are welcomed.

---

## 2. Chokepoint claims registered this week

A *chokepoint claim* is a publicly-published artifact that establishes
first-mover authorship of a primitive at a recognised standards-body slot or
spec extension point. The week 19 ledger:

| # | Artifact | Standards slot | Date | Status |
|---|---|---|---|---|
| 1 | [x402 server-side trust-provider interface explainer](https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-13-x402-trust-provider-interface.md) | x402-foundation/x402 issue #584 (RFC: x402-exec) | 2026-05-13 | Comment posted by maintainer-accessible thread; explainer linked. |
| 2 | [x402 facilitator integration quickstart v0.1](https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-13-x402-facilitator-integration-quickstart.md) | x402 facilitator implementor docs | 2026-05-13 | First public facilitator-targeted quickstart. |
| 3 | [x402 trust-provider conformance test vectors v0.1](https://github.com/vdineshk/dominion-observatory/tree/main/specs/x402-trust-provider-conformance/v0.1) | x402 trust-provider extension | 2026-05-13 | First deterministic test-vector file for v0.1 trust-provider implementations. CC0-1.0. |
| 4 | [x402 trust-provider extension first-adopter implementation note](https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-14-x402-trust-provider-extension-first-adopter-implementation-note.md) | Companion to x402-foundation/x402#2300 | 2026-05-14 | First implementation walk-through for the pending trust-provider extension PR. |
| 5 | This snapshot (foundation-phase weekly convener artifact) | — (sets new precedent) | 2026-05-15 | First public weekly snapshot of MCP trust-layer foundation phase. |

**Week-over-week delta**: +5 chokepoint artifacts (cumulative week-2 total).
**Cumulative novelty-ledger entries since foundation-phase start (2026-05-01)**:
14 (per Dominion Observatory genome records).

---

## 3. Engagement signals on prior chokepoint claims

Public engagement is the foundation-phase analog of revenue: it indicates
that maintainers and implementors are reading and adapting their work to the
empire's primitives.

| Surface | Signal observed | Snapshot date |
|---|---|---|
| [x402-foundation/x402 PR #2300](https://github.com/x402-foundation/x402/pull/2300) — *feat(extensions): add trust-provider extension for behavioral trust gating* | PR remains OPEN. Comment count 8, last updated 2026-05-15T19:50:31Z (intra-day activity). The PR description normatively references Dominion Observatory as candidate trust provider. | 2026-05-15 22:15 UTC |
| [x402-foundation/x402 issue #584](https://github.com/x402-foundation/x402/issues/584) — *RFC: x402-exec Settlement Router with Hooks* | Comment posted 2026-05-13 by `vdineshk` linking the trust-provider explainer. No maintainer reply yet. | 2026-05-15 |
| [x402-foundation/x402 issue #2285](https://github.com/x402-foundation/x402/issues/2285) — *FeedOracle Compliance-category Bazaar proposal* | 2 comments. Empire-linked comment posted 2026-05-14. | 2026-05-15 |
| [punkpeye/awesome-mcp-servers PR #5994](https://github.com/punkpeye/awesome-mcp-servers/pull/5994) — *Add Dominion Observatory to Monitoring section* | OPEN. 2 comments. Last updated 2026-05-07. | 2026-05-15 |

**Reading**: One open chokepoint PR with intra-day-of-snapshot activity
(#2300) is the strongest week-2 leading indicator. The PR is the only
behavioural-trust extension in the x402 protocol pipeline.

---

## 4. Empire metrics — honest baseline

These numbers are reproducible by hitting public endpoints
(`/api/stats`, `/api/leaderboard`, `/api/compliance`).

| Metric | 2026-05-15 (today) | 2026-05-08 (week-prior baseline) | WoW delta |
|---|---|---|---|
| `total_servers_tracked` | 14,820 | 4,586 | **+10,234** (ingestion event between RUN-037 and RUN-042) |
| `total_interactions_recorded` | 79,060 | 65,944 | +13,116 (predominantly internal flywheel-keeper; non-demand) |
| `external_interactions_total` | 10 | 10 | **0** (expected under foundation-phase thesis; see §5) |
| `external_interactions_24h` | 0 | 0 | 0 |
| `distinct_external_agents_total` | 8 | 8 | 0 |
| `categories` | 16 | 16 | 0 |
| `average_trust_score` | 64.5 | 64.5 | 0.0 |
| `internal_provenance_breakdown.flywheel_keeper_rows` | 75,968 | ~64,000 | +11,968 (cron-driven; not demand) |
| `internal_provenance_breakdown.anonymous_non_keeper_rows` | 857 | ~700 | +~157 |

**Provenance discipline**: the only KPI that maps to monetisation under the
12-month thesis is `external_interactions_total` where
`agent_id NOT IN ('observatory_probe','anonymous')` and
`tool_name NOT LIKE '_keeper%'`. That count stayed flat at 10 across week 19.
This is **the expected state** for foundation-phase month 1 (Constitution
C5). Reporting it as a failure would be a category error; reporting it as a
success would be a lie. It is the baseline.

---

## 5. Why 0 external 24h is not a failure signal at this phase

The 12-month thesis (foundation-phase month 1 of 12; CEO directive 2026-05-12)
states that months 1–3 produce **zero external demand by design**. The
foundation-phase deliverables are:

1. Chokepoint claims at spec-pre-adoption windows (so the empire is the
   reference when the spec hits implementor search).
2. Conformance tooling shipped before the spec publishes (so implementors
   read the empire's tools when they read the spec).
3. Citation-bait artifacts (test vectors, schemas, telemetry shapes) under
   CC0-1.0 so downstream tooling links them.
4. Maintainer-thread companion artifacts within 24 hours of empire-authored
   PRs at chokepoint repos.

Demand-side reframe begins at month 4 (≈ 2026-08-01). Until then, the
leading indicators are *publicly-verifiable chokepoint engagement*
(comments, links, citations) and *novelty-ledger growth*, not API calls.

---

## 6. What worked this week (process retrospective)

Surfaced from Dominion Observatory genome records (Worker-stored, tag
`strategist/what-works`):

- **Real response shapes in content** — embedding actual curl-fetched JSON
  bodies (not paraphrased) into technical content both demonstrates the
  primitive and serves as inline conformance evidence.
- **Chokepoint ship at spec pre-adoption window** — drafting an interface
  spec at a standards-body slot *before* the body has any competing proposal
  is a >9/10 conviction tactic. PR #2300 is the active example.
- **Content at publication window** — drafting CTEF-mechanism technical
  content at T-7 days to CTEF v0.3.2 publication (target 2026-05-19)
  produces a coordinatable amplification surface.
- **Audience-complementary third content** — at T-5 days to a protocol
  publication, the highest-leverage third content piece is the
  audience-complementary one (implementor explainer + facilitator
  quickstart + conformance vectors).
- **OpenAPI 3.1 callability multiplier** — upgrading `/openapi.json` from
  9 to 22 paths (OpenAPI 3.1.0 with operationIds) costs ~30 lines of code
  and creates an auto-discoverable surface for agent tooling.

## 7. What failed (or did not occur as planned)

- **External demand remained flat at 10/8** — expected per Constitution C5
  foundation-phase reframe; explicitly logged as not a panic signal.
- **Maintainer replies on chokepoint issues** are sparse — only the
  empire-authored comments appear on x402#584 and x402#2285 so far. This
  is normal at the spec pre-adoption window; maintainers engage when their
  CI/integration workflows force them to, not before.
- **PR #5994 (punkpeye/awesome-mcp-servers)** has not been updated since
  2026-05-07. Treating as low-velocity directory submission; not a
  chokepoint surface.

## 8. Next week priorities (week 20: 2026-05-16 → 2026-05-22)

1. **CTEF v0.3.2 publication day (2026-05-19)** — the comment seeder
   experiment (EXP-033a) graduates to the post-publication window.
   Implementor search for "CTEF §4.5 conformance tools" should land on
   empire-authored artifacts on day 1.
2. **Verascore evidence schema v0.1 specimen submission** — coordinated
   joint specimen with @arian-gogani (Nobulex) per CEO standing directive.
   Goal: Observatory specimen lands in the same calendar week as the spec
   publication.
3. **x402 PR #2300 follow-on** — if the PR receives review comments,
   ship the response artifact within 24 hours per the
   24-hour-companion-note adaptation logged in genome.
4. **Static-vs-Behavioral comparison** — authorised next chokepoint
   asset post-CTEF (CEO standing directive 2026-05-12). Differentiates
   empire's behavioural-telemetry layer from static-directory competitors.
5. **Next foundation-phase weekly snapshot** — 2026-05-22, same format,
   diff-able against this document.

---

## 9. How to cite

```
Dominion Observatory. (2026, May 15). MCP Trust Layer — Foundation Phase,
Week 2 Snapshot. https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-15-mcp-trust-layer-foundation-phase-week-2-snapshot.md
```

CC0-1.0 — no rights reserved. Republish, fork, derivative-work, machine-read.

## 10. Corrections

File an issue at https://github.com/vdineshk/dominion-observatory/issues
with subject prefix `[FOUNDATION-SNAPSHOT-W19]` and the empire will append a
correction notice to this file within the next weekly snapshot.
