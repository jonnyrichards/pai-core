---
title: 'The Voice of Coach' — Options
status: draft
confluence_page_id: 6117687617
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6117687617/The+Voice+of+Coach+Options"
last_synced: "2026-05-07T07:00:50.619Z"
---

## Background

This document maps paths forward for how we choose and manage Coach's voice — covering both the immediate decision, and longer-term options to consider once Voice is stable and we have usage data. Options are assessed on product/engineering effort, user benefit, and roadmap fit.

**Context on bandwidth:** We are targeting a June release for Voice (Beta). At time of writing, engineering is prioritizing: latency optimisations, security measures, instrumentation, testing, and bug fixing ahead of release. Voice selection (ie. 'the Voice of Coach') is secondary to these priorities. Any near-term option should impose minimal additional burden on the Engineering team.

---

## Near-Term Options

### Option A — Designate a single voice

#### ✅ Recommended

Select one voice from the following, PSX-recommended shortlist:

| **Voice** | **Id** |
| --- | --- |
| _Nova Westbrook - American Counselor and Friend_ | _ElevenLabs ID: rSZFtT0J8GtnLqoDoFAp_ |
| _Paul - Australian professional presenter_ | _ElevenLabs ID: WLKp2jV6nrS8aMkPPDRO_ |

‌

