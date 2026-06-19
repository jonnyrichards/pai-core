---
name: q3-priorities
description: Build a Q3 priorities table by synthesising multiple input sources (Slack canvas, Confluence doc, JPD view, CX spreadsheet, roadmap.md) through a structured back-and-forward conversation. Output is a Confluence-ready markdown table at projects/core-coach/q3-priorities.md.
---

# Q3 Priorities

Synthesises Q3 planning material from multiple sources into a single, structured markdown table — Confluence-ready and linkable to the roadmap.

## Inputs

The user will provide some combination of:
- A **Slack canvas** (URL or pasted content)
- A **Confluence doc** (URL — fetch it)
- A **Jira Product Discovery view** (URL or exported content)
- A **CX priority spreadsheet** (pasted or linked)
- A **local .md file** (read `projects/core-coach/roadmap.md` and any other specified path)

Read/fetch all inputs silently before saying anything. Don't summarise what you've read — go straight to the draft.

## Output

A markdown file at `projects/core-coach/q3-priorities.md` with:
- A preamble (2 sentences: what Q3 is about, what this table represents)
- A single table (see schema below)
- A "Deferred / Not Q3" section — named items with a one-line reason each

This file is the source of truth. It should be Confluence-pasteable as-is.

---

## Table Schema

| Stream | Initiative | Work Item | Description | Stage | CX Priority | Now / Next / Later | Estimate |
|---|---|---|---|---|---|---|---|

**Column definitions:**

- **Stream** — broad theme grouping (e.g. Unified, Context-Aware, Observable). Derived from sources; don't force-match `roadmap.md` stream names, but note mismatches for the user to reconcile later.
- **Initiative** — the parent initiative this work item belongs to (e.g. MSS, Customer Knowledge Base, Routing).
- **Work Item** — the specific deliverable or feature (e.g. Dynamic prompts, CKB EAP). Aim for row-weight equality: group very small items together under a single work item rather than creating micro-rows.
- **Description** — one sentence. Problem-first: what user or business need does this address? No hype. If the work item name is self-explanatory, lead with why it matters.
- **Stage** — one of: `Discovery`, `Discovery → Build`, `Build`
- **CX Priority** — label from the CX source (e.g. P1 / P2 / P3, or a short quoted phrase). Use `—` if not present in sources.
- **Now / Next / Later** — relative timing within Q3. `Now` = in-flight or starting immediately; `Next` = second half of Q3; `Later` = end of Q3 or likely slipping to Q4.
- **Estimate** — rough effort (e.g. `~3 dev days`, `~1 sprint`, `~2 weeks`). Use `?` if unknown. Don't fabricate — only fill if a source gives signal.

---

## Conversational Pattern

### Phase 1 — Silent ingest

Read all inputs. Build a complete draft table internally. Do not present it yet.

Before showing the draft, ask **one framing question**:

> "Before I show you the draft — what's the one thing Q3 needs to be true by the end? I want to make sure the table reflects that, not just what's in the sources."

Use the answer to calibrate the Now/Next/Later column and to flag any items that don't connect to the stated goal.

---

### Phase 2 — Present the draft by Stream

Show the draft table grouped by Stream. For each Stream:
1. Show the rows
2. Ask one focused question: *"Does this grouping feel right? Anything missing, miscategorised, or that should be split/merged?"*

Work through Streams one at a time. Don't ask about every cell — only flag:
- Items where Stage is ambiguous
- Items where CX Priority is missing but probably known
- Items that feel too large or too small relative to other rows (row-weight problem)
- Items present in only one source (worth flagging — may be stale or missing context)

Accept corrections. Move on.

---

### Phase 3 — Now / Next / Later pass

After the Stream review, do one dedicated pass on timing:

> "Let me run through the Now / Next / Later assignments — these are the ones I'm less confident about. Tell me if any feel wrong."

List only the uncertain ones (not the whole table). Accept corrections.

---

### Phase 4 — Deferred / Not Q3

Ask:

> "Anything you want explicitly named as Not Q3 — things that were considered but deprioritised?"

Named and reasoned > silently absent. Add these to the Deferred section.

---

### Phase 5 — Final review and write

Reflect the full table back. Ask:
- "Happy with the Stream names? They don't need to match the roadmap yet — just checking they make sense here."
- "Any estimates you want to add or correct before I write the file?"

On approval, write `projects/core-coach/q3-priorities.md`.

---

## Row-Weight Principle

Rows should feel roughly equal in scope. If one row is "redesign the entire session history UI" and the next is "fix a button label", that's a problem. Rules:

- Group micro-items (< 1 dev day) into a single Work Item: "Minor polish: [x, y, z]"
- Split items that span multiple milestones into separate rows only if the milestones have meaningfully different CX Priority or Now/Next/Later values
- If in doubt, err toward fewer rows — easier to split later than to merge

---

## Output Format

```markdown
# Q3 Priorities — Coach Foundations

[2-sentence preamble: what Q3 is about + what this table represents]

*Last updated: YYYY-MM-DD*

---

## Priorities

| Stream | Initiative | Work Item | Description | Stage | CX Priority | Now / Next / Later | Estimate |
|---|---|---|---|---|---|---|---|
[rows grouped by Stream, with a blank row between each Stream block]

---

## Deferred / Not Q3

| Item | Reason |
|---|---|
[rows]
```

---

## Principles

- **Sources first, opinions second.** Synthesise what's in the inputs before adding judgment.
- **One sentence, problem-first.** Every description names the user or business need.
- **Named tradeoffs.** Deferred > absent.
- **Row-weight equality.** The table should scan evenly — no micro-rows next to mega-rows.
- **CX signal is a first-class column.** If something is a CX priority and it's buried in Later, that needs to be a conscious decision, not an accident.
- **Don't fabricate estimates.** `?` is honest. A made-up number is not.
