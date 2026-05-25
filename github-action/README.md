# MCP Trust Check — GitHub Action

Automatically scan your repo's MCP server configurations and check behavioral trust scores from [Dominion Observatory](https://dominionobservatory.com) (14,800+ servers scored).

## Why

MCP servers are the new attack surface. Before your AI agent connects to a server, you should know its trust score. This action:

- **Discovers** MCP configs automatically (Claude Desktop, Cursor, VS Code, Cline, etc.)
- **Checks** each server against Dominion Observatory's behavioral trust API
- **Reports** results as a PR comment with letter grades (A+ to F)
- **Fails** the build if any server scores below your threshold (optional)

## Quick Start

```yaml
# .github/workflows/mcp-trust.yml
name: MCP Trust Check
on: [pull_request]

jobs:
  trust-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vdineshk/dominion-observatory/github-action@main
        with:
          threshold: 50
          fail_below_threshold: false
          comment_on_pr: true
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `threshold` | Minimum trust score (0-100) | `50` |
| `fail_below_threshold` | Fail if any server scores below threshold | `false` |
| `config_paths` | Additional config paths (comma-separated) | `''` |
| `comment_on_pr` | Post results as PR comment | `true` |
| `github_token` | GitHub token for PR comments | `${{ github.token }}` |

## Outputs

| Output | Description |
|--------|-------------|
| `servers_found` | Number of MCP servers discovered |
| `servers_below_threshold` | Number below threshold |
| `results_json` | Full results as JSON |

## Config Files Scanned

The action automatically scans these paths:

- `claude_desktop_config.json` — Claude Desktop
- `.cursor/mcp.json` — Cursor
- `.vscode/mcp.json` — VS Code
- `mcp.json` / `.mcp.json` — Generic
- `cline_mcp_settings.json` — Cline
- `.claude/settings.json` / `.claude/settings.local.json` — Claude Code
- `.claude.json` — Claude

Add custom paths via the `config_paths` input.

## PR Comment Example

The action posts a table like this on PRs:

| Server | Score | Grade | Category | Config | Status |
|--------|-------|-------|----------|--------|--------|
| brave-search | 78 | **B** | Search | `mcp.json` | ✅ PASS |
| filesystem | 45 | **D** | System | `.cursor/mcp.json` | ❌ FAIL |

## Use as CI Gate

Set `fail_below_threshold: true` to block merges when untrusted servers are detected:

```yaml
- uses: vdineshk/dominion-observatory/github-action@main
  with:
    threshold: 60
    fail_below_threshold: true
```

## API

This action uses the free Dominion Observatory API. No API key required.

```bash
curl "https://dominionobservatory.com/api/trust?url=brave-search"
```

## Links

- [Dominion Observatory](https://dominionobservatory.com)
- [Server Directory](https://dominionobservatory.com/servers/) — 14,800+ servers
- [Pre-flight Check](https://dominionobservatory.com/check)
- [API Docs](https://dominionobservatory.com/api/trust?url=brave-search)

## License

MIT