([More information on how PSX assessed and shortlisted these voices](https://docs.google.com/document/d/1QTiTNXIIjx6P5IzROoRj4vZJxDpAq1BSvgjA4o3y8TI/edit?tab=t.wkx3uo8ny7gd).)

‌

This voice becomes Coach's voice at launch. No user or admin control.

**Effort:** Zero engineering, minimal design. Decision only. _Note: CZ testing (slated for mid-late May) compare responses to these two voices (for a small sample of Campers)_

**User benefit:** Consistent, deliberate Coach identity from day one. A well-chosen voice with PSX backing performs better across scenarios than an internal popularity contest.

**Pros:**

* Fastest path to decision — unblocks the release
* No additional design or engineering capacity required
* Consistent product identity: Coach has a voice, not a menu
* Reversible — we can add in voices later once we have usage data and demand signal
* Can react to known geographic usage patterns (50% of all Coach requests come from the US followed by Europe (30%) and APAC (20%))

**Cons:**

* No user agency — some users will prefer a different voice
* Commits us to a choice before we have customer signal

‌

---

### Option B — Admin-selectable voice

Org admins can select from a curated set of 2–3 voices (from the shortlist) on behalf of their organisation. Voice is consistent within a company but varies across customers.

**Effort:** 1–2 weeks (engineering, PSX, design). New UI required (based on existing patterns) + testing.

**User benefit:** Gives enterprise admins agency over cultural/brand fit. Addresses some geographic variance.

**Pros:**

* Satisfies the "admin choice" use case Paul raised
* Allows some accommodation of geographic/cultural diversity without user-level complexity
* Still a small, curated set — avoids an unbounded voice catalogue

**Cons:**

* 1–2 week estimate compresses an already tight timeline; no guarantee this would be completed in April, when engineers are due to move to other Q2 initiatives (Orchestration + Routing, Unified Sessions, CKB)
* Adds scope when the team is still resolving higher-priority Voice work (eg. security requirements, latency optimisations)

‌

---

### Option C — Structured UX research first, then decide

Shortlist of 3 voices × 3 scenario types (opener, empathetic moment, pushback), rated on clarity, trust, and approachability. Decide based on data.

**Effort:** Design/research resource to design and run study. Make decision in 2–4 weeks

**User benefit:** Highest confidence in the choice. Decisions grounded in how real users experience the voice in context, not internal reactions.

**Pros:**

* Best signal quality before committing to a voice
* Builds a reusable UX research framework for future voice decisions

**Cons:**

* Incompatible with end-April timeline
* Delays the release for a secondary concern while primary Voice work is still outstanding
* Research effort competes with other Q2 priorities

‌

---

## Longer-Term Options (post-April)

These options become viable once Voice is live, we have usage data, and capacity is available.

---

### Option D — Curated catalogue, user-selectable voice

Each user selects their own preferred voice from a curated catalogue. PSX and Greta/PSX-AI research strongly supports this as the right long-term model — multiple genders and accents are needed to serve a global user base.

**Effort:** Significant. New UI, voice catalogue management, per-user preference storage. 3-4 weeks including UI, back end, testing, bug fix, and potential memory integration

**User benefit:** Highest. Accommodates individual cultural and personal preferences. PSX research backs this as the most equitable and effective approach.

**When to revisit:** Once Voice is stable post-launch, when we have demand signal from users, and when design capacity is available. Likely a Q3 consideration.

‌

---

### Option E — Custom / cloned Coach voice

Commission a bespoke Coach voice using ElevenLabs voice cloning. Select a human voice talent, obtain consent and samples, clone via EL, and ship a Coach-specific voice identity.

**Effort:** High (Product; Eng effort is low). Requires sourcing voice talent (legal constraints: no CA employee voices), consent process, EL cloning workflow, extensive QA across scenario types and edge cases. Product and PSX effort to define the brief and validate performance.

**User benefit:** Strongest brand differentiation. A Coach voice that is uniquely Coach — not a commodity off-the-shelf voice. Potential long-term value if Coach voice becomes a recognised product identity — but see product marketing input below.

**Pros:**

* Unique and own-able
* EL voice cloning is a mature capability we already have access to

**Cons:**

* Significant effort before we have any customer signal that voice quality/identity is a demand driver
* Legal constraint: voices of CA employees cannot go to production (already confirmed)
* Quality is highly sensitive to source material and cloning process — QA burden is non-trivial
* Premature investment if users are broadly satisfied with an off-the-shelf choice

**Product marketing input** *(note: shared informally — not yet reviewed with Paige):*

Product Marketing's view is that this option is premature as a branding investment, for structural reasons.

Martin:

* The only truly recognisable AI voices (Siri, Alexa, Google Assistant) required hundreds of millions of consumer interactions to become identifiable — voice *is* the product for those services
* Every brand that has invested in a custom voice identity operates a high-volume consumer touchpoint (call centres, smart speakers, in-car) — not B2B SaaS
* No B2B coaching or HR platform has a recognisable custom voice identity today — there is no proof point for this working in our category. Closest would be Nadia, but there is no data indicating that custom voice drives product adoption or allegiance
* At Coach's current and near-term volume, a distinctive voice would likely go unnoticed — including in a sales context

Mirna:

* Until Coach is the product (i.e. the primary interface at scale), investing in a branded voice identity is premature — and if it would block the release timeline, definitely not worth it
* The choice of a single voice (Option A) should be conscious about what gender and accent it normalises. Not a blocker, but worth documenting as a constraint on the Option A decision (i.e. user control over gender/accent is the right long-term model)
* Voice as a modality (will users adopt it at all?) is a bigger adoption risk than the specific voice chosen

**Brand marketing input:**

Zarnaz and Claudine (Apr 28):

* Strong support for Option E long-term — the goal being a voice that is owned, not rented
* A bespoke cloned voice can capture micro-details (weighted breathing, natural speaking rhythm) that off-the-shelf voices can't — recommend as the most scalable option for a distinctive Coach identity
* For the near-term, we recommend Nova Westbrook as a safe choice from the shortlist

**When to revisit:** Only if Voice becomes a primary, high-volume interface and there is clear customer signal that voice identity is a differentiator. The brand marketing case would also need to be reassessed at that point, including alignment with Paige.

---

## Recommendation

**Near-term: Option A.** Designate a single voice based on the PSX shortlist. No additional engineering or design effort required. Consistent with where our bandwidth should be focused — shipping Voice, not building voice selection infrastructure. The choice is reversible.

**Longer-term: we have two credible options and don't need to decide now.**

Option D (user-selectable catalogue) and Option E (custom/cloned voice) represent different philosophies:

* **Option D** leans into user control — let people choose what works for them, accommodating individual, cultural, and geographic preferences. PSX research supports this as equitable and effective.
* **Option E** leans into our people science expertise — we know what a good coaching voice looks like, we build it, and we own it. Brand strongly supports this direction long-term, and the capability (EL voice cloning) already exists.

Both have merit. The right call depends on signals we don't yet have: how much voice quality matters to users, whether Coach voice becomes a recognisable identity, and what demand looks like post-launch. We should gather that signal before committing to either path.
