# Almanac Roadmap Renderer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing grid-based roadmap renderer with an Almanac-style absolute-positioning layout where card width = duration, cards span quarter boundaries freely, and confidence is expressed through lane-ink treatments.

**Architecture:** The markdown file `h2-roadmap.md` is the single source of truth — its lane tables gain two new columns (`Start`, `Row`) and lose the `Quarter` column. The renderer `render.cjs` is rewritten to parse those columns, compute pixel positions from a continuous timeline axis, and emit self-contained HTML that recreates the Almanac visual language without React or external fonts. The `roadmap-create` skill gains a sequencing phase that produces the new column format.

**Tech Stack:** Node.js (CommonJS), vanilla HTML/CSS (no frameworks), markdown table parsing.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `projects/core-coach/h2-roadmap.md` | Modify | Source of truth — updated column format |
| `.claude/commands/roadmap-render/render.cjs` | Rewrite | Parser + HTML generator for Almanac layout |
| `.claude/commands/roadmap-render/SKILL.md` | Modify | Updated visual design description |
| `.claude/commands/roadmap-create/SKILL.md` | Modify | Add Phase 2.5 sequencing guidance + new column format |

---

## Coordinate System Reference

**Quarter index mapping:**
- Q1 → index 0, Q2 → index 1, Q3 → index 2, Q4 → index 3

**Start notation → float:**
- `Q3.0` → `2 + 0/6 = 2.000`
- `Q3.1` → `2 + 1/6 = 2.167`
- `Q3.2` → `2 + 2/6 = 2.333`
- `Q3.3` → `2 + 3/6 = 2.500`
- `Q3.4` → `2 + 4/6 = 2.667`
- `Q3.5` → `2 + 5/6 = 2.833`
- `Q4.0` → `3.000`, etc.
- `TBD` → `3.0` (placed in Q4 by convention)

**Effort → span (quarters):**
- Small → 0.5 (≈2 weeks)
- Medium → 1.0 (≈4 weeks)
- Large → 2.0 (≈8 weeks)

**Effort → ticks (out of 5):**
- Small → 2 ticks
- Medium → 3 ticks
- Large → 5 ticks

**Canvas geometry:**
```
ROADMAP_W = 1600px
ROADMAP_H = 900px   (auto-grows if lanes need more room)
PAD_X     = 56px
LABEL_W   = 196px
HEADER_H  = 124px
FOOTER_H  = 76px
TL_X      = PAD_X + LABEL_W  (= 252px, where timeline starts)
TL_W      = ROADMAP_W - TL_X - PAD_X
QW        = TL_W / 4  (pixels per quarter)
LANES_H   = ROADMAP_H - HEADER_H - FOOTER_H
SUBROW_H  = LANES_H / total_rows_across_all_lanes
CARD_H    = SUBROW_H - 16  (8px vpad top + bottom)
```

**Card pixel position:**
```
left   = TL_X + start * QW + 4
width  = span * QW - 8
top    = laneTop + row * SUBROW_H + 8
height = CARD_H
```

---

## Lane Color Palette

Six named colors — renderer assigns by lane position (index 0–5). The create skill documents these.

```js
const LANE_PALETTE = [
  '#8a4a2a',  // 0 — warm brown
  '#4a6a3a',  // 1 — forest green
  '#3a4e7a',  // 2 — slate blue
  '#6a3a5a',  // 3 — plum
  '#7a5a2a',  // 4 — ochre
  '#3a6a7a',  // 5 — teal
];
```

---

## Confidence Treatments

```js
const CONF_TREATMENT = {
  'Committed':       { kind: 'block',  fill: 'accent', text: 'cream', italic: false, tag: '★ committed'    },
  'High confidence': { kind: 'solid',  fill: 'tint',   text: 'ink',   italic: false, tag: '● high'         },
  'Early signal':    { kind: 'plain',  fill: 'paper',  text: 'ink',   italic: false, tag: '◇ early signal' },
  'Hypothesis':      { kind: 'dotted', fill: 'paper',  text: 'ink',   italic: true,  tag: '? hypothesis'   },
  'Placeholder':     { kind: 'dotted', fill: 'paper',  text: 'ink',   italic: true,  tag: '? placeholder'  },
};
```

