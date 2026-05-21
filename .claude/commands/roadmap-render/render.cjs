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
  if (treatment.kind === 'dotted') return `1px dashed rgba(26,20,16,0.45)`;
  return `1px solid ${ALMANAC.ink}`;
}

// ─── Row packing ─────────────────────────────────────────────────────────────
// Greedy interval packing: assign each item the first row where it doesn't
// overlap any already-placed item. Items are sorted by start time first.
// Returns an array of row indices parallel to the input items array.
function packRows(items) {
  // Build sortable list with computed start + span
  const sorted = items.map((it, idx) => ({
    idx,
    start: parseStart(it.Start),
    span:  EFFORT_SPAN[it.Effort] || 1.0,
  })).sort((a, b) => a.start - b.start);

  const rowEnds = []; // rowEnds[r] = earliest time row r is free again
  const result  = new Array(items.length);

  for (const { idx, start, span } of sorted) {
    const end = start + span;
    // Find first row that's free at `start`
    let row = rowEnds.findIndex(e => e <= start);
    if (row === -1) row = rowEnds.length; // need a new row
    rowEnds[row] = end;
    result[idx] = row;
  }

  return result;
}

// ─── HTML generator ───────────────────────────────────────────────────────────

function renderHtml({ title, subtitle, lanes, notH2 }) {
  const PAD_X   = 56;
  const LABEL_W = 196;
  const HEADER_H = 124;
  const FOOTER_H = 76;
  const ROADMAP_W = 1600;
  const TL_X = PAD_X + LABEL_W;
  const TL_W = ROADMAP_W - TL_X - PAD_X;

  // ── Dynamic quarter range ──────────────────────────────────────────────────
  // Detect which quarters are actually used and only render those columns.
  const ALL_QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarterMonths = { Q1: 'Jan — Mar', Q2: 'Apr — Jun', Q3: 'Jul — Sep', Q4: 'Oct — Dec' };

  const allItems = lanes.flatMap(l => l.items);
  let minQ = 3, maxQ = 3; // default to Q4 if no items
  for (const it of allItems) {
    const s = parseStart(it.Start);
    const e = s + (EFFORT_SPAN[it.Effort] || 1.0);
    minQ = Math.min(minQ, Math.floor(s));
    maxQ = Math.max(maxQ, Math.ceil(e) - 1);
  }
  minQ = Math.max(0, minQ);
  maxQ = Math.min(3, maxQ);
  const quarters = ALL_QUARTERS.slice(minQ, maxQ + 1);
  const numQ = quarters.length;
  const QW = TL_W / numQ;

  // ── Auto row packing per lane ──────────────────────────────────────────────
  const laneRowAssignments = lanes.map(lane => packRows(lane.items));
  const laneRows = laneRowAssignments.map(rows =>
    rows.length === 0 ? 1 : Math.max(...rows) + 1
  );

  const totalRows = laneRows.reduce((s, r) => s + r, 0);
  const LANES_H  = Math.max(600, totalRows * 100);
  const SUBROW_H = LANES_H / totalRows;
  const CARD_H   = SUBROW_H - 16;
  const ROADMAP_H = HEADER_H + LANES_H + FOOTER_H;

  const laneTops = [];
  let cur = HEADER_H;
  for (const rows of laneRows) {
    laneTops.push(cur);
    cur += rows * SUBROW_H;
  }

  function cardHtml(item, accent) {
    const t = CONF_TREATMENT[item.Confidence] || CONF_TREATMENT['Placeholder'];
    const start = parseStart(item.Start) - minQ; // offset to visible range
    const effort = item.Effort || 'Medium';
    const span  = EFFORT_SPAN[effort]  || 1.0;
    const ticks = EFFORT_TICKS[effort] || 3;

    const x = TL_X + start * QW + 4;
    const w = span * QW - 8;
    const y = 8;

    const bg     = cardBg(t, accent);
    const border = cardBorder(t);
    const textColor  = t.textClass === 'cream' ? ALMANAC.paper : ALMANAC.ink;
    const subColor   = t.textClass === 'cream' ? 'rgba(241,231,210,0.75)' : ALMANAC.inkSoft;
    const tickColor  = t.textClass === 'cream' ? ALMANAC.paper : ALMANAC.ink;
    const tickFaint  = t.textClass === 'cream' ? 'rgba(241,231,210,0.35)' : ALMANAC.inkFaint;
    const fontStyle  = t.italic ? 'italic' : 'normal';
    const fontWeight = t.kind === 'block' ? '600' : '500';

    const ticksHtml = [1,2,3,4,5].map(n => {
      if (n <= ticks) {
        return `<div style="width:2px;height:9px;background:${tickColor};display:inline-block;margin-right:2px;"></div>`;
      } else {
        return `<div style="width:2px;height:9px;border-left:1px solid ${tickFaint};display:inline-block;margin-right:1px;margin-left:-1px;"></div>`;
      }
    }).join('');

    const desc = item.Description && item.Description !== '—' ? escapeHtml(item.Description) : '';
    const tooltipHtml = desc
      ? `<div class="tooltip">${desc}</div>`
      : '';

    return `<div class="card-wrap" style="position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${w.toFixed(1)}px;height:${CARD_H.toFixed(1)}px;">
      ${tooltipHtml}
      <div style="
        width:100%; height:100%;
        background:${bg}; border:${border};
        padding:8px 11px; box-sizing:border-box;
        display:flex; flex-direction:column; justify-content:space-between;
        overflow:hidden; color:${textColor}; cursor:default;
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
      </div>
    </div>`;
  }

  function laneHtml(lane, li) {
    const accent      = LANE_PALETTE[li % LANE_PALETTE.length];
    const laneTop     = laneTops[li];
    const laneH       = laneRows[li] * SUBROW_H;
    const bandBg      = li % 2 === 0 ? 'rgba(180,140,80,0.08)' : 'transparent';
    const rowAssign   = laneRowAssignments[li];

    // Gridlines between visible quarters only
    const gridlines = Array.from({ length: numQ - 1 }, (_, i) => `
      <div style="position:absolute;top:${laneTop + 4}px;height:${laneH - 8}px;left:${(TL_X + (i + 1) * QW).toFixed(1)}px;border-left:1px dotted ${ALMANAC.inkFaint};"></div>
    `).join('');

    const cards = lane.items.map((it, idx) => {
      const row = rowAssign[idx];
      return `<div style="position:absolute;top:${(laneTop + row * SUBROW_H).toFixed(1)}px;left:0;width:${ROADMAP_W}px;height:${SUBROW_H}px;">
        ${cardHtml(it, accent)}
      </div>`;
    }).join('');

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

  function notH2Html() {
    if (!notH2.length) return '';
    const items = notH2.map(i => `
      <div style="padding:10px 16px;flex:1;min-width:180px;border-right:1px solid #f0f0f0;">
        <div style="font-weight:600;font-size:12px;color:#aaa;margin-bottom:3px;text-decoration:line-through;text-decoration-color:#ccc;">${escapeHtml(i.Initiative)}</div>
        <div style="font-size:11px;color:#bbb;line-height:1.45;">${escapeHtml(i.Reason)}</div>
      </div>`).join('');
    return `
      <div style="margin-top:24px;width:${ROADMAP_W}px;background:#fff;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
        <div style="padding:10px 16px;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;background:#f8f9fa;border-bottom:1px solid #e0e0e0;">Not in H2</div>
        <div style="display:flex;flex-wrap:wrap;">${items}</div>
      </div>`;
  }

  const quarterHeads = quarters.map((q, i) => `
    <div style="position:absolute;left:${(i * QW).toFixed(1)}px;width:${QW.toFixed(1)}px;display:flex;align-items:baseline;gap:10px;padding:0 14px;">
      <span style="font-size:22px;font-style:italic;">${q}</span>
      <span style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${ALMANAC.inkSoft};font-family:ui-monospace,monospace;">${quarterMonths[q] || ''}</span>
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

  .card-wrap { position: absolute; }
  .card-wrap .tooltip {
    display: none;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    width: 260px;
    background: ${ALMANAC.ink};
    color: ${ALMANAC.paper};
    font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
    font-size: 12px;
    line-height: 1.5;
    padding: 10px 13px;
    border-radius: 4px;
    pointer-events: none;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  }
  .card-wrap .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 18px;
    border: 6px solid transparent;
    border-top-color: ${ALMANAC.ink};
  }
  .card-wrap:hover .tooltip { display: block; }
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
        </div>
      </div>
      <div>
        <div style="margin-bottom:6px;">Confidence</div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          ${[
            { key: 'Committed',       id: 'Committed'       },
            { key: 'High confidence', id: 'High confidence' },
            { key: 'Early signal',    id: 'Early signal'    },
            { key: 'Hypothesis / Placeholder', id: 'Hypothesis' },
          ].map(({ key, id }) => {
            const t = CONF_TREATMENT[id];
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

// ─── Main ─────────────────────────────────────────────────────────────────────

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
