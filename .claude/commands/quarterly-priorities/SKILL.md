---
name: quarterly-priorities
description: Build a quarterly priorities table by synthesising multiple input sources (Slack canvas, Confluence doc, JPD view, CX spreadsheet, roadmap.md) through a structured back-and-forward conversation. Output is a Confluence-ready markdown table at projects/{product}/quarterly-priorities.md. This is the source-of-truth document — quarterly-roadmap builds on it downstream.
---

# Quarterly Priorities

Synthesises quarterly planning material from multiple sources into a single, structured markdown table — Confluence-ready and the foundation for the visual roadmap.

## Inputs

The user will provide:
- A **quarter + product** (e.g. "Q3 2026, Coach Foundations") — if not stated, ask before proceeding
- Some combination of sources:
  - A **Slack canvas** (URL or pasted content)
  - A **Confluence doc** (URL — fetch it)
  - A **Jira Product Discovery view** (URL or exported content)
  - A **CX priority spreadsheet** (pasted or linked)
  - A **local .md file** (e.g. `projects/core-coach/roadmap.md`)

Read/fetch all inputs silently before saying anything. Don't summarise what you've read — go straight to the framing question.

## Output

A markdown file at `projects/{product}/quarterly-priorities.md` with:
- A preamble (2 sentences: what the quarter is about, what this table represents)
- A single table (see schema below)
- A "Deferred / Not {Quarter}" section — named items with a one-line reason each

This file is the source of truth. It should be Confluence-pasteable as-is, and is the input for `/quarterly-roadmap`.

---

## Table Schema

| Stream | Initiative | Work Item | Description | Confidence | When? | Estimate |
|---|---|---|---|---|---|---|

**Column definitions:**

- **Stream** — broad theme grouping (e.g. Unified, Context-Aware, Observable). Derived from sources; don't force-match any existing roadmap stream names, but note mismatches for the user to reconcile later.
- **Initiative** — the parent initiative this work item belongs to (e.g. MSS, Customer Knowledge Base, Routing).
- **Work Item** — the specific deliverable or feature. Aim for row-weight equality: group very small items together under a single work item rather than creating micro-rows.
- **Description** — one sentence. Problem-first: what user or business need does this address? No hype. If the work item name is self-explanatory, lead with why it matters.
- **Confidence** — one of: `Committed` (scoped, resourced, in delivery), `High confidence` (strong intent, clear path), `Discovery` (planned but not yet scoped or resourced). Use `Committed` for work in active build; `High confidence` for work with a clear plan but not yet started; `Discovery` for work still being defined.
- **When?** — timing expressed as `[Early|Mid|Late] Q{N}` (e.g. `Early Q3`, `Late Q3`, `Early Q4`). Use the quarter being planned as the reference. `Early` = in-flight or starting in the first third; `Mid` = middle third; `Late` = final third or likely slipping to next quarter (use next quarter label in that case).
- **Estimate** — rough effort (e.g. `Small`, `Medium`, `Large`). Use `?` if unknown. Don't fabricate.

---

## Conversational Pattern

### Phase 1 — Silent ingest

Read all inputs. Build a complete draft table internally. Do not present it yet.

Before showing the draft, ask **one framing question**:

> "Before I show you the draft — what's the one thing {Quarter} needs to be true by the end? I want to make sure the table reflects that, not just what's in the sources."

Use the answer to calibrate the When? column and to flag any items that don't connect to the stated goal.

---

### Phase 2 — Present the draft by Stream

Show the draft table grouped by Stream. For each Stream:
1. Show the rows
2. Ask one focused question: *"Does this grouping feel right? Anything missing, miscategorised, or that should be split/merged?"*

Work through Streams one at a time. Only flag:
- Items where Stage is ambiguous
- Items that feel too large or too small relative to other rows (row-weight problem)
- Items present in only one source (may be stale or missing context)

Accept corrections. Move on.

---

### Phase 3 — When? pass

After the Stream review, do one dedicated pass on timing:

> "Let me run through the When? assignments — these are the ones I'm less confident about. Tell me if any feel wrong."

List only the uncertain ones. Accept corrections.

---

### Phase 4 — Deferred / Not {Quarter}

Ask:

> "Anything you want explicitly named as Not {Quarter} — things that were considered but deprioritised?"

Named and reasoned > silently absent.

---

### Phase 5 — Final review and write

Reflect the full table back. Ask:
- "Happy with the Stream names?"
- "Any estimates you want to add or correct before I write the file?"

On approval, write `projects/{product}/quarterly-priorities.md`.

---

## Row-Weight Principle

Rows should feel roughly equal in scope. Rules:
- Group micro-items (< 1 dev day) into a single Work Item: "Minor polish: [x, y, z]"
- Split items that span multiple milestones only if they have meaningfully different Stage or When? values
- If in doubt, err toward fewer rows — easier to split later than to merge

---

## Output Format

```markdown
# {Quarter} Priorities — {Product}

[2-sentence preamble: what the quarter is about + what this table represents]

*Last updated: YYYY-MM-DD*

---

## Priorities

| Stream | Initiative | Work Item | Description | Confidence | When? | Estimate |
|---|---|---|---|---|---|---|
[rows grouped by Stream, with a blank row between each Stream block]

---

## Deferred / Not {Quarter}

| Item | Reason |
|---|---|
[rows]
```

---

## Downstream

This file feeds `/quarterly-roadmap`, which adds the rendering layer (Start positions, Confidence, Deliverables milestones) and produces `roadmap.md` for `/roadmap-render`.

---

## Principles

- **Sources first, opinions second.** Synthesise what's in the inputs before adding judgment.
- **One sentence, problem-first.** Every description names the user or business need.
- **Named tradeoffs.** Deferred > absent.
- **Row-weight equality.** The table should scan evenly.
- **Don't fabricate estimates.** `?` is honest. A made-up number is not.
