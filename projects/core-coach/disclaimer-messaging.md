---
title: Disclaimer Messaging — Coach
confluence_page_id: 6163234985
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6163234985/Disclaimer+Messaging+Coach"
last_synced: "2026-04-22T01:28:33.621Z"
---

# Disclaimer Messaging — Coach

**Status:** DECISION SIGNED OFF (Feb 2026)
**Priority:** Medium
**Next step:** Jay and Jonny to schedule implementation as Coach Core BAU

---

## Approved Disclaimer Line

```
Your chats are private and not shared with your organization. Coach can make mistakes, check responses.
```

Two links to be included inline:

- **"About Coach"** → https://support.cultureamp.com/en/collections/13853224-ai-coach
- **"Your privacy"** → https://www.cultureamp.com/company/legal/privacy-policy

(Option B — Legal's strong preference)

---

## Scope

Harmonise disclaimer messaging across **all Coach instances** with this single consistent line.

---

## Design Rationale

- Short and scannable without losing meaning
- Front-loads "private" assurance to lower user friction
- "Your organization" provides clear boundary
- Fallibility message with "check responses" mirrors market norms (Gemini, Claude)
- Retained "your chats" for clarity despite proximity to input label

---

## Engineering Context

- Single disclaimer line to be implemented across all Coach instances
- 2 links included: "About Coach" and "Your privacy" (URLs confirmed above)
- Both link targets are now confirmed — engineering can proceed

---

## Key Decision Notes

- **Angela** raised concern that using "private" may not be accurate if aggregated, de-identified Coach conversations are used for future advanced usage reporting
- After consultation with DB and Legal, decision made to proceed with "private" wording given current product state
- Angela and Bec are exploring a longer-term, unified approach to privacy and consent across Culture Amp (not per-product)

---

## Assets / References

- [Slack discussion with approved line](https://cultureamp.slack.com/archives/C08317P1LTW/p1768447365253549)
- [Figma with link options](https://www.figma.com/design/AjF68wrnnYZ0hV8z2GFVwq/Ally-s-playground?node-id=209-10719&p=f&t=PBzZ6XsQGfkZHy7Z-0)
- Decision documented in: `Knowledge/products/coach-interface-decisions.md`