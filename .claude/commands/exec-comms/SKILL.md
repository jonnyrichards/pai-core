---
name: exec-comms
description: Drafts executive memos and stakeholder communications. At Culture Amp, exec comms are Slack-native, casual, and emoji-friendly. Also supports traditional formats (Amazon 6-pager, SCQA) for formal documents.
---

# Executive Communication

## When This Skill Activates

Claude uses this skill when:
- Writing executive memos or updates
- Creating board updates
- Drafting stakeholder emails
- Structuring strategic docs
- Communicating decisions or rollout plans to leadership

**For real examples from actual Culture Amp exec comms,** see `memory/work/craft/exec-comms-examples.md`

## Culture Amp Style: Slack-Native Exec Comms

**Default format for Culture Amp executive communications:**

### Style Guidelines

**Tone:**
- Casual and conversational ("Hi all," "Hope this makes sense")
- Direct and action-oriented
- Use emojis liberally but purposefully
- Friendly closing ("Shout with any questions! :yay:")

**Structure:**
- BLUF (Bottom Line Up Front) - key decision/update in opening line
- Emoji headers for scanability (`:rocket:`, `:thinking_face:`, `:woman-running:`)
- Concise phases/sections with inline emoji formatting
- Clear "Next Steps" section with dates
- Keep total length short (roughly 30-40 lines max)

**Formatting:**
- Title: `:emoji: Topic` (not markdown header)
- Section headers: `**:emoji: Section Name**` or `**:emoji: Phase X: Description**`
- Bullets with bold for emphasis
- Specific dates and milestones

### Template: Slack-Native Update

```markdown
:emoji: [Topic]

Hi all, sharing that [action/decision context], we've aligned on [key approach/decision]:

**:rocket: Phase/Section 1: [Name] ([Timeline])**
- Key point with specific details
- Key point with dates
- Key point with context

**:vertical_traffic_light: Phase/Section 2: [Name] ([Timeline])**
- Key point
- Key point

**:key: Key principles/considerations**
- **Principle 1** - explanation in plain language
- **Principle 2** - why this matters
- **Principle 3** - specific benefit

**:thinking_face: [Addressing common question/concern]**
- Answer to anticipated question
- Context or rationale

**:woman-running::skin-tone-2: Next Steps**
- **Now:** Current action
- **[Date]:** Milestone
- **[Date]:** Milestone
- **[Date]:** Milestone

Hope this makes sense. Shout with any questions! :yay:
```

### Example: Voice Rollout Update

```markdown
:purple_megaphone: Update on Voice Rollout

Hi all, sharing that after recent discussions, we've aligned on a **three-phase approach to roll out Voice in General Coach** (Q1 -> Q2), with Perform Voice in a Discovery phase:

**:rocket: Phase 1: Build + Customer Zero (Feb 16 - Mar 30)**
- Build core STT/TTS functionality + complete legal requirements (DPIA, consent, privacy policy, Eleven Labs contract)
- Mar 16: Release to Customer Zero (Culture Amp employees)
- Mar 30: Enable Sales Demo Environment once legal certainty achieved

**:vertical_traffic_light: Phase 2: Limited Beta (Early-Mid April)**
- Roll out to C1+ customers (percentage-based)
- Begin weekly metrics review: adoption rate, retention, session quality

**:dart: Phase 3: Beta (Late April - Ongoing)**
- Roll out to 100% of customers, labeled as "Beta"
- Beta labeling preserves pricing/packaging flexibility for future decisions

**:key: Key principles**
- **Universal feature** (not admin opt-in) - voice is an input modality, not an admin-enabled feature
- **Sales enablement-first** - primary business case is competitive positioning; SDE enabled before customer rollout
- **Phased rollout** - phased rollout enables quantitative feedback vs. small tester pool of traditional EAP
- **Beta positioning** - Beta enables a phased approach at the same time as preserving pricing/packaging flexibility

**:thinking_face: What About Perform?**
- V2 (Voice in Perform) is out of scope for Q2. We're doing Discovery in parallel to work through the UX implications of Coach in Perform's longer responses
- Goal of Discovery: Determine if we can enable Perform Voice with prompt modifications rather than significant engineering work. If we can solve with prompts, this unlocks faster delivery

**:woman-running::skin-tone-2: Next Steps**
- **Now:** Phase 1 build in progress (Feb 16 - Mar 16)
- **Mar 16:** Customer Zero launch
- **Mar 30:** Sales Enablement sessions + SDE enabled
- **Early-Mid April:** Limited Beta to C1+ customers
- **Late April:** Beta to all customers

Hope this makes sense. Shout with any questions! :yay:
```

