---
name: roadmap-render
description: Renders the Coach H2 roadmap markdown file into a self-contained HTML visual for Confluence embedding. Trigger when the user asks to render, generate, refresh, or export the roadmap visual, or says "update the roadmap HTML".
---

# Roadmap Renderer

Converts `projects/core-coach/h2-roadmap.md` (the source of truth) into a self-contained HTML file ready for Confluence embedding.

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
node .claude/commands/roadmap-render/render.cjs [input-file] [output-file]
```

**Defaults:**
- Input:  `projects/core-coach/h2-roadmap.md`
- Output: `projects/core-coach/h2-roadmap.html` (same path as input, `.html` extension)

**Custom paths:**
```bash
node .claude/commands/roadmap-render/render.cjs projects/core-coach/h2-roadmap.md /tmp/roadmap-preview.html
```

## Workflow

1. Run the render command (above)
2. Confirm success output: `✅ Rendered N initiatives → <output-path>`
3. Tell the user where the HTML file was written
4. Optionally offer to open it in the browser: `open projects/core-coach/h2-roadmap.html`

## Visual Design

The renderer produces an Almanac-style timeline: a fixed-width (1600px) canvas with absolute
card positioning. Card width encodes duration; cards span quarter boundaries freely.

| Element | Detail |
|---|---|
| Canvas | 1600px wide, height auto-scales with lane row count |
| Background | Cream parchment (#f1e7d2) with subtle gradient |
| Quarters | Column headers (Q1–Q4) with dotted internal gridlines |
| Swim lanes | Variable height (based on `Row` count); labelled gutter left |
| Lane colors | Each lane has an accent ink color (assigned by position) |
| Card width | Encodes duration: Small=0.5q, Medium=1.0q, Large=2.0q |
| Card position | Absolute horizontal position from `Start` coordinate |
| Confidence — Committed | Full accent color fill, cream text, heavy border |
| Confidence — High confidence | 18% accent tint background, hairline border |
| Confidence — Early signal | Paper background, hairline border |
| Confidence — Hypothesis/Placeholder | Paper background, dotted border, italic title |
| Effort ticks | 5-tick indicator top-right of card (Small=2, Medium=3, Large=5) |
| Not in H2 | Rendered below canvas as a strikethrough list |

## Updating the Roadmap

The markdown file is the source of truth. To update the visual:
1. Edit `projects/core-coach/h2-roadmap.md`
2. Re-run this skill

The renderer re-parses from scratch on every run — no state between runs.

## Markdown Format Expected

Lane tables use this column format (no `Quarter` column — position is encoded in `Start`):

```markdown
| Initiative | Start | Row | Confidence | Effort | Drives | Description |
```

**`Start`** values: `Q3.0` through `Q3.5`, `Q4.0` through `Q4.5` (or `TBD`)
- Each quarter has 6 positions (step = ~2 weeks): `Q3.0`=start of Q3, `Q3.3`=mid Q3, `Q3.5`=late Q3
- `TBD` renders at Q4.0

**`Row`**: `0` or `1` — which sub-row within the lane (for concurrent items that would overlap)

**`Confidence`** values: `Committed`, `High confidence`, `Early signal`, `Hypothesis`, `Placeholder`

**`Effort`** values: `Small` (0.5q), `Medium` (1.0q), `Large` (2.0q)

The `Not in H2` table format is unchanged: `| Initiative | Reason |`
