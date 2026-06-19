---
title: Voice Latency — Options & Pathways Forward
confluence_page_id: 6127684239
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6127684239/Voice+Latency+Options+Pathways+Forward"
last_synced: "2026-04-14T04:28:55.578Z"
---

# Voice Latency — Options & Pathways Forward

_Draft for discussion — Monday review_

---

## Section 1: Options to Reduce Latency

These are not mutually exclusive. Most can be pursued in parallel.

### 1. Implement instrumentation and establish a baseline

Before any other optimisation has measurable value, we need to be able to measure latency in a structured way. Currently we lack a benchmark.

**What this involves**: Custom instrumentation in Datadog to capture per-step timing across the voice pipeline (STT, LLM TTFB, LLM completion, TTS TTFB, TTS completion, client render). This cannot be done in Amplitude — it requires our own solution.

**The case for it**: Without a baseline, we're flying blind. Any change we make — model swap, architecture change, streaming tweak — is unmeasurable. This is the prerequisite for everything else in this list.

**Risks / trade-offs**: Engineering effort to instrument correctly. Low risk otherwise — this is pure upside.

---

### 2. Streaming optimisations within the current architecture

Start TTS as soon as the first sentence of LLM output is ready, rather than waiting for full completion. Tune ElevenLabs streaming parameters.

**The case for it**: Low engineering cost. Real gains possible — potentially 1–2s off current numbers. Can be done without changing any vendors or architecture.

**Risks / trade-offs**: Ceiling is the architectural constraint (serialised STT → LLM → TTS pipeline). Won't get us to <3s on its own.

---

### 3. Switch to a faster/smaller LLM for voice turns

Use a faster model (e.g. Claude Haiku, GPT-4o mini) for conversational voice exchanges, reserving the full model for complex or document-generating tasks. Voice interaction is typically short-turn — a smaller model may be sufficient.

**The case for it**: Meaningful latency reduction at the LLM step without any architectural change. Could be routed via the existing prompt flag logic (Thai's label-based approach).

**Risks / trade-offs**: Response quality trade-off — needs evaluation. Would require testing against current model to validate acceptable output quality for voice use cases.

---

### 4. Switch to ElevenLabs Flash model

ElevenLabs offers a Flash TTS model optimised for low latency. If we're not already using it, switching from their standard model could cut TTS time materially.

**The case for it**: Easy lever to pull. Likely fastest win on the TTS side of the pipeline.

**Risks / trade-offs**: Some reduction in voice output quality. **Blocked until the ElevenLabs deal is finalised** — not available under current terms.

---

### 5. Front-end visualisation of pipeline steps

Instrument the UI to show pipeline progress (e.g. "Listening… Thinking… Responding…") so users can see what's happening during the delay. Doesn't reduce actual latency but reduces perceived latency.

**The case for it**: Low engineering cost, high UX impact. Removes the "black hole" feeling during the wait. Standard pattern in voice AI products.

**Risks / trade-offs**: Doesn't solve the underlying problem. Should be paired with real latency improvements, not used as a substitute.

---

### 6. Native voice-to-voice architecture (speech-to-speech model)

Replace the STT → LLM → TTS pipeline with a native audio model (e.g. OpenAI Realtime API, Gemini Live). These models process audio input directly and generate audio output directly — no serialised transcription step.

**The case for it**: Fundamentally lower latency — no hard seams between pipeline steps. The only path to reliably competitive response times (<3s). System prompt carries across largely unchanged; model still text-steered.

**Risks / trade-offs**: Significant engineering effort. Loses ElevenLabs voice quality and customisation. Observability and guardrails story changes (no clean text transcript at LLM layer). New vendor/security review required. Additional Q2 resourcing likely needed. This is a medium-term option, not a near-term fix.

---

## Section 2: Pathways to Customer Zero Release

Three options for how we proceed to Customer Zero in early April, given the current latency position.

---

### Option A: Remove voice conversation mode; launch dictation only

Launch the dictation feature (voice input → text response) as planned. Pull voice conversation mode (voice input → voice response) from the Customer Zero scope until latency is improved. Continue iterating voice conversation mode in parallel.

**The case for it**: Dictation has no latency problem — the UX is fundamentally different (user speaks, gets a text response). Removes the risk of a poor first impression on voice conversation. Cleaner Customer Zero story.

**Risks / trade-offs**: Reduces the scope and novelty of the Customer Zero release. Some customer feedback on voice conversation mode won't be available until later. Delays learning.

---

### Option B: Release both modes with explicit latency caveats

Release dictation and voice conversation mode as-is, with clear framing in the Customer Zero comms that this is an early beta and latency is a known area of active improvement.

**The case for it**: Maximises learning. Real usage data on voice conversation mode will be more valuable than any internal testing. Aligned with DB's framing: "release and maximise usage." Sets up the instrumentation baseline immediately.

**Risks / trade-offs**: Risk of first impression. If latency is significantly worse than competitors, it may colour customer perception of the feature beyond the beta period. Requires tight messaging and expectation-setting.

---

### Option C: Explore native voice-to-voice architecture before broader beta

Pause broader beta rollout beyond Customer Zero while we scope and begin a rebuild toward a speech-to-speech architecture. Customer Zero becomes a research phase; broader beta follows once latency is materially improved.

**The case for it**: If the architectural ceiling is real, iterating on the current stack may be wasted effort. Better to spend Q2 on the right foundation.

**Risks / trade-offs**: Significant additional Q2 investment required — resourcing and timeline implications. Delays broader beta. High risk if the rebuild takes longer than expected. Probably the right long-term call but a large near-term commitment.

---

## Section 3: Defining "Good Enough" — Voice SLA

Before we can evaluate whether any of the above options are working, we need to agree on a target. This is a requirement we need to capture, not a decision we need to make today.

**The question**: What is the maximum acceptable Time to First Byte (TTFB) for voice conversation mode — i.e. the time between the user finishing speaking and the first audio response being heard?

This becomes the definition of "good enough" and the benchmark against which all latency improvements are measured.

**Why TTFB specifically**: It's the moment users feel the system respond. Total response duration matters too, but TTFB is the primary driver of whether a voice interaction feels natural or broken.

**Things to consider when setting the target**:
- Competitor benchmarks (what do Nadia and equivalent products deliver?)
- Human conversational norms (~200–500ms is natural; >2s feels like lag; >5s is likely unacceptable)
- What our current architecture can realistically achieve vs. what requires a rebuild

**Action**: Agree on a TTFB target (e.g. p50 and p95) before or during Monday's review. This target should inform which options in Section 1 are worth pursuing and which pathway in Section 2 is appropriate.

---

## Open Questions

- What is the current measured latency? (Need instrumentation to answer this properly)
- Is the ElevenLabs deal expected to close before Customer Zero?
- What is the Q2 engineering capacity available to voice?
- What TTFB target should we set as our SLA for voice conversation mode?