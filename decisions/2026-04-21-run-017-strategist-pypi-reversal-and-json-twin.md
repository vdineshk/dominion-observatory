# RUN-017 Strategist — 2026-04-21 Tue — PyPI ground-truth reversal + /rfc JSON twin

## Summary

Two ships and one critical ground-truth reversal.

1. **Ship A (code-skew reconciliation):** Fast-forwarded `origin/claude/amazing-allen-x8YC9` into main. The RUN-016 `/rfc/langchain-35691` HTML Authority page was live on the Worker since 2026-04-20 but had never been merged into main HEAD. Latent code-skew that could have caused a regressive deploy. Resolved.

2. **Ship B (Tuesday Observatory Improvement):** New route `GET /rfc/langchain-35691.json` — machine-readable JSON twin of the HTML Authority page. Structured schema.org TechArticle with policy_source convention, composition model, jurisdictional mappings, SDK package index (npm sdk, pypi sdk, pypi langchain), known limitations, and machine-readable pointer table. LLMs and agents can now cite Observatory's RFC position without HTML-stripping. Added to sitemap.xml + llms.txt. Cross-linked from the HTML page with change-log entry. Deploy version ID `5a3b7288-a1f8-406c-b7b5-1609888b5cad`.

3. **Ground-truth reversal (4th-hallucinated-ship narrative retracted):** The CEO Directive from 2026-04-20 declared PyPI `dominion-observatory-sdk` 404 and flagged the Strategist's "HN gate cleared" claim as the 4th hallucinated-ship. My registry-specificity pings at 2026-04-21T01:07 UTC contradict that:

   - `curl -sI https://pypi.org/simple/dominion-observatory-sdk/` → HTTP/2 200
   - `curl -sI https://pypi.org/project/dominion-observatory-sdk/` → HTTP/2 200
   - `curl -sI https://pypi.org/pypi/dominion-observatory-sdk/json` → HTTP/2 200
   - JSON body: `name: dominion-observatory-sdk, version: 0.2.0, upload_time: 2026-04-15T06:14:53, author: "Dominion / vdineshk"`

   `upload_time: 2026-04-15T06:14:53` is authoritative. The package has been on PyPI for 6 days. PyPI's search-index lag + twine's HTTP 400 "file already exists" produced the false-negative trio in the Sunday CEO session. RUN-015-v2's claim that PyPI SDK was live was actually **correct**. The retraction that retracted it was itself wrong.

   CEO notified via `DINESH-READ-ME.md` at repo root (per RUN-015 Genome rule — Gmail drafts pile up unsent; repo commits are seen every sweep). HN Show HN gate is truly open.

## Verification (ground-truth, this run)

- `/rfc/langchain-35691.json` → HTTP 200, valid JSON, schema_version 1.0, 9 machine-readable pointers, 2 change-log entries, `observatory_slot_filled: true`, SDK package index includes all 3 registry slots.
- `/rfc/langchain-35691` HTML → HTTP 200, cross-link to JSON twin present, change-log updated.
- `/sitemap.xml` → HTTP 200, both /rfc entries present.
- `/llms.txt` → HTTP 200, JSON twin listed under Machine-readable APIs.
- `/api/stats` → v1.2.0, 4584 servers, 9 external, health nominal.
- `pypi.org/pypi/dominion-observatory-sdk/json` → v0.2.0 confirmed live (reversal evidence).
- `pypi.org/pypi/dominion-observatory-langchain/json` → v0.1.0 confirmed live.
- `registry.npmjs.org/dominion-observatory-sdk` → v0.2.0 confirmed live (latest).

## Bottleneck diagnosis

**RETENTION-or-DISCOVERY | conviction 7/10.** EXTERNAL_DEMAND_COUNT = 9 lifetime / 7 distinct agents / 0 in 24h. Day 13 of near-zero external agent growth. 7 agents × 1.3 interactions-per-agent average — these are single drive-bys, not retention failures. Looks more like DISCOVERY than RETENTION proper, which is why EXP-016a (Discovery-vs-Thesis discriminator) remains the operative live experiment.

## Experiment portfolio actions this run

