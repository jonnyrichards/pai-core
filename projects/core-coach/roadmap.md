# Coach Foundations - Q3 Roadmap

<!--
TIMELINE SCALE
Each quarter has 6 positions (Q3.0 – Q3.5), each ~2 weeks apart.
"A month forward" = +2 positions. "A month back" = -2 positions.
Q3.5 → Q4.0 is a valid boundary crossing.

EFFORT (card width)
Small = 1/6q (~2 weeks) | Medium = 2/6q (~1 month) | Large = 4/6q (~8 weeks)
-->

Coach Everywhere — 50% of monthly active platform users using Coach.

---

## Confidence key

| Label | Meaning |
|---|---|
| Committed | Scoped, resourced, in delivery |
| High confidence | Strong intent, clear path |
| Early signal | Directionally right, needs validation |
| Hypothesis | Worth exploring, low signal so far |
| Placeholder | Not yet defined |

## Effort key

| Label | Sprints | Duration |
|---|---|---|
| Small | 1 | ~2 weeks |
| Medium | 2 | ~1 month |
| Large | 3 | 8 weeks |

---

## Unified:

Making Coach feel like one product across all surfaces.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| Unified Sessions | Q3.0 | Committed | Large | Reach | Single session history + site navigation | Single session history + site navigation: Users can see all Coach sessions in one place and navigate between Coach-enabled pages without losing context — making Coach feel like one product. | Ananda, Ally, Darsh |
| Routing | Q3.0 | Committed | Medium | Foundation | Cross-agent routing | Cross-agent routing: A question asked in Engage Coach can be routed to the Perform agent when appropriate — removing the seam between Coach contexts. | Michael, Ayden, Ben |
| Enablement | Q3.0 | Committed | Medium | Foundation | Playbook (build out + maintain) > Build > Discovery + Emerging | Playbook (build out + maintain): Maintain and evolve the Coach Playbook, control plane, and eval pipeline to support all teams building on Coach. ;; Build: Ship Coach integrations — Add a 1-on-1 topic (not API & MCP), Coach in Goals (~Early Q3), Coach in Survey Design (~Mid Q3), PCQ Coach Uplift (trend, comparison & discoverability). ;; Discovery + Emerging: Discovery across Coach in 1-on-1s, Manager Reviews Uplift, Anytime Feedback, Probation Reviews. Emerging: Frontier Support. | Tabitha, Ngoc, Lisa, Kristina |

---

## Context-Aware:

Grounding Coach in customer and user context.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| Customer Knowledge Base | Q3.0 | Committed | Large | Reach | CKB in CZ | CKB in CZ: CZ admins can upload company context to Coach to make Coach's response more tailored and company-specific (EAP, GA → Q4). | Nate, Rachel, Kristina, Lisa |
| Memory Slice 1 | Q4.3 | Discovery | Small | Engagement | Memory Slice 1 | Memory Slice 1: Coach can store and serve user-level settings and text-based memory across sessions — making replies more personally relevant over time. | — |

---

## MSI:

Closing the gap between insight and action for leaders.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| MSI Slice 2 | Q3.0 | Committed | Large | Engagement | Explainability + latency handling > Dynamic prompts > Exec summaries > Charts & graphs | Explainability + latency handling: Coach streams its thinking, data retrieval, and sources to the user — building trust and managing perceived latency during heavy tool calls. ;; Dynamic prompts: Coach detects admin vs leader context and surfaces tailored prompts — driving deeper engagement with insight data. ;; Exec summaries: Coach outputs a structured summary for leaders-of-scale to copy/use directly — reducing the gap between insight and action. ;; Charts & graphs: Coach renders charts where appropriate — improves insight expressiveness for MSS. | Ben, Baps, Lisa |
| Actions into 1:1s | Q3.0 | Discovery | Medium | Engagement | Actions into 1:1s | Actions into 1:1s: Enable users to add Coach-suggested actions directly to a 1:1 agenda — first step toward in-platform action-taking. | Nicha, Ally, Darsh |

---

## Observable:

Making Coach conversation data fast and easy to act on.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| Conversation Analytics | Q3.0 | Committed | Medium | Foundation | Analytics dashboard | Analytics dashboard: Create an 'at a glance' view of popular Coach topics; enable inspection of de-identified traces. | Pierce, Anh, Jonny |
| Feedback | Q4.0 | Discovery | Medium | Engagement | Thumbs up / thumbs down refresh | Thumbs up / thumbs down refresh: Turn thumbs up / down into actionable signal. | — |

---

## Trusted & Insightful:

Keeping Coach reliable, compliant, and expressive.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| FE Improvements | Q3.4 | Committed | Medium | Foundation | Context pillow + unified disclaimer + navigation | Context pillow + unified disclaimer + navigation: Context pillow shows what Coach is using, Coach has a unified disclaimer, secondary nav displays in Coach tap in main nav. | — |
| BE Improvements | Q3.2 | Committed | Large | Foundation | Compliance and codebase health > Web sockets clean up | Compliance and codebase health: GDPR automation, OCSF audit log compliance, Datadog spike. ;; Web sockets clean up: Ensure web sockets is properly supported across Coach instances. | — |
| Page Fluency | Q4.0 | Discovery | Medium | Reach | Page Fluency Slice 1 | Page Fluency Slice 1: Shared context between Coach and the page; Coach can make in-page edits — lays the foundation for Coach-first workflow experiences. | — |

---

## Not in scope

| Initiative | Reason |
|---|---|
| CA Connector in Claude | Requires strategic commitment; with PGLT |
| External data sources | Frontier team is working on this; deprioritised for Coach Foundations |
| Coach Voice | Waiting for Beta rollout data before next investment; MSI release is future-proofed with scaled-back conversation mode |
| Customer Knowledge Base EAP | Not achievable given multiple unknowns + risks, plus necessary focus on MSI + Unified Sessions / Routing |
