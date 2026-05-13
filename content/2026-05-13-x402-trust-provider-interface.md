# x402 Server-Side Trust-Provider Interface — Implementor Explainer (2026-05-13)

**Author:** Dominion Observatory
**Date:** 2026-05-13
**Status:** First public explainer of the server-side trust-provider interface concept for x402 facilitators.
**Spec reference:** Server-side `beforeSettle` composable trust-provider interface v0.1 — daee-engine PR #35 (commit `034b5c0`, branch `claude/jolly-galileo-ACx3v`).
**Permanent URL:** https://github.com/vdineshk/dominion-observatory/blob/main/content/2026-05-13-x402-trust-provider-interface.md

---

## 1. The gap this interface fills

x402 ([coinbase/x402](https://github.com/coinbase/x402)) is HTTP-native programmable payments. The protocol's facilitator design lets a server present a `402 Payment Required` response, the client signs a payment authorization, and the facilitator atomically verifies + settles the payment on-chain.

[RFC #584 (`x402-exec`)](https://github.com/coinbase/x402/issues/584) extends this with **Hooks**: arbitrary business logic that runs inside the same atomic settlement transaction. Hooks fire *after* the payment authorization has been validated.

There is a logical seam that Hooks do not address: **the moment between authorization and settlement, when the server can still decline to settle based on attestation about the calling agent**. We call this the `beforeSettle` seam, and the interface that fills it the **server-side trust-provider interface**.

| Phase | x402 component | What runs |
|---|---|---|
| Pre-payment | server response | `402` with `paymentRequirements` |
| Authorization | client signs | EIP-712 payment authorization |
| **beforeSettle (this seam)** | **trust-provider interface** | **agent attestation check** |
| Settle | facilitator | on-chain `transferWithAuthorization` |
| Post-settle | x402-exec Hooks | business logic in same atomic tx |

The `beforeSettle` seam is the only point where a server can refuse settlement based on observable agent behavior — uptime, success rate, prior-call distribution, claimed-vs-observed identity, drift from declared baseline. Once `transferWithAuthorization` fires, it's irreversible.

---

## 2. Why this surface is empty

Wallet-side trust scoring (the "is this counterparty trustworthy" question, scored client-side) has prior art across major ecosystems: Sift, ScoreChain, multiple Web3 KYC vendors.

**Subject-reversal**: the trust-provider interface scores the *agent calling the server*, server-side, immediately before settlement. The subject is reversed (server scoring agent, not wallet scoring counterparty), and the *position* is reversed (executed pre-settlement at the facilitator, not pre-transaction at the wallet). As of 2026-05-13, prior-art search across 6 surfaces returned 0 implementations of this pattern.

Concretely:

- `coinbase/x402` specs as of `main`: no `beforeSettle` extension point.
- `coinbase/x402` issue #584 Hooks: post-settle only.
- `bitrouter/x402-kit`: composable buyer/seller SDK; no trust-attestation seam.
- `AceDataCloud/FacilitatorX402`, `ChaosChain/chaoschain-x402`: facilitator implementations; no pre-settle trust check interface.
- `awesome-x402` curated resources: zero trust-attestation projects listed.

If the trust-provider interface is upstreamed into x402, the entity that defined it authors the interface. Builder PR #35 is that definition.

---

## 3. Interface shape (v0.1 summary)

The spec defines a composable interface with two responsibilities:

1. **Resolve attestation** for a given agent identity present in the x402 payment header.
2. **Return a settle / decline / abstain decision** before `transferWithAuthorization` fires.

```typescript
interface TrustProvider {
  // Called by the facilitator after payment authorization is verified,
  // before transferWithAuthorization is dispatched.
  beforeSettle(ctx: {
    agentIdentity: AgentIdentity;          // from payment header
    paymentRequirements: PaymentRequirements;
    facilitatorContext: FacilitatorContext;
  }): Promise<TrustDecision>;
}

type TrustDecision =
  | { kind: 'settle';   reason?: string }
  | { kind: 'decline';  reason: string }
  | { kind: 'abstain';  reason: string };  // facilitator falls through to next provider
```

Composability: multiple `TrustProvider` instances can be chained. The first non-`abstain` decision wins. This lets servers stack signal sources without coupling the facilitator to any specific attestation registry.

For the full normative spec, see daee-engine PR #35 (`specs/x402-trust-provider-interface/v0.1/SPEC.md`, 546 lines).

---

## 4. Worked example — Observatory as a TrustProvider

The Dominion Observatory tracks behavioral baselines for 4,586 MCP servers and the agents that call them. It returns a behavioral attestation for any agent identity that has accumulated observed history.

```typescript
import type { TrustProvider, TrustDecision } from '@daee/x402-trust-provider';

export const observatoryTrustProvider: TrustProvider = {
  async beforeSettle({ agentIdentity }) {
    const r = await fetch(
      `https://dominion-observatory.sgdata.workers.dev/agent-query/${agentIdentity.id}`
    );
    if (r.status === 404) return { kind: 'abstain', reason: 'no observation history' };
    const attestation = await r.json();
    if (attestation.trust_score < 30) {
      return { kind: 'decline', reason: `trust_score=${attestation.trust_score} below threshold` };
    }
    return { kind: 'settle', reason: `trust_score=${attestation.trust_score}` };
  },
};
```

Sample attestation shape (real, fetched 2026-05-13):

```json
{
  "agent_id": "...",
  "trust_score": 53.9,
  "observation_window_days": 30,
  "interaction_count": 71785,
  "category_distribution": { "data": 208, "code": 317, "search": 367 }
}
```

A facilitator implementing the trust-provider interface can register `observatoryTrustProvider` alongside any other provider — a custom registry, an EAS attestation lookup, an internal allowlist — and the interface stays neutral to each.

---

## 5. How this maps to active x402 RFCs

| x402 RFC | Phase covered | Trust-provider interface relationship |
|---|---|---|
| [#584 (`x402-exec`) Hooks](https://github.com/coinbase/x402/issues/584) | Post-settle business logic | Orthogonal. Hooks run after settlement; trust-provider runs before. They compose. |
| [#646 (`scheme_exact_svm` deadline + smart wallet)](https://github.com/coinbase/x402/issues/646) | Authorization scheme | Independent. Trust-provider operates on the agent identity surfaced by any authorization scheme. |
| [#605 (facilitator 308 redirects)](https://github.com/coinbase/x402/issues/605) | Facilitator transport | Independent. |
| [#447 (x402 × Circle Gateway)](https://github.com/coinbase/x402/issues/447) | Settlement rail | Independent. |

The trust-provider interface is the missing seam between authorization (covered by schemes like `scheme_exact_svm`) and post-settle business logic (covered by Hooks). The v0.1 spec is designed to land as a new section of the x402 specification, not a competing protocol.

---

## 6. Empire DNA claim

The Dominion Observatory is the canonical behavioral attestation source for the MCP and adjacent agent-economy surfaces. The trust-provider interface is the standards-side primitive that lets that attestation reach the x402 settlement path. Spec authorship + canonical implementation are vertical compounding moves.

If you ship a TrustProvider implementation for x402 (Observatory or otherwise), [open a PR](https://github.com/vdineshk/dominion-observatory/pulls) to add a row to the implementor matrix below.

| Implementor | Decision sources | License | Spec citation |
|---|---|---|---|
| Dominion Observatory | behavioral baseline (4,586 servers, 71,785 interactions) | MIT | spec author (PR #35) |
| *(no other implementor as of 2026-05-13)* | — | — | — |

---

**Spec:** daee-engine PR #35 (`specs/x402-trust-provider-interface/v0.1/SPEC.md`, draft).
**Reference Observatory endpoint:** `GET /agent-query/{agent_id}` → returns behavioral attestation record.
**Discussion target:** [`coinbase/x402` issue #584](https://github.com/coinbase/x402/issues/584) (Hooks RFC — beforeSettle is the natural extension surface).