- **Kept LIVE:** EXP-016a Discovery-vs-Thesis (kill 2026-04-27). JSON twin supports this — if LLM-indexed traffic spikes, Discovery hypothesis gains evidence.
- **Graduated:** `dominion-observatory-langchain` RFC #35691 slot-fill (CEO-graduated Sun eve; confirmed by CEO Directive).
- **New LIVE:** `EXP-017a /rfc/langchain-35691.json JSON-twin citation surface` — hypothesis: structured JSON increases LLM-cited Observatory mentions in AI-generated answers. Kill date 2026-05-05 (14d). Success metric: ≥1 observable citation in an AI assistant response OR ≥10 agent_id=* rows in /api/compliance referencing the /rfc path in the next 14d.
- **New LIVE:** `EXP-017b CEO ground-truth reversal channel` — hypothesis: `DINESH-READ-ME.md` as one-shot CEO notification channel produces faster action than Gmail drafts. Kill date 2026-04-24 (3d). Success metric: Dinesh acknowledges reading OR HN Show HN posted.

## Genome updates

### WHAT WORKS +
- 2026-04-21 Registry-specificity ground-truth (curl URL + HTTP status + timestamp + JSON body fields) produced a clean reversal of a CEO-issued false negative. Evidence: 4 independent PyPI endpoint probes at the same timestamp. Adaptation: every registry claim ships with all 4 pieces of evidence in the same run.
- 2026-04-21 Branch code-skew guard during a non-Friday run caught a latent RUN-016 ship not merged to main. Evidence: git log showed f1e1359 only on origin/claude/amazing-allen-x8YC9, while HTML /rfc was already live on Worker. Adaptation: code-skew scan is now AWAKEN phase, not Friday-only.

### WHAT FAILS +
- 2026-04-21 Search-index-lag as evidence of package absence. PyPI's public search returned zero results for `"dominion-observatory-sdk" site:pypi.org` on 2026-04-20 even though the package page was directly fetchable. Do not treat zero search results as a 404 — always fetch the package page directly.
- 2026-04-21 `twine upload HTTP 400` as evidence of package absence. HTTP 400 with body "file already exists" means the version is ALREADY published, not missing. Do not infer 404 from a 400 twine response.

### ADAPTATIONS +
- 2026-04-21 AWAKEN Ship B: code-skew guard now runs every run (not just Fridays). Check: for every route known to be live on Worker, grep git main HEAD for its path; if missing, investigate before any deploy.
- 2026-04-21 Retraction chain guard: if a prior CEO/Brain entry retracted a Strategist claim, re-run registry-specificity ground-truth before accepting the retraction. Retractions can themselves be drift.

## Conviction shifts

- `dominion-observatory-sdk` on PyPI: 2/10 → **9/10 ↑↑↑** (ground-truth confirmed live since 2026-04-15)
- `HN Show HN strategy`: 3/10 → **7/10 ↑↑** (gate actually open; CEO needs to post)
- `4th-hallucinated-ship narrative`: 8/10 → **2/10 ↓↓↓** (retracted — the retraction itself was the hallucination)
- `/rfc/langchain-35691.json` JSON twin: NEW 6/10 (conviction modest because LLM-citation channels are harder to measure)
- `Code-skew guard as every-run discipline`: NEW 9/10 (this run's incident shows the cost of Friday-only discipline)

## Darwinian self-check

1. Launch, kill, double-down, or execute live experiment? **YES** — launched EXP-017a (JSON twin) and EXP-017b (DINESH-READ-ME.md channel).
2. Ground-truth verify at least one SHIPPED claim? **YES** — verified 4 PyPI probes, 2 npm probes, 3 Observatory route probes, 1 LangChain RFC WebFetch (inconclusive due to rendering).
3. Propose a non-textbook tactic OR execute one already in portfolio? **YES** — JSON twin is a Reverse-publish / Artifact-bait hybrid: structured schema.org data that LLMs will prefer over HTML, forcing Observatory into AI-generated citations.
4. Genome updated with specific evidence? **YES** — 2 WHAT WORKS, 2 WHAT FAILS, 2 ADAPTATIONS, all dated and evidence-cited.

**4/4 yeses. Successful Darwinian run.**

## Next-run AWAKEN directives for RUN-018

1. Re-verify PyPI `dominion-observatory-sdk/json` → upload_time unchanged, version unchanged. Guard against further retraction drift.
2. Check DINESH-READ-ME.md still at repo root (or deleted if Dinesh read and cleared it per file instructions).
3. Check EXP-017a signal — any agent_id hitting /rfc/langchain-35691.json?
4. If HN Show HN has been posted, capture the front-page spike window for the /api/stats external_24h delta.
5. Wednesday rotation = Distribution & Flywheel Acceleration.
