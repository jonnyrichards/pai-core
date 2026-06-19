---
title: Voice Release Options — April 15 2026
confluence_page_id: 6135840983
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6135840983/Voice+Release+Options+April+15+2026"
last_synced: null
---

# Voice Release Options — April 15 2026

_Draft for leadership_

---

## Decision 1: Voice Conversation Mode (as-is)

**Status: Do not release.**

Current latency with Claude Sonnet averages ~6,000ms. VPs have communicated this is a blocker. Releasing voice conversation mode in this state is off the table until latency is materially improved.

---

## Decision 2: Dictation Release

Three options for how we proceed with dictation.

---

### Option A: Sign EL, release dictation to Customer Zero

Sign the ElevenLabs enterprise agreement and release dictation (voice input → text response) to the CZ cohort.

**The case for it**: Unlocks multiple things simultaneously — CZ testing on our own EL account, `disable_logging` in earnest, unblocks Eng on Security Review implementation items currently on hold, starts to get us real signal on whether users have appetite for the mic button at all, before we've solved voice conversation latency, paves a path for releasing 'voice' (dictation, not conversation) across the platform (ie. dictation can be released to Perform / Engage v. quickly). Cost: ~$12K for 3 months — modest relative to the ongoing opportunity cost of delays.

**Risks / trade-offs**: Requires signing the EL contract (spend commitment). Dictation alone doesn't require EL for STT — the contract spend is partly an investment in the broader voice roadmap, not dictation-specific - see Option B. 

**Estimate**: ~2 weeks to CZ release (Sign deal, Enterprise account set up, Security Review recommendations implemented, Instrumentation set up). _TO CHECK: Jay estimated 1 day eng to implement dictation in call — does the 2-week figure reflect EL onboarding/security work rather than the dictation implementation itself?_

---

### Option B: Use the Web Speech API for dictation

Implement dictation using the browser's native Web Speech API rather than ElevenLabs STT.

**The case for it**: ~1 week engineering effort. No vendor dependency, no contract required. Gets dictation in front of users quickly.

**Risks / trade-offs**: Sub-standard solution — quality and reliability lower than EL. Doesn't generate the same learnings (no signal on EL performance, slower path to voice conversation mode from this implementation). Feels like a short-term workaround that may need to be reworked. Wasted Eng effort building a feature that is then replaced. 

**Estimate**: ~1 week to CZ release (FE changes, Instrumentation)

---

### Option C: No dictation

Do not release dictation at this stage.

**The case for it**: Avoids committing to a sub-standard implementation or a contract before latency confidence is established.

**Risks / trade-offs**: Delays all learning. Removes the early signal on mic button adoption. Not recommended.

**Estimate**: N/A

---

## Decision 3: Voice Conversation Mode — Path to Release

Two options for how we get voice conversation mode to an acceptable latency.

---

### Option A: Switch to a lighter LLM (keep EL architecture)

Replace Claude Sonnet with a smaller/faster model for voice turns, keeping the existing EL STT → LLM → EL TTS pipeline. Candidates: Claude Haiku, Gemini Flash (smallest/cheapest), Gemini Pro (faster than Sonnet, maintains intelligence level), Nova (requires legal/customer comms coordination — see risks).

**The case for it**: Fastest proven lever — we've tested this and seen latency improvement. No architectural change required. Can be scoped and started immediately.

**Risks / trade-offs**:
- Nova is a special case: requires updated legal/customer comms coordination before it can be used — adds scope and lead time
- Requires a new round of prompt testing to validate performance at lower model tier
- New evals need to be established before we can confidently ship
- Customer comms / model disclosure need updating to reflect CA's use of a wider range of models (less so for Haiku/Gemini; more so for Nova)
- Response quality trade-off — ceiling may be lower than Sonnet for complex turns
- Uncertainty around scaling Voice beyond General Coach (ie. can lesser model handle mode switching or will this require more complicated, UI-based hand off?) — Sonnet handled this well; unknown for Haiku/Gemini

**Estimate**: Variable depending on model chosen:
- ~2 weeks if Haiku or Gemini work without customer comms changes
- ~1 month more realistic baseline
- ~6 weeks if Nova required (legal/customer team coordination adds lead time)
- Main work is performance evaluation and prompt optimisation, not the model swap itself

---

### Option B: Speech-to-speech architecture

Replace the STT → LLM → TTS pipeline with a native Eleven Labs speech model (audio + prompt in, audio out)

**The case for it**: Fundamentally lower latency (in theory) — removes the STT → LLM → TTS pipeline. The only path to lower response times if lighter models don't close the gap.

**Risks / trade-offs**:
- Significant engineering effort — effectively a rebuild of the voice layer
- Introduces new security and legal risk: no clean text transcript at the LLM layer; guardrails implementation changes materially; new security review required
- Concentration risk: moves even more of the voice pipeline onto EL as a single vendor
- Observability and evals more complex without a text intermediate
- Current view: not necessary if lighter models solve the latency problem; revisit only if Option A fails

**Estimate**: TBC — materially higher than Option A; would need its own spike to produce an estimate

---