Fill resolution:
- `accent` → lane's accent color (full fill, cream text)
- `tint` → `lane accent at 18% opacity over paper` — use `rgba` approximation in CSS
- `paper` → `#f1e7d2`

Border by kind:
- `block` → `1.8px solid #1a1410`
- `solid` → `1px solid #1a1410`
- `plain` → `1px solid #1a1410`
- `dotted` → `1.4px dotted #1a1410`

---

## Task 1: Update `h2-roadmap.md` — new column format

**Files:**
- Modify: `projects/core-coach/h2-roadmap.md`

Remove the `Quarter` column from both lane tables. Add `Start` and `Row` columns after `Initiative`. Assign reasonable start positions and row values based on the existing quarter assignments and dependencies described in the file.

Mapping rules:
- Q3 items that are `Committed` and first in the spine → `Q3.0`
- Subsequent Q3 items that could run concurrently → increment row or stagger start
- Q3/Q4 spanning items → start in Q3, span = 2.0 (Large) or suit effort
- Q4 items → `Q4.0` or later
- TBD → `Q4.0`, row 0
- `Not in H2` table keeps no position columns (it has no cards to render)

- [ ] **Step 1: Update The Spine table**

Replace:
```markdown
| Initiative | Quarter | Confidence | Effort | Drives | Description |
|---|---|---|---|---|---|---|
| Routing — MSS slice | Q3 | Committed | Medium | Engagement | Captures premium insights for our high-value leaders-of-scale and admin segment. Initial focus: retention insights. |
| Unified Sessions + Routing | Q3 | Committed | Medium | Reach | Consolidates Coach sessions into a single history view — making Coach feel like one product; solves navigation when Coach is open and lays the foundation for CA-wide Coach. |
| Page Fluency | Q3/Q4 | Early signal | Medium | Engagement | Makes Coach native to the page — aware of what's on screen, able to write directly into forms, and responsive to what the user is doing. Drives engagement by replacing copy-paste with in-page action. |
| CA-wide Coach | Q4 | High confidence | Medium | Reach | Extends Coach beyond its current pages to a persistent, platform-wide presence — increasing reach by putting Coach in front of users wherever they are in Culture Amp. |
```

With:
```markdown
| Initiative | Start | Row | Confidence | Effort | Drives | Description |
|---|---|---|---|---|---|---|
| Routing — MSS slice | Q3.0 | 0 | Committed | Medium | Engagement | Captures premium insights for our high-value leaders-of-scale and admin segment. Initial focus: retention insights. |
| Unified Sessions + Routing | Q3.0 | 1 | Committed | Medium | Reach | Consolidates Coach sessions into a single history view — making Coach feel like one product; solves navigation when Coach is open and lays the foundation for CA-wide Coach. |
| Page Fluency | Q3.3 | 0 | Early signal | Medium | Engagement | Makes Coach native to the page — aware of what's on screen, able to write directly into forms, and responsive to what the user is doing. Drives engagement by replacing copy-paste with in-page action. |
| CA-wide Coach | Q4.0 | 0 | High confidence | Medium | Reach | Extends Coach beyond its current pages to a persistent, platform-wide presence — increasing reach by putting Coach in front of users wherever they are in Culture Amp. |
```

- [ ] **Step 2: Update The Bets table**

Replace:
```markdown
| Initiative | Quarter | Confidence | Effort | Drives | Description |
|---|---|---|---|---|---|---|
| Improved Observability | Q3 | High confidence | Medium | Foundation | Builds the signal layer Coach currently lacks — understanding what users ask, how conversations resolve, and what they think. Creates new feedback channels and drives better product decisions. |
| Customer Knowledge Base | Q3/Q4 | Early signal | Medium | Engagement | Gives admins the ability to ground Coach in their organisation's values, priorities and frameworks — with the hypothesis that greater admin control drives internal advocacy and, in turn, usage. |
| Memory | Q4 | Hypothesis | Medium | Engagement | Gives Coach the ability to retain and build on what it knows about a user across sessions — making replies more personally relevant over time and increasing the reason to return. |
| Coach via MCP | Q4 | Early signal | Medium | Reach (off-platform) | Makes Coach — and CA data — accessible to other assistants via MCP, enabling customers to query CA externally with the safety of Coach as an interpretive layer. Drives reach by meeting users where they already work, off-platform. |
| Charts & Graphs | TBD | Placeholder | Medium | TBD | — |
| Extending Explainability | TBD | Placeholder | Medium | TBD | — |
```

