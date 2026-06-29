---
title: Coach | Unified Sessions | One-pager
created_date: 2026-03-18
status: draft
confluence_page_id: 6039667036
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6039667036/Coach+Unified+Sessions+One-pager"
last_synced: "2026-06-23T00:00:00.000Z"
---

# Description

A unified session layer that lets users access and resume Coach conversations anywhere across Culture Amp, and navigate between Coach-enabled pages without losing context — making Coach feel like one product.

## The Problem

**User Problem:**
- Session history is fragmented — opening General Coach doesn't show Engage or Perform Coach sessions
- Navigating between pages in the main panel or loading a previous session breaks the connection between the main panel and Coach panel content
- Coach feels like multiple disconnected tools, not one product

**Business Problem:**
- Fragmented sessions reduce return usage — users can't find previous conversations and start from scratch
- Inconsistent experience across Coach surfaces undermines trust and engagement

---

## Why This Proposal

**User Benefit:**
- **Continuity**: Users can pick up any Coach conversation from wherever they are in the platform
- **Coherence**: Navigating freely across Culture Amp feels seamless — the main and Coach panels stay in sync

**Business Benefit:**
- **Engagement**: Accessible session history increases return usage of Coach
- **50% MAU goal**: Reducing friction to repeat use is one of the highest-leverage moves toward the Q3 platform usage target

---

## Success Metrics

### Primary
- **Cross-Coach session visibility**: 100% of Coach sessions (General, Engage, Perform) visible in a single history view
- **Session history engagement**: X% of users resume a previous session within 30 days

### Secondary
- **Session coherence**: X% of users report that sessions persist in a coherent, understandable way

---

## Target Audience

All users of Coach across General, Engage, and Perform use cases.

---

## What

A unified session layer that:
1. Surfaces all Coach conversations — regardless of where they were started — in a single, accessible history view
2. Allows users to resume any session from anywhere across the platform
3. Preserves contextual integrity when navigating between pages — the Coach panel and active session survive site navigation

### What This Isn't
- Not a cross-agent routing solution (handled separately by the Routing initiative)
- Not a redesign of the Coach panel UI beyond session navigation

---

## How

### Phase 1: Unified Session History — GA release

**Goal:** Consolidate all Coach sessions into a single, discoverable history; establish session management foundations

**Milestones:**
- Single session history view live — all Coach sessions visible from one place, regardless of origin
- CZ test: validate history completeness, identify UX friction, confirm users can navigate to any previous session
- GA release

---

### Phase 2: Session Continuity & Site Navigation — CZ release

**Goal:** Define and ship an initial approach to Coach persisting as users navigate across Coach-enabled pages.

Q2 research established a mental model for session continuity — this phase moves from discovery into incremental delivery, building alignment with other Camps as we go. Navigation behaviour won't be a Coach decision alone: it depends heavily on what consuming pages support and how the emerging Unified Navigation initiative shapes platform-wide nav behaviour.

Two slices to work through:
- **Slice 1:** What happens when a user navigates to a page where Coach is also available?
- **Slice 2:** What happens when a user navigates to a page where Coach is not available?

**Release approach:** CZ only at this stage. The goal is to test a hypothesis and build alignment before proposing a wider rollout — the right answer here depends on open questions across Camps and Unified Navigation.

*Full milestones and exit criteria TBC pending alignment on the open questions below.*

---

## Open Questions

1. **Unified Navigation alignment:** How does Coach's navigation behaviour align with the emerging Unified Navigation initiative? What sequencing is needed?
2. **Camp alignment:** How do we build consensus with Camps that own consuming pages on what Coach persistence should look like in their context?
3. **Partial platform coverage:** Coach is not yet available everywhere. How do we handle the navigation experience in a world where some pages have Coach and others don't?

---

## Dependencies & Risks

**Dependencies:**
- Phase 2 is dependent on Unified Navigation initiative and alignment with consuming Camps — Coach cannot ship navigation behaviour unilaterally
- Routing initiative is a parallel dependency — session history must surface sessions from all agents

**Risks:**
- Phase 2 scope and timeline are contingent on the open questions above — there is a real risk of stalling without cross-Camp alignment
- Partial Coach coverage across the platform creates edge cases that are hard to handle gracefully