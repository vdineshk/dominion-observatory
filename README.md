# Dominion Observatory

**The behavioral trust layer for the AI agent economy.**

Check MCP server reliability before you call. Report outcomes to strengthen the trust network.

🌐 **Live:** https://dominion-observatory.sgdata.workers.dev
📡 **MCP Endpoint:** https://dominion-observatory.sgdata.workers.dev/mcp

## What is this?

Every AI agent needs to know: *"Can I trust this MCP server?"* The Dominion Observatory answers that question with real runtime data — not GitHub stars, not static scans, but actual performance metrics from real agent interactions.

- **Before** calling an unknown MCP server → `check_trust` tells you if it's reliable
- **After** calling any MCP server → `report_interaction` contributes to the trust network
- **Every report makes scores better for everyone** — this is a collective intelligence system

## Tools (8)

| Tool | Description |
|------|-------------|
| `check_trust` | Get trust score and reliability metrics for any MCP server |
| `report_interaction` | Report success/failure after calling an MCP server |
| `get_leaderboard` | Top-rated MCP servers by category |
| `get_baselines` | Behavioral baselines for a tool category |
| `check_anomaly` | Is this server behavior normal or anomalous? |
| `register_server` | Register a new MCP server (free) |
| `get_server_history` | 30-day trust score trend for a server |
| `observatory_stats` | Overall network statistics |

## Quick Start

### For agents (MCP)
Connect to: `https://dominion-observatory.sgdata.workers.dev/mcp`

### For developers (REST API)
```bash
# Check trust score
curl "https://dominion-observatory.sgdata.workers.dev/api/trust?url=https://example.workers.dev/mcp"

# View leaderboard
curl "https://dominion-observatory.sgdata.workers.dev/api/leaderboard"

# Network stats
curl "https://dominion-observatory.sgdata.workers.dev/api/stats"
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
