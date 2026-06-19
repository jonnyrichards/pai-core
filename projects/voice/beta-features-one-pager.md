---
title: Beta Features | One-pager
status: draft
confluence_page_id: 6128763265
confluence_url: 
last_synced: "2026-04-24T06:38:22.347Z"
---

## What is this?

A proposal to introduce a **Beta Features prerequisite flag and admin toggle** at the platform level — giving customers early access to new features before General Availability, while enabling Culture Amp to ship quickly, gather feedback, retain pricing flexibility, and maintain provisioning rigour through a new Beta clause in our General Terms.

---

## The Problem

Voice was the catalyst. As we prepared for release, we needed commercial flexibility — specifically, the ability to price Voice differently at renewal without creating a hard commitment today. Beta emerged as the solution.

That triggered a chain of requirements:

- **Legal** needed a Beta clause in General Terms to enforce that flexibility
- **Sales** needed to be able to redline the clause when a customer objected
- **Product** needed a mechanism to honour a redlined clause — a toggle that reflects contractual opt-outs in the product, with no manual follow-up required

---

## Why

### User Benefits

- Beta features give early adopters access to the latest product innovations before General Availability
- The Beta label sets honest expectations: real and useful, but subject to change — that transparency builds trust rather than eroding it

### Business Benefits

- **Voice needs to ship fast** — it's a competitive necessity, and the team is ready. We need the legal and product infrastructure to support that timeline
- **Beta framing preserves pricing flexibility** — labelling Voice (and future early-stage features) as "Beta" signals that pricing may change at renewal, without creating a hard commercial commitment today
- **A clean opt-out path unblocks deals** — a self-serve admin toggle means Sales can say "yes, you can switch it off" with confidence
- **Builds a repeatable capability** — Voice is the first beta feature; it won't be the last

---

## Success Metrics

**Primary:** Zero deals stalling because of the beta clause — Sales and Legal can confidently redline it, with the product toggle as the implementation mechanism.

**Secondary:** Product can ship new beta features faster to interested accounts; admins retain control to turn off at any time.

---

## What

**Beta Features** is a new platform-wide prerequisite flag — a meta-control that governs access to all features designated as "Beta."

- **Enabled by default** for all customers — optimising for learning and adoption while allowing admins to retain control
- **Admin-controlled** — any account admin can switch it off at any time via platform-wide settings
- **Baked into account provisioning** — reflected in the Product Provision Matrix and the Create Account flow, so opt-out is captured at setup rather than managed reactively
- **Platform-wide scope** — the toggle lives in platform settings, not scoped to Coach alone; any product team can release under the Beta label
- **Not EAP** — this is not opt-in, not granular per-feature control. It's a single meta flag that enables all Beta features. Initial design principle: keep it simple, optimise for learning, iterate as needed

### What makes a feature a "Beta" feature?

A Beta feature is one that:

- Is early-stage — released prior to General Availability
- Carries no guarantee it stays in the product in its current form
- May be subject to pricing changes at renewal
- Is shaped by feedback from users during the beta period

Many of these features will be AI-powered, though the Beta designation is not exclusive to AI.

---

## How

The implementation spans four steps:

1. **Add Beta clause to General Terms** — Legal drafts and finalises the clause for all new deals and renewals (in progress)
2. **Create prerequisite flag, add Voice** — Engineer a platform-level Beta flag; Voice feature flags are the first to sit behind it
3. **Add Beta Features toggle to platform settings** — Coach team builds the admin toggle in platform-wide settings (not scoped to Coach); designs for the Beta label in Voice already exist ([Figma](https://www.figma.com/design/7UcRC34Yh0cgLj7aBei4Ma/Coach-Voice?node-id=21-125485&t=CLntqFT8aVqIyQT1-1)); admin toggle designs TBD
4. **Update provisioning flow** — Unified Systems updates the Product Provision Matrix and Form Assembly / Create Account flow to reflect the new toggle

Unified Systems, Legal, Data Intelligence, and Coach are all aligned on this approach.

---

## Legal Position

The beta clause will be included in all new deals and renewals. Near-term exposure exists for customers on static or own-paper agreements until their renewal cycle closes the gap — Legal and Product have accepted this risk as low and manageable.

| Segment | Agreement Type | Beta Clause Coverage |
| --- | --- | --- |
| **Subset A** | Online terms | Automatic — rolls onto new GT version |
| **Subset B** | Static enterprise terms | New/renewal deals only; redlines accepted |
| **Subset C** | Own paper | Out of scope for now; future negotiation |

---

## GTM

**Key principle:** The beta clause is not a deal blocker. Legal will not hold firm if a customer redlines it — and the product toggle means a redlined clause is honoured automatically.

### Sales Talk Track

- Early access to new features before General Availability
- No guarantee the feature stays in its current form
- Pricing may change at renewal
- Feedback from beta users shapes the final product
- Customers can switch off beta features at any time via platform-wide admin settings