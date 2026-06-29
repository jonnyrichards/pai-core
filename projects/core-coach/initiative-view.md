---
title: "Coach Foundations: Q3 Initiatives (+ Q2 Recap)"
confluence_page_id: 6346015278
confluence_space: COACHCAMP
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6346015278/Q3+Initiative+Summary+Coach+Foundations"
last_synced: "2026-06-25T03:21:46.068Z"
---

# Coach Foundations: Q3 Initiatives (+ Q2 Recap)

Q3 is about making Coach feel like one product across Culture Amp — unified, context-aware, and trustworthy enough to reach 50% of monthly active platform users.

*Generated from quarterly-priorities.md. Last updated: 2026-06-23.*

---

| Initiative | Stream | What it is | Why it matters | Status |
|---|---|---|---|---|
| [**Unified Sessions**](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6039667036) | Unified | A single session history and navigation layer across all Coach-enabled pages. | Users currently experience Coach as disconnected per-page tools — unifying sessions makes Coach feel like one product and removes the biggest friction to repeat use. | Committed |
| [**Routing**](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6350110803) | Unified | Cross-agent routing so a question in one Coach context can be answered by the right agent. | Removes the seam between Coach contexts so users get the right answer regardless of where they started the conversation. | Committed |
| [**Customer Knowledge Base**](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/5986156868) | Context-Aware | A CZ admin interface for uploading company-specific context that Coach uses to ground its responses. | Generic responses are the main reason Coach feels unhelpful to specific customers — company context makes Coach meaningfully more relevant. | Committed |
| **MSI Slice 2** *(PM: Mann)* | MSI | A set of improvements to Coach's manager survey insight experience: explainability, dynamic prompts, exec summaries, charts, and action-linking. | MSI is Coach's highest-engagement surface — this slice closes the gap between surfacing insights and helping leaders act on them. | Committed |
| **Enablement** | Unified | Maintaining the Coach Playbook to support teams building across Coach surfaces. **Build:** Add a 1-on-1 topic (not API & MCP), Coach in Goals (~Early Q3), Coach in Survey Design (~Mid Q3), PCQ Coach Uplift (trend, comparison & discoverability). **Discovery:** Coach in 1-on-1s, Coach in Manager Reviews Uplift (Goals-based), Coach in Anytime Feedback, Coach in Probation Reviews. **Emerging:** Frontier Support (Content Design, Strategic/UX Design). | Coach's value multiplies as it reaches more surfaces — the Playbook and direct team support ensure each new integration ships with shared standards, consistent quality, and confidence tooling rather than starting from scratch. | Committed |
| [**Conversation Analytics**](https://cultureamp.atlassian.net/wiki/spaces/CL/pages/6306636573/Conversation+Analytics+-+Improvements) | Observable | Improvements to the Conversation Analytics tool — sampling, precomputed weekly ranges, and week-over-week trends — to make Coach conversation data fast and easy to act on. | The existing tool is too slow to be useful day-to-day; these improvements make it the primary lens for understanding what Coach users are actually asking and whether quality is improving. | Committed |
| **Codebase Maintenance + Improvements** | Trusted & Insightful | GDPR automation, OCSF audit log compliance, web socket consistency, and a unified disclaimer across Coach surfaces. | Good engineering practice and regulatory compliance — these keep Coach operable at scale, auditable in regulated markets, and trustworthy to end users. | Committed |

---

## Out of Scope

| Item | Reason |
|---|---|
| CA Connector in Claude | Requires strategic commitment; with PGLT |
| External data sources | Frontier team is working on this; deprioritised for Coach Foundations |
| Voice enhancements | Waiting for more data; MSI release is future-proofed with scaled-back conversation mode on this surface |
| Customer Knowledge Base EAP | Not achievable given multiple unknowns + risks, plus necessary focus on MSI + Unified Sessions / Routing |

---

## Q2 Achievements

| Initiative | Stream | What we shipped | Why it matters | Status |
|---|---|---|---|---|
| **LangGraph Migration** | Unified | All agents migrated to LangGraph; Agno platform retired. | Puts all Coach agents on a single orchestration layer — prerequisite for routing and unified sessions, removes ongoing cost and complexity of maintaining two platforms. | Completed |
| **Voice** | Trusted & Insightful | Voice CZ pilot, CZ UXR, dictation and conversation modes shipped to 100% of accounts (Beta feature), new Beta feature flag set up. | Creates parity with competitors, releases Beta version with a view to gathering data about feature value, builds flexibility to future pricing and packaging scenarios. | Completed |
| **End-to-End Evals** | Observable | Evals workflows enabled for new agents (e.g. Voice, Develop) and persistent evaluation for existing capabilities (e.g. Guardrails checks). | Gives teams confidence when shipping new agents or making changes, catches regressions before they reach users. | Completed |
| **MSI Slice 0** | MSI | New MSI agent, Coach on home page for EAP accounts, routing workflow for MSI and General Coach agents, MSI evals, MSI UI (Proactive Tile). | Enables Coach to deliver high-quality, multi-signal insights to leaders of scale, brings Coach to new surfaces, lays foundation for wider MSI release. | Completed |
| **Customer Knowledge Base Discovery** | Context-Aware | Design prototype + UXR, technical prototype + recommendations. | De-risks the Q3 CKB build — validated the concept with real users and surfaced the key technical constraints before committing to a full build. | Completed |