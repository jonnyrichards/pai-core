---
title: Pendo Feedback Summary — AI Comment Summaries & Coach (Jul 2024 – Apr 2026)
confluence_page_id: 6313050756
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6313050756/Pendo+Feedback+Summary+AI+Comment+Summaries+Coach+Jul+2024+Apr+2026"
last_synced: "2026-06-10T06:19:40.178Z"
---

# Pendo Feedback Summary — AI Comment Summaries & Coach (Jul 2024 – Apr 2026)

*Based on 144 Pendo feedback entries. 9 mention Coach directly; the vast majority concern AI Comment Summaries.*

---

## The Headline Finding

The most striking signal in this dataset is the **dominance of comment summary feedback**. Of 144 entries spanning nearly two years, the overwhelming majority are about AI comment analysis — not Coach conversations, not Perform features, not General Coach. This makes AI Comment Summaries the single biggest feedback category in Pendo by a wide margin, and suggests it is a more acutely felt pain point than Coach usage overall.

The low volume of Coach-specific feedback this year (9 entries) may reflect improved satisfaction — or simply lower adoption and visibility. The comment summary signal, by contrast, has been consistent and is still appearing in 2026.

---

## Key Themes

### 1. Comment Coverage is Too Narrow (most recurring, and still live)

The most technically specific and business-critical complaint: **AI comment analysis only considers comments on the Engagement Index factor**, not all survey comments.

The PwC case makes this concrete:
> *"PwC ran a survey with 17,000 comments. But when looking at the AI comment comparisons for Location demographic, it only considers 13 comments in the top quartile, and 66 comments in the bottom quartile. This does NOT give them a good representation of what the most & least engaged people are talking about."*

PwC also flagged that this narrow selection is **not transparent** — users can't tell which comments are included, making results feel untrustworthy and non-replicable. Their specific asks:
1. Expand AI comment comparison to include **all** comments, not just Engagement Index questions
2. **Document clearly** which comments are included in the analysis

This is a high-stakes trust issue for enterprise customers running large surveys.

### 2. Comment Themes and Sentiment are Inaccurate

Multiple entries flag that the AI gets the analysis wrong:

- Comment themes in summaries are **incorrect**
- Sentiment analysis is **poor** — both in isolation and when combined with topic assignment
- The output is **hard to trust** — users are skeptical of the AI's characterisation of their data

Canva's feedback illustrates the downstream consequence:
> *"They currently do a lot of thematic analysis off-platform using their own AI tools. CA themes don't really work for them — their themes evolve and change over time."*

When customers build workarounds using external tools (including ChatGPT), it signals the in-product experience is below their bar.

### 3. Coach Can't Show the Comments Behind Its Summary

A gap that cuts across both AI Comment Summaries and Coach: **Coach cannot surface the verbatim comments it has summarised**. When asked to show supporting evidence, it responds:

> *"I don't have access to individual employee comments — only the aggregated summary you just saw... If you need to review individual comments, you'd need to access those directly in the Culture Amp platform."*

This breaks the natural workflow. A user who receives a theme or a summary instinctively wants to drill into the evidence. Routing them back to the platform to manually search 11,000+ comments is not a viable answer. This is likely to erode trust in the summary itself — if the AI can't show its work, why believe it?

### 4. Customisation and Filtering is Missing

Users want to shape what the AI analyses, not just receive a fixed output:

- **Add filters to comment summaries** (e.g. by demographic, by factor, by sub-group)
- **Custom topic modelling** — Canva explicitly wants topics that evolve with their organisation rather than a fixed CA taxonomy
- **Survey-by-survey Coach access** — granular control rather than all-or-nothing
- **Group comments by custom categories** (e.g. Melbourne Archdiocese wanted to group principal feedback by Head Office directorate)

The Melbourne Archdiocese example (March 2026) confirms this is not just historic feedback:
> *"They now want to group the comments by different topics e.g. each 'department' or 'directorate' at Head Office... AI comments analysis would also assist with this."*

### 5. Scope Gaps — Where AI Analysis Doesn't Reach

Users are consistently asking for AI to cover more of the platform:

- **360 feedback** — summarise feedback (highest demand signal in notes)
- **Exit surveys** — help interpret exit survey results
- **Goals** — Coach access in Goals
- **1-on-1 content** — Coach in Perform to access 1:1 notes
- **Post-cycle insights** in Perform
- **Self-reflection themes** — AI-assisted trend analysis across self-reflections

These requests suggest customers see AI analysis as a capability they want to apply broadly, not just in engagement surveys.

### 6. Export and Distribution

- **Downloadable AI comment summaries** — requested multiple times
- **Export to slides** — for sharing survey insights with leadership

This reflects a real workflow: survey owners need to present findings, and the current output isn't shareable in the formats they use.

---

## Notable Verbatim Feedback

**PwC** — largest and most technically detailed submission:
> Comment analysis only includes Engagement Index comments; biased sample; not transparent. Asks for full-comment coverage and clear documentation of what's included.

**Canva** — thematic analysis workaround:
> AI themes don't fit their evolving taxonomy. Currently exporting and analysing off-platform using their own AI tools.

**KPMG** (via deal feedback):
> Coach is clunky, falling behind, can't surface important information for the board.

**Lost deal — Glint/Viva (Microsoft)**:
> Customer chose Glint over CA specifically because of Copilot integration.

---

## Questions for Product

1. **Is comment coverage scope (Engagement Index only) a known constraint?** The PwC case suggests customers expect full-survey coverage — is expanding this on the roadmap?
2. **Is Coach's inability to cite verbatim comments a deliberate confidentiality design?** If so, is there a trust-preserving way to show representative quotes (e.g. anonymised, consent-gated)?
3. **Has sentiment/theme accuracy improved enough to address the trust complaints?** The feedback predates comment summaries in their current form — but at least some of the accuracy criticism appears to be about the current product.
4. **What's the right unit of control for comment analysis?** Customers want filter-level and survey-level granularity. Is that directionally where the product is heading?