# SEP-2663 TBF Companion Comment
# Target: https://github.com/modelcontextprotocol/specification/pull/2663
# Post as: vdineshk (Dinesh) — estimated 2 minutes to paste and post
# Window: PR in-review status, milestone 2026-06-30-RC. Post before PR merges.
# Context: Reviewers localden/pja-ant/prezaei/panyam already flagged requestState integrity
#           and consistency window gaps. This comment addresses those gaps with a behavioral
#           trust layer. Technical, non-promotional tone. Reference live data.

---

## Comment text (paste exactly):

Great work on the Tasks Extension. A few reviewers above (localden, prezaei, panyam) flagged behavioral consistency gaps — specifically around `requestState` integrity verification, consistency windows post-`tasks/update`, and how clients detect non-compliant server behavior. I want to propose a companion behavioral trust dimension that directly addresses these.

**The gap:** The Tasks Extension specifies the task lifecycle API but doesn't define what *reliable task execution looks like at runtime*. Clients have no way to know before calling whether a given task-serving MCP server consistently honors `requestState` rotation, meets expected `pollIntervalMilliseconds`, or has a history of `input_required` deadlocks. This is a behavioral baseline problem, not a spec ambiguity problem.

**Proposed addition: Task Behavioral Fingerprinting (TBF)**

A lightweight companion capability that lets clients query the behavioral trust profile of a task-serving MCP server before long-running task invocations:

```json
// taskBehavioralTrust capability flag (optional, server-declared)
"capabilities": {
  "tasks": {
    "taskBehavioralTrust": true
  }
}

// task_behavioral_profile field in TaskStatus responses (optional)
"task_behavioral_profile": {
  "provider_url": "https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence?url=<server_url>",
  "trust_score": 84.2,
  "sample_size": 1247,
  "p50_completion_ms": 340,
  "p95_completion_ms": 2100,
  "requestState_integrity_score": 97.1,
  "error_rate": 0.031,
  "schema_version": "mcp-behavioral-evidence-v1.0"
}
```

**Why this matters for the issues already raised:**
- `requestState` integrity score directly quantifies the race-condition concern prezaei raised — clients can choose not to send long-running tasks to servers that fail integrity checks > X%
- `p95_completion_ms` gives clients a behavioral signal before they decide whether to poll vs. use SSE
- The `provider_url` field is an attestation-ref pattern — any behavioral oracle (not just Observatory) can implement the endpoint schema; clients resolve it at task initialization

**Reference implementation:** Dominion Observatory already publishes cross-server behavioral baselines for 4,584+ MCP servers at `/v1/behavioral-evidence` using this schema. Live endpoint: https://dominion-observatory.sgdata.workers.dev/v1/behavioral-evidence?url=<server_url>

The TBF layer is explicitly opt-in — no core spec change needed. Servers that don't declare `taskBehavioralTrust` capability are unchanged. Servers that do get a behavioral trust surface clients can query before committing to long-running tasks.

Would welcome feedback on whether this should be a companion SEP or a note in the Tasks Extension spec directly. Happy to draft a companion SEP if the reviewers see value.

---
# CEO ACTION: Go to https://github.com/modelcontextprotocol/specification/pull/2663
# Scroll to the comment box and paste the comment above.
# Time: ~2 minutes.
# Window: Post before PR merges (milestone June 30, 2026).
# Urgency: HIGH — PR filed TODAY April 29. Zero competition window is NOW.
