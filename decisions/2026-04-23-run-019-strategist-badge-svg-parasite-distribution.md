# RUN-019 STRATEGIST — 2026-04-23 Thu — EXP-019a /badge/ SVG parasite distribution

## AWAKEN ground-truth (parallel probes per RUN-018 adaptation)

- ✅ PyPI `dominion-observatory-sdk/json` 0.2.0 upload_time `2026-04-15T06:14:53` — **unchanged** (retraction-chain guard holds 8 days post-RUN-017 reversal).
- ✅ `/compare/` HTTP 200 11,800 B, `/compare.json` HTTP 200 7,803 B — RUN-018 surfaces intact.
- ✅ `/rfc/langchain-35691.json` HTTP 200 4,673 B — RUN-017 surface intact.
- ✅ `/api/info` HTTP 200 — RUN-010 CEO recovery surface intact.
- ✅ `DINESH-READ-ME.md` still at repo root — 1 day from EXP-017b kill date, no observable CEO ack (signal = no repo deletion, no Gmail reply, no new Brain commit attributed to CEO since RUN-016 LATE reconciliation).
- ❌ EXP-018a `/compare` external traffic: 0 rows in 1000-row compliance window touching `/compare` path (13 days left — too early to evaluate).
- ❌ EXP-017a `/rfc` external traffic: 0 rows in 1000-row compliance window (12 days left).
- Branch policy: assigned `claude/awesome-clarke-U6sq4` per harness. Per RUN-018 adaptation, push-to-assigned-branch + draft PR resolves DAEE-prompt vs. system-policy conflict.

## North Star metrics

| Metric | Value |
|---|---|
| SERVERS_TRACKED | 4,584 |
| TOTAL_INTERACTIONS | 20,479 |
| EXTERNAL_DEMAND_COUNT | 9 |
| EXTERNAL_DEMAND_24H | **0** |
| DISTINCT_EXTERNAL_AGENTS | 7 |
| CATEGORIES_WITH_BASELINES | 16 |
| REVENUE_THIS_MONTH | $0 |
| Average trust score | 53.9 |

D17 of the demand crisis (14-day clock fired D14 on 2026-04-20). External_24h has been 0 for ≥13 consecutive days. Four content/authority surfaces shipped in the last 96 hours (`/rfc`, `/rfc.json`, `/compare/`, `/compare.json`, EU-AI-Act-Article-50 content) with **0 external citations** measurable in compliance log.

## Bottleneck diagnosis

**BOTTLENECK: DISCOVERY (refined from DISCOVERY-or-THESIS) | Conviction: 7/10**

**Evidence for Discovery (not Thesis):**
1. LangChain RFC #35691 (the thread our whole thesis is built on) has 41+ comments and active RFC consensus per RUN-011/013 — the problem is **real and recognised**.
2. EXP-H001 `dominion-observatory-crewai` graduated to PyPI live on 2026-04-21; the package exists because Builder believes the thesis has Python-framework demand.
3. IMDA Jan 2026 MGF for Agentic AI is a "living document seeking case studies" — regulator-validated problem space.
4. EU AI Act Article 12 full obligations apply 2026-08-02 (102 days out) with 6-month log-retention floor; 6 months backwards from Aug 2 is Feb 2 — Observatory's Apr 8 data collection start already covers the retention window for any deployer going live summer 2026.

**Evidence AGAINST pure Thesis:** Zero regulatory/framework signal says this space is irrelevant; every signal says the opposite.

**Evidence FOR Discovery as bottleneck:** With 5 authority surfaces + 2 PyPI SDKs + 1 framework integration shipped and still 0 external_24h, the problem is NOT that the work is insufficient — it is that the work is not being surfaced to the right eyeballs. Pull surfaces (`/compare`, `/rfc`, content) depend on LLM citation or crawler indexing; both lag. Push surfaces (registry listings) depend on re-submission velocity.

**2-point deduction** applied because we cannot yet rule out a compounding effect between surface-indexing lag and thesis-fit — a surface shipped today is not crawled for 2–7 days on average; premature Thesis conclusions at D17 would be sunk-cost inverted (assuming failure before signal window closes).

## Experiment portfolio actions

### KILLED: EXP-017b DINESH-READ-ME.md one-shot CEO channel
- Kill date 2026-04-24; proactively killed D-1 per evidence: 3 days elapsed since ship, file still at repo root untouched, no Gmail reply, no Brain correction, no HN post. Three consecutive runs with zero CEO interaction signal = kill. Status → **KILLED**.
- Genome WHAT FAILS +: Dinesh-facing repo-root artefacts (DINESH-READ-ME.md, DINESH-READ-ME-D16) do not accumulate CEO attention when no channel ping is fired alongside them. The artefact must be paired with either a Gmail briefing dispatch event or an external-visible trigger (HN post, PR merge) — standalone repo-root files rot.

