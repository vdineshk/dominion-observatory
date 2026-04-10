# DAEE — Brain (Dominion Observatory)
Updated: 2026-04-10

---

## EMPIRE STATUS

| Metric | Current | Target |
|--------|---------|--------|
| Observatory servers tracked | 17 | 100 by Month 1 / 500 by Month 3 |
| Observatory interactions | 1 | 10K by Month 2 / 50K by Month 4 |
| Interactions last 24h | 0 | — |
| Categories covered | 6 | 10+ by Month 2 |
| Avg trust score | 74.8 | — |
| Revenue-generating servers (Builder) | UNKNOWN (Notion down) | 10 by Month 3 |
| Server revenue | UNKNOWN | — |
| Observatory revenue | $0 | — |
| Combined MRR | $0 known | $10K by Month 12 |
| Competitors (runtime behavioral) | 1 (Iris — different angle) | 0 |
| Data collection started | 2026-04-08 | — |
| Months elapsed | <1 | — |

Payment accounts:
- MCPize: ACTIVE
- Apify: ACTIVE
- Stripe: ACTIVE at levylens.co

---

## WHAT WORKS

- Observatory v1.0 deployed and live on Cloudflare D1
- 17 servers registered across 6 categories in first 2 days — good catalog start
- Static trust scoring functional (register_server calculates initial score from metadata)
- MCP endpoint responds correctly with 8 tools + prompts + resources
- Listed on Smithery (live); submitted to mcp.so, mcpservers.org
- REST API functional: /api/stats, /api/trust, /api/leaderboard

---

## WHAT FAILED

- Notion/Gmail connectors unavailable in this session — using file fallback
- Flywheel NOT spinning: 1 interaction in 2 days, 0 in last 24h
- Leaderboard returns empty (min 5 interactions per server — too high for early stage)
- Builder interaction data unknown (Notion down)

---

## PATTERNS

### Competitive Landscape (2026-04-10 — First Friday Scan)

| Competitor | Type | What They Measure | Runtime Data? | Threat |
|------------|------|-------------------|---------------|--------|
| MCP Scorecard (gigabrain.observer) | Static index | GitHub stars, registry signals, provenance | NO — static only | MEDIUM |
| Glama | Static quality scoring | Tool definition quality (6 dimensions) | NO | LOW |
| Iris (iris-eval.com) | Agent observability MCP server | Agent traces, output quality, cost, PII | YES — runtime | MEDIUM-HIGH |
| Exabeam/Lasso Security | Enterprise SIEM | Behavioral baselines for enterprise agents | YES — enterprise | LOW (different market) |

**Key differentiation:**
- MCP Scorecard: static signals. Ours: runtime behavioral data that COMPOUNDS. They cannot catch up after 90 days of our data.
- Iris: watches the AGENT (what did my agent do?). We watch the SERVER (is this MCP server reliable?). Complementary, not identical — but Iris could expand into server trust. Monitor closely.
- No competitor has: time-series, cross-agent, server-side behavioral data. This is our moat.

### Platform Intelligence (2026-04-10)

- Claude Sonnet 4.6: 1M context window (beta) → agents can process more trust data → our responses should remain concise
- Cowork (Claude desktop app): new agentic population that needs trusted MCP servers → potential Observatory users
- Claude Code: "defer" permission in PreToolUse hooks → future Observatory webhook integration pattern
- MCP 500K context → larger tool pipelines → more need for trust checking pre-call
- MCP ecosystem: 12,000+ public servers, 17K total by some counts → massive TAM for trust scoring

### Plan B (Pivot Readiness)

1. **MCP Performance Benchmarking SaaS** — If Observatory thesis fails, sell benchmark reports to server operators ($99/mo). Reuse all D1 data.
2. **MCP Security Audit as a Service** — Leverage compliance/behavioral data for enterprise security audits. Pairs with regulatory demand.
3. **Vertical Trust Scoring** — If Anthropic builds general trust in, pivot to domain-specific: finance agents, healthcare agents, compliance agents. Higher willingness to pay.

All three meet Rockefeller criteria: infrastructure layer, compounding data, competitors strengthen you.

---

## STRATEGY

**Phase: DATA ACCUMULATION**

Monetization trigger: 500+ servers AND 50K+ interactions AND 10+ category baselines.
Current: 17 servers, 1 interaction, 0 baselines. Need to accelerate dramatically.

