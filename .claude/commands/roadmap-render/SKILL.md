---
name: roadmap-render
description: Renders a roadmap markdown file into a self-contained HTML visual for Confluence embedding. Trigger when the user asks to render, generate, refresh, or export the roadmap visual, or says "update the roadmap HTML".
---

# Roadmap Renderer

Converts a roadmap markdown file (default: `projects/roadmap.md`) into a self-contained HTML file ready for Confluence embedding.

> **For future agents:** If you need to understand the geometry or modify the renderer, read `.claude/commands/roadmap-render/render.cjs` top-to-bottom. Key sections:
> - `parseStart()` — how `Q3.2` notation converts to a float coordinate
> - `packRows()` — greedy interval packing that assigns cards to rows without overlap
> - `renderHtml()` — dynamic quarter range detection, canvas geometry constants, card/lane positioning
> - `cardHtml()` — confidence treatments, effort ticks, tooltip injection

## When to Use

Trigger this skill when the user says:
- "render the roadmap"
- "generate the roadmap HTML"
- "refresh the roadmap visual"
- "export the roadmap"
- "update the roadmap HTML"

## Usage

Run the renderer script from the repo root:

```bash
node .claude/commands/roadmap-render/render.cjs [input-file] [output-file] [--png]
```

**Defaults:**
- Input:  `projects/roadmap.md`
- Output: `projects/roadmap.html` (same path as input, `.html` extension)

**Export PNG** (for Confluence embedding — requires Chrome):
```bash
node .claude/commands/roadmap-render/render.cjs --png
```
Outputs a `@2x` PNG alongside the HTML (e.g. `h2-roadmap.png`). Uses the local Chrome install via `puppeteer-core`.

**Custom paths:**
```bash
node .claude/commands/roadmap-render/render.cjs projects/roadmap.md /tmp/roadmap-preview.html
```

## Workflow

1. Run the render command (above)
2. Confirm success output: `✅ Rendered N initiatives → <output-path>`
3. Tell the user where the HTML file was written
4. Optionally offer to open it in the browser: `open projects/core-coach/roadmap.html`
5. If the user wants to embed in Confluence, use `--png` and upload the PNG as an image

## Visual Design

The renderer produces an Almanac-style timeline: a fixed-width (1600px) canvas with absolute
card positioning. Card width encodes duration; cards span quarter boundaries freely.

| Element | Detail |
|---|---|
| Canvas | 1600px wide, height auto-scales with lane row count |
| Background | Cream parchment (#f1e7d2) with subtle gradient |
| Quarters | Column headers (Q1–Q4) with dotted internal gridlines |
| Swim lanes | Variable height (auto-scaled by row count); labelled gutter left |
| Lane colors | Each lane has an accent ink color (assigned by position) |
| Card width | Encodes duration: Small=0.5q, Medium=1.0q, Large=2.0q |
| Card position | Absolute horizontal position from `Start` coordinate |
| Confidence — Committed | Full accent color fill, cream text, heavy border |
| Confidence — High confidence | 18% accent tint background, hairline border |
| Confidence — Early signal | Paper background, hairline border |
| Confidence — Discovery | Paper background, dotted border |
| Card width | Encodes duration: Small=1/6q (~2 weeks), Medium=2/6q (~1 month), Large=4/6q (~8 weeks) |
| Not in scope | Rendered below canvas as a strikethrough list |

## Updating the Roadmap

The markdown file is the source of truth. To update the visual:
1. Edit `projects/roadmap.md`
2. Re-run this skill

The renderer re-parses from scratch on every run — no state between runs.

## Markdown Format Expected

Lane tables use this column format:

```markdown
| Initiative | Start | Confidence | Effort | Drives | Deliverables | WorkItems | People |
```

**`Start`** values: `Q3.0` through `Q3.5`, `Q4.0` through `Q4.5` (or `TBD`)
- Each quarter has 6 positions (~2 weeks each): `Q3.0`=start of Q3, `Q3.3`=mid Q3, `Q3.5`=late Q3
- `TBD` renders at Q4.0
- The renderer auto-detects the earliest/latest quarters used and only renders those columns

**Row assignment** is fully automatic — greedy interval packing per lane, no `Row` column needed.

**`Confidence`** values: `Committed`, `High confidence`, `Early signal`, `Discovery`

**`Effort`** values: `Small` (~2 weeks, 1/6q), `Medium` (~1 month, 2/6q), `Large` (~8 weeks, 4/6q)

**`Deliverables`** (optional): `>`-separated milestones shown below the card title, e.g. `First milestone > Second milestone`. Use `—` to leave blank. (Pipes can't be used inside markdown table cells.)

**`WorkItems`** (optional): `;;`-separated `Work Item: Description` pairs pulled from `quarterly-priorities.md`. Shown as a bulleted list in the hover tooltip, e.g. `Cross-agent routing: Removes the seam between Coach contexts ;; Full agent handoff: Completes the handoff UX`. Use `—` to leave blank. Note: use `;;` not `|` — pipes are reserved as markdown table column separators.

**`People`** (optional): comma-separated names shown on the card below deliverables, e.g. `Alice, Bob`. Use `—` to leave blank. 2–3 names max.

The `Not in scope` table format is unchanged: `| Initiative | Reason |`