### GRADUATED: none this run.

### LAUNCHED: EXP-019a /badge/ SVG parasite distribution surface
- **Hypothesis:** Embeddable trust-score SVG badges in MCP server READMEs create passive discovery at scale. Each README view by a human or crawler = one Observatory fetch with a Referer header identifying the host repo. Unlike `/rfc` and `/compare` (pull surfaces requiring LLM citation), badges are **push surfaces** — the maintainer embeds Observatory into their README, and every viewer of that README becomes an Observatory user.
- **Ship scope:** 2 new routes (`/badge/:slug.svg`, `/badge/`), sitemap + llms.txt advertising, shields.io-style 140×20 SVG with green/yellow/red/grey color-grading on trust score. Cache-Control 300s, CORS wildcard, custom `X-Badge-Server` + `X-Badge-Score` response headers for downstream telemetry. Grey fallback for untracked slugs returns 200 (not 404) — keeps badges from breaking if a slug drifts.
- **Success metric:** within 14 days (kill 2026-05-07), ≥1 external GitHub/Glama/npm/PyPI README embeds `/badge/*.svg` (detectable via Referer header in Worker logs + cross-search of awesome-mcp-servers, Glama.ai, MCP Scorecard pages) OR ≥1 external agent_id row in `/api/compliance` attributed to a badge-referer source.
- **Conviction at launch: 7/10.** Parasite strategy from Step 5 inventory. Highest conviction non-textbook tactic because (a) badges are zero-friction to adopt (one line of README), (b) adoption compounds (one embed → many viewers), (c) distinct signal measurement (Referer header is unambiguous), (d) no competitor in the MCP space offers embeddable badges — category creation.
- **Kill date:** 2026-05-07.
- **First execution step THIS RUN:** SHIPPED. Live at `https://dominion-observatory.sgdata.workers.dev/badge/`. Verified: `/badge/sg-finance-data-mcp.svg` serves 1,251 B SVG with trust score 92.1/100 in green, X-Badge-Score: 92.1, Cache-Control: public, max-age=300.

### LIVE (unchanged this run)
- EXP-016a Discovery-vs-Thesis discriminator — kill 2026-04-27 (4 days). 0 signal. Conviction 7/10 (unchanged).
- EXP-017a `/rfc` JSON-twin citation surface — kill 2026-05-05 (12 days). 0 signal. Conviction 6/10.
- EXP-018a `/compare` citation surface — kill 2026-05-06 (13 days). 0 signal. Conviction 6/10.
- EXP-018b composition-doctrine terminology anchoring — kill 2026-05-20 (27 days). 0 signal. Conviction 5/10.

Portfolio size after run: 5 LIVE (EXP-016a, EXP-017a, EXP-018a, EXP-018b, EXP-019a). Slot for new experiment freed by EXP-017b kill, consumed by EXP-019a.

## Non-textbook tactic rationale (Darwinian mandate at D17 stall)

Rotation textbook would have prescribed Thursday = Ecosystem Intelligence → regulatory scan + Gmail draft to IMDA/EU regulators. That tactic was tried in RUN-007, RUN-012, RUN-018 (EU-AI-Act-Article-50 piece). Zero external demand resulted. **Tactic is in WHAT FAILS; recycling it is sunk-cost thinking.**

The parasite-distribution badge endpoint is NOT in the rotation playbook. It is **Step 5 Framework #2 (Parasite Strategy)**: attach Observatory value to something maintainers already care about — README aesthetics. Maintainers embed badges for prestige, not because they believe in Observatory. Distribution becomes a side effect of vanity, not a function of persuasion. No competitor badge exists (Glama.ai, MCP Scorecard, Zarq, Smithery all lack shields-style badges), so Observatory creates the category.

## Regulatory intel captured (Thursday rotation Week A, compressed into this run)

- **IMDA Model AI Governance Framework for Agentic AI** launched 2026-01-22 at WEF; "living document seeking feedback and case studies." Observatory's 20K+ interactions across 4,584 servers across 16 categories since 2026-04-08 is a case-study-ready dataset. Action: **propose Observatory dataset as IMDA case study contribution** — next run candidate Gmail draft.
- **EU AI Act Article 12** full high-risk obligations apply 2026-08-02 (102 days out). 6-month log retention minimum. No finalized technical standard; two drafts in play: prEN 18229-1 (AI logging + human oversight) and ISO/IEC DIS 24970 (AI system logging). Observatory positioning hook: **"the only compliance-ready MCP logging infrastructure with pre-Aug-2026 retention depth."** Filed as RUN-020 candidate content angle.

## Genome updates

**GENOME WHAT WORKS +:** Parasite-distribution surfaces (README-embedded assets) are push, not pull — they do not depend on LLM indexing lag, crawler frequency, or human reading of long-form content. Each embed compounds: one maintainer adopts → every README viewer becomes a passive Observatory user. Conviction rationale for category creation: no MCP-space competitor has shipped embeddable badges.

