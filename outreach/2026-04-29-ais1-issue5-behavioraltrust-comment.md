# AIS-1 Issue #5 — behavioralTrustProfile Comment
# Target: https://github.com/Kadikoy1/ais-1/issues/5
# Generated: 2026-04-29 | CEO authorization: Status=Go ✅
# Gmail draft id: r-7655468745547456168
# Deadline: June 30, 2026

## Prior-art check (C4)
- "AIS-1 behavioralTrustProfile DID property" → 0 results
- "AIS-1 behavioral trust extension" → 0 results
- SPIDER 6-surface search (2026-04-29) → 0 results
- ORIGINAL per C4 ✅

## Comment text (post as-is)

The authorization-scope gap you've identified has two distinct layers, and I think AIS-1 v0.1 can address one of them now:

1. **Authorization scope** (static policy): "Is this agent permitted to execute payment transactions?" — this is the governance/capability question you're raising, and I agree it's unresolved in v0.1.

2. **Behavioral trust evidence** (dynamic observation): "Has this agent reliably executed transactions without anomalies over time?" — this is a separate, queryable property that v0.1 could define as a DID Document extension, independent of resolving the policy question.

As a concrete proposal: a `behavioralTrustProfile` DID Document property that links an AIS-1 identity bond to an external behavioral attestation source:

```json
"behavioralTrustProfile": {
  "type": "BehavioralTrustProfile",
  "source": "https://dominion-observatory.sgdata.workers.dev",
  "endpoint": "https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence?url={agentEndpoint}",
  "schema": "mcp-behavioral-evidence-v1.0",
  "protocol_compatibility": ["a2a-evidence-ref", "erc-8004-endpoint-health"]
}
```

This doesn't resolve authorization policy, but it gives downstream verifiers a queryable behavioral track record: uptime, success rate, latency distributions, behavioral anomalies. For your regulated-domain use case (payments, healthcare, GDPR), behavioral evidence is a necessary complement to authorization scope — you need to know both what the agent is *permitted* to do and what it has *demonstrated* it does reliably.

We've been running this as a live cross-ecosystem behavioral dataset (4,584 MCP servers, 34K+ interactions since April 2026) and would be glad to shape the `behavioralTrustProfile` spec to fit whatever structure the AIS-1 maintainers think makes sense for v0.2.
