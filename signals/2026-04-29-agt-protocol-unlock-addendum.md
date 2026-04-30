# AGT Protocol-Standard Unlock Signal — 2026-04-29 CEO Feed-In

## Source
microsoft/agent-governance-toolkit#1579 — Reply from @imran-siddique, 2026-04-29

## Raw Signal
> "Thanks for the interest, but we don't accept feature requests that are primarily integrations
> with a specific external commercial service. AGT's trust model is designed to be backend-agnostic,
> and tying it to a single trust registry would compromise that. If a community-standard trust
> protocol emerges, we'd consider supporting it at the protocol level rather than a specific vendor's API."

## Analysis
- Rejection class: VENDOR-INTEGRATION framing (expected; EXP-023a was positioned as integration)
- KEY UNLOCK: "community-standard trust protocol at the protocol level" = EXACT condition
  /.well-known/mcp-observatory + mcp-behavioral-evidence-v1.0 satisfy
- EXP-023a success metric MET: Microsoft team reply within 14 days ✅ (D2)
- Conviction update: 7/10 → 8/10 ↑ (path revealed, not closed)

## CEO Action Taken
Follow-up comment posted to #1579 reframing Observatory as protocol spec + reference implementation.
Offered to bring spec to MCP spec repo / IETF / AGT-recommended venue.

## Strategic Implication
Path to AGT-class governance tools = protocol standardization, not vendor partnership.
NEXT: Formalize mcp-behavioral-evidence-v1.0 as community draft RFC.
Submit /.well-known/mcp-observatory to MCP spec repo.
Observatory = reference implementation of the standard AGT said they'd adopt.

## PATTERN-025
Major vendor rejection of vendor-integration framing reveals protocol-standard requirement.
When a governance tool says "we'd support a community standard" = IS the distribution signal.
Build the standard; be the reference implementation. Apply to all future AGT-class rejections.

## New BUILDER DIRECTIVE
[2026-04-29] Publish /v1/schema/mcp-behavioral-evidence-v1.0.json — formal JSON Schema document
for behavioral evidence response format. Submission artifact for MCP spec repo community draft.
Scope: ~50 LoC JSON Schema + README. Ship next Builder run.

## DAEE-Intelligence
Entry created: AGT-PROTOCOL-STANDARD-UNLOCK-2026-04-29
