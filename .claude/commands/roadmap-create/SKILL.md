---
name: roadmap-create
description: Use when the user wants to build a product roadmap from scratch, work through initiative framing, or produce a structured roadmap markdown file. Trigger on "build a roadmap", "let's plan H2", "roadmap session", or when the user brings a list of initiatives that need structuring.
---

# Roadmap Create

Drives a back-and-forth conversation that turns rough initiative ideas into a structured roadmap markdown file — the source of truth that `roadmap-render` then turns into a visual.

## Output

A markdown file with:
- Opening thesis (2 sentences)
- 1–3 swim lanes grouping initiatives by theme, confidence tier, or sequencing logic
- Not in H2 — explicitly deprioritised with reasons
- Confidence key + Effort key

The swim lane structure is negotiated with the user (see Phase 2). `projects/core-coach/h2-roadmap.md` is a good reference example, not a template to copy.

## Conversational Pattern

This skill drives a structured but natural back-and-forward. Follow this sequence:

---

### Phase 1 — Frame the half before touching initiatives

Open with two questions before listing anything:

1. **What is this half about?** Ask for a one-sentence thesis. Push back if it's vague. The thesis should name the strategic intent (e.g. "expanding Coach across CA") not just describe the work.

2. **What does success look like?** Establish the top-level metric(s). For Coach, this resolves to: **reach** (more users, more surfaces) and **engagement** (existing users doing more). Tag every initiative against one of these. This gives the roadmap analytical muscle beyond just listing work.

Don't rush this. A weak thesis produces a weak roadmap.

---

### Phase 2 — Structure before detail

Before writing any descriptions, propose a structure:
- Ask for the full list of initiatives the user has in mind (names only, rough)
- Ask how they naturally group — or propose groupings based on what you hear
- Assign quarters (Q3 / Q4 / Q3/Q4 / TBD)
- Flag anything that should be **Not in H2** — explicitly named and reasoned, not just absent

**Swim lanes are flexible.** The groupings should reflect how this particular roadmap thinks, not a fixed template. Some examples of valid structures:

| Structure | When it fits |
|---|---|
| **Spine + Bets** (e.g. `h2-roadmap.md`) | When there's a sequenced critical path plus exploratory orbiting work |
| **By confidence tier** | When the main story is certainty: Committed / Exploring / Future |
| **By theme or surface** | When work clusters around distinct product areas |
| **Flat — no lanes** | When everything is exploratory and false hierarchy would mislead |

If the user's initiatives don't naturally form a Spine, don't force one. Ask: *"Do any of these depend on each other, or are they mostly independent bets?"* — the answer should drive the structure.

Show the structure as a table. Ask: *"Does this feel complete at the structural level, or are there other initiatives missing before we go deeper?"*

Don't write descriptions yet. Get the shape right first.

**Placeholders are fine.** If the user mentions something half-formed, add it as `Placeholder` confidence with `TBD` quarter. Named > absent.

---

### Phase 2.5 — Sequencing

After agreeing the lane structure, assign a `Start` and `Row` for each initiative before writing descriptions.

**`Start` format:** `Q3.0` through `Q3.5`, `Q4.0` through `Q4.5`, or `TBD`.
Each quarter has 6 positions (~2 weeks each): `Q3.0` = start of Q3, `Q3.3` = mid Q3, `Q3.5` = late Q3.

**`Row`:** `0` = top sub-row, `1` = second sub-row. Use `1` when two items in the same lane would visually overlap (i.e. their time ranges cross).

**Default approach — skill-led:**
Propose start positions as a table. Apply these heuristics:
- Committed items anchor earliest in their quarter
- Items with stated dependencies start after their prerequisite's estimated end
  - Small ends ~0.5q after start, Medium ~1.0q, Large ~2.0q
- Two items in the same lane with overlapping time ranges get `Row: 0` and `Row: 1`
- TBD items get `Start: TBD`

Show the proposed sequencing as a table:

| Initiative | Lane | Start | Row | Notes |
|---|---|---|---|---|
| Routing — MSS slice | The Spine | Q3.0 | 0 | Committed, anchors first |
| Unified Sessions | The Spine | Q3.0 | 1 | Concurrent with Routing |

