---
title: Beta Features | RFC
status: draft
author: Jonny Richards
date: 2026-05-12
confluence_page_id: 6233063880
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6233063880/Beta+Features+RFC"
last_synced: "2026-05-13T05:56:06.632Z"
---

## Background

Voice was the catalyst for this proposal. As the Coach team prepared to release Voice, a chain of requirements emerged: Legal needed a Beta clause in the General Terms to preserve pricing flexibility at renewal; Sales needed to be able to redline that clause when a customer objected; and Product needed a mechanism to honour a redlined clause in the product — a list of 'opt outs' that was add-able, as well as a toggle that gave manual control to an admin (Beta features are on / off)

The result is **Beta Features** — a platform-wide mechanism, governed by two LaunchDarkly segments, that determines whether any user is served Beta features. Voice is the first feature to sit behind it; more will hopefully follow.

A related [one-pager](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6128763265/Beta+Features+One-pager) covers the business rationale, GTM approach, and legal position. This RFC focuses on the technical implementation.

---

## Discussion

### What we're building

Beta Features is not a single flag. It is a dual-segment architecture in LaunchDarkly that gates any feature designated as "Beta." Each Beta feature will continue to have its own feature flag; what's new is that those flags will only serve when an account passes both segment checks.

**Segment 1 — Ineligible for Beta program**
Accounts that do *not* have a Beta clause in their contract (i.e. they redlined it). These accounts must never see Beta features, regardless of admin preference.

- Maintained manually by Support as part of account provisioning
- Longer term: ideally automated via Salesforce / PCQ as the source of truth
- Must exist in all three data regions: US, AU, EU (LaunchDarkly project per region)
- Ben K has already created a skeleton segment in Production US LD: *Ineligible for beta program (US)*

**Segment 2 — Excluded from Beta features**
Accounts that are contractually eligible but have chosen to opt out via the admin toggle in product.

- Always a superset of Segment 1 — LD's segment-of-segments feature handles this: Segment 2 includes a rule that pulls in all accounts from Segment 1 automatically
- Maintained via the admin toggle, which updates the segment via the LD API
- Ben K has created a skeleton segment in Production US LD: *Excluded from beta features (US)*

**How the segments interact**
A Beta feature flag serves when an account is **not** in either segment. In plain terms: the account has a Beta clause *and* has not opted out.

To discover which features are currently in Beta at any time, check the *Excluded from Beta features* segment page in the US LD project — the "used in x Flags" list shows every flag that references the segment.

### Fail behaviour

Security has requested that the LD flag **fail closed** — i.e. if LaunchDarkly is unavailable, Beta features should default to *off* rather than *on*. This aligns with the general guidance that AI features should default `false` in fallback.

Fail-open/fail-close (called "fallback" in LD) is set in code at the point where the flag is evaluated — it cannot be set centrally. Each Beta feature flag must be implemented with `fallback: false`. This is a point of engineering discipline, not a system constraint.

When a Beta feature graduates to GA, its flag should be removed, removing the default `false` fallback behaviour. (This is also a point of engineering discipline.)

### Source of truth for segment membership (open question)

Security (Bindi) also raised the question of whether there should be a source of truth for segment membership *outside* of LaunchDarkly — e.g. a corresponding field in Salesforce — so that LD can be reconciled against it if needed.

Ben K's current position is that maintaining a parallel source of truth adds overhead and the LD segments themselves are sufficient.

**Open question:** Do both segments (Ineligible for Beta program / Excluded from Beta features) need canonical records outside LD? If so, where (Salesforce PCQ, Product Provision Matrix, elsewhere) and who owns it?

### Admin toggle — the Features app

To allow eligible accounts to opt out (or back in), Coach Camp will build a new **Features app** in Account Settings.

- A single page surfaced in the Account Settings menu
- Contains one toggle - *Beta features — ON / OFF* - using an existing platform settings component
- Toggle language (per Ben K): `"Beta features: ON"` / `"To disable Beta features, switch the above toggle to off"`
- The toggle is only visible to account admins
- Accounts in Segment 1 (contractually ineligible) do not see the toggle — they cannot opt in
- The Features app's visibility is controlled by a direct Segment 1 lookup

**Open question — toggle ↔ LD API mechanism:** The current assumption is that the toggle calls the LaunchDarkly API directly to add or remove the account from Segment 2. This needs to be confirmed with Ben K / Engineering before implementation begins. If the LD API is not the right path, an alternative write mechanism (e.g. a backend service that syncs account state to LD) needs to be agreed

