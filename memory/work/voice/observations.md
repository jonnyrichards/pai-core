# Voice — Observations

Timestamped log of events, decisions, learnings. Append-only. Latest first.

- 2026-05-13 [work, voice, security, standup]: Core Coach standup decisions on outstanding Voice items. No concerns raised about security review — decision: won't build any non-EL dashboards yet. Devs are looking at session timeout. BFF flag separation and account selection mechanics (for Beta rollout) are in hand. Guardrails ask is with Jakub / Security. EL observability question resolved — covered in standup, no action needed. CZ comms drafted and shared with India — now with her.

- 2026-05-12 [work, voice, comms, uxr]: Proposed Voice comms messaging for CZ testing (prepared with Kristina and Darsh ahead of India chat).

  **Comms #1**
  - Try out Voice!
  - Voice will change mid-week; this is intentional; we're testing 2
  - We'd love your thoughts on the voice; we'll send out a survey link later; let us know which one you preferred
  - Let us know if you're happy to do a short interview to answer some more in-depth questions about your experience using our new Voice feature, sign up here

  **Comms #2**
  - Voice is switching!
  - Reminder to try it out

  **Comms #3**
  - Thanks for trying it out
  - Please take the time to fill out a short survey letting us know which voice you prefer!

- 2026-05-08 [work, voice, architecture]: Interruption handling decision (Baps, Nate, Tabitha). Agreed: (1) No update to message list or checkpointer on interruption — back end does not know an interruption occurred; expected UX is Coach continues to render what it would have said, audio cuts off, Coach waits for new input. (2) Interruptions measured via Amplitude: fire event when user speaks while audio is still playing. This gives visibility into interruption rates without back-end storage.

