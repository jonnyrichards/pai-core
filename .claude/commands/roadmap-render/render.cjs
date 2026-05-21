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