### Gong / Release Announcement

**Use when:** Announcing a feature release or GA to the #product-announcements / #eng-releases channel (or similar). These are Slack-native, celebratory, and structured for skimmability.

**Tone:** Proud but grounded. Credit the team. Make it easy for non-technical readers to understand the "so what."

**Structure:**
- `:gong: Gong - [Feature name] - [short outcome] :gong:` as the opening line (no separate title)
- `:raised_hands: What's new?` — 2-3 sentence plain-language summary
- `:lovedata: The Details` (or `:package: What's included?`) — bullet list of specifics; use sub-bullets for technical detail
- `:dart: Why this matters?` — 2-4 bullets, customer/user value focus
- `:pray: Who can we thank?` — @mention contributors; brief, warm
- Support/more info line — link to support article + feedback channel + DM offer

**Template:**
```
:gong: Gong - [Feature] - [short outcome line] :gong:

:raised_hands: What's new?
[2-3 sentence plain summary of what shipped and what it does.]

:lovedata: The Details
[Bullet list of specifics — what data/config/behaviour changed]
- Item 1
- Item 2

:dart: Why this matters?
- [Customer benefit 1]
- [Customer benefit 2]
- [Privacy/trust/existing model preserved — if relevant]

:pray: Who can we thank?
@name for [contribution]. @name for [contribution].
[#team tags for collaborating teams]

Where can I find out more?
[Support article link]. Share questions in #[channel] or DM me :slightly_smiling_face:
```

**Notes from examples:**
- "Mini-Gong" prefix is fine for smaller fast-follow releases (`:tada:` instead of `:gong:`)
- `:warning: Gotchas` section is optional — use when there's a non-obvious constraint or edge case
- Keep "Why this matters" customer-facing even in internal posts — avoids inside-baseball framing
- The `:lovedata:` / `:package:` heading swap is intentional — use `:lovedata:` for data/AI features, `:package:` for config/UI features

**Reference examples:** see bottom of this file (`## Gong Examples`)

---

## Amazon 6-Pager Style (For Deep Analysis)

**Use when:**
- Major strategic decisions requiring detailed tradeoffs analysis
- Board-level communications
- Cross-functional alignment on complex initiatives
- Building a case with data, alternatives, and risk mitigation
- Formal proposals that need comprehensive rationale

**Format:**
```markdown
# [Title]: [One-line summary]

## Executive Summary (BLUF - Bottom Line Up Front)
[Key decision/recommendation in 2-3 sentences]

## Situation
[Current state, context]

## Complication
[Problem or opportunity]

## Question
[What needs to be decided or understood]

## Recommendation
[Your proposal]

## Rationale
[Why this is the right approach]
- Reason 1
- Reason 2
- Reason 3

## Alternatives Considered
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| A      | ...  | ...  | Not chosen |
| B      | ...  | ...  | **Recommended** |

## Next Steps
1. [Action] - [Owner] - [Date]
2. [Action] - [Owner] - [Date]

## Success Metrics
- [How we'll measure success]

## Risks & Mitigation
- **Risk:** [describe] → **Mitigation:** [how we'll handle]

## Appendix
[Supporting data, details]
```

**Style notes:**
- More formal and structured than Slack-native comms
- Data-driven with clear alternatives analysis
- Comprehensive risk/mitigation section
- Typically 1-3 pages
- Can stand alone without additional context

---

## SCQA Framework (Quick Reference)

**Use when:** Structuring problem-oriented communications quickly.

**Structure:**
- **Situation:** Current state
- **Complication:** Problem/challenge
- **Question:** What should we do?
- **Answer:** Your recommendation

---

## Quick Reference

### 📝 Culture Amp Exec Comms Checklist

**Structure:**
- [ ] BLUF in opening line (key decision/update stated upfront)
- [ ] Emoji title (`:emoji: Topic`)
- [ ] Phases/sections with emoji headers
- [ ] Specific dates and milestones
- [ ] "Next Steps" section with timeline
- [ ] Friendly closing

**Style:**
- [ ] Casual tone ("Hi all," "Hope this makes sense")
- [ ] Emojis for scanability
- [ ] Short (30-40 lines max)
- [ ] Conversational explanations
- [ ] Action-oriented

**Content:**
- [ ] Context provided where timeline/approach shifted
- [ ] Key principles explained in plain language
- [ ] Anticipated questions addressed
- [ ] Specific details (not just high-level)

### 📝 Traditional Exec Comms Checklist

