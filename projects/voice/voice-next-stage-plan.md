---
title: Voice — Next Stage Plan
status: draft
last_updated: 2026-06-18
confluence_page_id: 6335890058
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6335890058/Voice+Next+Stage+Plan"
last_synced: "2026-06-18T07:11:05.786Z"
---

# Voice — Next Stage Plan

---

## Where we are

### Rollout
- 100% rollout since 15 June
- Voice marketing plan coming late June — part of a larger Perform bundle (inc. Session Replay + PAUF in Coach in Perform)

### Usage / Data
- ~4% of Coach users messaging Coach use dictation; conversation mode roughly half that (no retention data yet)
- Average TTFT for conversation mode in General Coach: **1–2s** (per Datadog)
- Average TTFT for conversation mode in MSI (manual testing, 3 sessions): **9–12s**; avg response length 227 words; read time 40s+
- #help-coach-feedback mentions *(pending — check Slack ahead of Monday)*

### CZ testing findings
- Preference for **Nova** voice
- **Interruption** is the main friction point; early mitigation deployed (increased recording time)
- Voice is for brain-dumping & efficiency; dictation is the preferred mode. Insight: users are not looking to voice to build an emotional connection or have a 'conversation' — they want an efficient input modality (Fast Finding #4)
- Reference: [Voice Fast Findings June 2026](https://docs.google.com/presentation/d/1MWjw0gC4kwMMvFn7HrAV6srZGU5fJ_7bHqZZl51yvuc/edit?slide=id.g3e846edbd4c_0_81#slide=id.g3e846edbd4c_0_81)

### Voice by surface

**1. Pre-MSI launch (current state)**

| Surface | Agent | Dictation? | Conversation? | TTFT (conversation) | Notes |
|---|---|---|---|---|---|
| Coach page | General Coach | ✅ | ✅ | 1–2s (Datadog) | Standalone voice prompt (Haiku model) with no tool calls handles voice; separate prompt handles non-voice |
| Perform Coach | Manager Review Coach | ✅ | ❌ | — | Decision (May): too slow; conversation mode removed |
| Engage Coach | PCQ | ✅ | ❌ | — | Decision (May): too slow; conversation mode removed |

**2. MSI slice 1 (July 7)**

| Surface | Agent | Dictation? | Conversation? | TTFT (conversation) | Notes |
|---|---|---|---|---|---|
| Coach page | General Coach, MSI | ✅ | ❓ | GC: 1–2s / MSI: 9-12s | ⚠️ Pattern breaks — conversation mode queries need to be disambiguated (GC or MSI?). Current solve: block voice from MSI-ready pages |
| Home page | General Coach, MSI | ✅ | ❓ | GC: 1–2s / MSI: 9-12s | ⚠️ Same issue |

**3. Beyond MSI (illustrative)**

| Surface | Agent | Dictation? | Conversation? | TTFT (conversation) | Notes |
|---|---|---|---|---|---|
| Goals page | All Coaches | ✅ | ❓ | TBC | ⚠️ Same pattern — do we have a conversation mode version of every agent? |

---

## The looming gotcha

The current architecture works by maintaining a **separate, lightweight voice prompt per agent** (e.g. the Haiku-based General Coach voice prompt). This is what delivers the 1–2s TTFT. It's fast because it is deterministic agent choice, uses a small model, makes no tool calls, and is optimised for voice-friendly responses.

That approach breaks down as soon as multiple agents share a surface. When a user taps the microphone on the Coach page post-MSI launch, the system faces a routing problem: is this query for General Coach or MSI? Today's answer: conversation mode is is blocked on MSI-ready pages entirely. [Check with Michael]: The user sees the voice button but their query silently never routes to MSI.

The deeper issue: routing between agents is inherently non-deterministic (it's what LangGraph's routing layer handles). We've been solving a non-deterministic problem with a deterministic shortcut, and the shortcut is running out of road. MSI is the first pressure point, but it's not the last. Within a few months, virtually every surface will have multiple agents. The question isn't "how do we fix conversation mode for MSI"; it's "what is the right architecture for conversation mode in a unified, multi-agent Coach?"

---

## Ways forward

### 1. Questions to answer

In roughly this order:

1. **Do we need to support conversation mode on surfaces with multiple agents?** ('fork-in-the-road' question)
2. **If yes, how does routing work?** When a user speaks, which agent handles the query and how is that decided in a way that works for conversation mode's latency constraints?
3. **How are conversation mode instructions delivered prompt-side** in a world where the main agent (not a separate voice prompt) is handling the query?
4. **What latency is acceptable for conversation mode?** The 1–2s TTFT on General Coach sets a user expectation. If we enable conversation mode for MSI, it will be much slower. What's the ceiling before conversation mode becomes a poor experience?

---

### 2. Options

| Option | Description | Tradeoff |
|---|---|---|
| **A. Extend current pattern** | Maintain a separate voice prompt per agent; route non-deterministically (via an orchestrator) to the right voice prompt | Fragile — breaks as surfaces gain more agents; huge prompt upkeep load on PSX, doesn't scale to unified Coach |
| **B. Route through main agent** | Remove separate voice prompts; inject voice-specific instructions as snippets; let the main agent route conversation mode queries to regular, non-voice agents | Solves routing correctly; but TTFT will increase |
| **C. Deprecate conversation mode** | Invest only in dictation mode going forward; remove conversation mode | Clean technically, and CZ data suggests users prefer dictation anyway — but a significant product retreat, and a sunk cost (EL) |

### Latency reduction options (Option B)

If pursuing Option B, these are the levers available to bring TTFT closer to acceptable:

| Option | Description | Tradeoff |
|---|---|---|
| Smaller model (e.g. Haiku) | As done for General Coach — worked well there | Requires rigorous evals for MSI and other agents; unlikely to work with large payloads |
| UI 'thinking' indicator | Visual step to reduce *perceived* latency — no actual improvement | Low effort, buys goodwill but doesn't fix the problem |
| Prompt-based guidance | Instruct the agent via the voice snippet to a) see if tool calls are enabled for the agent (this will be a guide to whether response times are likely to be long) b) suggest the user ends the voice sessions and continues in text | Essentially says: 'this mode doesn't work'; but it's low friction for the user |
| Voice-optimise MSI prompt | Tune MSI prompt specifically for voice — shorter, more conversational responses | Would reduce response length (227 words → more listenable) but **not** TTFT (model + tool calls remain); may be a viable middle ground worth exploring |

---

### 3. Timing

MSI slice 1 launches **7 July** — we need a direction before then. Concretely:

- Decision on conversation mode + MSI
- Option B? -> Engineering scoping begins
- Option C? -> Consider internal + any user-facing implications

---