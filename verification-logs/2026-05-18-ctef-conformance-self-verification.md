# CTEF v0.3.2 Conformance Self-Verification — T-1d (2026-05-18)

**License**: CC0-1.0 (public domain dedication).
**Authored by**: Dominion Observatory.
**Subject**: empire's own `/.well-known/ctef-conformance` handler.
**Window**: T-1d to CTEF v0.3.2 publication (2026-05-19).
**Reproducibility commit**: `b3c259134fc0a756510bde1120c3de61bf912ad3` (vdineshk/dominion-observatory).
**Re-runnable script**: [`scripts/verify-ctef-conformance.sh`](../scripts/verify-ctef-conformance.sh).

---

## 1. What this artifact is

A timestamped, third-party-re-runnable proof that every conformance vector advertised in the Observatory's `/.well-known/ctef-conformance` handler is operationally passing **before** CTEF v0.3.2 publication.

Self-attestation under CTEF §4.5.3 is a one-way declaration. This artifact pairs that declaration with continuous proof: the same vectors the spec recommends, exercised live, results recorded with a git commit pin so any later observer can re-execute the same sequence and verify nothing was retroactively edited.

No prior MCP / A2A / x402 / CTEF surface publishes a timestamped self-conformance proof of its own §4.5.3 handler. This is the empire's first-mover claim on the "implementor-side conformance log" surface.

## 2. Verification run — 2026-05-18T22:15:34Z

Source of vectors: live `GET https://dominion-observatory.sgdata.workers.dev/.well-known/ctef-conformance` (`ctef-conformance-v0.3.2`, evidence_provider role, did:web:dominion-observatory.sgdata.workers.dev).

| # | Vector label | Expected status | Actual status | Expected fields / leakage check | Result |
|---|---|---|---|---|---|
| 1 | `positive_case` (`/v1/behavioral-evidence/sg-cpf-calculator-mcp`) | 200 | **200** | `schema`, `trust_score`, `behavioral_summary`, `found` — all PRESENT | **PASS** |
| 2 | `negative_path_subject_not_tracked` (`/benchmark/nonexistent-server-vector-ctef-conformance`) | 404 | **404** | `tier` / `confidence` / `payload` / `data_sufficiency` MUST NOT LEAK — none leaked. `error_code` = `SUBJECT_NOT_TRACKED` | **PASS** |
| 3 | `behavioral_silver_degradation_live` (`/api/trust-delta?url={silver_tier_subject}`) | 200 | **200** | `schema`, `summary`, `window` — all PRESENT | **PASS** |
| 4 | `tier_distribution_citation` (`/api/sla-tier`) | 200 | **200** | `mcp-sla-tier-certification-v1.0` schema returned; tier distribution Platinum 10 / Gold 6077 / Silver 4756 / Bronze 3919 / Unrated 58 | **PASS** |

**Aggregate**: 4/4 PASS. Empire is conformance-passing under its own published `/.well-known/ctef-conformance` handler at the timestamp above, on the commit above.

## 3. Why publish T-1d, not T+1d

The 24-hour publication window for a normatively-cited spec is the highest-leverage discovery window of the spec's lifetime. Implementors land first on the spec, then immediately on "is anyone running this in production yet?" Retrofitted post-publication proofs are indistinguishable from competent reads of the spec; pre-publication proofs are not.

This artifact is committed and timestamped **before** CTEF v0.3.2 publishes. Any later observer can verify both (a) that the empire's handler vectors pass live, and (b) that the proof itself was committed before the spec went public. The commit hash is the cryptographic anchor.

## 4. Re-running this verification

```bash
git clone https://github.com/vdineshk/dominion-observatory.git
cd dominion-observatory
git checkout b3c259134fc0a756510bde1120c3de61bf912ad3   # this run
bash scripts/verify-ctef-conformance.sh
```

The script fetches the live conformance handler, parses every vector, executes each one, and prints a PASS/FAIL line per vector. Exit code 0 means all vectors pass.

The same script is intended to be the seed of a CTEF §4.5.3 conformance harness pattern — every operator that publishes a `.well-known/ctef-conformance` handler should be able to run their own version. The empire's version is offered as the reference implementation under CC0-1.0 with no attribution requirement.

## 5. Endpoints exercised (cross-reference for §4.5.4 cross-attestation envelopes)

All endpoints below are live-tested at the timestamp in §2:

- `GET /.well-known/ctef-conformance` → 200 (`ctef-conformance-v0.3.2`)
- `GET /.well-known/mcp-observatory` → 200
- `GET /v1/behavioral-evidence/{server-id}` → 200 (tracked subject) / 404 (untracked subject)
- `GET /benchmark/{server-id}` → 200 (tracked) / 404 (untracked, with `error_code: SUBJECT_NOT_TRACKED`, no field leakage)
- `GET /api/trust?url={url}` → 200
- `GET /api/trust/verascore?url={url}` → 200 (verascore-evidence-schema-v0.1)
- `GET /api/trust-delta?url={url}` → 200
- `GET /api/sla-tier` → 200 (`mcp-sla-tier-certification-v1.0`)
- `GET /api/leaderboard` → 200
- `GET /api/compliance` → 200 (EU AI Act Art. 12 + Singapore IMDA Agentic AI Governance)
- `GET /api/stats` → 200 (14,820 servers tracked, 86,917 interactions, EARLY_DEMAND / DATA_ACCUMULATION)
- `GET /openapi.json` → 200 (9 operationId-tagged paths for auto-discovery)

Endpoints **not** advertised by the conformance handler and therefore **not** part of this proof: `/api/ctef/ecosystem` (referenced in some prior internal records but not currently routed; not part of §4.5.3 surface), `/api/ctef/readiness` (planned, deploy pending per the T-3 readiness brief), `/.well-known/agent-card.json` (separate AGT track, not CTEF).

## 6. Citation snippet (copy-pasteable)

> Dominion Observatory, *CTEF v0.3.2 Conformance Self-Verification — T-1d (2026-05-18)*, CC0-1.0. Commit `b3c2591`. https://github.com/vdineshk/dominion-observatory/blob/main/verification-logs/2026-05-18-ctef-conformance-self-verification.md

## 7. Follow-up

The empire will publish a paired T+1d verification log post-CTEF-publication for diff comparison, and weekly verification logs thereafter under `verification-logs/`. Operators running their own CTEF §4.5.3 handlers are invited to ship the same pattern; no licence, no permission, no attribution required.
