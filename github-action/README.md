# MCP Trust Check — GitHub Action

Automatically scan your repo's MCP server configurations and check behavioral trust scores from [Dominion Observatory](https://dominionobservatory.com) . Indexed projects only receive behavioral scores when runtime measurements exist; others are UNRATED. A score is not a safety or compliance guarantee.

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
| `unrated_policy` | UNRATED/no runtime measurements: `fail` or `warn` | `fail` |
| `not_found_policy` | NOT_FOUND: `fail` or `warn` | `fail` |
| `api_error_policy` | HTTP/network/invalid JSON: `fail` or `warn` | `fail` |
| `config_paths` | Additional config paths (comma-separated) | `''` |
| `comment_on_pr` | Post results as PR comment | `true` |
| `github_token` | GitHub token for PR comments | `${{ github.token }}` |

## Outputs

| Output | Description |
|--------|-------------|
| `servers_found` | Number of MCP servers discovered |
| `servers_below_threshold` | Number below threshold |
| `servers_unknown` | Number UNRATED, NOT_FOUND, or API_ERROR |
| `servers_passed` | Number MEASURED at/above threshold |
| `results_json` | Full results as JSON |

## Result states and policies

- `MEASURED`: a finite numeric score from 0 through 100. At/above the threshold is a passing score check; below it warns, or fails when `fail_below_threshold: true`.
- `UNRATED`: a recognized server without a runtime score (`null` or missing). No grade is assigned.
- `NOT_FOUND`: HTTP 404 or a successful response explicitly reporting `found: false`.
- `API_ERROR`: other non-success HTTP status, timeout/network failure, invalid JSON, or an invalid score/response.

The three unknown-state policies default to `fail` (fail closed), independently of `fail_below_threshold`. Set an individual policy to `warn` to deliberately continue (fail open). Warning results remain unknown, `passed: false`, and are excluded from `servers_passed`; continuing a workflow does not make a server trusted. Existing workflows that previously silently continued on API errors must explicitly choose `warn` if desired. Invalid policy values and thresholds fail configuration validation.

`results_json` includes `state`, nullable `trust_score`, `passed`, `below_threshold`, and `action` (`pass`, `warn`, or `fail`). Null is never converted to zero. A measured result can be selected from another configured identifier after a missing/error result; if no identifier resolves, API errors take precedence over NOT_FOUND.

For a fully closed gate:

```yaml
with:
  threshold: 70
  fail_below_threshold: true
  unrated_policy: fail
  not_found_policy: fail
  api_error_policy: fail
```

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
| example-measured | 78 | **B** | Search | `mcp.json` | MEASURED / PASS (pass) |
| example-low | 45 | **F** | System | `.cursor/mcp.json` | MEASURED / BELOW THRESHOLD (fail) |
| example-unrated | -- | -- | -- | `mcp.json` | UNRATED (fail) |

These are illustrative fixture values, not live scores.

## Use as CI Gate

Set `fail_below_threshold: true` to block merges when measured scores fall below your threshold:

```yaml
- uses: vdineshk/dominion-observatory/github-action@main
  with:
    threshold: 60
    fail_below_threshold: true
```

## API

This action uses the free Dominion Observatory API. No API key required.

```bash
curl --fail-with-body --get --data-urlencode "url=brave-search" "https://dominionobservatory.com/api/trust"
```

## Links

- [Dominion Observatory](https://dominionobservatory.com)
- [Server Directory](https://dominionobservatory.com/servers/) — indexed MCP projects
- [Pre-flight Check](https://dominionobservatory.com/check)
- [API Docs](https://dominionobservatory.com/api/trust?url=brave-search)

## License

MIT

## Development checks

Run `npm install`, `npm test`, and `npm run build` from `github-action/`. Tests mock HTTP and GitHub APIs; they do not verify live availability. The committed `dist/index.js` must be rebuilt after source changes.
