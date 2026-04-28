# A2A CEO Comment — Discussion #1631 + Issue #1755
# Generated: 2026-04-28 RUN-024
# 30-SEC CEO TASK: Tue-Fri 09:00-12:00 SGT window preferred
# Action: Post comment #1 to https://github.com/a2aproject/A2A/discussions/1631
#         Post comment #2 to https://github.com/a2aproject/A2A/issues/1755
# Time: ~2 min total. Technical tone. No editing needed.

---

## COMMENT 1: A2A Discussion #1631 — Behavioral evidence_ref source

**Post to:** https://github.com/a2aproject/A2A/discussions/1631
**Paste exactly:**

---

Great framing on the `evidence_ref` + `verification_ref` schema slot. I've been thinking about this from the MCP server side — the behavioral attestation problem is symmetric: you need the same kind of runtime evidence for the *servers* an A2A agent delegates to, not just the agents themselves.

We've been running cross-ecosystem behavioral telemetry on 4,584 MCP servers since April 2026 — latency distributions, success rates, uptime_30d, behavioral anomalies (auth_wall drift, response schema changes). This is the kind of data that would populate an `evidence_ref` for any MCP tool call in an A2A task graph.

We just shipped a behavioral evidence endpoint in a format that maps to the schema slot you're describing:

```
GET https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence?url={server_url}
```

Response includes `trust_score`, `uptime_30d`, `success_rate`, `total_observations`, `behavioral_flags`, with a `schema_version: "mcp-behavioral-evidence-v1.0"` and `protocol_compatibility: ["a2a-evidence-ref", "erc-8004-endpoint-health"]` field for versioning.

Discovery endpoint: `https://dominion-observatory.sgdata.workers.dev/.well-known/mcp-observatory`

Happy to sketch a JSON schema mapping to whatever `evidence_ref` shape the maintainers are leaning toward. The underlying data is there.

---

## COMMENT 2: A2A Issue #1755 — Behavioral compliance probe results

**Post to:** https://github.com/a2aproject/A2A/issues/1755
**Paste exactly:**

---

This endpoint compliance gap you've documented (0/50 properly returning A2A-compliant responses) maps to exactly what our behavioral telemetry surface is tracking at scale.

We run continuous behavioral probes across 4,584 MCP servers with runtime data going back to April 2026. The same pattern shows up in the MCP ecosystem — a large fraction of listed servers are unreachable, returning auth walls, or silently timing out. We published a methodology at https://dominion-observatory.sgdata.workers.dev/methodology.

For the A2A ecosystem, we're open to running the same probe set against A2A endpoints and contributing the behavioral data back. We just shipped a behavioral evidence endpoint that returns structured attestation JSON:

```
GET https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence?url={endpoint_url}
```

If there's interest in a formal data contribution to this issue, happy to run a probe batch against the endpoints from your list and post the results here.

---

## Prior-art check (C4)
- "Observatory dominion A2A discussion 1631 behavioral evidence" → no results
- "behavioral attestation oracle A2A a2aproject evidence_ref implementation" → no results
- "behavioral oracle A2A a2aproject" → no results
- ORIGINAL per C4 ✅