With:
```markdown
| Initiative | Start | Row | Confidence | Effort | Drives | Description |
|---|---|---|---|---|---|---|
| Improved Observability | Q3.0 | 0 | High confidence | Medium | Foundation | Builds the signal layer Coach currently lacks — understanding what users ask, how conversations resolve, and what they think. Creates new feedback channels and drives better product decisions. |
| Customer Knowledge Base | Q3.3 | 0 | Early signal | Medium | Engagement | Gives admins the ability to ground Coach in their organisation's values, priorities and frameworks — with the hypothesis that greater admin control drives internal advocacy and, in turn, usage. |
| Memory | Q4.0 | 0 | Hypothesis | Medium | Engagement | Gives Coach the ability to retain and build on what it knows about a user across sessions — making replies more personally relevant over time and increasing the reason to return. |
| Coach via MCP | Q4.0 | 1 | Early signal | Medium | Reach (off-platform) | Makes Coach — and CA data — accessible to other assistants via MCP, enabling customers to query CA externally with the safety of Coach as an interpretive layer. Drives reach by meeting users where they already work, off-platform. |
| Charts & Graphs | Q4.0 | 0 | Placeholder | Medium | TBD | — |
| Extending Explainability | Q4.2 | 1 | Placeholder | Medium | TBD | — |
```

- [ ] **Step 3: Commit**

```bash
git add projects/core-coach/h2-roadmap.md
git commit -m "feat: update h2-roadmap to Almanac column format (Start, Row)"
```

---

## Task 2: Rewrite `render.cjs` — parser

**Files:**
- Rewrite: `.claude/commands/roadmap-render/render.cjs`

Write the new file top-to-bottom. Start with the parser only — no HTML yet. The parser must handle the new column format and produce a structured data object.

- [ ] **Step 1: Write the parser skeleton and `parseStart` function**

Replace the entire file with:

```js
#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ─── CLI Args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const inputFile  = args[0] || 'projects/core-coach/h2-roadmap.md';
const outputFile = args[1] || inputFile.replace(/\.md$/, '.html');

// ─── Coordinate helpers ──────────────────────────────────────────────────────

const QUARTER_INDEX = { Q1: 0, Q2: 1, Q3: 2, Q4: 3 };

// Parses "Q3.2" → 2.333, "Q4.0" → 3.0, "TBD" → 3.0
function parseStart(s) {
  if (!s || s.trim().toUpperCase() === 'TBD') return 3.0;
  const m = s.trim().match(/^(Q[1-4])\.([0-5])$/i);
  if (!m) return 3.0;
  const qi = QUARTER_INDEX[m[1].toUpperCase()];
  const step = parseInt(m[2], 10);
  return qi + step / 6;
}

const EFFORT_SPAN  = { Small: 0.5, Medium: 1.0, Large: 2.0 };
const EFFORT_TICKS = { Small: 2,   Medium: 3,   Large: 5   };

// ─── Markdown parser ─────────────────────────────────────────────────────────

function parseTable(lines) {
  const rows = lines.filter(l => l.includes('|') && !/^\|[-: |]+\|$/.test(l));
  if (rows.length < 2) return [];
  const headers = rows[0].split('|').map(h => h.trim()).filter(Boolean);
  return rows.slice(1).map(row => {
    const raw = row.split('|');
    const cells = raw.slice(1, raw[raw.length - 1].trim() === '' ? -1 : undefined);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cells[i] || '').trim(); });
    return obj;
  });
}

function extractSection(lines, heading) {
  const start = lines.findIndex(l => l.startsWith('## ') && l.includes(heading));
  if (start === -1) return [];
  const tableStart = lines.findIndex((l, i) => i > start && l.startsWith('|'));
  if (tableStart === -1) return [];
  const tableEnd = lines.findIndex((l, i) => i > tableStart && !l.startsWith('|') && l.trim() !== '');
  return parseTable(lines.slice(tableStart, tableEnd === -1 ? undefined : tableEnd));
}

function parseRoadmap(md) {
  const lines = md.split('\n');

  // Title: first # heading
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'Roadmap';

  // Subtitle: first non-empty paragraph after h1
  let subtitle = '';
  let pastH1 = false;
  for (const l of lines) {
    if (l.startsWith('# ')) { pastH1 = true; continue; }
    if (pastH1 && l.trim() && !l.startsWith('#') && !l.startsWith('---')) {
      subtitle = l.trim(); break;
    }
  }

  // Find all ## section headings (excluding known non-lane sections)
  const SKIP = ['Confidence key', 'Effort key', 'Not in H2'];
  const laneSections = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l.startsWith('## ') && !SKIP.some(s => l.includes(s)));

  const lanes = laneSections.map(({ l, i }, si) => {
    const heading = l.replace(/^##\s+/, '').trim();
    // Section body: from this heading to the next ## or end
    const nextSectionIdx = laneSections[si + 1] ? laneSections[si + 1].i : lines.length;
    const sectionLines = lines.slice(i, nextSectionIdx);
    const items = extractSection(sectionLines, heading.split(':')[0].trim());
    return { heading, items };
  });

  const notH2 = extractSection(lines, 'Not in H2');

  return { title, subtitle, lanes, notH2 };
}

// ─── Main (parser smoke-test) ─────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: input file not found: ${inputFile}`);
    process.exit(1);
  }
  const md = fs.readFileSync(inputFile, 'utf8');
  const data = parseRoadmap(md);
  console.log('Parsed lanes:', data.lanes.map(l => `${l.heading} (${l.items.length} items)`).join(', '));
  console.log('Not in H2:', data.notH2.length, 'items');
}