Ask: *"Does this sequencing feel right? Adjust any start positions before we write descriptions."*

Accept corrections. Update the table. Only proceed to Phase 3 once the user is happy with the sequence.

---

### Phase 3 — Descriptions one by one

Work through each initiative. The pattern:

1. **Draft a description.** Lead with what it is if the name doesn't make it obvious; lead with why it matters if the name is self-explanatory. One sentence. No filler.
2. **User corrects or rewrites.** Accept verbatim corrections without paraphrasing back. If they rewrite it, use their exact words.
3. **Confirm confidence level.** Use the key below. Don't over-inflate. `Committed` means scoped, resourced, in delivery — not "we really want to do this."
4. **Confirm what it drives.** Reach / Engagement / Foundation. Foundation is valid for observability, instrumentation, infrastructure that enables the others.

**Description principles (from the session that produced `h2-roadmap.md`):**
- One sentence does two jobs: what it is + why it matters for adoption
- If the "what" is obvious from the name, lean into the "why"
- If the "what" needs explaining, lead with that
- No justification needed for Committed items — they're in, just describe them clearly
- Don't editorialize. Sharp, factual, no hype.

---

### Phase 4 — Not in H2

Explicitly name everything that was considered and deprioritised. One-line reason for each:
- Infrastructure work that doesn't unlock user-facing value yet
- Important but unlikely to move adoption at current scale
- Insufficiently defined to commit to

**Named and reasoned > silently absent.** This section signals thoughtfulness and makes the tradeoffs visible.

---

### Phase 5 — Final review

Reflect the full structure back as a table. Ask:
- "Does the sequencing in the Spine feel right?"
- "Are the confidence levels honest?"
- "Anything missing from Not in H2?"

Only after sign-off: write the markdown file.

---

## Confidence Key

| Label | Meaning |
|---|---|
| Committed | Scoped, resourced, in delivery |
| High confidence | Strong intent, clear path |
| Early signal | Directionally right, needs validation |
| Hypothesis | Worth exploring, low signal so far |
| Placeholder | Not yet defined |

## Effort Key

| Label | Sprints | Duration |
|---|---|---|
| Small | 1 | ~2 weeks |
| Medium | 2 | ~1 month |
| Large | 6 | ~3 months |

---

## Output Format

The file structure adapts to the swim lanes agreed in Phase 2. The fixed skeleton is:

```markdown
# [Product] H2 Roadmap

[Thesis — 1-2 sentences]

---

## Confidence key
[table]

## Effort key
[table]

---

## [Lane 1 name]: [subtitle]

[1-sentence framing of this lane]

| Initiative | Start | Row | Confidence | Effort | Drives | Description |

---

## [Lane 2 name]: [subtitle]    ← omit if not needed

[1-sentence framing]

| Initiative | Start | Row | Confidence | Effort | Drives | Description |

---

## Not in H2

| Initiative | Reason |
```

**Column reference:**
- `Start`: `Q3.0`–`Q3.5`, `Q4.0`–`Q4.5`, or `TBD` (no `Quarter` column — position encodes it)
- `Row`: `0` or `1` (sub-row within lane for concurrent items)
- `Confidence`, `Effort`, `Drives`, `Description`: unchanged from previous format

**Reference example:** `projects/core-coach/h2-roadmap.md` uses a Spine + Bets structure. The renderer (`roadmap-render`) handles any number of lanes with any names — it reads section headings dynamically.

Default output path: `projects/[product-name]/h2-roadmap.md`

---

## Principles

- **Shape before detail.** Get the structure right before writing a single description.
- **Verbatim over paraphrase.** When the user corrects a description, use their words exactly.
- **Honest confidence.** Push back on inflated labels. "We want to do this" is not Committed.
- **Named tradeoffs.** Not in H2 is as important as the rest of the roadmap.
- **One sentence, two jobs.** Every description should say what it is AND why it matters.
- **The thesis earns the initiatives.** If an initiative doesn't connect to the thesis, that's worth naming.
