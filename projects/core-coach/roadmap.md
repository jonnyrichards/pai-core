# Coach Foundations - H2

<!--
TIMELINE SCALE
Each quarter has 6 positions (Q3.0 – Q3.5), each ~2 weeks apart.
"A month forward" = +2 positions. "A month back" = -2 positions.
Q3.5 → Q4.0 is a valid boundary crossing.

EFFORT (card width)
Small = 1/6q (~2 weeks) | Medium = 2/6q (~1 month) | Large = 4/6q (~8 weeks)
-->

Coach everywhere — 50% of monthly active users.

---

## Confidence key

| Label | Meaning |
|---|---|
| Committed | Scoped, resourced, in delivery |
| High confidence | Strong intent, clear path |
| Early signal | Directionally right, needs validation |
| Discovery | Planned but not yet scoped or resourced |

## Effort key

| Label | Sprints | Duration |
|---|---|---|
| Small | 1 | ~2 weeks |
| Medium | 2 | ~1 month |
| Large | 3 | 8 weeks |

---

## Unified:

Make Coach accessible platform-wide.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| Unified Sessions | Q3.0 | Committed | Large | Reach | Single session history + site navigation | Single session history + site navigation: Users can see all Coach sessions in one place and navigate between Coach-enabled pages without losing context — making Coach feel like one product. | Ananda, Ally, Darsh |
| Routing | Q3.0 | Committed | Medium | Reach | Cross-agent routing | Cross-agent routing: A question asked in Engage Coach can be routed to the Perform agent when appropriate — removing the seam between Coach contexts. | Michael, Ayden, Ben |
| Enablement | Q3.0 | Committed | Large | Reach | Playbook + control plane > End-to-end eval pipeline > Write Goals with Coach > Coach in [x] | Playbook + control plane: Equip teams building on Coach with updated playbook, control plane, and prompt library ;; End-to-end eval pipeline: Any triggering event (new agent, model change, guardrail update) runs a new eval — gives teams shipping confidence ;; Write Goals with Coach: Support the Goals team to ship Coach in Goals with PSX + MCP support ;; Coach in [x]: Support Perform camp with Discovery around: Coach in probation, 1:1s, AF | Tabitha, Ngoc, Lisa, Kristina |

---

## Context-Aware:

Equip Coach with organisational and personal context.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| Customer Knowledge Base | Q3.0 | Committed | Large | Engagement | CKB in CZ | CKB in CZ: CZ admins can upload company context to Coach to make Coach's response more tailored and company-specific (EAP, GA → Q4) | Nate, Rachel, Kristina, Lisa |
| Customer Knowledge Base | Q4.0 | High confidence | Medium | Engagement | CKB in EAP | CKB in EAP: Expand Customer Knowledge Base to EAP customers | Nate, Rachel, Kristina, Lisa |
| Memory | Q4.2 | Discovery | Medium | Engagement | Memory Slice 1 | Memory Slice 1: Coach can store and serve user-level settings and text-based memory across sessions — making replies more personally relevant over time. | — |

---

## MSI:

Make Coach smarter about manager survey insights.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| MSI Slice 2 | Q3.0 | Committed | Large | Engagement | Explainability + latency handling > Dynamic prompts > Exec summaries > Charts & graphs > Actions into 1:1s | Explainability + latency handling: Coach streams its thinking, data retrieval, and sources to the user — building trust and managing perceived latency during heavy tool calls. ;; Dynamic prompts: Coach detects admin vs leader context and surfaces tailored prompts — driving deeper engagement with insight data. ;; Exec summaries: Coach outputs a structured summary for leaders-of-scale to copy/use directly — reducing the gap between insight and action. ;; Charts & graphs: Coach renders charts where appropriate — improves insight expressiveness for MSS. Q4 scope: extend charting to new data types. ;; Actions into 1:1s: Enable users to add Coach-suggested actions directly to a 1:1 agenda — first step toward in-platform action-taking. | Ben, Baps, Lisa |
| Actions into 1:1s | Q3.0 | Discovery | Large | Engagement | Discovery | Discovery: Enable users to add Coach-suggested actions directly to a 1:1 agenda — first step toward in-platform action-taking | Nicha, Ally, Darsh |

---

## Observable:

Make Coach's behaviour inspectable and improvable.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| Conversation Analytics | Q3.0 | Committed | Medium | Foundation | Analytics dashboard | Analytics dashboard: Create an 'at a glance' view of popular Coach topics; enable inspection of de-identified traces | Pierce, Anh, Jonny |
| Feedback | Q4.3 | High confidence | Medium | Foundation | Thumbs up / thumbs down refresh | Thumbs up / thumbs down refresh: Turn thumbs up / down into actionable signal. | — |

---

## Trusted & Insightful:

Build trust through reliability, transparency, and quality.

| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
|---|---|---|---|---|---|---|---|
| Coach Voice | Q4.0 | High confidence | Large | Engagement | Voice UX + latency optimisation | Voice UX + latency optimisation: Enable Voice for Engage / Perform, improve UX for high latency interactions | Nicha, Ally, Darsh |
| FE Improvements | Q3.0 | Committed | Medium | Foundation | Context pillow + unified disclaimer + navigation | Context pillow + unified disclaimer + navigation: Context pillow shows what Coach is using, Coach has a unified disclaimer, secondary nav displays in Coach tap in main nav | — |
| BE Improvements | Q3.0 | Committed | Large | Foundation | GDPR automation > OCSF audit log compliance > Datadog spike | GDPR automation: Automate GDPR compliance processes ;; OCSF audit log compliance: Bring audit logs into OCSF format ;; Datadog spike: Investigate and resolve Datadog integration issues | — |
| Web Sockets Clean Up | Q3.4 | Committed | Medium | Foundation | Web sockets clean up | Web sockets clean up: Ensure web sockets is properly supported across Coach instances | — |
| Page Fluency | Q4.3 | Discovery | Medium | Foundation | Page Fluency Slice 1 | Page Fluency Slice 1: Shared context between Coach and the page; Coach can make in-page edits — lays the foundation for Coach-first workflow experiences. | — |

---

## Not in scope

| Initiative | Reason |
|---|---|
| CA Connector in Claude | Requires strategic commitment; with PGLT |
| External data sources | Frontier team is working on this; deprioritised for Coach Foundations |