main();
```

- [ ] **Step 2: Run parser smoke-test**

```bash
cd /Users/jonathan.richards/code/jonny-pai
node .claude/commands/roadmap-render/render.cjs
```

Expected output (approximate):
```
Parsed lanes: The Spine: Path to CA-wide Coach (4 items), The Bets: Value-Add Initiatives (6 items)
Not in H2: 3 items
```

If you see `0 items` for any lane, the section heading matching is off — check that `extractSection` is being called with the correct substring from the `## ` heading.

---

## Task 3: Rewrite `render.cjs` — HTML generator

**Files:**
- Modify: `.claude/commands/roadmap-render/render.cjs`

Add the full HTML generation function. Replace the `main()` at the bottom to write output.

- [ ] **Step 1: Add constants and helpers after the parser section**

Insert after the `parseRoadmap` function, before `main()`:

```js
// ─── Visual constants ─────────────────────────────────────────────────────────

const ALMANAC = {
  paper:    '#f1e7d2',
  paper2:   '#ece1c8',
  ink:      '#1a1410',
  inkSoft:  'rgba(26,20,16,0.55)',
  inkFaint: 'rgba(26,20,16,0.18)',
};

const LANE_PALETTE = [
  '#8a4a2a',
  '#4a6a3a',
  '#3a4e7a',
  '#6a3a5a',
  '#7a5a2a',
  '#3a6a7a',
];

const CONF_TREATMENT = {
  'Committed':       { kind: 'block',  fill: 'accent', textClass: 'cream', italic: false, tag: '★ committed'    },
  'High confidence': { kind: 'solid',  fill: 'tint',   textClass: 'ink',   italic: false, tag: '● high'         },
  'Early signal':    { kind: 'plain',  fill: 'paper',  textClass: 'ink',   italic: false, tag: '◇ early signal' },
  'Hypothesis':      { kind: 'dotted', fill: 'paper',  textClass: 'ink',   italic: true,  tag: '? hypothesis'   },
  'Placeholder':     { kind: 'dotted', fill: 'paper',  textClass: 'ink',   italic: true,  tag: '? placeholder'  },
};

function escapeHtml(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Hex color at opacity over white — approximates color-mix for tint fill
function hexTint(hex, opacity) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  const paper = [241, 231, 210];
  const tr = Math.round(paper[0] + (r - paper[0]) * opacity);
  const tg = Math.round(paper[1] + (g - paper[1]) * opacity);
  const tb = Math.round(paper[2] + (b - paper[2]) * opacity);
  return `rgb(${tr},${tg},${tb})`;
}

function cardBg(treatment, accent) {
  if (treatment.fill === 'accent') return accent;
  if (treatment.fill === 'tint')   return hexTint(accent, 0.18);
  return 'transparent';
}

function cardBorder(treatment) {
  if (treatment.kind === 'block')  return `1.8px solid ${ALMANAC.ink}`;
  if (treatment.kind === 'dotted') return `1.4px dotted ${ALMANAC.ink}`;
  return `1px solid ${ALMANAC.ink}`;
}
```

