---
title: Versioned Consent — Coach
confluence_page_id: 6013780157
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6013780157/Versioned+Consent+Coach"
last_synced: "2026-03-11T00:56:57.396Z"
---

# Versioned Consent — Coach

**Status:** Proposal
**Owner:** Jonny Richards
**Last updated:** 2026-03-11

---

## Proposal

Implement a single consent model with version tracking across Coach.

- Store the consent version each user has agreed to
- When new features require consent (e.g. Voice), increment the version and re-prompt
- **Existing users** are only re-prompted when they access the new feature — they are not blocked from existing Coach
- **New users** see the latest version upfront and must consent to use any Coach features

## Tradeoff

Consent is all-or-nothing. A user cannot opt into Coach while opting out of a specific feature (e.g. Voice).

This is accepted: the alternative (per-feature checkboxes) becomes unwieldy as Coach adds more features over time.

## Rationale

- Keeps consent simple and singular
- Scales to future features without reworking the consent model
- Minimises friction for existing users — no re-consent unless they use a new feature

---

## Design

**Approved consent line:**
> "Any responses submitted to Coach by text or voice will be processed in line with our Privacy Policy and Terms of Use."

*Agreed with Angela Scicluna (Legal) via Slack, 2026-03-11. Angela's initial suggestion used "Coach Voice" as a product name; Jonny proposed framing voice as an input mode rather than a separate product — Angela approved the revised wording.*

**Modal design notes:**
- The overall consent modal does not need to change — only the wording updates
- Open question: should we have a variant modal for returning users who are updating consent?
  - Intent: acknowledge they have consented before, but a new consent update is required
  - We may not need to explain the nature of the update — just signal it's a necessary re-consent
  - Possible label/framing: "Update Consent" rather than the first-time consent flow