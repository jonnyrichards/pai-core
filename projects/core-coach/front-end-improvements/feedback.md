---
title: Core Coach — Feedback
confluence_page_id: 6015320127
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6015320127/Core+Coach+Feedback"
last_synced: "2026-03-11T03:52:50.380Z"
---

## High Level Description

We need an approach to handling feedback post migration to LangGraph.

**Phase 1:** Migrate existing feedback functionality out of Stagira so Stagira can be retired (preserve existing table etc.)

**Phase 2:** Implement a new feedback feature with proper consideration (i.e., start from scratch with Langfuse in mind)

---

## Engineering Context

* Eng is retiring Stagira; feedback currently lives in Stagira; we need to get feedback out of Stagira quickly with minimal effort (so the feature can persist)
* New table: `message_id`, `session_id`, `thumbs_up_down`, `feedback_text` (nullable — most users won't leave text)
* Existing data can be fetched but best not to get too hung up on it — data is unreliable
* Send `thumbs_up_down` clicks to Amplitude?
* Product should take the lead on how feedback should work; start from scratch
* Eng could handle Stage 1 but needs Product's guidance on Stage 2

---

## Product / Design Context

Start from scratch. Feedback hasn't been touched for a long time.

### Stage 1: Feedback Report (Manual)

A lightweight, manually-run report for internal PM use.

**Inputs**

* Date range (default: last 30 days)

**Outputs**

* **Sentiment by context** — Is negative or positive sentiment more pronounced in a particular Coach setting, relative to overall message volume? e.g. _"Overall negative sentiment is more pronounced in General Coach…"_
* **Message-sentiment patterns** — Connections between specific messages and sentiment. Look for patterns in what triggers thumbs up / thumbs down. e.g. _"Negative sentiment tends to be triggered by messages that…"_
* **Indicative quotes** — Surface representative quotes attached to sentiments in the time window. e.g. _"Here are some notable quotes attached to sentiments…"_
* **Sentiment volume trend** — Are more / fewer people expressing a particular sentiment over the time window?
* **Overall sentiment read** — Nice to have, but given sample sizes this is dubious; treat as indicative only

### Stage 2: Feedback Viewer (Site)

A web app making all of the above explorable in a PM-friendly way — akin to DS's existing mini-sites (e.g. Saturn/Rash-style).

* Organised by instance: General / Perform / Engage
* Metrics: overall sentiment, topic-based sentiment analysis (what messages trigger negative sentiment), sentiment trend
* Indicative quotes / feedback surfaced inline
* More ambitious; timeline is flexible

---

## Timeline

* Stage 1 must happen before Stagira is retired
* Stage 2 is flexible

---

## Next Steps

- [ ] Flesh out Stage 2 proposal
- [ ] Schedule Stage 1 as part of LangGraph migration