- [ ] **Step 2: Add the `renderHtml` function**

Insert after the helpers, before `main()`:

```js
// ─── HTML generator ───────────────────────────────────────────────────────────

function renderHtml({ title, subtitle, lanes, notH2 }) {
  // Geometry
  const PAD_X   = 56;
  const LABEL_W = 196;
  const HEADER_H = 124;
  const FOOTER_H = 76;
  const ROADMAP_W = 1600;
  const TL_X = PAD_X + LABEL_W;
  const TL_W = ROADMAP_W - TL_X - PAD_X;
  const QW   = TL_W / 4;

  // Lane layout — derive rows per lane from max row index in items
  const laneRows = lanes.map(lane =>
    Math.max(1, ...lane.items.map(it => (parseInt(it.Row, 10) || 0) + 1))
  );
  const totalRows = laneRows.reduce((s, r) => s + r, 0);
  const LANES_H  = Math.max(600, totalRows * 100); // 100px min per sub-row
  const SUBROW_H = LANES_H / totalRows;
  const CARD_H   = SUBROW_H - 16;
  const ROADMAP_H = HEADER_H + LANES_H + FOOTER_H;

  // Lane top positions
  const laneTops = [];
  let cur = HEADER_H;
  for (const rows of laneRows) {
    laneTops.push(cur);
    cur += rows * SUBROW_H;
  }

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarterMonths = { Q1: 'Jan — Mar', Q2: 'Apr — Jun', Q3: 'Jul — Sep', Q4: 'Oct — Dec' };

  // ── Card HTML ──
  function cardHtml(item, accent) {
    const t = CONF_TREATMENT[item.Confidence] || CONF_TREATMENT['Placeholder'];
    const start = parseStart(item.Start);
    const effort = item.Effort || 'Medium';
    const span  = EFFORT_SPAN[effort]  || 1.0;
    const ticks = EFFORT_TICKS[effort] || 3;
    const row   = parseInt(item.Row, 10) || 0;

    const x = TL_X + start * QW + 4;
    const w = span * QW - 8;
    const y = row * SUBROW_H + 8;

    const bg     = cardBg(t, accent);
    const border = cardBorder(t);
    const textColor  = t.textClass === 'cream' ? ALMANAC.paper : ALMANAC.ink;
    const subColor   = t.textClass === 'cream' ? 'rgba(241,231,210,0.75)' : ALMANAC.inkSoft;
    const tickColor  = t.textClass === 'cream' ? ALMANAC.paper : ALMANAC.ink;
    const tickFaint  = t.textClass === 'cream' ? 'rgba(241,231,210,0.35)' : ALMANAC.inkFaint;
    const fontStyle  = t.italic ? 'italic' : 'normal';
    const fontWeight = t.kind === 'block' ? '600' : '500';

    // Effort ticks (5 marks)
    const ticksHtml = [1,2,3,4,5].map(n => {
      if (n <= ticks) {
        return `<div style="width:2px;height:9px;background:${tickColor};display:inline-block;margin-right:2px;"></div>`;
      } else {
        return `<div style="width:2px;height:9px;border-left:1px solid ${tickFaint};display:inline-block;margin-right:1px;margin-left:-1px;"></div>`;
      }
    }).join('');

    return `<div style="
      position:absolute;
      left:${x.toFixed(1)}px; top:${y.toFixed(1)}px;
      width:${w.toFixed(1)}px; height:${CARD_H.toFixed(1)}px;
      background:${bg}; border:${border};
      padding:8px 11px; box-sizing:border-box;
      display:flex; flex-direction:column; justify-content:space-between;
      overflow:hidden; color:${textColor};
    ">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div style="font-size:13px;line-height:1.15;font-weight:${fontWeight};font-style:${fontStyle};letter-spacing:-0.1px;color:${textColor};">
          ${escapeHtml(item.Initiative)}
        </div>
        <div style="display:flex;align-items:center;flex-shrink:0;margin-top:3px;">${ticksHtml}</div>
      </div>
      <div style="font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;color:${subColor};display:flex;justify-content:space-between;align-items:center;gap:8px;font-family:ui-monospace,monospace;">
        <span>${escapeHtml(item.Start || '')}</span>
        <span style="font-style:${t.kind === 'dotted' ? 'italic' : 'normal'};white-space:nowrap;">${t.tag}</span>
      </div>
    </div>`;
  }

  // ── Lane HTML ──
  function laneHtml(lane, li) {
    const accent   = LANE_PALETTE[li % LANE_PALETTE.length];
    const laneTop  = laneTops[li];
    const laneH    = laneRows[li] * SUBROW_H;
    const bandBg   = li % 2 === 0 ? 'rgba(180,140,80,0.08)' : 'transparent';

    // Quarter gridlines (3 internal)
    const gridlines = [1,2,3].map(i => `
      <div style="position:absolute;top:${laneTop + 4}px;height:${laneH - 8}px;left:${(TL_X + i * QW).toFixed(1)}px;border-left:1px dotted ${ALMANAC.inkFaint};"></div>
    `).join('');

    // Cards
    const cards = lane.items.map(it => {
      const row = parseInt(it.Row, 10) || 0;
      return `<div style="position:absolute;top:${(laneTop + row * SUBROW_H).toFixed(1)}px;left:0;width:${ROADMAP_W}px;height:${SUBROW_H}px;pointer-events:none;">
        ${cardHtml(it, accent)}
      </div>`;
    }).join('');

    // Lane label (left gutter)
    const nameParts = lane.heading.split(':');
    const laneName  = nameParts[0].trim();

    return `
      <div style="position:absolute;top:${laneTop}px;left:${PAD_X}px;right:${PAD_X}px;height:${laneH}px;background:${bandBg};"></div>
      <div style="position:absolute;top:${laneTop}px;left:${PAD_X}px;right:${PAD_X}px;border-top:0.5px solid ${ALMANAC.ink};"></div>
      <div style="position:absolute;top:${laneTop + 14}px;left:${PAD_X}px;width:${LABEL_W - 16}px;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${ALMANAC.inkSoft};font-family:ui-monospace,monospace;">
          <span style="color:${accent};font-weight:600;">§ ${toRoman(li + 1)}</span>
          <span style="margin-left:8px;">— ${laneRows[li]} ${laneRows[li] === 1 ? 'track' : 'tracks'}</span>
        </div>
        <div style="font-size:26px;line-height:1.05;margin-top:6px;letter-spacing:-0.4px;color:${accent};">
          ${escapeHtml(laneName)}
        </div>
      </div>
      ${gridlines}
      ${cards}
    `;
  }

  // ── Not in H2 ──
  function notH2Html() {
    if (!notH2.length) return '';
    const items = notH2.map(i => `
      <div style="padding:10px 16px;flex:1;min-width:180px;border-right:1px solid #f0f0f0;">
        <div style="font-weight:600;font-size:12px;color:#aaa;margin-bottom:3px;text-decoration:line-through;text-decoration-color:#ccc;">${escapeHtml(i.Initiative)}</div>
        <div style="font-size:11px;color:#bbb;line-height:1.45;">${escapeHtml(i.Reason)}</div>
      </div>`).join('');
    return `
      <div style="margin-top:24px;background:#fff;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
        <div style="padding:10px 16px;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;background:#f8f9fa;border-bottom:1px solid #e0e0e0;">Not in H2</div>
        <div style="display:flex;flex-wrap:wrap;">${items}</div>
      </div>`;
  }

  // ── Quarter heads ──
  const quarterHeads = quarters.map((q, i) => `
    <div style="position:absolute;left:${(i * QW).toFixed(1)}px;width:${QW.toFixed(1)}px;display:flex;align-items:baseline;gap:10px;padding:0 14px;">
      <span style="font-size:22px;font-style:italic;">${q}</span>
      <span style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${ALMANAC.inkSoft};font-family:ui-monospace,monospace;">${quarterMonths[q]}</span>
    </div>`).join('');

  const laneBlocks = lanes.map((lane, li) => laneHtml(lane, li)).join('');
  const lanesBottom = HEADER_H + LANES_H;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
    background: #e8e4dd;
    padding: 32px;
    color: ${ALMANAC.ink};
    -webkit-font-smoothing: antialiased;
  }
  .canvas-wrap { overflow-x: auto; }
</style>
</head>
<body>
<div class="canvas-wrap">
<div style="
  width:${ROADMAP_W}px; height:${ROADMAP_H}px; position:relative;
  background:${ALMANAC.paper};
  background-image:
    radial-gradient(circle at 18% 22%, rgba(120,80,30,0.05), transparent 45%),
    radial-gradient(circle at 82% 78%, rgba(80,40,10,0.06), transparent 50%);
">

  <!-- Masthead -->
  <div style="position:absolute;top:34px;left:${PAD_X}px;right:${PAD_X}px;display:flex;align-items:baseline;justify-content:space-between;gap:24px;">
    <div style="font-size:32px;line-height:1;letter-spacing:-0.4px;white-space:nowrap;">
      ${escapeHtml(title)}
    </div>
    <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${ALMANAC.inkSoft};text-align:right;white-space:nowrap;font-family:ui-monospace,monospace;">
      ${escapeHtml(subtitle)}
    </div>
  </div>

  <!-- Double rule -->
  <div style="position:absolute;top:80px;left:${PAD_X}px;right:${PAD_X}px;border-top:2px solid ${ALMANAC.ink};"></div>
  <div style="position:absolute;top:84px;left:${PAD_X}px;right:${PAD_X}px;border-top:0.5px solid ${ALMANAC.ink};"></div>

  <!-- Quarter heads -->
  <div style="position:absolute;top:90px;left:${TL_X}px;height:30px;">
    ${quarterHeads}
  </div>
  <div style="position:absolute;top:${HEADER_H - 4}px;left:${PAD_X}px;right:${PAD_X}px;border-top:0.5px solid ${ALMANAC.ink};"></div>

  <!-- Lanes -->
  ${laneBlocks}

  <!-- Bottom double rule -->
  <div style="position:absolute;top:${lanesBottom}px;left:${PAD_X}px;right:${PAD_X}px;border-top:0.5px solid ${ALMANAC.ink};"></div>
  <div style="position:absolute;top:${lanesBottom + 4}px;left:${PAD_X}px;right:${PAD_X}px;border-top:2px solid ${ALMANAC.ink};"></div>

  <!-- Footer legend -->
  <div style="position:absolute;bottom:18px;left:${PAD_X}px;right:${PAD_X}px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${ALMANAC.inkSoft};font-family:ui-monospace,monospace;">
    <div style="display:flex;gap:32px;align-items:flex-end;">
      <div>
        <div style="margin-bottom:6px;">Card width = duration</div>
        <div style="display:flex;align-items:center;gap:6px;">
          <div style="width:60px;height:14px;border:1px solid ${ALMANAC.ink};background:transparent;"></div>
          <span style="font-family:serif;text-transform:none;letter-spacing:0;font-size:11px;color:${ALMANAC.ink};">= span</span>
        </div>
      </div>
      <div>
        <div style="margin-bottom:6px;">Confidence</div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          ${Object.entries(CONF_TREATMENT).map(([key, t]) => {
            const sampleAccent = '#8a4a2a';
            const bg = cardBg(t, sampleAccent);
            const border = cardBorder(t);
            return `<div style="display:flex;align-items:center;gap:6px;">
              <div style="width:28px;height:16px;background:${bg};border:${border};"></div>
              <span style="font-family:serif;text-transform:none;letter-spacing:0;font-size:10px;color:${ALMANAC.ink};">${key}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
    <div style="text-align:right;font-style:italic;font-family:serif;text-transform:none;letter-spacing:0;font-size:12px;color:${ALMANAC.inkSoft};max-width:220px;line-height:1.3;">
      Each lane has its own ink.<br>Confidence sets how much ink shows.
    </div>
  </div>
