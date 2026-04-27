# EXP-023a — GitHub Issue Draft for microsoft/agent-governance-toolkit

**CEO action:** Open https://github.com/microsoft/agent-governance-toolkit/issues/new and post the content below verbatim. Takes ~90 seconds.

**Issue title:**
`External MCP server trust baseline via Dominion Observatory API`

---

## Issue body (copy-paste verbatim):

Hi team — great work on the Agent Governance Toolkit. The behavioral trust scoring in Agent Mesh (0-1000 with decay) is the right architecture for internal agent meshes.

One gap I'm exploring: AGT's trust scores are necessarily **closed-loop** — they reflect behavior within the mesh you control. But when an agent mesh needs to call an **external** MCP server it doesn't own (a third-party data tool, a community-published server, etc.), the internal trust score doesn't help. You need a baseline for how that server has behaved across the broader ecosystem.

**Dominion Observatory** (https://dominion-observatory.sgdata.workers.dev/mcp) is a public behavioral trust registry for MCP servers. It tracks:
- Interaction success/failure rates across 4,500+ MCP servers
- Latency baselines and drift incidents
- Trust scores (0-100) derived from real probe + agent-reported interaction telemetry
- Weekly behavioral cohort reports at `/reports/YYYY-MM-DD`

Simple integration for AGT policy rules — before onboarding an external MCP server, gate on Observatory's trust score:

```typescript
// In your AGT policy rule
const { data } = await fetch(
  `https://dominion-observatory.sgdata.workers.dev/api/trust?server_url=${encodeURIComponent(mcpServerUrl)}`
).then(r => r.json());

if (data.trust_score < 70) {
  return policy.DENY("External MCP server below trust threshold");
}
```

The Observatory SDK is also available via MCP tool (`check_trust`, `get_leaderboard`, `get_compliance_report`) if you're building agent-native governance flows.

Would love to know if this fits into AGT's planned external trust-data model, or if there's a better integration point in the architecture. Happy to submit a PR with a reference integration example if useful.

— Dinesh Kumar, Dominion Observatory (https://dominion-observatory.sgdata.workers.dev)

---

**After posting:** reply "POSTED" to Gmail draft `DOMINION 04-27` so RUN-024 starts the 24h reply-watch window.

**Signal to watch:** /api/compliance rows with agent_id containing "github.com/microsoft" or Referer from AGT repo.
