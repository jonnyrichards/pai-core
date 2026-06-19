---
title: Voice Coach - Go-to-Market Document
confluence_page_id: 5951226056
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/5951226056/Voice+Coach+-+Go-to-Market+Document"
last_synced: "2026-05-08T06:22:49.558Z"
---

## Executive Summary

We are adding a voice modality to AI Coach — enabling users to speak to Coach rather than type. Voice makes coaching feel more natural and human: you're talking to a coach, not typing to a chatbot. It also delivers competitive parity with Lattice (our #1 competitor who heavily markets voice) and provides tangible differentiation in sales pitches.

**Primary Goal:** Zero instances of deals falling over because AI Coach does not offer a voice mode.

**Target Release:**
- **Tue May 19:** Customer Zero (internal focus group + wider internal testing)
- **Tue Jun 2:** Voice Beta begins — Week 1: 10% rollout
- **Early Jun:** Sales Enablement
- **Tue Jun 16:** Voice Beta — Week 3: 100% rollout

---

## What is Voice?

Voice makes coaching feel more immediate and human — you're talking to a coach, not typing to a chatbot. It's especially well-suited to the kinds of conversations people actually use General Coach for: preparing for a difficult 1:1, workshopping how to deliver feedback, or practising a performance review conversation before it happens.

**Core features:**
- **Dictation mode** — voice-to-text input, available across all Coaches
- **Conversation mode** — free, back-and-forward spoken conversation with Coach (General Coach only)
- **Streaming audio with synchronised text** — see and hear responses in real-time
- **Seamless mode switching** — Coach shifts between voice and text mid-reply where appropriate (eg. sharing a template)
- **Interruption handling** — users can interrupt Coach mid-response
- **One voice** — one designed Coach voice

**Not included:**
- Voice in Perform (on hold pending discovery)
- Voice in Engage (on hold pending discovery)
- Voice selection (one voice initially)
- Mobile optimisation (Coach remains desktop-first across all modalities)

---

## Voice Selection

**Near-term: one voice, no user choice.** We're launching with a single voice selected from a PSX-shortlisted set of two candidates (Nova Westbrook and Paul). The CZ qualitative panel will test both; the better-performing voice ships. No additional engineering or design work required.

**Longer-term: two credible paths, decision deferred.** Once Voice is live and we have usage data, we'll decide between:
- **User-selectable catalogue** — let users choose from a curated set; accommodates individual, cultural, and geographic preferences (PSX-recommended long-term model)
- **Custom/cloned Coach voice** — a bespoke voice built for Coach via ElevenLabs voice cloning; supported by Brand as the most scalable path to a distinctive Coach identity

Both have merit. The right call depends on signals we don't yet have: how much voice identity matters to users, and what demand looks like post-launch. Full options paper: [The Voice of Coach — Options](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6117687617)

---

## Positioning

General Coach is already used heavily as a performance management tool — managers come to it to prepare for difficult conversations, practise delivering feedback, and think through performance review discussions. Voice is the natural fit for exactly these tasks. The ability to workshop an approach out loud, role-play a difficult conversation, or rehearse a performance review before you walk into the room — these feel qualitatively different when you can speak rather than type.

That's the sales framing too: *"You can talk to it. Rehearse the conversation before you have it."* Voice is a demo moment, not a feature bullet.

---

## Success Metrics

### Sales Impact (Primary)

- **Zero instances of deals falling over because AI Coach does not offer a voice mode**
- **Close rate impact:** Track close rate of deals where voice was demoed vs. not demoed (target: neutral or positive impact)
- **Deal mentions:** Voice is mentioned or demoed in deals; baseline to be set with Sales

### Adoption & Usage (Secondary)

These metrics help us understand if users find genuine value beyond the "cool factor":

- **Trial rate:** 5–10% of enabled users try voice at least once
- **Retention:** 20% of triallers (1–2% of enabled users) complete 3+ voice sessions
- **Usage volume:** >1% of all Coach interactions use voice; >2% is the threshold to consider voice a genuinely adopted modality
- **Session completion rate:** >70% of voice sessions reach a natural end (vs. abandon/error exit)
- **Error/abandon rate:** <15% (STT failures, disconnections, frustrated exits)

---

## Data Privacy and Consent

No audio recordings are stored. We have ElevenLabs' enterprise tier (Zero Retention Mode), which ensures no customer audio is retained by the provider. This is the answer to the privacy question in customer conversations.

---

## Release Strategy

Two phases: Customer Zero (remaining build + controlled testing) followed by Beta (graduated rollout to all customers).

### Phase 1: Remaining Build + Customer Zero (May 19 →)

_Goal_: Complete outstanding build work and validate Voice with Customer Zero before any customer release.

**Remaining build items:**
- [x] Instrumentation and analytics
- Remaining security review items
- OKTA implementation
- [x] Consent
- Error/fallback behaviour
- Enable in Sales Demo Environments

**Customer Zero testing:**
Two tracks running in parallel:
- **Company-wide:** Voice will be enabled for all of Customer Zero — broad internal exposure and feedback via existing channels
- **Focused qualitative panel:** A panel of ~10 Campers, guided by UXR (Darshana), split across two shortlisted voice options. One week of testing, one week to implement feedback before Beta release.

**Gate to Phase 2:** Voice comparison complete and final voice selected; session completion rate at an acceptable level; no P0/P1 bugs outstanding; security review items implemented; consent flow finalised; analytics instrumentation live; OKTA implemented.

### Phase 2: Voice Beta — Graduated Rollout (Jun 2 →)

_Goal_: Release Voice to all customers in a controlled, graduated rollout, labelled as Beta.

**Feature scope:**
- Dictation: available across all Coaches
- Conversation mode: General Coach only at launch
- Admin toggle in Account Settings (desirable but not a blocker — rollout managed via flags until shipped)

**Rollout:**
- Week 1 (Jun 2): 10% of accounts
- Week 2 (Jun 9): 30% of accounts
- Week 3 (Jun 16): 100% of accounts

---

## Timeline at a Glance

| Date | Milestone |
|------|-----------|
| **Mon May 4** | ElevenLabs deal signed |
| **Tue May 19** | Customer Zero release (Dictation: all Coaches; Conversation mode: General Coach only) |
| **Tue Jun 2** | Voice Beta begins — Week 1: 10% rollout |
| **Tue Jun 9** | Voice Beta — Week 2: 30% rollout |
| **Tue Jun 16** | Voice Beta — Week 3: 100% rollout |
| **Early Jun** | Sales Enablement |

---

## Open Questions

1. **Competitive intel:** What are AEs hearing about Lattice's voice feature in the field?
2. **Pricing questions:** How do we handle "is this extra cost?" questions? (Answer: No, included in Coach at launch; future pricing TBD)
3. **Objection handling:** How do we best prepare for common questions? (FAQ: privacy, cost, when to use voice vs. text)
4. **Quarterly targets:** Is it possible to set targets for voice mentions in deals to validate the business case?
5. **Demo approach in SDEs:** We can't store Voice sessions for playback, and demoing live isn't advisable. Proposed talk track: rep clicks the mic button and dictates a message to show Dictation mode ("makes input fast and easy" — rep doesn't send); for Conversation mode, the rep describes the experience rather than runs it ("if I want a full conversation, I click the Conversation button — that opens a two-way exchange where I can talk freely and Coach replies naturally — great for preparing for difficult conversations, practising feedback, role play"). Dictation is fully demo-able; Conversation mode is described. Proposal shared with Tom Lewis for sign-off.