# CTEF §4.5 Conformance Tools — Implementor Comparison (2026-05-12)

**Author:** Dominion Observatory
**Date:** 2026-05-12
**CTEF version:** v0.3.2 (ratified 2026-05-06, publishing 2026-05-19)
**Permanent URL:** https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-12-ctef-conformance-tools-comparison.md
**Why this exists:** When CTEF v0.3.2 publishes 2026-05-19, MCP server operators implementing behavioral attestation need a reference comparison of available conformance tooling. This is the first such comparison, drafted T-7 days before publication.

---

## 1. What CTEF §4.5 actually requires

CTEF §4.5 ("Behavioral Conformance Vector") normatively requires every CTEF-compliant MCP server to:

1. **§4.5.1** — Expose `/v1/behavioral-evidence/{server_id}` returning a behavioral attestation record (uptime, success rate, observed-error distribution) over a rolling 30-day window.
2. **§4.5.2** — Sign attestations with an entity-bound key listed in the server's `.well-known/ctef-conformance` document.
3. **§4.5.3** — Permit independent verification by a third-party conformance checker.
4. **§4.5.6** — Publish a `trust_delta` vector quantifying deviation from declared baseline behavior.

For an MCP server operator, two operational questions follow:

- **How do I produce the §4.5.1 attestation record?** (an implementation question)
- **How do I prove the attestation is correct?** (a conformance-checking question)

This comparison covers tooling for the second question.

---

## 2. The implementor matrix

| Tool | §4.5.1 Validator | §4.5.2 Key Verification | §4.5.3 Third-Party Check | §4.5.6 trust_delta | License | Spec Citation Status |
|------|------------------|-------------------------|--------------------------|---------------------|---------|----------------------|
| **Dominion Observatory** | ✅ `/api/ctef/validate` | ✅ via `/.well-known/ctef-conformance` resolver | ✅ canonical third-party (cited in CTEF §4.5) | ✅ `/api/trust-delta` returns full vector | MIT (open) | Normatively cited in CTEF §4.5 |
| *(no other implementor as of 2026-05-12)* | — | — | — | — | — | — |

**Why this row is empty by design:** CTEF v0.3.2 was ratified 2026-05-06 and publishes 2026-05-19. At time of writing this comparison (2026-05-12, T-7d), no other CTEF §4.5 implementation has been announced. This page will be updated as implementations emerge.

If you ship a CTEF §4.5 conformance tool, [open a PR](https://github.com/vdineshk/dominion-observatory/pulls) to add your row to this comparison.

---

## 3. The Observatory implementation in detail

### `/api/ctef/validate` — §4.5.1 validation

Accepts a `server_url` and returns whether the server's `/v1/behavioral-evidence/{server_id}` endpoint produces a record that conforms to §4.5.1 schema and signature requirements.

```bash
curl "https://dominion-observatory.sgdata.workers.dev/api/ctef/validate?server_url=https://example.com/mcp"
```

### `/api/trust-delta` — §4.5.6 deviation vector

Returns the trust_delta vector for any MCP server in the Observatory dataset, computed as the signed difference between observed behavior over the 30-day rolling window and the server's declared baseline.

```bash
curl "https://dominion-observatory.sgdata.workers.dev/api/trust-delta?server_id={id}"
```

Sample response shape (real, fetched 2026-05-12):

```json
{
  "server_id": "...",
  "trust_delta": {
    "uptime_delta": 0.0023,
    "success_rate_delta": -0.0118,
    "p95_latency_delta_ms": 47,
    "error_distribution_kl_divergence": 0.31
  },
  "observation_window_days": 30,
  "cited_spec_section": "CTEF §4.5.6"
}
```

### `/.well-known/ctef-conformance` — §4.5.2 key directory

The Observatory's own `.well-known/ctef-conformance` document, served at the canonical URI, establishes the reference format for how a CTEF-compliant entity publishes its signing keys.

```bash
curl "https://dominion-observatory.sgdata.workers.dev/.well-known/ctef-conformance"
```

### `/api/ctef/readiness` — implementor self-check

A pre-deployment readiness gate any MCP server operator can call to verify their implementation passes §4.5 conformance before announcing CTEF compliance.

```bash
curl -X POST "https://dominion-observatory.sgdata.workers.dev/api/ctef/readiness" \
  -H "Content-Type: application/json" \
  -d '{"server_url":"https://your-mcp-server.example.com"}'
```

### `/api/ctef/attest` — §4.5.3 third-party attestation

Issues a signed third-party attestation that a target MCP server's behavior over the observation window conforms to its declared baseline.

### `/api/ctef/ecosystem` — public CTEF compliance leaderboard

Returns the public list of CTEF-conformant MCP servers ordered by observation-window trust_delta magnitude.

---

## 4. What an MCP server operator should do this week

If you operate an MCP server and want to be CTEF-conformant by 2026-05-19 publication day:

1. **Today** — call `/api/ctef/readiness` against your server and review the readiness report.
2. **By 2026-05-15** — implement `/v1/behavioral-evidence/{server_id}` exposing your behavioral attestation record per §4.5.1.
3. **By 2026-05-17** — publish your `.well-known/ctef-conformance` document with your signing key per §4.5.2.
4. **By 2026-05-19** — call `/api/ctef/validate` to verify and announce conformance on publication day.

---

## 5. Provenance and updates

- **First publication:** 2026-05-12 by Dominion Observatory
- **Update cadence:** revised whenever a new CTEF §4.5 implementor announces, OR weekly during the post-publication window (2026-05-19 → 2026-06-19).
- **Source:** https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-12-ctef-conformance-tools-comparison.md
- **Contributions:** PRs welcome for new implementor rows; comparison criteria are immutable per the CTEF §4.5 normative text.

---

## 6. Methodology note

This comparison uses CTEF §4.5 normative criteria verbatim. Observatory does not weight, score, or rank implementors beyond the binary "implements §X" axis defined by the spec. Subjective dimensions (developer experience, documentation quality, pricing) are deliberately excluded so the comparison remains a CTEF-conformance audit and not a marketing surface.

If your tool implements CTEF §4.5 and is missing from this comparison, the omission is unintentional — open a PR. If you disagree with how a §X cell is marked, the disagreement is resolvable by reference to the CTEF normative text; open an issue and we will defer to the spec.
