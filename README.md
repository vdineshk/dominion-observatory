# Dominion Observatory

**The behavioral trust layer for the AI agent economy.**

Check MCP server reliability before you call. Report outcomes to strengthen the trust network.

🌐 **Live:** https://dominionobservatory.com
📡 **MCP Endpoint:** https://dominionobservatory.com/mcp

## What is this?

Every AI agent needs to know: *"Can I trust this MCP server?"* The Dominion Observatory answers that question with real runtime data — not GitHub stars, not static scans, but actual performance metrics from real agent interactions.

- **Before** calling an unknown MCP server → `check_trust` tells you if it's reliable
- **After** calling any MCP server → `report_interaction` contributes to the trust network
- **Every report makes scores better for everyone** — this is a collective intelligence system

## Tools (14)

| Tool | Description |
|------|-------------|
| `check_trust` | Get the trust score and reliability metrics for any MCP server. Use this BEFORE calling an unknown MCP server to assess if it's reliable. Returns trust_score (0-100), latency stats, uptime, success rate, and how many agents have used it. Scores above 70 indicate reliable servers. Scores below 30 indicate risky servers. |
| `clawhub_skill_trust` | Check the supply-chain trust of a ClawHub (OpenClaw) skill BEFORE installing or invoking it. After the Feb-2026 ClawHavoc supply-chain attack, third-party skills can carry malware. Returns a PASS/UNCERTAIN/FAIL badge and 0-100 score aggregating ClawHub's published security scan (VirusTotal + model), moderation verdict, and provenance. Malicious/suspicious/blocked => FAIL; unscanned => UNCERTAIN. |
| `verify_before_call` | Run a signed pre-invocation verification immediately before an agent sends money, credentials, private data, or write access to an MCP server. The first 3 verifications per agent are free. After that, authenticate the MCP HTTP request with Authorization: Bearer do_<api_key> for Stripe metering ($0.01/call), or call once without payment to receive x402 instructions and retry with payment_tx. Returns PASS/UNCERTAIN/FAIL/UNRATED, evidence freshness, recommendation, and a signed diligence receipt. |
| `paid_trust_verdict` | Get the PREMIUM behavioral trust verdict for an MCP server, with a signed, citable, tamper-evident attestation receipt. This is a paid x402 service: call WITHOUT payment_tx to receive payment instructions (0.001 USDC on Base), pay, then call again WITH the payment_tx (transaction hash, single-use) to receive the full verdict + receipt. The free check_trust tool remains available for basic scores. |
| `verify_attestation` | Cryptographically verify a Dominion signed attestation (JWS) — e.g. a trust-verdict receipt, gateway attestation, or MCP Verified badge. Stateless: checks the Ed25519 signature against Dominion's published public key (no trust in this server required). Use this to confirm a receipt another party gave you is authentic and untampered. |
| `preflight_check` | Run a PRE-FLIGHT due-diligence check on an MCP server BEFORE your agent invokes it. Returns a verdict (PASS/UNCERTAIN/FAIL/UNRATED) plus a SIGNED, timestamped diligence receipt you keep as proof you performed a trust check — the standard of care after the ClawHavoc/Miasma supply-chain attacks. Call this before connecting to or invoking any unfamiliar MCP server. |
| `report_interaction` | Report the outcome of calling an MCP server. Call this AFTER you use any MCP server to contribute to the trust network. Your report helps other agents make better decisions. This is free and takes <1ms. |
| `get_leaderboard` | Get the top-rated MCP servers, optionally filtered by category. Use this to discover the most reliable MCP servers in the ecosystem. Categories include: weather, finance, code, data, search, compliance, transport, productivity, communication. |
| `get_baselines` | Get behavioral baselines for a tool category. Shows what 'normal' looks like — average latency, success rates, typical call patterns. Use this to evaluate whether a specific server's performance is within normal range for its category. |
| `check_anomaly` | Check if observed behavior from an MCP server is anomalous compared to baselines. Use this when a server seems slow, unreliable, or returns unexpected results. Returns whether the behavior deviates significantly from normal patterns. |
| `register_server` | Register a new MCP server in the observatory. Server owners can register their servers to start building a trust score. Registration is free. |
| `get_server_history` | Get daily trust score and performance history for a server over the last 30 days. Use this to see trends — is the server improving or degrading? |
| `observatory_stats` | Get overall statistics about the Dominion Observatory — total servers tracked, total interactions recorded, coverage by category, and data freshness. Use this to understand the scope of the trust network. |
| `get_compliance_report` | Export a compliance-ready audit trail of all recorded interactions. Formatted for EU AI Act Article 12 and Singapore IMDA Agentic AI Governance Framework. Filter by server, agent, or date range. Essential for enterprises that need to prove their AI agents are behaving correctly. |

## Quick Start

### For agents (MCP)
Connect to: `https://dominionobservatory.com/mcp`

### For developers (REST API)
```bash
# Check trust score
curl "https://dominionobservatory.com/api/trust?url=https://example.workers.dev/mcp"

# View leaderboard
curl "https://dominionobservatory.com/api/leaderboard"

# Network stats
curl "https://dominionobservatory.com/api/stats"
```

## How Trust Scores Work

Trust scores range from 0-100 and combine two signals:

- **Static score (30%)**: GitHub presence, documentation quality, authentication support
- **Runtime score (70%)**: Real success rates, latency, error patterns from agent interactions

Scores above 70 = reliable. Below 30 = risky. The more agents report interactions, the more accurate scores become.

## Architecture

- **Runtime:** Cloudflare Workers (330+ global edge locations, <1ms cold start)
- **Database:** Cloudflare D1 (SQLite at the edge)
- **Protocol:** MCP (Model Context Protocol) + REST API
- **Cost:** Runs on free tier

## Data Collection

Started: April 8, 2026

Every interaction reported to the observatory strengthens the trust network for all agents. The behavioral dataset compounds daily — it cannot be replicated by competitors who start later.

## Categories

weather · finance · code · data · search · compliance · transport · productivity · communication

## Operator

Built by [Dinesh Kumar](https://github.com/vdineshk) in Singapore.
Part of the Dominion Agent Economy Engine (DAEE).

## License

MIT