- 2026-05-05 [work, voice, rollout]: Voice remaining to-dos and release strategy snapshot.

  **Remaining to-dos:**
  - Convert remaining bugs to Jira tickets
  - Move Eleven Labs token from BFF to BE
  - Test how interruptions are working (e.g. reload interrupted session; Ro video); decide on fix
  - Decide on storing the coach voice message interruptions in the BE
  - OKTA implementation — kicked off with Div (need timing)
  - Security review recommendations
  - Instrumentation (Amplitude + Datadog)
  - Beta features toggle
  - Eleven Labs Account — J&J to advise Div's team on needing dev and production + set up a troubleshooting/consult channel; register new API tokens on Coach so Coach has permissions to talk to the new account
  - CZ testing
  - Evals — new start (18 May) to own the voice harness using Rash's proposal as a guide (consider: synthetic voice gen EL-powered as part of harness etc.)

  **Release strategy:**
  - Feature coupling: Release Dictation (All Coaches) + Conversation (General Coach only) _simultaneously_ (CZ + Beta)
  - Timing:
    - Early-mid May: bug fixes, EL account implementation, Security review items, instrumentation (Amplitude)
    - Mid-late May: roll out to CZ + CZ testing, Beta features implementation (shouldn't block CZ or Beta), instrumentation (Datadog)
    - Early June: switch on Beta (GA), test Conversation mode with other Coach modules (Perform, MSS, PCQ) / decide on wider Conversation mode release

- 2026-05-04 [work, voice, uxr]: Darshana session on Voice testing approach. Plan: week-long test within a 2-week CZ window; Darsh to advise, R+A+J to run; Darsh will review script to check it fits in 30 mins. Mid-week voice ID swap to test preference anecdotally. Next: schedule the testing and build into roadmap. [work, voice, uxr, testing, darshana]

- 2026-05-04 [work, voice, eleven-labs]: Dan + Jay sync on ElevenLabs post-contract. Key decisions and open items: (1) **Dictation everywhere, Conversation gated** — deploy both buttons platform-wide but FF for Conversation mode stays off; (2) **EL relationship** — need to build account relationship with EL AE (Kenny); (3) **Technical alignment** — need a walk-through call with EL on v2 vs. v3 API (which should we use?); (4) **Billing/invoicing** — how do we raise a ticket and who approves invoices on our side (Jo potentially, via her SaaS channel involvement); (5) **Observability** — open question whether Coach takes on EL observability. [work, voice, eleven-labs, architecture, billing]

- 2026-05-01 [work, voice, okta, eleven-labs, infosec]: Okta SSO process for Voice (ElevenLabs) now in motion following EL contract signing. Div Patel's team handling the request. 2-week timeframe requested. Ticket: https://cultureamp.at.okta.com/next/requests/6505. cc'd Jay, Dan Fraser, Jo. [work, voice, okta, eleven-labs, infosec]

- 2026-04-24: AWS guardrails being removed from the real-time voice flow to reduce latency — moving to async. Not removed entirely: guardrails still run, but lose the ability to block Coach responding in real time. Data still stored, can still be analysed and audited. Rationale: (1) Culture Amp's own guardrails do most of the heavy lifting anyway; (2) AWS guardrails are unreliable. [work, voice, security]

- 2026-04-23: DB meeting next steps for Voice (share with Jay): (1) Create feature flags, separate Dictation and Conversation modes. (2) Deploy both to subset of CZ (Coach Leads + Mindy/Paul etc.) for vibe check on latency/performance — EL contract signing to follow shortly. (3) WPP opportunity: scope an early slice of CKB for them (potentially June) — share their docs somehow via Coach; DB chatting to Hiral. (4) Get download from Lisa on how Insights prompt 174 went for CZ. (5) Jonny to share context with Kristina and tee up prompt help. [work, milestone, voice]

- 2026-04-20: No Amplitude events tracking snippets — flagged to chat through with Jay. [work, analytics]

- 2026-04-16: Jakub (principal eng) on Voice architecture. Current hops: browser→EL→browser→Claude (potentially repeats)→browser→EL→browser. Speech-to-speech option (EL handles all STT/LLM/TTS hops) reduces latency but hands full control to EL — departs from current architecture, creates divergence we'd have to maintain. Alternative path: connect our backend directly to EL, removing the browser from some hops. Create an OpenAI-compatible interface (industry standard, already used on consuming side) — EL could connect to it. Benefit: removes geo-latencies (browser-dependent). Downside: harder to debug. Next step Jakub flagged: Miro board mapping the waterfall — identify which hops can be removed. Overarching Q: is all this worth it? Shipping dictation may answer that. [work, architecture]

- 2026-04-16: DB 1:1. Voice reflections: (1) Ownership — Coach hasn't owned the plan, it's been AirX-driven ('Dan will break the back of it'); felt like execution not driving. Need more ownership of the plan — here's where we're going, here's how we get there. (2) Experimentation — DB worried we'll start moving too slow now that we have 'decent usage' and things need to be better for GA. Beta features is one solve but we need Beta customers too. (3) Stakeholder management — need to flag stuff ahead of time, more proactive communication. Su handover: DB will need help with analysis / data intelligence post-handover. [work, milestone]

- 2026-04-14: Mindy voice latency session (Jay + Jonny presenting). Presented optimisations from voice-pipeline-level through to model changes. Mindy not convinced we can hit 3s without a model swap — needs to experience prod with all existing optimisations in place before she'll form a view. Coach team resolved: ship all existing optimisations to prod so Mindy can test. If model change is the path, need to check with Paul. Meeting goal (build confidence to proceed with EL contract + CZ go-ahead) was not achieved — still in holding pattern. Jo pushed back on the cost framing: given eng effort already spent on Voice, the EL contract spend isn't disproportionate. Mindy's implicit position: dictation-first without EL is a cheaper path if Voice latency can't be resolved. [work]

- 2026-04-14: Enoch + DB sync. Session Management: repeat PGLT collab session with added framing — "how do we decide?" + "how do we derisk/build confidence?"; demo via Figma testing patterns (not responses); check with Security + Legal first; target Tues 21 Apr 4pm; attendees: Ally, Jay, Coach leads (DB, Enoch, Mindy, Jo) + PGLT only; book via 'Book a product review' in #product-reviews. Voice testing: shift from guided interview to self-guided over a week, rate at end; 'which voice' is a Culture Amp brand decision, not just Product; two timelines needed: (1) release to CZ for testing (continue), (2) stakeholder alignment + socialisation — needs a plan covering options, stakeholders, and sharing approach. [work]

- 2026-04-13: Shared Beta features vision with Coach leads — few people absent but no objections. Jay and Jakub stressed technical ease of implementation; overall advice: don't overcomplicate it. Enoch flagged UXR findings from last year around the term "Beta" — worth reviewing before finalising copy/labelling approach. [work]

- 2026-04-10: Mindy + Greta sync — EL contract decision. Preferred position: EL remains the preferred vendor, but confidence in the full voice pipeline is not yet sufficient to sign. Decision: hold on signing until pipeline confidence is established (latency optimisation work currently in progress and close). This doesn't close off a dictation-first launch — launching dictation with EL before conversation mode is still on the table. Key callouts: (1) the main latency bottleneck is the LLM, not the voice-specific parts of the pipeline; (2) their bar for "great" latency is 2–3 seconds, not 5. Next step: present research findings at Coach Leads session Tuesday 2026-04-14. [work]

- 2026-04-09: ElevenLabs pricing analysis at $4,300/month (Tier A). 100% TTS: ~63.2M chars (~12.6M words / ~19,500 sessions). 100% STT: ~25,300 hrs transcription. Realistic 80/20 TTS-heavy mix: ~50.5M chars TTS (~10.1M words / ~15,600 sessions) + ~5,060 hrs STT. 50/50 mix: ~31.6M chars TTS (~6.3M words) + ~12,650 hrs STT. STT is dramatically cheaper — transcription costs are near-negligible vs TTS at this contract size. Session count based on avg 646 words/session (General Coach). For context: General Coach is currently averaging ~8,000 sessions/week — voice % unknown pre-launch, but this gives a sense of the volume at play. [work]
- 2026-04-09: Eleven Labs order form (deal terms) saved at: https://docs.google.com/document/d/1C0l_4nqQ33hyPPqB3qu_bBkyYmw-p-zq/edit?usp=sharing&ouid=109946937302639967661&rtpof=true&sd=true [work, legal]
- 2026-04-09: Created Coach voice options paper — 5 options (A: single voice, B: admin-selectable, C: UXR-first, D: user-selectable, E: custom/cloned), recommending Option A near-term and Option D long-term. Confluence: https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6117687617/Coach+Voice+Selection+Options [work]

- 2026-04-09: User testing strategy for dictation-first rollout — synced with Jay. Decision: hold back on 1:1 UXR testing until conversation mode is enabled. During dictation-only phase: use Coach Camp and #help-coach-feedback channels for feedback aggregation; encourage CZ to post there; rely on aggregate rather than targeted UXR. [work]

- 2026-04-09: Beta features clause — synced with Simon D (Data Intelligence). Aligned on overall approach: add beta features clause in general terms, build in product flexibility to disable beta features. Specifically aligned on a product toggle, enabled by default (customer's responsibility to turn off). Simon's advice: a) make it admin-controlled (keep customer in control), b) Coach team owns the toggle short-term — no dependency on Core Services to build it. [work]

