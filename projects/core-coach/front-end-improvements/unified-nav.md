---
title: Unified Nav — Coach
confluence_page_id: 6022234139
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6022234139/Unified+Nav+Coach"
last_synced: "2026-03-12T02:19:51.421Z"
---

# Unified Nav — Coach

**Driver:** Unified Systems
**Dependency:** Coach

---

## Overview

The Unified Nav team requires each product team to specify which items appear in the secondary nav when a user clicks their product in the primary nav. We need to provide this list for Coach.

[Note: no secondary nav is a valid option — tapping the primary nav item would go straight to General Coach.]

---

## What

### Product Discovery Sprint

**Output:** Secondary nav list, broken down by user type:

- **All users** — e.g. New chat, Previous 5 sessions [Product to confirm]
- **Admin only** — e.g. All of the above + Settings, Usage

### Coach Engineering

- Update the existing Coach package to remove Coach from the Settings nav (this will be handled by the new Unified Nav admin area)
- Coach team to attempt KV3 migration in Q1 to reduce mission team workload

---

## How

- Unified Systems is building the new API in the Coach repo — will require Coach team input (domain knowledge + PR reviews)
- Coach updates its package to remove the existing Coach entry in the Settings nav for admins

---

## Notes

- Small scope. Estimate: 2-3 days development x 1 engineer. More of a BAU item than an initiative.