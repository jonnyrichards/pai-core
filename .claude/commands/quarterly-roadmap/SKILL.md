---
name: quarterly-roadmap
description: Translates a quarterly-priorities.md into a renderer-ready roadmap.md by adding the temporal and confidence layer (Start positions, Confidence, Deliverables). A lean, focused skill — structure and content come from quarterly-priorities; this skill only adds what the renderer needs. Trigger when the user says "build the roadmap from priorities", "promote to roadmap", or "quarterly roadmap".
---

# Quarterly Roadmap

Translates `quarterly-priorities.md` into `roadmap.md` — the input for `/roadmap-render`. This skill is deliberately lean: it doesn't re-derive structure or re-negotiate content. All of that lives upstream in `/quarterly-priorities`. This skill only adds the rendering layer.

## What this skill adds

`quarterly-priorities.md` already has: Stream, Initiative, Work Item, Description, Stage, When?, Estimate.

This skill adds:
- **Start** — precise quarter position (e.g. `Q3.0`, `Q3.2`) for the timeline renderer
- **Confidence** — Committed / High confidence / Early signal / Hypothesis / Placeholder
- **Deliverables** — 2–4 `>`-separated milestones shown on the card face
- **Drives** — Reach / Engagement / Foundation
- **People** — optional comma-separated list of 2–3 names shown on the card (first names or initials)

That's it. No re-structuring, no re-writing descriptions, no new swim lane negotiation.

## Inputs

- `projects/{product}/quarterly-priorities.md` — read this first, silently
- The quarter (infer from the priorities file, or ask if unclear)

## Output

`projects/{product}/roadmap.md` — in the standard roadmap format consumed by `/roadmap-render`.

---

## Conversational Pattern

### Phase 1 — Silent read + propose

Read `quarterly-priorities.md`. Then:

1. Map Streams → Lanes (1:1 by default; flag if any Stream is too broad or too narrow to be a useful lane)
2. Map Work Items → Initiatives, grouping where appropriate (multiple Work Items under one Initiative become one card with Deliverables)
3. Propose Start positions based on When? + Estimate:
   - `Now` + Small → early in quarter (e.g. Q3.0)
   - `Now` + Large → Q3.0, will span into mid-quarter
   - `Next` → mid-quarter (e.g. Q3.2–Q3.3)
   - `Later` → late quarter (e.g. Q3.4–Q3.5)
   - Honour dependencies where visible (e.g. if A must precede B, don't overlap them)
4. Assign default Confidence based on Stage:
   - `Build` → `Committed`
   - `Discovery → Build` → `High confidence`
   - `Discovery` → `Discovery`

Present this as a single table:

| Initiative | Lane | Start | Confidence | Effort | Drives | Deliverables |
|---|---|---|---|---|---|---|

Ask: *"Does this mapping look right? Adjust any Start positions or Confidence levels before I fill in Deliverables and People."*

Keep this round tight — most of it should be right first time.

---

### Phase 2 — Deliverables pass

Work through initiatives that don't yet have Deliverables (i.e. weren't carried over from the priorities file). For each:

> "[Initiative name] — what are the 2–4 milestones on the card? E.g. `First cut live > Full rollout`"

If the Work Items in quarterly-priorities.md already describe a natural sequence, propose them as Deliverables and ask for confirmation rather than asking from scratch.

Use `—` for initiatives where milestones aren't meaningful (e.g. ongoing infra work).

Once Deliverables are confirmed, ask once:

> "Any initiatives you'd like to tag with people? (Optional — first names or initials, 2–3 max per card. Hit enter to skip.)"

Accept a free-form response like "Unified Sessions: Alice, Bob / Routing: Carol" and map it. Leave `—` for anything not mentioned.

---

### Phase 3 — Write

No final review round needed — the content was already reviewed in `/quarterly-priorities`. Just confirm:

> "Happy for me to write roadmap.md?"

On approval, write `projects/{product}/roadmap.md` in the standard format (see Output Format below).

---

## Output Format

Follow the roadmap.md format exactly — the renderer depends on it.

```markdown
# {Product} - {Half} Roadmap

<!--
TIMELINE SCALE
Each quarter has 6 positions (Q3.0 – Q3.5), each ~2 weeks apart.
"A month forward" = +2 positions. "A month back" = -2 positions.
Q3.5 → Q4.0 is a valid boundary crossing.

EFFORT (card width)
Small = 1/6q (~2 weeks) | Medium = 2/6q (~1 month) | Large = 4/6q (~8 weeks)
-->

{Thesis from quarterly-priorities preamble — 1 sentence}

---

## Confidence key

| Label | Meaning |
|---|---|
| Committed | Scoped, resourced, in delivery |
| High confidence | Strong intent, clear path |
| Early signal | Directionally right, needs validation |
| Hypothesis | Worth exploring, low signal so far |
| Placeholder | Not yet defined |

## Effort key

| Label | Sprints | Duration |
|---|---|---|
| Small | 1 | ~2 weeks |
| Medium | 2 | ~1 month |
| Large | 3 | 8 weeks |

---

## {Lane name}:

{Lane summary — 1 sentence}

| Initiative | Start | Confidence | Effort | Drives | Deliverables | People | Description |
|---|---|---|---|---|---|---|---|
[rows]

---

## Not in scope

| Initiative | Reason |
|---|---|
[rows from Deferred section of quarterly-priorities.md]
```

**Key rules:**
- Lane name comes from Stream in quarterly-priorities
- Description comes verbatim from quarterly-priorities — don't rewrite
- Deliverables: `>`-separated, 3–5 words each, no pipes
- People: comma-separated first names or initials (e.g. `Alice, Bob`), or `—` if none
- Not in {Half} section comes directly from the Deferred section of quarterly-priorities
- **Lane summary: max ~60 characters, one line.** The renderer renders it in a narrow left gutter — longer summaries overflow into the card area. Keep it tight: a noun phrase, not a sentence.

---

## Principles

- **Don't re-derive what's already decided.** quarterly-priorities settled the structure. This skill only adds the temporal layer.
- **Verbatim descriptions.** Copy from quarterly-priorities exactly — no paraphrasing.
- **Honest confidence.** `Build` stage ≠ automatically Committed. Push back if something looks overstated.
- **Propose, don't ask.** Come with a full draft and ask for corrections — don't interrogate row by row.
