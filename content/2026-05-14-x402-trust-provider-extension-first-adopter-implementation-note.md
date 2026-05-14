# Trust-Provider Extension for x402 — First-Adopter Implementation Note

**Date**: 2026-05-14
**Status**: Implementation note for [x402-foundation/x402#2300](https://github.com/x402-foundation/x402/pull/2300) (open)
**Companion spec**: [x402 Trust-Provider Interface v0.1 (DRAFT)](https://github.com/vdineshk/daee-engine/blob/main/specs/x402-trust-provider-interface/v0.1/SPEC.md)
**Conformance vectors**: [x402-trust-provider-conformance v0.1](https://github.com/vdineshk/dominion-observatory/tree/main/specs/x402-trust-provider-conformance/v0.1) (CC0-1.0)
**Audience**: x402 resource-server operators, x402 facilitator implementors, trust-provider authors

This note is a worked walk-through for the trust-provider extension proposed in
[x402#2300](https://github.com/x402-foundation/x402/pull/2300) — *feat(extensions):
add trust-provider extension for behavioral trust gating*. It exists because the
PR description references Dominion Observatory in its JSDoc as a candidate trust
provider, and an operator copying that example needs three things the diff does
not (and should not) provide:

1. **A complete adoption recipe** — what to install, what to configure, where the
   hook attaches in the resource server's settlement path, and what shape to
   send back to the facilitator.
2. **A live, copy-pasteable evaluator that talks to a real provider today** —
   not a stub, not a "TODO: implement," but JSON shapes you can curl right now.
3. **A clear separation between the protocol shape (what the spec says the
   provider returns) and the evaluator's wire choice (what HTTP calls the
   evaluator actually makes against the provider's deployed endpoints).**

The note is written from the perspective of a server operator who has read
PR #2300 and wants the extension working in front of `/api/paid` by
end-of-day. It uses Dominion Observatory as the worked example because that is
the provider currently shipping the [reference v0.1 interface
spec](https://github.com/vdineshk/daee-engine/blob/main/specs/x402-trust-provider-interface/v0.1/SPEC.md)
and the [conformance test
vectors](https://github.com/vdineshk/dominion-observatory/tree/main/specs/x402-trust-provider-conformance/v0.1).
The same recipe applies to any future provider conformant to the v0.1 spec.

---

## 1. The shape PR #2300 introduces

The diff adds three primitives in `typescript/packages/extensions/src/trust-provider/`:

- `TrustQuery` — what the resource server sends to the evaluator. Carries
  `payer.wallet`, `resource.url|method|amount`, `requested_at`.
- `TrustEvaluation` — what each evaluator returns. Carries
  `provider`, `provider_url`, `decision ∈ {PASS, FAIL, UNCERTAIN}`,
  optional `score`, optional `reason_code`, `evaluated_at`, optional
  `evidence_uri`, optional `attestation` block.
- `aggregate(evaluations, policy)` — folds N evaluations into one decision
  per the configured policy (`strict` | `quorum` | `custom`).

Wired into the resource server via `onBeforeSettle`:

```text
client request → 402 PaymentRequired → client pays →
   facilitator.verify → server.onBeforeSettle (trust-provider runs here) →
       PASS  → facilitator.settle → server returns 200 + paid resource
       FAIL  → server aborts settlement → 402/403 response
       UNCERTAIN + fail-closed → abort
       UNCERTAIN + fail-open   → proceed
```

The protocol-level surface is intentionally tiny. Where it gets interesting
for an adopter is the evaluator function: that is where the operator decides
*which trust signal* to consult and *how to map it onto the v0.1 envelope*.

---

## 2. Adoption recipe (server operator)

Assume an existing x402 resource server, already on x402 V2, that exposes
`POST /api/paid` behind a 402 + facilitator settle path.

### Step 1: Install (when the PR lands)

```bash
pnpm add @x402/extensions
# or, while #2300 is in review:
pnpm add github:vdineshk/x402#trust-provider-extension
```

### Step 2: Configure the evaluator

The evaluator is a closure of shape `(query: TrustQuery) => Promise<TrustEvaluation>`.
It receives the `TrustQuery` from the hook and returns a `TrustEvaluation`.
Below is a working evaluator that calls Dominion Observatory's currently-live
leaderboard endpoint to extract a behavioral trust score.

```typescript
import {
  createTrustProviderExtension,
  declareTrustProviderExtension,
  TRUST_PROVIDER,
  type TrustQuery,
  type TrustEvaluation,
} from "@x402/extensions/trust-provider";

const observatoryEvaluator = async (query: TrustQuery): Promise<TrustEvaluation> => {
  // Resolve the agent identity to a server URL the Observatory tracks.
  // The mapping is operator-local: if the server already knows which
  // upstream MCP server identity the agent is, pass that here directly.
  const agent_server_url = query.payer.wallet
    ? mapWalletToServerUrl(query.payer.wallet)
    : null;

  if (!agent_server_url) {
    return {
      schema: "x402-trust-evaluation-v0.1",
      provider: "dominion-observatory",
      provider_url: "https://dominion-observatory.sgdata.workers.dev",
      decision: "UNCERTAIN",
      reason_code: "agent_identity_unmapped",
      evaluated_at: new Date().toISOString(),
    };
  }

  // Call Observatory's leaderboard for the row matching this server URL.
  // Live curl shape (verified 2026-05-14T22:09 UTC):
  //   curl https://dominion-observatory.sgdata.workers.dev/api/leaderboard?limit=200
  // returns { servers: [{ url, name, category, trust_score, success_rate,
  //   avg_latency_ms, total_interactions, tracked_since }, ...] }
  const r = await fetch(
    "https://dominion-observatory.sgdata.workers.dev/api/leaderboard?limit=200",
  );
  const board = await r.json();
  const row = board.servers.find((s: any) => s.url === agent_server_url);

  if (!row) {
    return {
      schema: "x402-trust-evaluation-v0.1",
      provider: "dominion-observatory",
      provider_url: "https://dominion-observatory.sgdata.workers.dev",
      decision: "UNCERTAIN",
      reason_code: "agent_not_observed",
      evaluated_at: new Date().toISOString(),
    };
  }

  // Map trust_score (0–100, behavioral) onto the v0.1 decision envelope.
  // Operator picks the cutoff. 60 / 40 below mirror the JSDoc in PR #2300.
  const score01 = row.trust_score / 100;
  const decision =
    row.trust_score >= 60 ? "PASS" :
    row.trust_score < 40  ? "FAIL" :
    "UNCERTAIN";

  return {
    schema: "x402-trust-evaluation-v0.1",
    provider: "dominion-observatory",
    provider_url: "https://dominion-observatory.sgdata.workers.dev",
    decision,
    score: score01,
    reason_code: `trust_score=${row.trust_score}, success_rate=${row.success_rate}, total_interactions=${row.total_interactions}`,
    evaluated_at: new Date().toISOString(),
    // Optional: the per-row leaderboard URL acts as the evidence URI.
    evidence_uri: `https://dominion-observatory.sgdata.workers.dev/api/leaderboard?limit=200`,
  };
};

const config = {
  providers: [{ name: "dominion-observatory", evaluate: observatoryEvaluator }],
  policy: { kind: "strict" as const },
  failureMode: "fail-closed" as const,
  perProviderTimeoutMs: 5000,
};
```

The evaluator is the only operator-specific code. Everything else (the hook,
the aggregation, the abort response) is library-shipped.

### Step 3: Register with the resource server

```typescript
const extension = createTrustProviderExtension(config);
server.registerExtension(extension);
```

### Step 4: Advertise the requirement in 402 responses

```typescript
const paymentRequired = {
  scheme: "exact",
  network: "base",
  maxAmountRequired: { /* … */ },
  resource: { url: "/api/paid", method: "POST" },
  extensions: {
    [TRUST_PROVIDER]: declareTrustProviderExtension(config),
  },
};
```

`declareTrustProviderExtension` advertises providers, policy kind, and failure
mode to the client without exposing evaluator internals. Clients can use this
to short-circuit settlement attempts they expect to fail.

That is the entire integration. The hook intercepts settlement, calls the
evaluator, aggregates, and either lets the facilitator settle or aborts.

---

## 3. Live verification (today, against production)

The leaderboard endpoint cited above is live and returns the documented shape.
Live snapshot from `2026-05-14T22:09 UTC`:

```bash
$ curl -s 'https://dominion-observatory.sgdata.workers.dev/api/leaderboard?category=finance&limit=2'
{
  "category": "finance",
  "servers": [
    { "url": "https://sg-gst-calculator-mcp.sgdata.workers.dev/mcp",
      "name": "sg-gst-calculator-mcp", "category": "finance",
      "trust_score": 92.5, "success_rate": 100, "avg_latency_ms": 49,
      "total_interactions": 8793, "tracked_since": "2026-04-09 01:52:52" },
    { "url": "https://sg-finance-data-mcp.sgdata.workers.dev/mcp",
      "name": "sg-finance-data-mcp", "category": "finance",
      "trust_score": 92.1, "success_rate": 99.3, "avg_latency_ms": 20,
      "total_interactions": 8789, "tracked_since": "2026-04-11 01:30:24" }
  ],
  "total_results": 2, "min_interactions": 1,
  "generated_at": "2026-05-14T22:09:56.626Z"
}
```

The corpus the leaderboard draws from contains **14,814 servers tracked,
76,414 interactions recorded, average trust score 64.5, 2,697 interactions
in the trailing 24h** as of the same timestamp (curl `/api/stats`). The
behavioral surface is large enough that an operator querying the leaderboard
for an agent's upstream server will, for the categories Observatory has the
deepest coverage in (`finance`, `data`, `code`, `productivity`,
`compliance`), get back a trust score backed by real interaction history.

### Note on `/api/agent-query/{id}`

PR #2300's JSDoc cites an evaluator that calls
`https://dominion-observatory.sgdata.workers.dev/api/agent-query/<id>` and
reads `data.server.trust_score` directly. That endpoint exists in the
Observatory worker source and will become the canonical per-agent lookup
path; as of `2026-05-14T22:08 UTC` a routing-precedence change is in flight
on the production deploy and the path returns an HMAC challenge instead of
the trust attestation. **Until that lands, the working pattern is the
leaderboard lookup shown above** — same trust score, slightly larger
response payload. Implementation status is being tracked at the
[Observatory deploy log](https://github.com/vdineshk/dominion-observatory)
and will be folded into a v0.2 of this note. This is the kind of operational
detail PR #2300 reviewers should know about before adopting any one
worked-example endpoint as load-bearing.

---

## 4. Conformance against the v0.1 vectors

The empire ships [15 deterministic conformance test
vectors](https://github.com/vdineshk/dominion-observatory/tree/main/specs/x402-trust-provider-conformance/v0.1)
covering the `settle / decline / abstain` decision matrix plus edge cases
(URL encoding, missing fields, observatory outages, threshold boundaries).
After wiring the evaluator above, run the v0.1 vectors against your local
hook to confirm:

- `PASS` decisions produce no `abort` from the hook
- `FAIL` decisions produce `abort: true, reason: "trust_evaluation_failed"`
- `UNCERTAIN + fail-closed` produces
  `abort: true, reason: "trust_evaluation_uncertain"`
- `UNCERTAIN + fail-open` produces no abort

The vectors are CC0-1.0; future trust providers adopting the v0.1 shape can
cite the same vectors as their conformance suite. That is the explicit
intent: **one set of vectors per spec version, every conformant provider
points at them, every operator runs them once and is portable across
providers.**

---

## 5. Why this matters for the PR review

PR #2300 is structurally important because it is the first server-side
extension in x402 that carves out a normalized place for *external trust
evaluation* before settlement. Before the PR, every x402 server doing fraud
or behavioral checks had to write provider-specific glue inside its own
settlement path. After the PR, the glue is one closure with a documented
input/output shape, and aggregation across N providers is a configuration
choice rather than custom code.

For PR reviewers: the empire's reading of this design space is documented
in the [v0.1 spec](https://github.com/vdineshk/daee-engine/blob/main/specs/x402-trust-provider-interface/v0.1/SPEC.md),
including the **subject-reversal** argument (servers score incoming agents,
not the other way around) and the **composition** argument (declarative
aggregation policy rather than per-server middleware). Both arguments
point in the same direction the PR's diff goes; the spec is offered as
a citable companion document for the discussion thread, not as an
alternative or replacement design.

For operators: the integration above takes well under an hour end-to-end
once the PR lands. The hook is small, the evaluator is local, the
aggregation is library-shipped, and the conformance suite is published.
The risk surface is the evaluator's correctness against the v0.1 envelope
and the network behavior of the backing trust provider — both of which
this note has tried to make concrete with live curl shapes against a
real, today-deployed provider.

---

## 6. What this note is not

- It is not a position on whether `onBeforeSettle` is the right hook name,
  or whether `aggregate(strict|quorum|custom)` is the right policy
  surface. Those are review questions for the PR thread.
- It is not a claim that Dominion Observatory should be the default
  trust provider in `@x402/extensions`. It is the worked example because
  it is what is shipping the v0.1 reference interface today; as more
  providers conform, the same recipe will work against any of them with
  no code change beyond the evaluator closure.
- It is not a substitute for the
  [v0.1 spec](https://github.com/vdineshk/daee-engine/blob/main/specs/x402-trust-provider-interface/v0.1/SPEC.md);
  it is a worked walk-through of how an operator wires the extension in
  PR #2300 to a v0.1-conformant evaluator.

---

## Authoring

This note was produced with AI assistance (Claude). The recipe shape, the
worked evaluator code, the live curl verification, and the prose were
drafted by the author with AI-assisted writing and refinement. The
behavioral attestation surface (Dominion Observatory) and the v0.1 spec
predate this note. Per the AI-disclosure norm increasingly adopted for
standards-track companion writing, this disclosure appears in the body
of the document, not in a separate channel.
