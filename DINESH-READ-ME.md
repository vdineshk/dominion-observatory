# DINESH — READ THIS FIRST (Strategist RUN-017, 2026-04-21 Tue)

## TL;DR — HN SHOW HN GATE IS OPEN. The 4th-hallucinated-ship narrative itself was the hallucination.

**The RUN-016 CEO Directive that declared PyPI `dominion-observatory-sdk` 404 was incorrect.** Package has been LIVE on PyPI at 0.2.0 since 2026-04-15T06:14:53 UTC — a week ago. This is not a new publish. It was never actually 404.

You can post HN Show HN anytime. `pip install dominion-observatory-sdk` resolves right now.

---

## Ground-truth evidence (registry-specificity rule, 2026-04-21T01:07 UTC probes)

```
curl -sI https://pypi.org/simple/dominion-observatory-sdk/
→ HTTP/2 200

curl -sI https://pypi.org/project/dominion-observatory-sdk/
→ HTTP/2 200

curl -sI https://pypi.org/pypi/dominion-observatory-sdk/json
→ HTTP/2 200

curl -s https://pypi.org/pypi/dominion-observatory-sdk/json | jq .info
→ name: dominion-observatory-sdk
  version: 0.2.0
  upload_time: 2026-04-15T06:14:53
  author: Dominion / vdineshk
```

Four independent probes across three URL shapes (simple, project, pypi/json) all HTTP 200. The `upload_time` field is authoritative — PyPI would not report a synthetic upload time for a non-existent package.

---

## Reconciling the CEO session from Sunday night

The Sunday CEO verification used three methods. Here is why each produced a false negative:

1. **WebFetch of pypi.org/project/dominion-observatory-sdk/** → reported `robots.txt disallowed (inconclusive)`.
   Inconclusive is not a 404. Treating inconclusive as evidence of absence was the first error.

2. **Web search `"dominion-observatory-sdk" site:pypi.org`** → zero results.
   PyPI's public search indexer has a well-known days-to-weeks lag between upload and searchability. Zero search results is not evidence the package is missing — it is evidence the search index has not caught up. The package page has always been directly fetchable.

3. **`twine upload` returned HTTP 400 Bad Request** (not 409).
   HTTP 400 on a duplicate upload means "invalid request" which can include *"file already exists at this version"* when the twine client reformats the error. On Python 3 twine implementations, PyPI's 400 with body `"File already exists. See https://pypi.org/help/#file-name-reuse"` is the canonical "this version is already published" response — it is **not** evidence the package is missing. Treating it as such was the third error.

Cross-registry conflation was the narrative shape, but in this specific instance, the four ground-truth pings above are dispositive: the package was on PyPI all along.

---

## What to do now

1. **Post HN Show HN** when you have time. SDK is live on PyPI AND npm. The 60-second first-impression test (a reader types `pip install dominion-observatory-sdk`) will pass.
   - Title suggestion: `Show HN: Dominion Observatory — cross-ecosystem trust scores for MCP servers`
   - Sub-link: `https://dominion-observatory.sgdata.workers.dev/`
   - Install line to include: `pip install dominion-observatory-langchain` (the framework surface; the base SDK install follows).

2. **No action needed on `twine upload` retry.** The package is already at 0.2.0. Re-publishing requires a version bump to 0.3.0 which we do not need right now.

3. **Nothing to do about the RFC #35691 slot-fill** — you already posted it Sunday evening. Still filled.

---

## What Strategist RUN-017 shipped in this same run

- **`/rfc/langchain-35691.json`** — machine-readable JSON twin of the /rfc page. Structured schema.org TechArticle with policy_source convention, composition model, jurisdictional mappings, SDK package index, known limitations. LLMs and agents can now cite the Observatory RFC position without HTML-stripping.
- **sitemap.xml** extended to include the JSON twin.
- **llms.txt** extended to point LLMs at the JSON twin.
- **HTML /rfc page** cross-links to the JSON twin and change-logged.
- **Branch reconciliation:** RUN-016 branch `claude/amazing-allen-x8YC9` was fast-forwarded into main. The /rfc HTML route was live on the Worker but missing from git main HEAD — a latent code-skew. Now main matches the live Worker.

---

## Why this document exists (not Gmail)

Per RUN-015 Genome rule — Gmail drafts pile up unsent. Repo commits are read on every Builder sweep and on every Strategist AWAKEN. Ground-truth corrections that must not be missed live in the repo.

Delete this file after you have read it. It is a one-shot CEO notification, not permanent documentation.

— Strategist RUN-017
