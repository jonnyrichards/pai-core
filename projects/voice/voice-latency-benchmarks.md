---
title: Voice AI Latency — Industry Benchmarks
status: draft
confluence_page_id: 6127682827
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6127682827/Voice+AI+Latency+Industry+Benchmarks"
last_synced: "2026-04-13T01:51:14.953Z"
---

## Overview

This document summarises industry benchmarks for voice AI response latency, human perception thresholds, and the current state of provider SLAs. Intended to inform SLA definition for the voice service.

---

## End-to-End Latency: Leading Services

End-to-end (E2E) latency is measured from the moment a user stops speaking to the moment the first audio byte of the response begins playing.

| Provider / Stack | Reported E2E Latency | Notes |
|---|---|---|
| OpenAI Realtime API (GPT-4o) | ~300–500 ms | Native speech-to-speech |
| ElevenLabs Conversational AI | ~400–700 ms | Sub-500 ms TTFB is their published target |
| Deepgram (ASR only, Nova-2) | ~100–200 ms | Streaming transcription only — not full E2E |
| Cartesia (TTS only) | ~90–150 ms | Time-to-first-audio-chunk via streaming |
| Retell AI (full stack) | ~700–900 ms | Independent tester measurements (2024) |
| Vapi (full stack) | ~800–1,200 ms | Varies by LLM choice |
| Bland AI (full stack) | ~500–900 ms | 2024 launch materials |
| DIY stack (Deepgram + GPT-4o + ElevenLabs) | ~600–900 ms | Community benchmarks (Pipecat, LiveKit) |

**Note:** Most vendor benchmark pages are not publicly accessible. These figures are drawn from vendor documentation, community benchmark projects, and independent tests — not a single authoritative comparison source.

---

## Human Perception Thresholds

| Latency | User Experience |
|---|---|
| < 150 ms | Imperceptible — feels instantaneous |
| 150–300 ms | Natural — gold standard for conversational voice |
| 300–500 ms | Noticeable but tolerable — current practical target for most production systems |
| 500 ms–1 s | Awkward — satisfaction scores decline noticeably |
| > 1 s | Disruptive — turn-taking breaks down; system feels like it's "thinking" |

**Reference standard:** ITU-T G.114 (designed for telephony) specifies 0–150 ms as preferred, 150–400 ms as acceptable, >400 ms as unacceptable for interactive voice. It's the closest thing to an official standard, though it predates AI voice applications.

Human conversational response time is 200–500 ms (psycholinguistics research), which is why 300 ms feels natural — it's within the range of normal human turn-taking.

---

## Pipeline Component Breakdown

A typical production voice AI pipeline has three sequential components:

```
[User speaks] → ASR → LLM (TTFT) → TTS (TTFAB) → [User hears response]
```

| Component | Typical Range | Best-in-class |
|---|---|---|
| ASR (Automatic Speech Recognition) | 100–300 ms | ~80 ms (Deepgram Nova-2 streaming) |
| LLM Time-to-First-Token (TTFT) | 200–600 ms | ~150 ms (GPT-4o, Gemini Flash) |
| TTS Time-to-First-Audio-Byte (TTFAB) | 100–400 ms | ~50–90 ms (Cartesia, ElevenLabs Turbo) |
| Network / infrastructure overhead | 20–100 ms | ~10 ms (co-located services) |
| **Total E2E** | **420 ms–1.4 s** | **~300–400 ms (optimised stack)** |

**Key optimisation lever:** The LLM TTFT dominates total latency. Streaming TTS — where audio generation begins from the first LLM tokens rather than waiting for the full response — converts a sequential pipeline into a partially parallel one, reducing perceived latency by 200–400 ms.

---

## Published SLAs

The voice AI industry has no standardised latency SLA framework. Providers compete on marketing benchmarks rather than contractual commitments.

| Provider | Latency SLA | Uptime SLA | Notes |
|---|---|---|---|
| OpenAI | None | 99.9% (API) | No latency commitment for Realtime API |
| ElevenLabs | None | Not published | "Sub-500 ms" is a marketing target only |
| Deepgram | None | 99.9% (paid plans) | Docs target 200 ms for streaming ASR |
| Cartesia | None | Not published | Publishes p50/p95 in docs (~90 ms / ~200 ms TTFAB) |
| Vapi / Retell / Bland | None | Not published | Enterprise contracts may include custom terms |

**ITU-T G.114** is the de facto reference standard for interactive voice latency but was designed for PSTN telephony, not AI.

---

## Implications for SLA Design

1. **300 ms is the "natural conversation" target** — within normal human response time and what best-in-class stacks can achieve.
2. **500 ms is the user experience cliff** — design p95 SLA targets around not exceeding this threshold.
3. **Measure TTFAB, not full response completion** — Time to First Audio Byte is what users perceive as the start of the response.
4. **Use percentile targets, not averages** — p50 / p95 / p99 thresholds, as outliers are what break perceived quality.
5. **No industry template exists** — any SLA we define would be self-authored, with ITU-T G.114 as the closest external reference for justification.

### Suggested SLA Starting Points

| Metric | Target | Rationale |
|---|---|---|
| E2E latency p50 | ≤ 500 ms | Practical production target; achievable with current stack |
| E2E latency p95 | ≤ 1,000 ms | Keeps the tail within the "disruptive" threshold |
| E2E latency p99 | ≤ 2,000 ms | Outlier bound |
| Uptime | 99.9% | Industry standard for API services |

These are starting points for discussion — actual targets should be informed by measured baseline performance.