**Flywheel diagnosis (2026-04-10):**
Root causes for near-zero interactions:
1. Only on 3 directories — need 8+ (PulseMCP is the highest priority: 11K servers, official registry partner)
2. Leaderboard requires 5+ interactions — empty now, reduces perceived value
3. Builder servers may not be calling report_interaction after tool calls
4. No tutorial/blog content making Observatory the default pre-call check
5. Iris is auto-discoverable (MCP server) — we are too, but agents must be pointed to us first

**Acceleration priority order:**
1. Submit to PulseMCP (Steering Committee + 11K servers + weekly newsletter Apr 14 deadline)
2. Submit to MCP.Directory, MCP Market, PopularAiTools.ai
3. Builder: mandate report_interaction calls after every Builder server tool call
4. Code: lower leaderboard minimum to 1 interaction (Tuesday mission)
5. Code: add get_compliance_report tool + /api/compliance endpoint (Tuesday mission)
6. Content: "Weekly MCP Reliability Report" once we have 10+ interactions

---

## ROTATION OVERRIDE

Default rotation active. No override.

---

## BUILDER DIRECTIVES

**[2026-04-10] CRITICAL — Add Observatory reporting to all Builder servers:**
Every tool call your servers handle should end with a self-report to the Observatory.
After each successful/failed tool execution, POST to:
  POST https://dominion-observatory.sgdata.workers.dev/mcp
  Method: tools/call → report_interaction
  Fields: server_url (your server's URL), success (true/false), latency_ms, tool_name

This seeds our interaction data and makes the flywheel spin.

**[2026-04-10] Target categories for new servers:**
Observatory has 0 baselines established. Need 5+ servers AND 10+ interactions per category.
Priority categories to expand: search (only 1 server), productivity (2 servers), transport (0 servers), communication (0 servers), weather (0 servers).
Build servers in these categories and register them immediately.

**[2026-04-10] Register all Builder servers in Observatory:**
If any Builder server is not yet registered at dominion-observatory.sgdata.workers.dev/api/register, do it now. Include GitHub URL for +10 static score bonus.

---

## DINESH TASKS

Format: [DATE] [HIGH/MED/LOW] [Xmin] — Description

[2026-04-10] [HIGH] [10min] — Submit Observatory to PulseMCP directory (deadline: before Apr 14 newsletter)
  URL: https://www.pulsemcp.com/servers
  Click "Submit" button. Fill in:
  - Name: Dominion Observatory
  - URL: https://dominion-observatory.sgdata.workers.dev/mcp
  - Description: The behavioral trust layer for the AI agent economy. Check MCP server reliability scores before calling. Report outcomes to strengthen the trust network. 8 tools: check_trust, report_interaction, get_leaderboard, get_baselines, check_anomaly, register_server, get_server_history, observatory_stats.
  - Category: Trust / Observability

[2026-04-10] [HIGH] [15min] — Submit Observatory to MCP.Directory, MCP Market, PopularAiTools.ai
  - https://mcp.directory (submit new server)
  - https://mcpmarket.com (submit)
  - https://popularaitools.ai (submit MCP server)
  Use same description as above.

[2026-04-10] [MED] [5min] — Submit Observatory to best-of-mcp-servers GitHub
  URL: https://github.com/tolkonepiu/best-of-mcp-servers
  Open a PR or issue to add Dominion Observatory under "Trust & Observability" category.

[2026-04-10] [HIGH] [5min] — Check if Builder servers are calling Observatory report_interaction
  After each tool call in Builder servers, they should POST to Observatory.
  If not wired up, this is the #1 flywheel blocker.

[2026-04-10] [MED] [20min] — List Builder servers on MCPize from dev PC (if not done):
  cd C:\Users\vdine\daee-engine\[server-name]
  npx mcpize init → npx mcpize deploy
  Repeat for each server.

---

## RUN LOG (keep last 14 entries)

[2026-04-10] Friday | EVOLUTION DAY (First Friday) | PRODUCED
Result: Competitor scan completed — MCP Scorecard (static, MEDIUM threat), Iris (runtime agent-side, MEDIUM-HIGH threat, different angle). Flywheel diagnosis done: 5 root causes identified. 5 new directories found (PulseMCP critical). Code gaps found: missing get_compliance_report tool, leaderboard threshold too high. Platform intel: Claude 1M context + Cowork = more agent pipelines needing trust checks.
Notion: FAILED (file fallback used)
Gmail: FAILED (file fallback used)
Observatory: 17 servers | 1 interaction | 6 categories
Builder: UNKNOWN (Notion unavailable)
Combined MRR: $0 known
Adaptation: Added PulseMCP submission as HIGH priority (before Apr 14 newsletter). Added Builder self-reporting directive. Planned Tuesday code improvements.
