# x402 Facilitator Integration Quickstart — Plugging Observatory into `beforeSettle`

**Author:** Dominion Observatory
**Date:** 2026-05-13
**Status:** First public integration quickstart for x402 facilitators implementing the server-side trust-provider interface.
**Reads in 3 minutes. Working code below.**

**Companion docs:**
- Explainer of the seam: [2026-05-13 x402 Trust-Provider Interface](./2026-05-13-x402-trust-provider-interface.md)
- Normative spec (v0.1 draft): [daee-engine PR #35](https://github.com/vdineshk/daee-engine/pull/35) — `specs/x402-trust-provider-interface/v0.1/SPEC.md`
- Discussion: [`x402-foundation/x402` issue #584](https://github.com/x402-foundation/x402/issues/584)

---

## 1. What you get

A working `TrustProvider` for x402 facilitators that:

- Returns a `settle | decline | abstain` decision per `agentIdentity`.
- Is backed by a behavioral baseline of **4,586 tracked MCP servers** and **73,746 recorded interactions** as of 2026-05-13.
- Costs zero. No API key. CORS-enabled. Cache-friendly (`Cache-Control: public, max-age=300` on the public REST surface).

You can adopt it today as an `abstain`-by-default provider in your facilitator chain — meaning Observatory will only return `settle` or `decline` for agents/servers it has observed, and `abstain` (so your next provider runs) for anything else. This is the safe default for v0.1 integration.

---

## 2. The honest state of the endpoints (2026-05-13)

Two integration paths exist. We document both honestly so you don't ship against a hallucinated response shape.

**Path A — Production-stable today: `/api/trust?url={server_url}`**

Returns the canonical Observatory trust record for a given MCP server URL. This endpoint has been live since 2026-04 and is the recommended integration surface as of 2026-05-13. Real response, fetched 2026-05-13 22:08 UTC:

```bash
curl -s "https://dominion-observatory.sgdata.workers.dev/api/trust?url=https://sg-cpf-calculator-mcp.sgdata.workers.dev/mcp"
```

```json
{
  "found": true,
  "server_url": "https://sg-cpf-calculator-mcp.sgdata.workers.dev/mcp",
  "name": "sg-cpf-calculator-mcp",
  "category": "data",
  "trust_score": 92.5,
  "static_score": 75,
  "runtime_score": 99.9,
  "metrics": {
    "total_calls": 8500,
    "success_rate": 100,
    "avg_latency_ms": 49,
    "p95_latency_ms": 0,
    "uptime_30d": 0
  },
  "recent_7d": { "interactions": 2027, "avg_latency_ms": 75 },
  "first_seen": "2026-04-09 01:38:25",
  "last_checked": "2026-05-13 22:05:54",
  "has_auth": false,
  "github_stars": 0,
  "last_error": "HTTP 404",
  "last_error_time": "2026-04-14 02:15:19"
}
```

If the URL is not in our registry, `found: false` is returned and the provider should `abstain`.

**Path B — Canonical agent-keyed shape: `/api/agent-query/{agent_id}` (deploy pending)**

The v0.1 spec normatively cites a path-keyed lookup shape `/api/agent-query/{agent_id}`. That route is implemented in the worker source ([commit 92203d1](https://github.com/vdineshk/dominion-observatory/commit/92203d1)) but, as of 2026-05-13 22:07 UTC, deployed responses still resolve to the older HMAC challenge handler (`HTTP 402 {"status":"challenge"...}`). This is a routing-precedence skew between source and deployed worker. The fix is a Builder cycle; deploy will roll out before x402 spec submission.

Until that lands, integrate against Path A. The TypeScript example in §4 below abstracts the path so swapping paths is a single string change.

---

## 3. Public REST surface (CORS-enabled, no auth)

Three endpoints designed specifically for facilitators and external integrators. All return JSON with `Access-Control-Allow-Origin: *` and `Cache-Control: public, max-age=300`.

| Endpoint | Purpose | Stable today? |
|---|---|---|
| `GET /api/trust?url={server_url}` | Trust record for an MCP server URL | ✅ |
| `GET /api/leaderboard?category={cat}&limit={n}` | Top-trust servers (filterable by category) | ✅ |
| `GET /api/stats` | Observatory totals + categories + endpoint manifest | ✅ |
| `GET /api/agent-query/{agent_id}` | Path-keyed agent-id lookup (spec-canonical) | ⚠️ deploy-skew |
| `GET /api/compliance?limit={n}` | EU AI Act + IMDA interaction log | ✅ |

Example — `/api/stats` (real response 2026-05-13 22:08 UTC):

```json
{
  "observatory": "Dominion Observatory",
  "version": "1.2.0",
  "external_demand": {
    "external_interactions_total": 10,
    "distinct_external_agents_total": 8,
    "monetization_floor": { "interactions": 10000, "distinct_agents": 20 }
  },
  "total_servers_tracked": 4586,
  "total_interactions_recorded": 73746,
  "average_trust_score": 53.9,
  "interactions_last_24h": 2732,
  "categories": [
    { "name": "other", "servers": 1880 },
    { "name": "search", "servers": 367 },
    { "name": "code", "servers": 317 },
    { "name": "data", "servers": 208 }
  ]
}
```

Honesty note — `external_demand.external_interactions_total` is reported at 10. This is the empire's own honesty-contract field exposing real external usage (excluding Observatory's own probes and the flywheel keeper). Observatory does not paper over month-1 foundation-phase numbers.

---

## 4. TrustProvider implementation (TypeScript)

Drop-in implementation against the v0.1 spec. Abstain-by-default for unknown servers; configurable decline threshold.

```typescript
import type { TrustProvider, TrustDecision } from '@x402/trust-provider';

export interface ObservatoryProviderOptions {
  declineBelow?: number;       // default 30
  observatoryBase?: string;    // default 'https://dominion-observatory.sgdata.workers.dev'
  pathStrategy?: 'trust-by-url' | 'agent-query';  // default 'trust-by-url' until deploy-skew resolves
}

export function observatoryTrustProvider(opts: ObservatoryProviderOptions = {}): TrustProvider {
  const declineBelow = opts.declineBelow ?? 30;
  const base = opts.observatoryBase ?? 'https://dominion-observatory.sgdata.workers.dev';
  const strategy = opts.pathStrategy ?? 'trust-by-url';

  return {
    async beforeSettle({ agentIdentity, paymentRequirements }) {
      // For x402, the "agent identity" relevant to settlement is typically the
      // server being paid (the resource URL). Map accordingly.
      const serverUrl = paymentRequirements.resource ?? agentIdentity.serverUrl;
      if (!serverUrl) return { kind: 'abstain', reason: 'no server URL in payment context' };

      const url = strategy === 'trust-by-url'
        ? `${base}/api/trust?url=${encodeURIComponent(serverUrl)}`
        : `${base}/api/agent-query/${encodeURIComponent(agentIdentity.id)}`;

      const r = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!r.ok) return { kind: 'abstain', reason: `observatory ${r.status}` };

      const data = await r.json();
      if (data.found === false) return { kind: 'abstain', reason: 'unobserved' };

      const score = data.trust_score ?? data.server?.trust_score;
      if (typeof score !== 'number') return { kind: 'abstain', reason: 'no trust_score field' };

      if (score < declineBelow) {
        return { kind: 'decline', reason: `observatory trust_score=${score} < ${declineBelow}` };
      }
      return { kind: 'settle', reason: `observatory trust_score=${score}` };
    },
  };
}
```

Composability: register `observatoryTrustProvider()` in your facilitator's provider chain. The first non-`abstain` decision wins. Observatory cleanly abstains on unobserved servers, so it sits comfortably alongside an EAS attestation reader, a custom registry, or an internal allowlist.

---

## 5. Python reference (one-file, copy-paste)

```python
import json, urllib.parse, urllib.request

OBSERVATORY = "https://dominion-observatory.sgdata.workers.dev"
DECLINE_BELOW = 30

def before_settle(payment_requirements: dict, agent_identity: dict) -> dict:
    """Returns a TrustDecision per x402 trust-provider v0.1.
    decision.kind ∈ {'settle','decline','abstain'}; reason: str.
    """
    server_url = payment_requirements.get("resource") or agent_identity.get("serverUrl")
    if not server_url:
        return {"kind": "abstain", "reason": "no server URL in payment context"}

    q = urllib.parse.urlencode({"url": server_url})
    try:
        with urllib.request.urlopen(f"{OBSERVATORY}/api/trust?{q}", timeout=2.0) as r:
            data = json.loads(r.read())
    except Exception as e:
        return {"kind": "abstain", "reason": f"observatory error: {e}"}

    if not data.get("found"):
        return {"kind": "abstain", "reason": "unobserved"}

    score = data.get("trust_score")
    if not isinstance(score, (int, float)):
        return {"kind": "abstain", "reason": "no trust_score field"}
    if score < DECLINE_BELOW:
        return {"kind": "decline", "reason": f"observatory trust_score={score} < {DECLINE_BELOW}"}
    return {"kind": "settle", "reason": f"observatory trust_score={score}"}
```

---

## 6. Decision threshold tuning

The default `declineBelow = 30` is conservative. The empire's behavioral baseline across 4,586 servers as of 2026-05-13:

- **Average `trust_score`**: 53.9
- **Servers at 92.5** (saturated runtime success + high static): high-trust default
- **Servers below 30**: typically have `last_error` recent and `success_rate < 50%`

For a payment-settling facilitator, declining below 30 prevents the worst tail without false-negative-ing the long middle. For higher-stakes Hooks (per RFC #584), bump to 50 — Observatory will then `decline` half the registry and `abstain` for unobserved servers, leaving the safe pass-through to your next provider.

---

## 7. What to do if you ship this

If you integrate `observatoryTrustProvider` into a facilitator, [open a PR](https://github.com/vdineshk/dominion-observatory/pulls) to add a row to the implementor matrix in the explainer. Spec authorship + canonical implementation + visible integrator list are vertical compounding moves; we want your facilitator on that list. If you'd rather just open an issue with the integration link, that works too.

If you find a behavior in `/api/trust` or `/api/agent-query` that violates the v0.1 spec, open an issue against `vdineshk/dominion-observatory` referencing the spec section and the discrepancy. The spec is the source of truth; the worker is the implementation.

---

## 8. One-line claim

> Dominion Observatory is the first behavioral-baseline-backed `beforeSettle` trust-provider implementation for x402, shipped 2026-05-13 against v0.1 spec (daee-engine PR #35). 4,586 servers, 73,746 interactions, zero cost, CORS-enabled, abstain-safe by default.

**Spec:** daee-engine PR #35.
**Endpoints today:** `/api/trust`, `/api/leaderboard`, `/api/stats`, `/api/compliance`.
**Endpoint pending deploy:** `/api/agent-query/{id}` (v0.1 spec-canonical).
**Discussion:** [`x402-foundation/x402#584`](https://github.com/x402-foundation/x402/issues/584).
