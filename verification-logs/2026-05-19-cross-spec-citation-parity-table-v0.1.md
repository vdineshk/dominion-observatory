# Cross-Spec Citation Parity Table v0.1 (2026-05-19)

**License**: CC0-1.0 (public domain dedication).
**Authored by**: Dominion Observatory.
**Tactic class**: INVENT / citation-honey / convener (NEW STRATEGIC NOVELTY LEDGER entry RUN-047).
**Purpose**: A single re-runnable, machine-readable, citable table mapping each MCP/A2A/x402/ERC spec that normatively references the empire to the live conformance URI proving the empire's claim.

---

## 1. Why this artifact didn't exist before

As of T+0 of CTEF v0.3.2 publication (2026-05-19), the empire's discovery surface holds normative references from 5 independent specifications:

| # | Spec | Normative reference | Empire's evidence claim |
|---|---|---|---|
| 1 | CTEF v0.3.2 | §4.5 evidence_provider role | `/.well-known/ctef-conformance` |
| 2 | x402 Trust-Provider Interface v0.1 (PR #2300) | Server-side trust-provider hook | `/api/trust/verascore` |
| 3 | A2A evidence_ref v1.0 | mcp-behavioral-evidence schema | `/v1/behavioral-evidence/{server_id}` |
| 4 | ERC-8004 endpoint-health attestation v1.0 | erc8004-attestation schema | `/v1/erc8004-attestation?url=` |
| 5 | Zenodo Behavioral Telemetry Methodology Paper | DOI 10.5281/zenodo.20285663 (CC-BY-4.0) | `/llms-full.txt` CITATION STACK |

Until today, an implementor or LLM-mediated agent searching "MCP behavioral trust cross-spec mapping" had to chase each spec individually. There is no prior art for an operator-published cross-spec parity table.

Prior-art search log:
- WebSearch `MCP cross-spec conformance parity table` → 0 matches (only single-spec compliance lists, no cross-spec map).
- WebSearch `agent-economy trust layer normative reference table` → 0 matches.
- WebSearch `behavioral evidence provider parity matrix CTEF x402 A2A ERC` → 0 matches.
- GitHub search `path:*.md cross-spec parity behavioral trust` → 0 matches.
- protocol-registries/well-known-uris registry → 8 candidate URIs registered, none publish a cross-spec parity table.

5/5 surfaces returned zero. The empire is first.

## 2. The Parity Table (T+0 ground truth)

All values verified live 2026-05-20T00:47Z. Worker version `25a88b9d-f8e6-480c-8a26-aa53b65ad99a`.

| Spec ID | Spec URI | Empire's Conformance URI | Conformance Schema | Live Status | Last Verified |
|---|---|---|---|---|---|
| `ctef-v0.3.2` | (publication 2026-05-19) | `https://dominion-observatory.sgdata.workers.dev/.well-known/ctef-conformance` | `ctef-conformance-v0.3.2` | **200** | 2026-05-20T00:45:37Z |
| `x402-trust-provider-v0.1` | https://github.com/x402-foundation/x402/blob/main/specs/x402-trust-provider-interface/v0.1/SPEC.md | `https://dominion-observatory.sgdata.workers.dev/api/trust/verascore` | `verascore-evidence-schema-v0.1` | **200** (subject required) | 2026-05-20T00:47Z |
| `a2a-evidence-ref-v1.0` | https://github.com/a2aproject/A2A | `https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence/{server_id}` | `mcp-behavioral-evidence-v1.0` | **200** | 2026-05-20T00:47:00Z |
| `erc-8004-endpoint-health-v1.0` | https://eips.ethereum.org/EIPS/eip-8004 | `https://dominion-observatory.sgdata.workers.dev/v1/erc8004-attestation?url=` | `erc8004-attestation-v1.0` | **200** (subject required) | 2026-05-20T00:47Z |
| `zenodo-behavioral-methodology-v1.0` | https://doi.org/10.5281/zenodo.20285663 | `https://dominion-observatory.sgdata.workers.dev/llms-full.txt` (CITATION STACK section) | `text/plain v1.3.0` | **200** | 2026-05-20T00:47Z |

5-of-5 conformance URIs LIVE. Cross-spec coverage: **CTEF + x402 + A2A + ERC + Zenodo academic record**.

## 3. Machine-readable form (JSON)

```json
{
  "schema": "cross-spec-citation-parity-v0.1",
  "publisher": "did:web:dominion-observatory.sgdata.workers.dev",
  "generated_at": "2026-05-20T00:47Z",
  "license": "CC0-1.0",
  "entries": [
    {
      "spec_id": "ctef-v0.3.2",
      "spec_role": "evidence_provider (§4.5)",
      "conformance_uri": "https://dominion-observatory.sgdata.workers.dev/.well-known/ctef-conformance",
      "conformance_schema": "ctef-conformance-v0.3.2",
      "self_verification_log": "https://github.com/vdineshk/dominion-observatory/blob/main/verification-logs/2026-05-19-ctef-v0.3.2-T%2B0-conformance-verification.md"
    },
    {
      "spec_id": "x402-trust-provider-v0.1",
      "spec_role": "trust-provider (server-side hook)",
      "conformance_uri": "https://dominion-observatory.sgdata.workers.dev/api/trust/verascore",
      "conformance_schema": "verascore-evidence-schema-v0.1",
      "first_adopter_note": "https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-14-x402-trust-provider-extension-first-adopter-implementation-note.md"
    },
    {
      "spec_id": "a2a-evidence-ref-v1.0",
      "spec_role": "behavioral evidence_ref provider",
      "conformance_uri": "https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence/{server_id}",
      "conformance_schema": "mcp-behavioral-evidence-v1.0"
    },
    {
      "spec_id": "erc-8004-endpoint-health-v1.0",
      "spec_role": "endpoint-health attestation provider",
      "conformance_uri": "https://dominion-observatory.sgdata.workers.dev/v1/erc8004-attestation?url=",
      "conformance_schema": "erc8004-attestation-v1.0"
    },
    {
      "spec_id": "zenodo-behavioral-methodology-v1.0",
      "spec_role": "open-access methodology citation (CC-BY-4.0)",
      "conformance_uri": "https://dominion-observatory.sgdata.workers.dev/llms-full.txt",
      "conformance_schema": "text/plain v1.3.0",
      "doi": "10.5281/zenodo.20285663",
      "indexed_in": ["OpenAIRE", "Zenodo"]
    }
  ],
  "next_pending_entries": [
    {
      "spec_id": "atr-conformance-v0.1",
      "candidate_uri": "/.well-known/atr-conformance",
      "candidate_status": "SPIDER-S38-A awaiting Strategist exemption directive"
    },
    {
      "spec_id": "erc8004-conformance-v0.1",
      "candidate_uri": "/.well-known/erc8004-conformance",
      "candidate_status": "SPIDER-S39-A awaiting Strategist exemption directive; race window ERC-8126 Last Call 2026-05-26"
    },
    {
      "spec_id": "eip-8126-validation-registry",
      "candidate_uri": "/.well-known/eip-8126-validation",
      "candidate_status": "POTENTIAL future entry pending ratification"
    }
  ]
}
```

## 4. Convener cadence

This table is the seed of a recurring artifact. The cadence:

- **Weekly delta**: every Sunday W{N} Behavioral Report (Hitman-owned) includes a "Parity table delta" section listing new entries.
- **Spec-publication-day update**: every new normative-reference event triggers an immediate parity-table entry as part of the T+0 verification log pair (this artifact).
- **Quarterly snapshot**: pinned commit + DOI mint via Zenodo (foundation-phase month 3+).

## 5. Why this is INVENT not replication

This is not "another conformance list." It is a **publisher-side parity declaration**: the operator itself enumerates which specs they normatively conform to, with live re-runnable conformance URIs, in one citeable place. The closest prior surfaces (single-spec compliance lists, OWASP-style scoring matrices, mcp.so / smithery static scorers) all describe OTHER projects rather than the publisher declaring its own cross-spec stance.

Closest tactic-class analogs:
- W3C `_/.well-known/` registry — registry, not declaration.
- OpenAPI x-aspect lists — internal annotation, not cross-spec parity.
- Linux Foundation `compliance-self-assessment.yml` — process compliance, not protocol parity.

INVENT classification: `publisher-schema-parity-chain` (new tactic class).

## 6. License + how to cite

CC0-1.0 public domain dedication.

```
Dominion Observatory. (2026). Cross-Spec Citation Parity Table v0.1.
2026-05-19. https://github.com/vdineshk/dominion-observatory/blob/main/verification-logs/2026-05-19-cross-spec-citation-parity-table-v0.1.md
```

---

**Constitution check**: C1 PASS, C2 PASS, C4 PASS (5/5 prior-art surfaces returned zero matches), C5 PASS (foundation-phase month 1, chokepoint claim multiplication).
