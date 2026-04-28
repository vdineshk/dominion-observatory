# RUN-023 Territory Defense — Monday 2026-04-27

## 4 Competitor Scans Executed

### Scan 1 — "MCP trust score reliability scoring 2026"

**New threat: mcp-trust-radar** (github.com/brandonwise/mcp-trust-radar). Static only. Permission risk + maintenance signals. No runtime behavioral component. Threat: LOW.

**TrustMesh MCP Server** (Glama, geerdwedda-create). LOCAL agent-to-agent trust scoring via SQLite (0-1 scale with color codes). Not ecosystem-wide. Threat: LOW.

**Agent Trust Stack MCP Server** (Glama, alexfleetcommander). Similar local-trust pattern. Threat: LOW.

**Zarq Q1 2026 State of AI Assets**: 143K agents, 17K MCP servers "all trust scored." Last data: 2026-03-09. STATIC. No runtime behavioral component. Threat: LOW-MEDIUM (narrative positioning, not data moat).

**MCPScoreboard.com**: Independent quality scores for public MCP servers. STATIC. Threat: LOW.

**Audit finding (rapidclaw.dev)**: "52% of MCP Servers Are Dead (2026)" — 1,847 servers audited, 52% abandoned. Observatory has 4,584 servers with interaction telemetry that could produce a more authoritative version of this finding. CONTENT OPPORTUNITY.

### Scan 2 — "MCP behavioral monitoring agent behavior baseline runtime 2026"

**⚠️ CRITICAL NEW COMPETITOR: Microsoft Agent Governance Toolkit** (github.com/microsoft/agent-governance-toolkit, released 2026-04-02)

- Open-source, MIT license
- Agent Mesh: 0-1000 trust score with 5 behavioral tiers, behavioral decay, dynamic privilege assignment
- Inter-Agent Trust Protocol (IATP) for secure agent-to-agent communication
- MCP Security Gateway: capability sandboxing, tool-call interception
- Agent OS: stateless policy engine, <0.1ms p99 latency
- Covers 10/10 OWASP Agentic AI Top 10 (certified by CLI attestation on deploy)

**Key differentiation from Observatory:**
- Microsoft AGT: INTERNAL governance of agents within a controlled mesh (trust between agents YOU OWN)
- Observatory: EXTERNAL behavioral trust scoring of MCP SERVERS across the public ecosystem (trust of servers you're about to connect to)
- These are COMPLEMENTARY layers: AGT is the policy enforcer; Observatory is the external threat intelligence / baseline feed
- AGT's trust scoring is closed-loop (only sees activity within the mesh). Observatory's is open-ecosystem (sees cross-server behavioral patterns across 4,584 servers)

**COMPETITIVE RESPONSE PROTOCOL update:**
Microsoft AGT launch VALIDATES Observatory's thesis publicly (behavioral trust scoring is the right approach). Positioning: "Microsoft AGT governs your agents. Observatory scores the MCP servers your agents connect to. AGT needs Observatory's external baselines to be complete." Lean into complementarity, not competition.

**ARMO (armosec.io)**: "Detecting Intent Drift in AI Agents With Runtime Behavioral Data" — eBPF kernel-level observation, Kubernetes-aware. Security-oriented, not trust-scoring. Different layer, different buyer. Threat: LOW.

**Moesif**: MCP Security and Agent Behavior monitoring for API analytics. General-purpose API monitoring, not trust scoring. Threat: LOW.

**Cisco AI Agent Security Scanner for IDEs**: Agent verification at IDE layer. Not ecosystem-wide. Threat: LOW.

### Scan 3 — Zarq / MCPScorecard update

- Zarq published "State of AI Assets Q1 2026" (dev.to/zarq-ai). Most recent data: 2026-03-09. Confirmed STATIC — no runtime behavioral data.
- MCPScoreboard.com (separate from MCPScorecard): quality scores. STATIC. Low threat.
- Developers Digest Tech directory: alive. Previously surfaced in RUN-015.

No new scoring methodology shifts detected in the tracked static competitors. Empire's runtime behavioral moat holds — ZERO competitors doing live behavioral telemetry across public MCP ecosystem.

### Scan 4 — ERC-8004 MCP endpoint health monitoring

- ERC-8004 LIVE on Ethereum mainnet since 2026-01-29
- Reputation layer: 401 feedback submissions in first 2 weeks (numerical scores + categorical tags)
- v2 spec in development with "enhanced MCP support"
- SPIDER PATTERN-023 (laplace0x issue #73) remains the empire's primary ecosystem-internal demand signal
- 5 competing reputation oracle projects already live: DJD Agent Score, MolTrust, Chitin, Azeth, Verity Protocol
- **Window narrowing.** EXP-021a comment (CEO-blocked in PR #6) must post soon or empire loses first-comment positioning on issue #73

## BUILDER DIRECTIVES Update

[2026-04-27] Microsoft Agent Governance Toolkit (microsoft/agent-governance-toolkit, 2026-04-02) validates Observatory's behavioral trust thesis publicly. BUILDER should:
1. Review AGT's agent-mesh trust scoring API — assess whether Observatory's trust endpoints can serve as an EXTERNAL data source for AGT policy rules
2. Flag if any AGT primitive (IATP, behavioral tiers, behavioral decay model) should inform Observatory's own trust-score algorithm evolution
3. Do NOT copy AGT's internal-mesh design — Observatory's moat is CROSS-ECOSYSTEM external behavioral data, not internal governance

[2026-04-27] Content positioning now available: "Observatory + Microsoft AGT = complete trust stack (external discovery + internal governance)." Draft blog post if content slot opens.

## Competitive Response Protocol Update

| Competitor | Type | Threat | Updated Response |
|---|---|---|---|
| Microsoft AGT | Runtime behavioral (INTERNAL) | MEDIUM (thesis validation) | Position as complementary. Observatory = external layer. |
| Zarq | Static (EXTERNAL, snapshot) | LOW-MEDIUM | Observatory = runtime behavioral moat vs Zarq's static snapshot |
| mcp-trust-radar | Static (permission/maintenance) | LOW | Niche, no runtime data |
| TrustMesh | Local agent-to-agent | LOW | Different surface |
| ARMO | eBPF runtime (security) | LOW | Security-focus, not trust scoring |
| MCPScorecard | Static (GitHub metadata) | LOW | No behavioral data |
