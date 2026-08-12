# AIS-1 Behavioral Trust Profile (BTP) — Comment Draft
# Target: AIS-1 v0.1 public comment thread (find via https://ais-1.org or GitHub)
# Status: PENDING-CEO-REVIEW (AIS-1 BTP is Status=Reviewing in DAEE-Opportunities)
# CEO ACTION REQUIRED: Change Status to Go in DAEE-Opportunities FIRST, then post this comment
# Window: AIS-1 v0.1 comment period closes June 30, 2026 (63 days from today)
# Time required: ~60 minutes to locate comment thread, review, and post

---

## Pre-posting: Locate the comment thread

1. Go to https://ais-1.org
2. Find the "v0.1 Public Comment" or "Specification Comment" link (GitHub issue or discussion)
3. Read any existing comments to ensure no one has proposed a behavioralTrustProfile property

---

## Comment text (adapt as needed after reading the thread):

AIS-1 defines *who* an agent is (identity bond, dual-token, legal entity link) — but not *what it reliably does over time*. I'd like to propose a `behavioralTrustProfile` DID Document property as a v0.1 comment to close this gap.

**Proposed property:**

```json
{
  "@context": ["https://www.w3.org/ns/did/v1", "https://ais-1.org/contexts/v1"],
  "id": "did:ais1:example",
  "verificationMethod": [...],
  "behavioralTrustProfile": {
    "type": "BehavioralTrustProfile",
    "provider": "https://dominion-observatory.sgdata.workers.dev",
    "attestation_endpoint": "https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence?url={agent_endpoint}",
    "schema_version": "mcp-behavioral-evidence-v1.0",
    "fields": ["trust_score", "p95_latency_ms", "error_rate", "sample_size", "requestState_integrity_score"]
  }
}
```

**Rationale:** An agent's identity bond (AIS-1) establishes *who it is*, but enterprises evaluating agent-to-agent trust need to know *what it does reliably*. The `behavioralTrustProfile` property links an AIS-1 identity bond to a behavioral trust attestation from an independent runtime behavioral oracle. This creates a complete agent trust record:

> **Complete agent trust record = AIS-1 bond (who) + behavioralTrustProfile (what it reliably does)**

**Implementation:** The property points to any behavioral trust provider implementing the `/v1/behavioral-evidence` schema — it is not locked to a single provider. Dominion Observatory is the reference implementation, with cross-server behavioral baselines for 4,584+ MCP servers collected since April 2026.

**Why now:** AIS-1 is establishing the foundational vocabulary for agent identity. Adding `behavioralTrustProfile` in v0.1 means every v0.2 implementation includes behavioral trust as a first-class property. Missing it in v0.1 risks behavioral trust being defined as a third-party extension in v0.2 with no canonical source.

Happy to provide a full JSON-LD context extension and example DID Document if the working group sees value.

---
# DAEE-OPPORTUNITIES CONTEXT:
# Opportunity ID: 351017e7-fcf2-81e6-827d-f967310f5a9d
# SPIDER conviction: 9/10 (S21-B)
# Current status: Reviewing → CEO must change to Go before Strategist executes
# Action needed from CEO: (1) change Status=Go in DAEE-Opportunities, (2) find the AIS-1 comment
#                         thread, (3) post comment above
