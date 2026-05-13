# x402 Trust-Provider Conformance Test Vectors v0.1

**Spec under test:** [x402 Trust-Provider Interface v0.1](https://github.com/vdineshk/daee-engine/blob/main/specs/x402-trust-provider-interface/v0.1/SPEC.md) (daee-engine PR #35)
**Published:** 2026-05-13
**Publisher:** Dominion Observatory
**Vectors file:** [`test-vectors.json`](./test-vectors.json) — 15 deterministic vectors
**License:** CC0-1.0 (vectors); MIT (test-runner snippets below)

## Why these exist

The x402 trust-provider interface v0.1 introduces a new `beforeSettle` seam in the x402 facilitator flow. Multiple implementors are expected (Observatory, EAS readers, custom registries, internal allowlists). Without conformance vectors, implementations will drift from each other on edge cases — what happens when `trust_score` is non-numeric? When the observatory times out? When `paymentRequirements.resource` is missing? Drift means a payment safely settled under one provider could be unsafely settled under another.

These vectors lock those edges. An implementation that passes all 15 is v0.1-conformant.

## How to consume

Each vector is a JSON object containing:

- `input` — the `agentIdentity` and `paymentRequirements` passed to your `beforeSettle()` function.
- `mock_observatory_response` (or `observatory_error`) — what your stubbed observatory client should return. If `null`, no call should be made.
- `expected_decision` — what your function must return.
- Optional `lookup_must_use` / `lookup_must_use_encoded` — verifies your implementation calls the observatory with the right URL.
- Optional `decline_below` — threshold override for that vector.

### Reference runner (TypeScript)

```typescript
import { readFileSync } from 'node:fs';

const suite = JSON.parse(readFileSync('test-vectors.json', 'utf8'));

for (const v of suite.vectors) {
  const stub = (calledUrl: string) => {
    if (v.lookup_must_use && !calledUrl.includes(v.lookup_must_use)) {
      throw new Error(`${v.id}: lookup URL mismatch (got ${calledUrl})`);
    }
    if (v.observatory_error?.kind === 'http') {
      throw Object.assign(new Error('http'), { status: v.observatory_error.status });
    }
    if (v.observatory_error?.kind === 'timeout') {
      throw new Error('timeout');
    }
    return v.mock_observatory_response;
  };

  const decision = await yourImpl.beforeSettle(
    v.input,
    { observatoryFetch: stub, declineBelow: v.decline_below ?? 30 }
  );

  if (decision.kind !== v.expected_decision.kind) {
    console.error(`${v.id} FAIL: expected ${v.expected_decision.kind}, got ${decision.kind}`);
    continue;
  }
  if (v.expected_decision.reason_contains
      && !decision.reason.includes(v.expected_decision.reason_contains)) {
    console.error(`${v.id} FAIL: reason "${decision.reason}" missing "${v.expected_decision.reason_contains}"`);
    continue;
  }
  console.log(`${v.id} PASS`);
}
```

### Reference runner (Python)

```python
import json

suite = json.load(open("test-vectors.json"))
for v in suite["vectors"]:
    def stub(url):
        if v.get("lookup_must_use") and v["lookup_must_use"] not in url:
            raise AssertionError(f'{v["id"]}: lookup URL mismatch')
        err = v.get("observatory_error") or {}
        if err.get("kind") == "http":
            raise RuntimeError(f"http {err['status']}")
        if err.get("kind") == "timeout":
            raise TimeoutError("timeout")
        return v["mock_observatory_response"]

    d = your_impl.before_settle(
        v["input"]["agent_identity"], v["input"]["payment_requirements"],
        observatory=stub, decline_below=v.get("decline_below", 30),
    )
    ok = d["kind"] == v["expected_decision"]["kind"]
    if "reason_contains" in v["expected_decision"]:
        ok = ok and v["expected_decision"]["reason_contains"] in d["reason"]
    print(f'{v["id"]} {"PASS" if ok else "FAIL"}')
```

## Reporting conformance

If your facilitator passes all 15 vectors, open a PR to add a row to the implementor matrix in [the explainer](../../../content/2026-05-13-x402-trust-provider-interface.md#6-empire-dna-claim). Include:

- Repo / package name
- Language
- Date passed
- Spec version under test (must be `v0.1`)

If you find a vector that is ambiguous, contradictory, or untestable, open an issue against `vdineshk/dominion-observatory` referencing the vector `id`. Spec ambiguities documented this way feed back into v0.2.

## What v0.1 vectors deliberately DO NOT cover

- Provider chaining order (composability) — that lives in the facilitator surface, not the provider.
- Caching behavior — left to implementations; future v0.2 may add a vector for cache-respect.
- Authentication to the observatory — current v0.1 surface has no auth.
- The `/api/agent-query/{id}` path-keyed variant — deploy-skew as of 2026-05-13; v0.1 vectors test the `/api/trust?url=` lookup path. Path-keyed vectors will be added when deploy resolves.

These omissions are intentional. v0.1 establishes the decision contract. v0.2 will add operational properties (caching, retries, observability).
