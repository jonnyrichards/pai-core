---
title: Coach | Voice | One-pager
confluence_page_id: 5840339196
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/5840339196/Coach+Voice+One-pager"
last_synced: "2026-05-08T06:08:01.883Z"
---

## Description

_This Thing in One Sentence_

We are adding a voice modality to Coach - a way for users to get the benefits of Coach's insights via a free-flowing conversation rather than a lengthy text exchange.

## The Problem

_What is the problem this project addresses? (Ideally in 1 sentence)_

### Business Case

There is a concern that the business is losing or will lose deals to competitors who offer voice functionality. One instance of this is VML (WPP agency who Doug spoke to) who enquired about voice and said they were actively trialling Nadia and were getting good results when management coaching shifted to voice. In short the business context is that lack of a voice modality in Coach has influenced or swayed enough large deals that we believe it will be a significant benefit to the business if sales teams can say we offer voice as part of their pitch.

### User Case

Users are tired of text-based interactions with AI and crave a coaching experience that is more accessible and human-like. In a survey of CSMs representing more than 550 accounts, there were 4 instances of a customer having requested or enquired about voice, coupled with 6 instances of Pendo feedback - over 2+ years. (See 'Customer Context' below.) In other words the research suggests weak appetite for voice in customers. However, 'customers not sharing with us that they want voice' does not mean they don't want voice. It just signals that to date they have not actively requested it.

**Pendo:** There are 6 mentions of 'voice' in Pendo - over several years (ie. several are not recent). 5 cite the speed of providing feedback in performance reviews as the basis of wanting/needing voice, but offer no more context.

**Interviews:** We interviewed 11 CSMs representing a mix of commercial and enterprise across more than 550 accounts, including CSMs who look after customers that are in the CiP EAP (so: AI-ready, leant in):

* Only 4 accounts have mentioned or requested voice (IPSY, National Council on Compensation Insurance, GrabTaxi, Apollo). The only insights that come out of these 4 instances: IPSY says they'd potentially like it for scenario planning capabilities (within Coach); GrabTaxi asked about general voice capabilities
* A few CSMs mentioned the 'cool' or 'wow' factor of voice and how it can add to the AI story, but in general it has not come up either from customers directly or in pitches
* We have several leads for follow up interviews: GrabTaxi (Chris Senior), ENT & Allergy, Faire (Katie Graves), NCCI (Kailey Marshall), Appian (Kate Baldoni), Aegon, Prosus, Allegro (Ada), Pipedrive, Teaching Lab (more recent Pendo requests)

**Notable quotes:**

* "Voice has not come up in any pitches. It's always nice to be at the cutting edge, but without knowing the customers real needs and evaluations, I'm not sure about this. I haven't heard of this ask yet so it wouldn't be top of my list to pursue."
* "It makes me wonder if it is the type of feature that is really powerful in a sales scenario, but then we dont see that energy translate to adoption"
* "Voice hasn't come up in any customer conversations about AI. My customers want Time-Based Reviews / Automation of Probation - these would be bigger wins as far as I'm concerned"

‌

---

## Why

**Competitive Landscape:**

* **Lattice** is the biggest proponent of voice as a modality for its AI. Late last year Lattice introduced voice to the Lattice AI Agent, and showcases these capabilities being 'available at no additional cost'; the main use cases they promote: "Rehearse tough conversations or ask questions on the go, just by speaking" - the idea of a "verbal sparring partner", and a "Meeting Assistant" which coaches towards better 1:1s (having listened in on the meeting)
* **Workday** has a partnership with BetterUp which has a voice-based Coach assistant. Use cases: preparing for difficult feedback, and role-play ahead of presentations. Integrates with Slack, Teams, and Calendars
* **15Five** acquired Kona, an AI-powered coaching tool which joins voice calls, transcribes, and then after the meeting analyzes the transcript and suggests improvements to meeting behaviour
* **Valence** offers a full, voice-focused management coach called Nadia which was cited by WPP in a call as a service they were actively trialling and which managers found useful

**User Benefits:**

Voice interactions offer tangible benefits for coaching:
* Feel more intuitive, immediate, and human
* Make AI Coach 'more coaching-like'

---

## Success Metrics

_How do we know if we've solved this problem?_

### Sales Impact (Primary - Business Case)

