---
name: initiative-export
description: Generates a high-level initiative view from quarterly-priorities.md — one row per initiative, with a synthesised summary and why. Filtered to Committed initiatives by default. Output is projects/{product}/initiative-view.md. Trigger when the user says "initiative view", "initiative export", or "generate initiative summary".
---

# Initiative Export

Generates a concise, initiative-level summary from `quarterly-priorities.md`. This is a read-only export — the source file is never modified.

## What this produces

A single markdown file with three sections, in order:
1. A one-sentence tl;dr + main initiatives table (one row per initiative)
2. An **Out of Scope** table (from the `## Out of Scope` section of `quarterly-priorities.md`)
3. A **Q2 Achievements** table (from `projects/{product}/q2-recap.md`)

| Initiative | Stream | What it is | Why it matters | Status | People |
|---|---|---|---|---|---|

## Column definitions

- **Initiative** — name from quarterly-priorities.md
- **Stream** — stream from quarterly-priorities.md
- **What it is** — one sentence synthesised from the work items under this initiative. Describe what will be built or shipped, not the individual work items. Be specific.
- **Why it matters** — one sentence on the business or user value. Synthesise from the work item descriptions — the "so what". If the descriptions don't give enough signal, use the stream goal as context.
- **Status** — taken directly from the Confidence column. Where an initiative has mixed Confidence values across its work items, use the highest.
- **People** — union of all work item People values for this initiative, deduped, comma-separated. Use `—` if all work items have `—`.

## Inputs

- `projects/{product}/quarterly-priorities.md` — read silently; use for main initiatives table and Out of Scope section
- `projects/{product}/q2-recap.md` — read silently; append verbatim as the Q2 Achievements section
- Filter: include only initiatives where at least one work item has `Confidence = Committed`. Exclude pure `Discovery` initiatives unless the user explicitly asks to include them.

## Output

`projects/{product}/initiative-view.md`

---

## Execution pattern

This skill is non-conversational — no review rounds. Read, synthesise, write.

1. Read `quarterly-priorities.md` silently
2. Read `q2-recap.md` silently
3. Group work items by Initiative
4. For each initiative, synthesise What it is + Why it matters from the work item descriptions
5. Apply the Committed filter
6. Write the file with all three sections in order

If anything is genuinely ambiguous (e.g. an initiative name collision across streams), flag it in one line after writing — don't interrupt the flow.

---

## Output Format

```markdown
# {Quarter} — Initiative Summary: {Product}

{One-sentence tl;dr: what this quarter is moving toward and why it matters.}

*Generated from quarterly-priorities.md. Last updated: YYYY-MM-DD.*

---

| Initiative | Stream | What it is | Why it matters | Status | People |
|---|---|---|---|---|---|
[rows — no blank separator rows; bold the Initiative name in every row]

---

## Out of Scope

| Item | Reason |
|---|---|
[rows from the ## Out of Scope section of quarterly-priorities.md]

---

## Q2 Achievements

[table from q2-recap.md, reproduced verbatim]
```

---

## Synthesis principles

- **What it is** = compress the work items into one sentence about the initiative as a whole. Don't list the work items — describe the thing being built.
- **Why it matters** = extract the user or business value from the descriptions. Look for "so that", "making", "enabling", "reducing" language in the source. If it's not there, infer from the stream goal.
- **Don't fabricate.** If the descriptions don't support a strong "why", write a conservative one and flag it.
- **One sentence each.** No subclauses. No lists.

---

## Downstream

This file is a standalone export — it does not feed any other skill. It is safe to regenerate at any time without affecting `roadmap.md` or the render pipeline.