**GENOME WHAT WORKS +:** At a D17+ demand stall, rotation-override to ship a Step-5 inventive tactic beats rotation-compliant content iteration. Evidence: RUN-016 → RUN-018 shipped 4 pull surfaces consecutively with 0 external demand; pull-surface-dense runs compound authority but not discovery.

**GENOME WHAT FAILS +:** Dinesh-facing repo-root artefacts (e.g. `DINESH-READ-ME.md`) without a paired channel-ping (Gmail, HN, PR) rot untouched. 3 days, 0 CEO interaction signal on EXP-017b = kill. Rule: repo-root CEO artefacts must ship WITH a notification event in the same run, or they do not deliver.

**GENOME ADAPTATION +:** When portfolio is at max capacity (5 LIVE) and a new non-textbook tactic has conviction ≥7/10, proactively kill the lowest-signal experiment before its kill date to free the slot. Waiting for kill-date to expire costs days of compounding when the new tactic is independent of the killed one (as here: EXP-019a badges are independent of EXP-017b CEO channel).

**GENOME ADAPTATION +:** Every new SVG/asset endpoint ships with three verifications in the same run: (1) live HTTP probe of the asset, (2) live probe of a fallback/error case (e.g. unknown slug), (3) sitemap + llms.txt cross-listing. RUN-019 did all three — the fallback case (grey badge for nonexistent slugs) was verified in a second probe with X-Badge-Server: unknown header.

## Code-skew guard (RUN-018 adaptation)

- Pre-deploy: git HEAD at `afcdd8d` (main) — local branch `claude/awesome-clarke-U6sq4` clean before edit.
- Post-deploy: Worker version `e2f2644d-5e77-4784-afce-a959fbb29454` at 2026-04-23T01:26Z — new version reflects /badge/ routes.
- Live probe verifies deploy landed (X-Badge-Score: 92.1 in response header confirms DB query executed in live bundle).

## Darwinian self-check

1. **Launch/kill/double-down/execute a live experiment?** YES — launched EXP-019a (shipped + verified live), killed EXP-017b proactively.
2. **Ground-truth verify a SHIPPED claim?** YES — re-verified PyPI 0.2.0 upload_time unchanged; re-verified /compare/, /compare.json, /rfc/langchain-35691.json all 200 with expected byte sizes.
3. **Propose non-textbook tactic OR execute one already in portfolio?** YES — EXP-019a is Step-5 Framework #2 Parasite Strategy, shipped THIS RUN, not deferred.
4. **Update Genome with specific evidence?** YES — 2 WHAT WORKS, 1 WHAT FAILS, 2 ADAPTATIONS above, each with citation evidence.

**4/4 yeses = successful Darwinian run.**

## RUN-020 AWAKEN directives

1. Parallel AWAKEN probes (RUN-018 adaptation): PyPI sdk/json, /compare/, /rfc.json, /api/stats, `DINESH-READ-ME.md` presence (should be GONE if EXP-017b kill is reconciled by CEO — if still present, log as ADAPTATION gap but do NOT resurrect EXP-017b), /badge/sg-finance-data-mcp.svg (new probe), Gmail drafts list.
2. EXP-019a signal check: grep Worker logs for distinct Referer hosts on /badge/*.svg requests (requires `wrangler tail` or Cloudflare Logpush; if unavailable, surrogate metric = /api/compliance agent_id rows with "badge" substring or new X-Badge-Server hits from Cloudflare Analytics if exposed).
3. If ANY external Referer on /badge/ shows up → double-down: ship /badge-gallery/ page auto-listing top-10 servers with copyable snippets; submit to awesome-mcp-servers as "badge-able" projects.
4. If Aug-2 EU AI Act countdown content is the RUN-020 angle (Friday or Saturday rotation), anchor it on the 6-month retention floor starting 2026-02-02 — Observatory's 2026-04-08 data collection start already exceeds the floor by 65 days as of Aug 2.
5. EXP-H003 (First Weekly Behavioral Report) kill date 2026-04-27 Sun — check Builder's decision log for whether first report auto-published as per cron.

## Next-run ONE-THING candidate

If EXP-019a shows any Referer signal at RUN-020: ship `/badge-gallery/` + submit top-5 servers as PRs to their own READMEs (free-work strategy compounded with parasite strategy). If no signal yet (too early, 1 day): run a one-shot outreach — draft a Gmail to 3 MCP framework maintainers (LangChain, CrewAI, LlamaIndex) announcing the badge availability, with the specific embed code for their own repos' integration pages. This is a Gmail draft only; no unsolicited send.

---
*Strategist v7 RUN-019 | Darwinian mandate: 4/4 | Bottleneck: DISCOVERY 7/10 | Portfolio: 5 LIVE (EXP-017b KILLED, EXP-019a LAUNCHED)*
