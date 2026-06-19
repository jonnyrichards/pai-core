---
title: Unified Coach — H2 Direction
confluence_page_id: 6335955527
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6335955527/Unified+Coach+H2+Direction"
last_synced: "2026-06-18T05:48:03.551Z"
---

# Unified Coach — H2 Direction
*Brief for Enoch · June 2026*

---

## Trajectory

| | Q3 | Q4 |
|---|---|---|
| **Theme** | Foundation | Everywhere |
| **Milestones** | Coach in Home Page · Unified Session History · Routing between Coach agents · Coach in Goals + Develop | Coach handles 'navigate away' · Coach in [x] (Survey Design? AF? 1-on-1s?) · Coach knows Culture Amp · Coach in every page |

---

## User Testing — Key Findings

We ran research on context-switching behaviour in a prototype. Three things stood out:

1. **Users expect persistence by default.** Before seeing the prototype, most users assumed Coach would persist when they navigate away — not close or reset.

2. **Navigation ≠ Chat switching.** The right pattern depends on *how* the context switch happens:
   - When *switching between chats*, users valued being asked — the informed consent prompt felt appropriate
   - When *navigating around the platform*, that same prompt felt like friction; a visual marker (signposting) was sufficient

3. **Orientation matters more than we thought.** The context pillow and change marker failed to orient users — everyone looked at the top of the chat panel, not the bottom. The "context" label itself didn't land.

**Bonus signal:** Chat history is effectively hidden (behind a three-dot menu). Users can't find past conversations without help.

---

## Three Patterns at Our Disposal

When a context switch occurs, we have three approaches:

| Pattern | Description |
|---|---|
| **Reset** | Start a new session automatically; previous context is cleared |
| **Informed Consent** | Ask the user before mixing contexts |
| **Signposting** | Let the session continue, but clearly mark what changed |

These aren't mutually exclusive — they can work in combination.

---

## My Hunch

Two scenarios drive the vast majority of context-switch cases. If we get the UX right for these, everything else falls into line:

**1. Navigate away** (user loads a different page while Coach is open)
- Preferred: **Reset** — clean slate, low risk of data bleed
- Fallback: **Signposting** — persist but mark the transition clearly

**2. Load a previous chat**
- Preferred: **Informed Consent** — ask before mixing
- Fallback: **Signposting** — make the context change obvious

Before testing, we leaned toward signposting across the board. Post-testing, we think the two scenarios warrant different approaches — and the data privacy risk (e.g. performance review data and survey results in the same scroll) makes reset a strong default for navigation.

There are also meaningful **engineering constraints around data isolation** between agent contexts. (These are solvable at the product design layer, and the patterns above give us the shape to work within.)

---

## Order of Events

1. **Unified Sessions** — single session history; logical once Coach lands on the home page and agents share a surface
2. **Navigation** — makes Coach ready to persist across the platform; establishes the UX patterns above
3. **Routing** — expands the graph; enables a growing agent pool to route between themselves
4. **Coach in [x]** *(Q3)* — Goals, Develop
5. **Coach everywhere** *(Q4)* — Coach in [x], Coach knows Culture Amp, "Ask anything anywhere"