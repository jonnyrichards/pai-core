# PAI Improvements

<!-- Ideas, wishlists, repair notes. Edit in place by section. -->

## Feature Ideas

### Planning skill pipeline (built 2026-06-16)

Three skills that form a sequenced pipeline for quarterly product planning:

1. **`/quarterly-priorities`** — synthesis skill. Ingests multiple sources (Confluence, Slack canvas, JPD CSV, CX spreadsheet, local .md). Back-and-forth conversation to produce `projects/{product}/quarterly-priorities.md` — a Confluence-ready table with columns: Stream | Initiative | Work Item | Description | Stage | When? | Estimate. This is the **source of truth**.

2. **`/quarterly-roadmap`** — translation skill. Reads `quarterly-priorities.md` and adds the rendering layer: Start (Q3.x positions), Confidence, Deliverables (Work Items → card milestones), Drives. Lean — 2 rounds max. Outputs `projects/{product}/roadmap.md`. Lane summaries must be ≤60 chars (renderer constraint).

3. **`/roadmap-render`** — visualisation skill. Reads `roadmap.md`, outputs `roadmap.html`. No conversation. Run whenever you want to refresh the visual.

**Key design decisions:**
- `quarterly-priorities.md` is human-readable and Confluence-syncable via `/confluence-sync`
- `roadmap.md` is a derived artefact — regenerable from priorities, not independently maintained
- Description in roadmap.md = hover tooltip only (not shown on card face)
- Work Items in priorities = Deliverables on the card face in the renderer
- `/roadmap-create` still exists for blank-slate situations (no priorities doc)

**Confluence sync note:** Live Docs always return ADF on pull regardless of formatting style. Plain text cells survive the ADF→markdown conversion cleanly; native Confluence formatting (status lozenges, coloured cells) gets stripped. Treat Confluence as a push/share layer; edit locally and push.

## Bug Fixes

## Optimization Ideas

## Workflow Improvements

- **Auto-route observations**: When owner pastes an observation without specifying a file, infer the domain from content and write to the correct `observations.md`. Confirm with a single "→ domain/observations" line. Handles cross-domain by picking most relevant file. Triggers: message starts with "observation" or "O: {text}" shorthand. (added 2026-03-27, updated 2026-03-31)
- **Quarter close ritual**: At end of each quarter, sweep `shipped.md` + `[shipped]`-tagged observations across all projects and draft a look-back doc. Also check for slipped items and carry-forward risks. Trigger: "Q[N] retro", "look back", "what did we ship". (added 2026-03-31)
- **shipped.md per project**: Each work project has a `shipped.md` — one line per delivered feature/milestone with date. Append when something goes to prod. Use `[shipped]` tag in observations too for redundant discoverability. (added 2026-03-31)
