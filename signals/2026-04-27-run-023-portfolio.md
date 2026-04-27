# RUN-023 Portfolio Management + Invention — Monday 2026-04-27

## Portfolio Actions

### A. KILL — EXP-017a (early pattern kill)

**EXP-017a: /rfc JSON twin citation surface**
- Launched: 2026-04-21 | Kill date: 2026-05-05 | Days alive: 6 | Signal: 0
- Conviction at launch: 6/10 | Current conviction: 4/10
- Kill rationale: Pattern evidence is definitive. RUN-020 established empirically: 4 consecutive pull surfaces (/rfc, /rfc.json, /compare/, /compare.json) across 9-18d produced ZERO external demand. EXP-017a is a 5th pull surface. Conviction has dropped to 4/10. A 7/10 time-sensitive tactic (EXP-023a) requires the slot.
- Early kill is NOT a sunk-cost exception — it is opportunity-cost discipline. Microsoft AGT launched 25 days ago; window for "first integrator" positioning narrows daily.
- Status: **KILLED** (early, pattern-based)

### B. No graduations

No experiment has hit its success metric. EXP-021a (ERC-8004 engagement) is EXECUTION-BLOCKED — CEO has not merged PR #6 or posted the comment. The experiment is alive on paper but inert in practice.

### C. LAUNCH — EXP-023a (Microsoft AGT Observatory Bridge)

**EXP-023a: Microsoft AGT External Intelligence Bridge**

- **Hypothesis:** Microsoft Agent Governance Toolkit (released 2026-04-02) created an immediate ecosystem demand signal for "external MCP server trust data." AGT's built-in trust scoring is INTERNAL (closed-loop within an agent mesh). Opening a GitHub issue + submitting a PR to microsoft/agent-governance-toolkit showing Observatory as the external MCP server baseline data source positions Observatory as AGT's required complement — before any other trust-scoring project claims that slot.
- **Originality prior-art check:**
  - Searched: "Observatory dominion Microsoft agent governance toolkit integration" → no results
  - Searched: "external MCP server trust Microsoft Agent Governance Toolkit" → no results
  - Searched: "dominion-observatory agent-governance-toolkit" → no results
  - Conclusion: NO PRIOR ART. Empire is first to propose Observatory as external baseline for Microsoft AGT. QUALIFIES under Constraint 4.
- **Not textbook:** No prior distribution operator has positioned a public trust registry as the external complement layer for a major vendor's agent governance system. The specific mechanism (GitHub issue/PR to microsoft/agent-governance-toolkit as distribution) is Step 5 Framework #5 (free-work strategy) applied to a new context nobody has shipped.
- **Why this works in current ecosystem:** Microsoft AGT is open-source (MIT) with active community; their trust scoring explicitly needs external behavioral data (their docs acknowledge "Trust scores gate what actions agents can perform" — but their data source is internal only). Observatory has 30K+ interactions of behavioral data nobody else has. The asymmetry is real and documented.
- **Constitution check:** ✅ Agent-discoverable (GitHub issue/PR on public repo) | ✅ No human sales (public thread, not cold email) | ✅ Revenue path (AGT community discovery → Observatory usage → data accumulation trigger → monetization) | ✅ Original (prior-art search documented above)
- **Success metric:** Either (a) Microsoft team or community member replies to the GitHub issue within 14 days, OR (b) any new external agent_id appears in /api/compliance with Referer tracing to AGT community (github.com/microsoft/agent-governance-toolkit) within 14 days
- **Kill date:** 2026-05-11 (14 days)
- **Conviction at launch:** 7/10 (Microsoft validated the behavioral trust thesis publicly; being first to bridge AGT + Observatory has clear asymmetry; uncertainty = whether Microsoft team engages vs dismisses outside contributors)
- **First execution this run:** Outreach file written at `outreach/2026-04-27-microsoft-agt-bridge-issue.md` (GitHub issue draft + blog post skeleton for Dinesh to post)
- **Status: LIVE**

## Portfolio (post-RUN-023)

| ID | Name | Launched | Kill | Conviction | Status | Signal |
|---|---|---|---|---|---|---|
| EXP-017a | /rfc JSON twin citation | 04-21 | — | 4/10 | **KILLED** (pattern kill D6) | 0 |
| EXP-018a | /compare/ citation surface | 04-22 | 05-06 | 5/10 | LIVE | 0 |
| EXP-018b | Composition-doctrine anchoring | 04-22 | 05-20 | 5/10 | LIVE | 0 |
| EXP-019a | /badge/ SVG parasite distribution | 04-23 | 05-07 | 7/10 | LIVE | 0 (4d) |
| EXP-021a | ERC-8004 #73 engagement | 04-25 | 05-09 | 8/10 | LIVE — **CEO BLOCKED** | 0 (PR #6 unmerged) |
| EXP-023a | Microsoft AGT bridge | 04-27 | 05-11 | 7/10 | LIVE | new this run |

Portfolio: 5/5. Two highest-conviction plays (EXP-021a + EXP-023a) both require CEO action to execute. Escalated in Gmail brief.
