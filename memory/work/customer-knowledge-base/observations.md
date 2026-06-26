# Observations: Customer Knowledge Base

- 2026-06-18 [work, ckb, uxr, personify-health, research]: Personify Health research session findings:
  - **Document naming**: re-add document name + description fields to the upload UI — they don't want Coach citing weird filenames when surfacing sources
  - **No edit needed**: fine with uploads being final/non-editable; "our documents would be final"
  - **Conflict resolution**: if Coach conflicts with their document, their document wins — no ambiguity
  - **Time-sensitive context**: liked the idea of ephemeral context injections (e.g. "there's just been a re-org")
  - **Document-level permissions**: want access controls at the document level (e.g. compensation guidelines visible only to managers)
  - **Pilot Group**: comfortable with Pilot Group as the mechanism for admins to test the knowledge base before full rollout
  Note: document-level permissions conflicts with current design decision (no per-document access controls) — needs flagging. [[work/customer-knowledge-base/observations#2026-06-12]]

- 2026-06-16 [work, ckb, psx, docs]: PSX-authored guidance doc on how to assess documents uploaded to the CKB — https://cultureamp.atlassian.net/wiki/spaces/AIML/pages/6256165101/PSXAI+guidance+on+CKB

- 2026-06-25 [work, ckb, dan, technical]: Dan's direct notes on CKB (technical perspective, early-mid Jun) — largely consistent with 2026-06-12 session below; key additions/emphases: (1) RAG handles many documents well — 'shove it all in', no partitioning; (2) multiple docs of same type is fine, don't enforce 'one values doc only'; (3) document name should default to filename, let them edit but don't sweat it; (4) auto-tag on upload + let user change; limit tag count. Core decisions confirmed: preserve exact doc (no summarisation), batch upload, non-editable, no per-document permissions, show summary (TBD if same as tags). [[work/customer-knowledge-base/observations#2026-06-12]]

- 2026-06-12 [work, ckb, product, design, engineering]: Session with Enoch, Dan, Rachael — key CKB design/tech decisions:
  - **Upload latency**: processing will take time; UI needs an affordance for this
  - **Preserve exact document**: do not summarise on ingest
  - **Batch upload**: 'set and forget' — not one-by-one
  - **Non-editable**: uploaded document should not be editable; name can be edited (default to filename) but don't sweat it
  - **Document summary**: could show a summary (possibly with one-word tags) — to investigate; may or may not be the same thing
  - **RAG approach**: 'shove it all in' — RAG handles lots of documents well; do not partition; all docs in one set
  - **No document-level permissions**: too complex; don't offer per-document user access controls
  - **Auto-tagging**: auto-tag on upload, let user change; limit number of tags; multiple docs of same type is fine — don't enforce 'one values doc only'

- 2026-06-09 [work, ckb, uxr, emily-safier, personify-health]: Emily Safier keen to run an early test with Personify Health covering (a) Goals in Coach and (b) adding Customer Context to Coach. Jonny suggested mid-late w/c 15 Jun — acknowledged as a pull-forward ahead of the main testing wave in w/c 22 Jun.

- 2026-06-09 [work, ckb, uxr, darshana, milestone]: Research timeline agreed with Darshana. W/c 15 Jun: refine CKB research questions (session likely already booked with Darshana for next week); recruit customers in parallel — Jonny to send comms and consent forms to CS coaches on return next week to give enough lead time for account scheduling. W/c 22 Jun: run customer testing, synthesise and share back. Research plan doc: https://docs.google.com/document/d/1AaUaI87beHnflKB5bnPrOdZ2P6QNtfcQ2q6Ui1Sixbs/edit [[work/unified-coach/observations]]

- 2026-05-29 [work, ckb, design, rach, feedback]: Reviewed Rach's CKB Figma designs. Key feedback: (1) **Three-dot menus** — may not be needed; delete could be an inline icon, edit could be via expand. (2) **Processing page** — question whether a top-of-page processing panel is warranted; a status column ('Processing' → 'Added') in the main table could handle this while keeping the upload UI ready for the next doc. (3) **Edit page** — should serve both post-upload and returning-edit flows (same page). Proposed pattern: inline expand in the context list for editing; unexpanded row for status controls (live/delete). Also: 'Add to Coach' and 'Live' appear to be the same thing — need clarity. Testing functionality could live in-page via existing Pilot Group UI rather than a separate test environment — pilot group members test in Coach proper, no quasi-Coach needed. (4) **Replace pop-up** — may be unnecessary; 'Add to previous' is just adding a doc, 'Replace' is just deleting the first — unclear this decision warrants a dedicated pop-up.

- 2026-05-27 [work, ckb, uxr, links]: CKB proposed research plan: https://docs.google.com/document/d/1AaUaI87beHnflKB5bnPrOdZ2P6QNtfcQ2q6Ui1Sixbs/edit?tab=t.0#heading=h.30q4i7ac6jj2

- 2026-05-19 [work, ckb, kickoff]: CKB prototype work kicking off. Jonny briefed Jakub, Dan, and Rach ahead of first alignment meeting. Core technical proposal (shared with Jakub): skip RAG entirely — upload doc → store plain text (or summarise if too large) → short summary injected into system prompt → Coach gets a tool to fetch full text on demand. Framing is 'simplest possible thing we can put in front of customers in 2 sprints'. Dan and Rach alignment goals: agree on functionality, settle testing environment, and strive for all available trade-offs to make 2-sprint timeline real. UI philosophy: 'communicable not functional' — some screens only need to suggest a capability, not build it. Rach likely owns wireframes; Dan builds prototype; Rach styles. One-pager doubles as PRD. [work, ckb, prototype, jakub, dan, rach]

- 2026-04-28 [work, ckb, coach, prompt]: Chat with Lisa about Prompt 174 — injecting Culture Amp strategic context into Coach prompt for PX. Key open questions: (1) should context be injected every time vs. on-demand via tool call, (2) would admins be able to validate these responses, (3) how do we ensure Coach improves based on additional inputs rather than just being noisier. [work, ckb, coach, product, lisa]

- 2026-04-22 [work, ckb, airx]: Spoke to Dan about AIRX work on CKB. He's exploring: what's possible, admin upload pipeline, security concerns, branding (is it still 'Coach' when company context is added). Reiterated it's a slam dunk — a feature users clearly want. Product's highest-leverage contribution before kick-off (late May) likely user interviews + hypothesis validation. Option to bring Darsh in early as an onboarding project. [work, ckb, product, dan]
