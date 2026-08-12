# RUN-025 Portfolio Management — Wednesday 2026-04-29

## A. KILL — EXP-018b (early pattern kill, D7)

**EXP-018b: Composition-doctrine terminology anchoring**
- Launched: 2026-04-22 | Kill date: 2026-05-20 | Days alive: 7 | Signal: 0
- Conviction at launch: 5/10 | At kill: 4/10
- Kill rationale: D7, 0 signal, lowest conviction in portfolio (5/10). Passive measurement — tracking
  whether "3-layer framing" or "policy_source=" terminology spreads in external RFC/blog/LLM output.
  With Observatory in DISCOVERY bottleneck and zero external demand for 21 days, a passive
  terminology-tracking experiment contributes nothing to the critical path. EXP-025a (SEP-2663 TBF,
  8/10) has a literal zero-day window (PR filed today). The trade: 5/10 passive measurement D7 →
  8/10 zero-day active push.
- **Status: KILLED** (early kill, D7, pre-kill-date — justified by zero-day slot opportunity)
- Genome WHAT FAILS addition: Passive measurement experiments (no CEO action required, no push surface
  needed) produce zero insight in DISCOVERY bottleneck where there is no inbound traffic to measure.
  Passive measurement has value only once baseline inbound exists.

## B. No graduations

- EXP-021a: CEO BLOCKED (PR #6 unmerged, outreach file D4 stale). Cannot measure.
- EXP-023a: D2. No signal (CEO post pending).
- EXP-024a: D1. No signal (CEO post pending; NOW DEPLOYED as of this run).
- EXP-019a: D6. No signal.

## C. LAUNCH — EXP-025a (SEP-2663 Task Behavioral Fingerprint)

**EXP-025a: SEP-2663 Task Behavioral Fingerprint (TBF) Companion Spec Comment**

- **Hypothesis:** Posting a technical comment on SEP-2663 (modelcontextprotocol/specification PR #2663,
  filed TODAY April 29) proposing Task Behavioral Fingerprinting as a companion extension — with
  Observatory's `/v1/behavioral-evidence` endpoint as the live reference implementation — will get
  acknowledgment from the spec reviewer and embed Observatory in the MCP Tasks Extension discussion.
  Timing: PR is in-review status, assigned to CaitieM20, milestone 2026-06-30-RC. Zero other
  behavioral trust proposals exist. The zero-day window is TODAY.

- **Originality prior-art search (inherits from SPIDER S21-A, 5-surface verification):**
  1. GitHub MCP PRs: no companion behavioral SEP for SEP-2663
  2. WebSearch "task behavioral fingerprint MCP protocol specification 2026": 0 matches
  3. WebSearch "task behavioral baseline MCP agent protocol specification 2026": Fingerprint.com MCP
     = device fingerprinting (NOT task behavioral) — not the mechanism
  4. Microsoft Agent Governance Toolkit: audit+identity+policy, no task behavioral baseline spec
  5. MCP 2026 roadmap: behavioral monitoring mentioned generically, no task behavioral fingerprint SEP
  Conclusion: ZERO prior art. Empire ships first.
  Additional check (this run): PR discussion by localden/pja-ant/prezaei/panyam flagged requestState
  integrity and consistency window gaps — no behavioral fingerprinting proposal in any comment.

- **Not textbook:** No prior MCP trust registry has proposed a task-level behavioral fingerprint
  companion SEP. Standard playbook = directory submission; this inverts it — contributes to the spec
  itself so every Task Extension implementer discovers Observatory at specification level.

- **Why now:** SEP-2663 filed SAME DAY. Reviewers already flagging requestState integrity and
  behavioral consistency gaps — direct demand signal for the TBF layer. Comment window is open NOW.
  Once PR merges to spec (milestone June 30), companion spec comment opportunity shifts to PR against
  the merged spec, harder to claim authorship.

- **Ships this run:** `outreach/2026-04-29-sep2663-tbf-companion-comment.md` — full CEO-pasteable
  comment for modelcontextprotocol/specification PR #2663

- **Constitution check:**
  - C1 ✅: Public GitHub PR comment; agent-discoverable via MCP spec repo
  - C2 ✅: No human sales; MCP devs find Observatory via spec implementation
  - C3 ✅: Every SEP-2663 implementer discovering Observatory = potential premium tier user
  - C4 ✅: 5-surface prior-art search, 0 matches

- **Success metric:** PR reviewer (CaitieM20) or PR author (LucaButBoring) acknowledges TBF
  concept, OR any other spec contributor references Observatory in PR discussion, OR any new
  external agent_id in /api/compliance from an MCP-spec-related referrer within 14 days.

- **Kill date:** 2026-05-13 (14 days)
- **Conviction:** 8/10
- **Status: LIVE** (outreach file drafted this run; CEO posts)

## Portfolio (post-RUN-025)

| ID | Name | Launched | Kill | Conviction | Status | Signal |
|---|---|---|---|---|---|---|
| EXP-018b | Composition-doctrine anchoring | 04-22 | — | 4/10 | **KILLED** (early D7) | 0 |
| EXP-019a | /badge/ SVG parasite | 04-23 | 05-07 | 7/10 | LIVE | 0 (D6) |
| EXP-021a | ERC-8004 engagement | 04-25 | 05-09 | 8/10 | LIVE — CEO BLOCKED | 0 (D4 stale) |
| EXP-023a | Microsoft AGT bridge | 04-27 | 05-11 | 7/10 | LIVE | 0 (D2) |
| EXP-024a | A2A evidence endpoint | 04-28 | 05-12 | 8/10 | LIVE — NOW DEPLOYED | 0 (D1) |
| EXP-025a | SEP-2663 TBF companion | 04-29 | 05-13 | 8/10 | LIVE — CEO posts | new |

Portfolio: 5/5. Three highest-conviction plays still CEO-blocked (ERC-8004, AGT, A2A).
EXP-025a adds fourth CEO-action-required play — escalating all four in Gmail briefing.

**Kill calendar:**
- 2026-05-07: EXP-019a (D14 kill)
- 2026-05-09: EXP-021a (D14 kill — CEO BLOCKED note)
- 2026-05-11: EXP-023a (D14 kill)
- 2026-05-12: EXP-024a (D14 kill)
- 2026-05-13: EXP-025a (D14 kill)
