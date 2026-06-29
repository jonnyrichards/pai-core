# AI Accelerator Week Plan
*Week of 30 June 2026*

### Theme: AI Skilling & Tooling — build habits, not just prototypes

---

## 1. Prototyping workflow with Nicha

- Set up a shared repo with [design-sandbox components](https://github.com/cultureamp/design-sandbox/tree/main/apps/design-sandbox/components) + [DESIGN.md](https://github.com/cultureamp/coach-monorepo/blob/main/DESIGN.md) as context
- Agree on a shared idea (CKB admin UI? Coach Everywhere concept?)
- Simple workflow: branch → vibe-code → PR to merge
- Nicha is fresh on Coach Foundations this week — good timing to pick something in that space

---

## 2. Context sharing workflow with Jay

- Investigate publishing a subset of PAI memory as an OKF bundle Jay can consume
- Could be as simple as a shared git repo with curated markdown files at first
- Ties to #3 below as the applied output

---

## 3. Google Open Knowledge Format

- Read the [spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- Map PAI's memory structure against OKF conventions — already close
- Decide: upgrade PAI memory to OKF-compliant, or use OKF as the export format for sharing

---

## 4. Culture Amp shared skills repository

- Scan what's available, identify 1-2 skills to contribute
- PAI skills (quarterly-roadmap, initiative-export) are good candidates

---

## 5. Local prototyping environment

- Wire design-sandbox components + DESIGN.md into a local Claude context
- Produce a template/README so Nicha can replicate in 10 mins

---

## 6. Market intelligence lift

### 6a. One-off this week
- Follow up on Competitor Radar access → structured review of Lattice, Leapsome, 15Five (2-3hr timebox → short brief)
- Get better data out of Clozd — understand which competitor touchpoints are swaying deals
- Get better data out of Pendo — understand what regular customer feedback is available and how to access it

### 6b. Routines — set up recurring agents
Spend a half-day learning how Routines work end-to-end (not yet investigated — this is the week), then wire up 2-3:

| Routine | Cadence | Notes |
|---------|---------|-------|
| Competitive intelligence scan | Fortnightly | Web search for Lattice/Leapsome/15Five announcements → brief |
| AI news digest | Weekly | Pull + summarise Mann's newsletter + broader AI signals |
| Pendo feedback scan | Weekly | Query Pendo for recent feedback → observations to memory |
| Clozd win/loss signals | Monthly | Summarise deal outcomes with competitor mentions |

> Pendo + Clozd routines depend on API/MCP connectors — check availability first. AI news + competitive scan can run on web search today.

---

## Suggested time allocation

| Day | Focus |
|-----|-------|
| Mon | OKF research + map against PAI memory; Jay context-sharing experiment |
| Tue | Local prototyping env setup + Nicha collaboration workflow |
| Wed | Prototype something with Nicha (shared idea) |
| Thu | Routines deep-dive — learn the system, wire up 2-3 live agents |
| Fri | Market research sprint (Clozd, Pendo, competitor scan) + CA shared skills repo |