### Interim state

Until the Features app is built, eligible accounts that wish to opt out can do so by contacting Support. Support will manually add the account to Segment 2 in the relevant data region. Because segment membership is region-scoped, Support only needs to update the region the account actually exists in (US, AU, or EU). The UI will mirror this behaviour when built.

### Data regions

All three LD segments must be created in each of the three production LD projects (US, AU, EU). Ben K has created the skeleton segments in US. AU and EU segments still need to be created.

---

## Recommendation and Outcome

Adopt the dual-segment LD architecture as described above. The recommended sequencing:

1. **Now:** Create the remaining LD segments in AU and EU projects (mirrors what Ben K has done in US)
2. **Now–May 19 (Customer Zero):** Begin manually maintaining Segment 1 as part of provisioning; build the Features app (Coach); Unified Systems integrates the app into the Settings menu; update the Product Provision Matrix and Create Account flow
3. **By June 16 (100% Beta rollout):** Features app live; admin toggle functional; Segment 2 auto-maintained via toggle; all Beta feature flags implemented with `fallback: false`; fail-closed behaviour verified

The interim manual opt-out path via Support covers any gap between now and the Features app going live.

---

## Responsibilities

| Area | Task | Owner | Notes |
|------|------|-------|-------|
| **LD Segments** | Create Ineligible + Excluded segments in AU and EU LD projects | Coach (Jay/Jas) | US skeleton already created by Ben K |
| **LD Segments** | Maintain Segment 1 (Ineligible for Beta program) during provisioning | Support (Jared Ellis) | Manual until Salesforce/PCQ automation; all 3 regions |
| **Features app** | Build standalone Features app with Beta toggle component | Coach (Jay/Jas) | Single page, Account Settings; toggle calls LD API (TBC) |
| **Settings integration** | Add Features app to the Account Settings menu | Unified Systems (Ben K's team) | Coach builds the app; US surfaces it in the menu |
| **Provisioning** | Update Product Provision Matrix to reflect Beta Features as a provisioning item | Unified Systems | [Product Provision Matrix](https://cultureamp.atlassian.net/wiki/spaces/CS/pages/1310261567/Product+Provision+Matrix) |
| **Provisioning** | Update Form Assembly / Create Account flow to reflect Beta toggle | Support (Jared Ellis) | [Create Account flow](https://miro.com/app/board/o9J_l5cqP-w=/?moveToWidget=3074457362111162308&cot=10) |
| **Legal** | Finalise Beta clause for General Terms (all new deals and renewals) | Legal | In progress |
| **Engineering (all)** | Implement `fallback: false` on all Beta feature flags | Each feature team | Coach owns Voice flags; must be applied per-flag at implementation |
| **Source of truth** | Decide whether Segment 1 needs an external source of truth (e.g. Salesforce) | Jonny + Ben K + Bindi | Open question — TBC |

---

## Timeline

| Date | Milestone |
|------|-----------|
| Now | Resolve open questions: toggle ↔ LD API mechanism; source of truth for Segment 1 |
| Now | Create AU + EU LD segments |
| Now | Support begins manually maintaining Segment 1 during provisioning |
| May 19 | Customer Zero release — manual opt-out path via Support active |
| ~May 26 | Features app built (Coach); Settings integration done (Unified Systems) |
| ~Jun 2 | Admin toggle live; Segment 2 auto-maintained via toggle; Beta (10% rollout) begins |
| Jun 16 | 100% Beta rollout — full implementation complete, all flags with `fallback: false` |

---

## References

- [Beta Features One-pager](./beta-features-one-pager.md)
- [Product Provision Matrix](https://cultureamp.atlassian.net/wiki/spaces/CS/pages/1310261567/Product+Provision+Matrix)
- [Create Account flow (Miro)](https://miro.com/app/board/o9J_l5cqP-w=/?moveToWidget=3074457362111162308&cot=10)
- [Coach Voice Figma — Beta label designs](https://www.figma.com/design/7UcRC34Yh0cgLj7aBei4Ma/Coach-Voice?node-id=21-125485&t=CLntqFT8aVqIyQT1-1)
- [Beta Features one-pager Confluence](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6128763265/Beta+Features+One-pager)
- [Ben K's comment on Confluence (segments proposal)](https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6128763265/Beta+Features+One-pager?focusedCommentId=6218350926)