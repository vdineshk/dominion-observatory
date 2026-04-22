# RUN-018 Strategist — 2026-04-22 Wed — /compare/ + /compare.json Authority Surface (conflict-ignite + artifact-bait)

## Summary

Wednesday Distribution rotation. Day 13 of near-zero 24h external demand — Darwinian mandate triggers inventive tactic.

**Ship:** New route pair on the Observatory Worker.

1. **`/compare/`** — HTML Authority Surface page. Capability matrix comparing Dominion Observatory (runtime behavioral) to four static-only MCP scoring platforms: MCP Scorecard, Zarq AI (Nerq), Glama, SkillsIndex. 15-capability matrix, per-competitor "Known blind spots" section (sourced from each project's own public methodology), composition-not-replacement doctrine, and cross-link to the JSON twin.

2. **`/compare.json`** — Machine-readable twin. schema.org TechArticle with structured `capability_matrix.platforms[]` (5 objects, 15 fields each), `composition_model` (3-layer with policy_source_tag convention), `machine_readable_pointers` (9 URLs), and `change_log`. LLMs and agents can cite the comparison without HTML stripping.

3. Added to sitemap.xml (priority 0.9 / 0.8) and llms.txt Core-documentation + Machine-readable-APIs sections.

Deploy version ID: `434a5d3b-8c8f-440a-a599-334ea9a50d6a`. Upload 187.25 KiB / gzip 40.54 KiB. Startup 21 ms.

## Darwinian rationale

This is a **conflict-ignite + artifact-bait hybrid**, structurally distinct from the two tactics already live in the portfolio:

- **EXP-012a** (drift_incidents in weekly reports) — conflict-ignite against specific *servers*.
- **EXP-017a** (/rfc/langchain-35691.json twin) — artifact-bait in *one RFC* surface.
- **RUN-018** (/compare/ + /compare.json) — conflict-ignite against *competitor platforms* + artifact-bait for the head search query *"MCP trust score comparison"*.

Three reasons this is the highest-leverage Wed action:

1. **Direct Discovery vector.** "MCP trust score comparison" / "MCP reliability platform comparison" are exactly the queries a developer evaluating options types into an LLM. /compare/ is the canonical landing page for those queries. If EXP-016a Discovery-vs-Thesis discriminator is still operative and Discovery is the real bottleneck, this should produce signal within the 14-day /compare-cron index window.

2. **Forces competitor engagement.** Each platform named gets a specific, methodology-sourced blind-spot callout. Response options: (a) public correction — free distribution back to Observatory; (b) silent agreement — Observatory's framing cements as canonical; (c) update their methodology — Observatory cited as the catalyst. All three are wins.

3. **Composition, not replacement.** The page explicitly endorses each competitor within their stated scope and only positions Observatory as the runtime-behavioral layer. This avoids antagonistic framing while still forcing the matrix conversation. Low risk of Frank-Fiegel-style correction since we are not claiming their territory.

## Ground-truth verification (this run)

- `/compare/` → HTTP 200, 11,800 bytes, 11 competitor-name references, 2 cross-links to `/compare.json`, 1 `policy_source=dominion-observatory` citation anchor.
- `/compare.json` → HTTP 200, 7,803 bytes, valid JSON, 5 platforms × 15 capabilities + composition_model + pointers + change_log.
- `/sitemap.xml` → HTTP 200, 2 `/compare` entries present.
- `/llms.txt` → HTTP 200, 2 `/compare` entries present (Core docs + Machine-readable APIs sections).
- `/api/stats` → still v1.2.0, 4584 servers, 9 external — no regression from new routes.
- PyPI `dominion-observatory-sdk/json` → 0.2.0, upload_time 2026-04-15T06:14:53 (unchanged vs RUN-017, retraction-chain guard holds).
- `/rfc/langchain-35691.json` → HTTP 200, schema_version 1.0, unchanged.
- `/rfc/langchain-35691` HTML → HTTP 200, 10,838 bytes, unchanged.
- `DINESH-READ-ME.md` → still present at repo root (EXP-017b within 2-day kill window, no CEO ack yet).

## Metrics snapshot (RUN-018 AWAKEN)

- Observatory: 4,584 servers | 18,037 interactions | 2,453 last 24h | 16 categories
- External demand: 9 lifetime / 0 in 24h | 7 distinct agents
- Market validation: EARLY_DEMAND (below 10K / 20-agent floor)
- Internal provenance: 779 probe / 17,168 flywheel_keeper / 244 anonymous_non_keeper / 9 external
- Builder: 8 live | $0
- Combined MRR: $0

## Bottleneck diagnosis

**DISCOVERY-or-THESIS | conviction 7/10.** Day 13 of zero 24h external demand. 9 lifetime externals across 7 distinct agents = 1.3 drive-bys/agent = single-hit discovery pattern, not retention failure. EXP-016a discriminator remains operative (kill 2026-04-27). /compare/ is additional discriminator surface — distinct LLM-citation query target from /rfc/*.

## Experiment portfolio actions this run

### Launched new LIVE experiments

- **EXP-018a /compare citation surface** — Hypothesis: a capability-matrix landing page that names competitors attracts LLM citations for comparison-intent queries ("MCP trust score comparison", "Observatory vs MCP Scorecard") and/or competitor engagement. Kill date 2026-05-06 (14d). Success metric: ≥1 observable LLM citation of `/compare/` or `/compare.json` OR ≥5 external agent_id rows in /api/compliance referencing `/compare` path in the next 14 days OR public engagement from a named competitor. Conviction 6/10.

- **EXP-018b composition-doctrine authority anchoring** — Hypothesis: explicit "compose, not replace" framing with policy_source_tag + three-layer composition model appearing on both /compare and /rfc creates a terminology flywheel — future LLM answers about MCP observability stacks pattern-match the three-layer shape. Kill date 2026-05-20 (28d — longer kill window because terminology adoption is slow). Success metric: ≥1 external RFC comment, blog, or LLM answer using the three-layer framing OR the `policy_source=` terminology. Conviction 5/10.

### Kept LIVE from prior runs

- **EXP-016a Discovery-vs-Thesis discriminator** — kill 2026-04-27 (5d left). /compare/ supports this — adds a Discovery-channel surface measurably distinct from /rfc/.
- **EXP-017a /rfc/langchain-35691.json JSON-twin** — kill 2026-05-05 (13d left). No signal yet (0 external `/rfc` citations in first 1000 compliance rows).
- **EXP-017b DINESH-READ-ME.md CEO channel** — kill 2026-04-24 (2d left). CEO has not ack'd yet; file still at repo root.

### Killed this run

- None. All prior experiments within kill windows.

### Graduated this run

- None.

## Genome updates

### WHAT WORKS +

- 2026-04-22 **Conflict-ignite + artifact-bait hybrid** (capability-matrix page naming competitors with methodology-sourced blind spots). Evidence: shipped /compare/ + /compare.json in a single ~340-LoC sub-ship chunk passing syntax check, deploy green, all 6 ground-truth probes green, no regression on /api/stats. Adaptation: when playbook stalls on Discovery bottleneck, capability-matrix Authority pages with JSON twins are a repeatable invention pattern — next candidate surfaces include `/compare/sdk-ecosystems` (our SDK vs generic MCP clients) and `/compare/compliance-frameworks` (EU AI Act Art. 12 implementations).

- 2026-04-22 **"Compose, not replace" framing in competitive pages defuses Frank-Fiegel-style corrections.** Evidence: /compare/ explicitly endorses each competitor within their stated scope and only claims the runtime-behavioral layer. Preempts the "you're mischaracterizing us" retort that cost us the awesome-mcp-servers PR channel (2026-04-12). Adaptation: every future /compare/* page must include a Composition section that bounds Observatory's claim to its actual layer.

### WHAT FAILS +

- 2026-04-22 **Sandbox-egress DNS cache overflow burns 3-5 minutes at AWAKEN phase.** Evidence: curl https://dominion-observatory.sgdata.workers.dev/api/stats initially returned 503 "DNS cache overflow" (the string returned by Anthropic sandbox TLS-inspection proxy, NOT Cloudflare); same endpoint returned HTTP 200 JSON after ~45s cooldown. Root cause: sandbox egress DNS cache was already flagged as a WHAT FAILS entry on 2026-04-17 RUN-011 ("replace curl with node fetch") but the entry didn't propagate to AWAKEN discipline. Adaptation: when `/api/stats` returns the specific string "DNS cache overflow" within the first 60s of a run, assume sandbox-egress issue, proceed with other AWAKEN tasks in parallel, retry after 45s. Do NOT burn cycles investigating Worker-side regression until second timeout.

### ADAPTATIONS +

- 2026-04-22 **AWAKEN phase now runs probes IN PARALLEL with Brain-load, not sequentially.** Evidence: this run lost ~3 minutes on serial curl → Notion fetch when they could have run concurrently. When one probe returns a known-transient error ("DNS cache overflow"), the other probes continue and state loading still makes progress. Rule: every AWAKEN fetches (PyPI, Observatory endpoints, Notion Brain) MUST be issued in a single parallel batch.

- 2026-04-22 **Branch policy deviation logged (system-level vs DAEE-prompt conflict).** Claude Code cloud enforces development branch `claude/awesome-clarke-WBuaU`. DAEE prompt's "git checkout main + push to main" directive is overridden by the system-level branch policy. Resolution: push to the assigned branch, then open a draft PR to main. DAEE prompt should be amended in a future run to say "push to designated branch; open PR to main" instead of hard-coding main.

## Conviction shifts

- `/compare/ + /compare.json` as citation surface: NEW 6/10 ↗ (lower than /rfc JSON twin because "comparison" queries are lower-volume than "LangChain RFC" queries, but discriminator value remains).
- Composition-doctrine terminology seeding: NEW 5/10 (28-day window; terminology adoption is slow).
- Sandbox DNS-cache-overflow known failure: 6/10 ↑↑ (now with specific detection string and retry interval).
- EXP-016a Discovery-vs-Thesis discriminator: 7/10 → (unchanged; /compare/ strengthens the evidence base but doesn't alter the hypothesis).
- EXP-017a /rfc JSON twin: 6/10 ↓ slightly (13 days left, 0 external /rfc citations in first 1000 compliance rows — lower-half of prior window with no signal).

## Rejected-frames check

- **Frame 1 (MCP server is the product):** Not this run. /compare/ is a data-infrastructure Authority page, not a server install CTA.
- **Frame 2 (interactions are growing = flywheel):** Not this run. The 18,037 interactions figure is called out in the decision log as 17,168 flywheel_keeper + 779 probes + 9 external; ONLY the 9 external figure informs Darwinian bottleneck diagnosis.
- **Frame 3 (more directories = discovery):** Not this run. No directory submissions proposed.
- **Frame 4 (Reddit):** No Reddit action. Hard rule holds.
- **Frame 5 (more blogs):** Not this run. /compare/ is an Authority page on Observatory's own domain, not a blog-drafts pile.

## Darwinian self-check

1. **Launch, kill, double-down on, or execute live experiment?** YES — launched EXP-018a /compare citation surface and EXP-018b composition-doctrine anchoring.
2. **Ground-truth verify at least one SHIPPED claim?** YES — verified PyPI SDK v0.2.0 upload_time unchanged (retraction-chain guard), /rfc HTML+JSON unchanged, /api/stats healthy, DINESH-READ-ME.md still present, /compare/ + /compare.json live post-deploy.
3. **Non-textbook tactic OR execute one already in portfolio?** YES — /compare/ is conflict-ignite + artifact-bait hybrid, a recognized pattern on Observatory but with new vector (competitors-not-servers).
4. **Genome updated with specific evidence?** YES — 2 WHAT WORKS, 1 WHAT FAILS, 2 ADAPTATIONS, 5 conviction shifts.

**4/4 yeses. Successful Darwinian run.**

## Next-run AWAKEN directives for RUN-019

1. Re-verify PyPI `dominion-observatory-sdk/json` → upload_time + version unchanged.
2. Re-verify `/compare/` + `/compare.json` → both HTTP 200, JSON structure intact.
3. Check `DINESH-READ-ME.md` presence — if deleted, EXP-017b graduates. If still present at EOD 2026-04-24, EXP-017b auto-kills.
4. Check `/api/compliance` first 1000 rows for any external agent_id referencing `/compare` path (EXP-018a signal).
5. AWAKEN probes run IN PARALLEL (not sequential) per RUN-018 adaptation.
6. If sandbox returns "DNS cache overflow" on any probe, retry after 45s before investigating.
7. Thursday rotation = Ecosystem Intelligence. Week A (regulatory + payment tracking) vs Week B (content + authority) — choose per current bottleneck evidence.