**For formal documents (6-pagers, board updates):**

**Structure:**
- [ ] BLUF (bottom line first)
- [ ] Context clear
- [ ] Decision/recommendation obvious
- [ ] Next steps specific

**Style:**
- [ ] Concise (no fluff)
- [ ] Scannable (bullets, headers)
- [ ] Data-backed
- [ ] Action-oriented

---

## Key Principles

**Culture Amp:**
> "Exec comms live in Slack. Keep them casual, emoji-friendly, and scannable."

**Amazon:**
> "Start with the press release. Work backwards."

**On Executive Writing:**
> "If you can't summarize it in 2 sentences, you don't understand it well enough."

## Gong Examples

<!-- Reference examples — do not edit. Used as source material for the Gong template above. -->

###
:gong: Gong - Coach in Perform - Anytime Feedback V2 is now a new data source available in Manager Reviews | Live in GA :gong:

:raised_hands: What’s new?
AI Coach in Performance now uses Anytime Feedback v2 as an additional data source when managers use Coach to draft Manager Reviews. This strengthens Coach’s ability to synthesise continuous feedback alongside existing sources (self‑reflections, peer & upward feedback, past manager reviews, Shoutouts) to produce more complete, evidence‑based summaries.

This also includes anytime feedback as a datasource in Highlights and Opportunities as well.

:lovedata: The Details
Anytime Feedback (v2) is used in AI Coach in Performance (Manager Reviews), only where visible to the manager. Screenshots of the experience below.

The following list is the detail on what Anytime Feedback data is used by Coach:

Feedback message text – full free‑text content of the Anytime Feedback entry.
Feedback giver and recipient – who wrote the feedback and who it’s about (used to link feedback to the direct report in Coach).
Requested vs unrequested feedback – whether the feedback was provided in response to a request (manager‑ or peer‑requested) or shared proactively.
Visibility / sharing – whether the feedback was shared with the recipient only or also with their manager (Coach only uses entries already visible to the manager).
Date of feedback – submission date used in Coach’s timeframe filter (e.g. last 3/6/9/12 months).


:dart: Why this matters ?

Gives Coach a richer picture of day‑to‑day performance by including continuous feedback captured in Anytime Feedback v2.
Reduces manager effort collecting input outside the platform (email, docs, 1:1 notes).
Keeps the existing Anytime Feedback privacy model intact – Coach only analyses entries the manager can already see.


:pray: Who can we thank? 

@Prasanna who kicked off this work and did a bulk of the work late last year :raised_hands::skin-tone-3: Really appreciate your contribution here! 
@rachel.ellena for leading this initiative and for @ben.crow to coming in and smashing out the remaining implementation. 
@Kristina @ally.glavin for working on the prompt, design and content of this new data source.
@Rashmika for helping make CiP super robust with evals.
@jas and Suyin for pulling the project together!
#team_anytime_feedback for collaborating with us on bringing this to life.


Where can I find out more?
Customer facing support article is here. Share your questions and/or feedback with us in #help_coach_feedback or drop me a DM :slightly_smiling_face:

###
:pcq: Mini-Gong : PCQ Config in Shared Reports now in GA  ! :tada:

:star2: What is it?
Performance Culture Quadrant™ (PCQ) is now configurable per shared report via a new :tickticktick:checkbox. Admins still always see PCQ in their own admin report and can decide when (and if) to roll it out to each shared report audience.

:dart: Who is this for and why?

Customers who are excited about PCQ but want more controlled and staggered change management instead of an “all-or-nothing” rollout.
HR admins who need time to align with execs before rolling-out the PCQ broadly.


:package: What's included?

:white_medium_small_square: Performance Culture Quadrant checkbox in Standard and Advanced shared report config (default state: :tickety-boo:)
Checkbox controls PCQ report visibility and PCQ mode in Coach for shared report viewers
PCQ checkbox only appears in Shared Report Config if the two PCQ factors have been configured in Survey Design
:camera_with_flash: See screenshots!


:warning: Gotchas 

PCQ checkbox only appears in Shared Report Config if the two PCQ factors have been configured in Survey Design




:bulb: Support and Help

Customer-facing support article
#temp_pcq_feedback_help 
:glean: PCQ Glean Agent


:clap: Thanks
@nancy @david.hauser @stephanie.renata @Vicky @Marcus @chris @bling @Lisa Vandertogt @michael.schimko @jas @Jessie @pip, MHFA @mirna.nasr @amyb for your teamwork in getting this final fast-follow out the door! :tada: (edited)