* **Zero instances of deals falling over because AI Coach does not offer a voice mode**
* Sales confidence: Sales teams feel they have stronger competitive positioning selling against Lattice (#1 voice-enabled competitor) and develop improved battle cards showcasing Coach's voice capabilities
* Close rate impact: Track close rate of deals where voice was demoed vs. not demoed (target: neutral or positive impact)
* Deal mentions: Voice is mentioned/demoed in at least X deals per quarter (baseline TBD with Sales)

### Adoption & Usage (Secondary - User Case)

**Benchmarks and context:** The best public reference point for voice adoption is Google, which disclosed in 2016 that ~20% of mobile app queries were voice — the highest figure they ever released, and the last. ChatGPT launched Advanced Voice Mode in late 2024 and integrated it into the main chat UI in late 2025, signalling meaningful adoption, though OpenAI has never published a percentage of interactions figure. Both benchmarks come from high-propensity consumer contexts. For Coach, two penalties apply: (1) **desktop vs. mobile** — desktop accounts for ~24% of voice assistant usage vs. ~56% on mobile, a roughly 3–4x penalty; (2) **B2B vs. consumer** — professional environments (open-plan offices, meeting rooms) create strong social inhibitors to voice use that simply don't apply to consumer apps. Applying these factors, a realistic steady-state for a desktop B2B coaching tool is likely 1–3% of interactions.

* **Trial rate:** 5–10% of enabled users try voice at least once
* **Retention:** 20% of triallers (1-2% of enabled users) complete 3+ voice sessions (indicates genuine value, not just curiosity)
* **Usage volume:** >1% of all Coach interactions use voice; >2% is the threshold to consider voice a genuinely adopted modality
* **Session completion rate:** >70% of voice sessions reach a natural end (vs. abandon/error exit)
* **Error/abandon rate:** <15% (STT failures, disconnections, frustrated exits)

---

## Target Audience

_Who are we building for?_

In priority order:

1. **Sales teams |** We are primarily building for Sales teams - to meet the metrics listed above
2. **Customers |** We are also building for customers to offer a new, more intuitive and immediate, and human way of interacting with AI Coach that increases speed, reduces friction, and feels more like a regular coach

---

## Voice Selection

**Near-term: one voice, no user choice.** We're launching with a single voice selected from a PSX-shortlisted set of two candidates (Nova Westbrook and Paul). The CZ qualitative panel will test both; the better-performing voice ships. No additional engineering or design work required.

**Longer-term: two credible paths, decision deferred.** Once Voice is live and we have usage data, we'll decide between:
- **User-selectable catalogue** — let users choose from a curated set; accommodates individual, cultural, and geographic preferences (PSX-recommended long-term model)
- **Custom/cloned Coach voice** — a bespoke voice built for Coach via ElevenLabs voice cloning; supported by Brand as the most scalable path to a distinctive Coach identity

Both have merit. The right call depends on signals we don't yet have: how much voice identity matters to users, and what demand looks like post-launch. Full options paper: [The Voice of Coach — Options](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6117687617)

---

## What

_Roughly, what does this look like in the product? Link to designs if available._

[Figma](https://www.figma.com/design/7UcRC34Yh0cgLj7aBei4Ma/Coach-Voice?node-id=0-1&p=f&t=8z8AYGRmYXdbZvMt-0)

---

## How

Two phases: Customer Zero (remaining build + controlled testing) followed by Beta (graduated rollout to all customers).

### Phase 1: Remaining Build + Customer Zero (May 19 →)

_Goal_: Complete outstanding build work and validate Voice with Customer Zero before any customer release.

**Remaining build items:**

- Instrumentation and analytics (in hand; separate session planned with Baps to review what’s implemented and what’s outstanding)
- Remaining Security review items
- OKTA implementation
- Error/fallback behaviour
- Enable in Sales Demo Environments [Proposal is with Tom Lewis for feedback]

**Feature scope:**

- Dictation: available across all Coaches
- Conversation mode: General Coach only

**Customer Zero testing:**

Two tracks running in parallel:
- **Company-wide:** Voice will be enabled for all of Customer Zero — broad internal exposure and feedback via existing channels (#help-coach-feedback, Coach Camp)
- **Focused qualitative panel:** A panel of ~10 Campers, guided by UXR (Darshana), split across two shortlisted voice options. One week of testing, one week to implement feedback before Beta release.

**Gate to Phase 2:**

The following must be true before proceeding to Beta:

- Voice comparison complete and final voice selected
- Session completion rate at an acceptable level (no widespread abandons or errors)
- No P0/P1 bugs outstanding
- Security review items implemented
- Consent flow finalised
- Analytics instrumentation live
- OKTA implemented


### Phase 2: Voice Beta — Graduated Rollout (Jun 2 →)

_Goal_: Release Voice to all customers in a controlled, graduated rollout, labeled as Beta.

**Feature scope:**

- Dictation: available across all Coaches
- Conversation mode: General Coach only at launch
- Admin toggle in Account Settings (desirable but not a blocker for release — rollout will be managed via flags until the toggle is shipped)

**Rollout:**

- Week 1: 10% of accounts (random)
- Week 2: 30% of accounts
- Week 3: 100% of accounts

**Scope expansion:**

Product and PSX to evaluate whether Conversation mode can extend beyond General Coach. This requires further testing and analysis of beta data; timing TBD based on findings.

---

## Timeline at a Glance

| Date | Milestone |
|------|-----------|
| **Mon May 4** | ElevenLabs deal signed |
| **Tue May 19** | Customer Zero release (Dictation: all Coaches; Conversation mode: General Coach only) |
| **Tue Jun 2** | Voice Beta begins — Week 1: 10% rollout |
| **Tue Jun 9** | Voice Beta — Week 2: 30% rollout |
| **Tue Jun 16** | Voice Beta — Week 3: 100% rollout |

---

## Testing

**High-level approach:**

Rich qualitative feedback from Customer Zero testing combined with quantitative data from gradual GA rollout to validate both business case (sales impact) and user case (adoption).

**Customer Zero Testers:**
Simran Jasdhoal
Anna Pelesikoti
Jacqui Pooley
Aditi Pimprikar
Katie Graves
Mirna Nasr
Caitlin Radcliffe
Hayley Williams
Chris Senior
India Egan