</div>
</div>

${notH2Html()}

</body>
</html>`;
}

// Roman numerals helper
function toRoman(n) {
  const vals = [10,'X',9,'IX',5,'V',4,'IV',1,'I'];
  let r = '';
  for (let i = 0; i < vals.length; i += 2) {
    while (n >= vals[i]) { r += vals[i+1]; n -= vals[i]; }
  }
  return r;
}
```

- [ ] **Step 3: Replace `main()` to write HTML output**

Replace the existing `main()` function with:

```js
function main() {
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: input file not found: ${inputFile}`);
    process.exit(1);
  }
  const md = fs.readFileSync(inputFile, 'utf8');
  const data = parseRoadmap(md);
  const totalItems = data.lanes.reduce((s, l) => s + l.items.length, 0);
  const html = renderHtml(data);
  fs.writeFileSync(outputFile, html, 'utf8');
  console.log(`✅ Rendered ${totalItems} initiatives → ${outputFile}`);
}

main();
```

- [ ] **Step 4: Run the renderer end-to-end**

```bash
cd /Users/jonathan.richards/code/jonny-pai
node .claude/commands/roadmap-render/render.cjs
```

Expected:
```
✅ Rendered 10 initiatives → projects/core-coach/h2-roadmap.html
```

Then open in browser:
```bash
open projects/core-coach/h2-roadmap.html
```

Verify visually:
- Two swim lanes visible with names in left gutter
- Cards absolutely positioned, widths vary by effort (Medium cards wider than Small)
- Committed cards: full accent color fill
- High confidence cards: tinted background
- Early signal / Hypothesis: white background with hairline / dotted border
- Quarter gridlines visible as faint dotted verticals
- Page Fluency card (Start: Q3.3, Medium) visually straddles the Q3/Q4 boundary
- Not in H2 section below the canvas

- [ ] **Step 5: Commit**

```bash
git add .claude/commands/roadmap-render/render.cjs
git commit -m "feat: rewrite renderer with Almanac absolute-position layout"
```

---

## Task 4: Update `roadmap-render` SKILL.md

**Files:**
- Modify: `.claude/commands/roadmap-render/SKILL.md`

- [ ] **Step 1: Update the Visual Design table and Markdown Format section**

Replace the `## Visual Design` section:

