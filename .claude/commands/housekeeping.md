Use this skill to perform PAI memory housekeeping. Trigger if the user says "housekeeping", "clean up memory", "prune memory", "archive old data", or similar maintenance requests. Also runs nightly via cron.

## 1. Garbage Collect Memory

Review and archive stale data per CLAUDE.md glacier rules. All glacier files must have YAML frontmatter (see CLAUDE.md for format). When appending to an existing glacier file, update its frontmatter (bump entries, extend date_range, update tags).

**Observations — archive by primary tag:**
- If any `observations.md` has >50 entries, group oldest entries by primary tag and move to `memory/glacier/{domain}/observations-{tag}.md`
- If `memory/pai-meta/self-observations.md` has >50 entries, group by primary tag → `memory/glacier/pai-meta/observations-{tag}.md`
- If a single tag file exceeds 50 entries, split by year: `observations-{tag}-{YYYY}.md`

**Calendar — archive by quarter:**
- If any `calendar.md` has events >2 weeks past, move to `memory/glacier/personal/calendar-{YYYY}-Q{N}.md`

**Other files — standard rules:**
- If any `action-items.md` has >10 completed items, move to `memory/glacier/{domain}/action-items-done.md`
- Scan all domain directories dynamically (don't assume which domains exist — check what's in `memory/`)
- If `memory/pai-meta/improvements.md` has >10 implemented items, move to `memory/glacier/pai-meta/improvements-done-{YYYY}.md`

## 2. Prune Hot Memory

Scan `memory/` for all `hot-memory.md` files. Each must stay under 50 lines.
Move excess detail to the appropriate observations.md files.

## 3. Lint Memory for Staleness

Scan all warm-tier memory files for claims that may have been contradicted or superseded by newer entries. This is a semantic check, not a format check.

**Process:**
- Read all `observations.md` and `brief.md` files
- Read all `shipped.md` files (ground truth for what has actually happened)
- Flag any brief section whose `<!-- last verified: YYYY-MM-DD -->` date is >90 days ago
- Flag any brief entry that contradicts a newer observation or shipped entry
- Flag any hot-memory item that appears to be resolved based on newer observations

**Output:** A short list of flagged items with the contradiction or stale date noted. Do not auto-delete — surface for the owner to review. Stale items confirmed as resolved should be removed from hot-memory/brief, and noted in self-observations.

## 3a. Brief Check

For each domain in `memory/work/`, check whether a `brief.md` exists.

- **If brief exists:** covered by lint step above.
- **If no brief exists and observations.md has ≥10 entries:** draft a `brief.md` for that domain by distilling the observations into stable themes. Use the same format as existing briefs (sections with `<!-- last verified -->` dates). Notify the owner that a draft brief was created.
- **If no brief exists and observations.md has <10 entries:** skip — not enough signal yet.

## 4. Run Condensation Check

Review `memory/pai-meta/patterns.md` against all `hot-memory.md` files:
- **Promote**: If a pattern is actively relevant (urgent, frequently referenced, or currently unfolding), add it to the appropriate `hot-memory.md`
- **Demote**: If a hot-memory item is resolved, historical, or no longer top-of-mind, remove it from hot-memory (keep it in patterns.md)
- This keeps hot-memory focused on what matters *right now* and patterns.md as the stable knowledge base

## 5. Update Domain Log Files

For each domain that had memory changes this session (new observations, archived items, lint fixes, condensation changes), append a dated entry to `memory/{domain}/log.md`. Create the file if it doesn't exist.

**Format:**
```markdown
---
type: log
title: {Domain} — Change Log
description: Changelog of memory updates for external consumers of this bundle
domain: {domain}
updated: YYYY-MM-DD
---

# {Domain} — Change Log

## YYYY-MM-DD
- <what changed and why — written for an external reader, not PAI's internal voice>
```

This is the OKF-facing changelog — written for someone consuming the bundle who wants to know what changed, not PAI's internal observations. Keep entries factual and brief.

## 6. Sync Notes

If a notes vault is configured (`PAI_NOTES_VAULT` env var), run the `/sync-notes` skill — scans vault for new entries, syncs into PAI memory. Skip if not configured.

## 7. Sync Calendar

Run the `/sync-calendar` skill — pulls gcalcli agenda, updates `memory/personal/calendar.md`, flags prep needs. Skips automatically if gcalcli is not installed.

## 8. Surface Opportunities & Accountability

Scan all domain directories for `action-items.md` files. For each:
- **Stale items** (open >2 weeks): List with age and a suggested next action

Be direct. Don't just report — recommend specific actions.

## 9. Rebuild Glacier Index

Scan all `memory/glacier/**/*.md` files. For each file, extract the YAML frontmatter fields (type, domain, tags, date_range, entries, summary). Write the results as a markdown table to `memory/glacier/index.md`:

```
# Glacier Index
<!-- Auto-generated by housekeeping. Do not edit. -->
<!-- Last updated: YYYY-MM-DD -->

| File | Domain | Type | Tags | Date Range | Entries | Summary |
|------|--------|------|------|------------|---------|---------|
| path/relative/to/glacier.md | domain | type | tag1, tag2 | YYYY-MM to YYYY-MM | N | one-line summary |
```

Sort rows alphabetically by file path. Update the "Last updated" date.

## 10. Rebuild Link Index

Scan all memory files (excluding glacier/) for [[wiki-links]].
Rewrite `memory/link-index.md`:

```
# Memory Link Index
<!-- Auto-generated by housekeeping. Do not edit. -->
<!-- Last updated: YYYY-MM-DD -->

## target/file
- From [[source/file]]: "context snippet"
```

Sort sections alphabetically. Only include active memory files (not glacier/).

## 10. Compose Debrief

Summarize everything done:
- What was archived/pruned
- Upcoming events flagged
- Any action items surfaced

Keep it concise but informative.