- 2026-04-08: Coach voice poll (Slack) — internal poll across 8 ElevenLabs voice candidates (Verity, Xeda, Nova, Mark-natural, Mark-casual, Tom, Jarnathan, Sean). Vote results (reactions): **Tom led the poll**; Sean and Nova also received notable support. Note: **Xeda has been excluded as a candidate post-poll** — too unstable in testing (poor performance). Key stakeholder inputs: **Ally** ranked Tom > Sean > Xeda; **Enoch** favoured Xeda and Mark-casual; **Nicha** suggested Sean or Nova; **Mindy** expects strong geographic/cultural variance; **Greta/PSX** position: user should ultimately choose their own voice; strong conviction PSX-AI research that multiple genders and accents needed medium-term; legal: voices of CA employees cannot go to production; **Paul** raised admin-selectable setting. Net position: no final decision; next step: shortlist + structured user research. [work]

- 2026-04-08: Voice geographic preferences — 49% of accounts NA-based (43% contracted users); active Coach users: NA = 48%, EMEA = 31%, APAC = 18%. PSX doc: https://docs.google.com/document/d/1QTiTNXIIjx6P5IzROoRj4vZJxDpAq1BSvgjA4o3y8TI/edit?tab=t.0 [work]

<!-- 2026-03 entries archived to memory/glacier/work/voice/observations-work-2026-03.md -->
<!-- 2026-02 entries archived to memory/glacier/work/voice/observations-work-2026.md -->