```markdown
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
```

Replace the `## Markdown Format Expected` section:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add .claude/commands/roadmap-render/SKILL.md
git commit -m "docs: update roadmap-render skill to describe Almanac layout"
```

---

## Task 5: Update `roadmap-create` SKILL.md

**Files:**
- Modify: `.claude/commands/roadmap-create/SKILL.md`

- [ ] **Step 1: Add Phase 2.5 — Sequencing after the Phase 2 section**

Insert between `### Phase 2` and `### Phase 3` sections:

```markdown
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
```

- [ ] **Step 2: Update Phase 5 output format table**

Replace the Output Format table in `## Output Format` to show the new column set:

```markdown
```markdown
| Initiative | Start | Row | Confidence | Effort | Drives | Description |
```
```

And update the reference note below it:
```markdown
**Column reference:**
- `Start`: `Q3.0`–`Q3.5`, `Q4.0`–`Q4.5`, or `TBD` (no `Quarter` column — position encodes it)
- `Row`: `0` or `1` (sub-row within lane for concurrent items)
- `Confidence`, `Effort`, `Drives`, `Description`: unchanged from previous format
```

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/roadmap-create/SKILL.md
git commit -m "feat: add sequencing phase to roadmap-create skill (Start/Row columns)"
```

---

## Self-Review Notes

- `parseStart` handles `TBD` → `3.0` ✓
- `laneRows` derived dynamically from max row index in items — no hardcoded count ✓
- `ROADMAP_H` auto-scales with lane content ✓
- `cardHtml` positions cards relative to their lane's top via the wrapper div — confirmed `top` is `row * SUBROW_H + 8` within the lane, not absolute from canvas top ✓
- `toRoman` used for lane numerals in gutter ✓
- `CONF_TREATMENT` keys match the confidence strings in `h2-roadmap.md` exactly: `'Committed'`, `'High confidence'`, `'Early signal'`, `'Hypothesis'`, `'Placeholder'` ✓
- Not in H2 table has no `Start`/`Row` columns — parser uses `extractSection('Not in H2')` separately, so it won't break ✓
- `Quarter` column removed from lane tables in Task 1 — renderer no longer reads it ✓
