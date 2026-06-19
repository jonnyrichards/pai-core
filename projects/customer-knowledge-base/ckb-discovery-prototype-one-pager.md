---
title: Customer Knowledge Base | Discovery Phase | Proposed Outputs
confluence_page_id: 6247645548
confluence_space: COACHCAMP
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6247645548/Customer+Knowledge+Base+Discovery+Phase+Proposed+Outputs"
last_synced: "2026-05-22T05:29:51.023Z"
---

# What is this?

We are in the Discovery phase of the Customer Knowledge Base. The goals of this phase are to:

1. Validate the proposed feature by testing a working customer knowledge base with Coach
2. Validate the proposed UX with customers and get feedback ahead of a full build
3. De-risk key technical components through a spike ahead of the build phase

This document outlines a plan for two parallel workstreams: **a design prototype** to test UX flows with customers, and **a CZ-facing technical prototype** to de-risk the proposed technology stack and test how Coach performs with an authentic customer knowledge base.

---

## The Problem

**User Problem:**

* Admins have no way to give Coach context about their company — its values, priorities, competency frameworks, or strategic initiatives
* Responses lack customer context and feel generic, disconnected from users' day-to-day reality

**Business Problem:**

* \[PRODUCT\] We need a quick, low-cost way to test the perceived value of a Customer Knowledge Base before investing in a production build. Without early customer signal, we risk building the wrong thing or discovering too late that our proposed solution doesn't meet customer needs
* \[ENGINEERING\] We need a way to test the document upload, sanitisation, and parsing pipeline, ensure Coach can access these documents efficiently when necessary, and ensure that they do not spoil or poison Coach's responses
* \[PEOPLE SCIENCE\] We need a way to understand if such a knowledge base 'actually works': if Coach accesses it reliably, when expected, and if it improves Coach's responses in ways we expect

---

## A 'Two Track' Approach: Design + Technical Prototypes

We're proposing a two-track approach: a design prototype, which we can put in front of customers and use to test proposed features, functionality and user flows; and a CZ-facing technical prototype, which will address key security aspects of the feature (document uploading, parsing and safety) and which PSX and others can use internally to test the performance of Coach's responses when given access to a customer knowledge base.

|  | **Design Prototype** | **Technical Prototype** |
| --- | --- | --- |
| **Purpose** | Test the primary value proposition of the feature | Test the proposed technology stack and de-risk the feature |
| **Made by** | Rachael Geaney | Dan Fraser |
| **Used by** | Customer pilot group (~5 customers) | Culture Amp (dev farm) |
| **Features** | A user can:<br>- View a primary CKB interface<br>- Simulate an upload flow<br>- Simulate an edit flow (summary / theme etc.)<br>- Simulate a 'test in Coach' flow (test / publish to Coach)<br>- Simulate a delete flow | A CZ admin can:<br>- Upload documents to a CZ-specific version of Coach<br><br>A CZ user (in dev farm) can:<br>- Try the knowledge base and test Coach's responses |
| **Questions answered** | What kinds of documents do you want to upload? How many? What type / format? How large?<br><br>How important is it to be able to test how uploaded documents change Coach's responses before releasing to employees?<br><br>Do you understand the functionality? Do you think this would be valuable? | What pipeline should we create to sanitise, parse, and store documents?<br><br>What retrieval mechanism should we use? (If DB: what chunking/retrieval strategies? If FS: how do we handle large documents?)<br><br>Do we need a CKB summary in the system prompt? If so, what form should it take?<br><br>What tools do we equip Coach with to retrieve knowledge — and how effectively do they work?<br><br>Can we divide the CKB build into slices, and if so what belongs in slice 1 vs. later slices? |
| **What it isn't** | A way for customers to test how Coach works with their own documents | A production feature behind a feature flag |

---

## Why can't we test with 'actual' customer documents?

The CKB is easily the riskiest feature we have proposed implementing in Coach:

* **Security concerns**

    * CKB is an 'open upload' feature: customers could upload PII or malicious content, and there are a range of attack vectors and other vulnerabilities that need to be tested internally first
    * Risks are present with one customer and one document — the issue is not scale, it's the sensitivity of what we'd be safeguarding and the responsibility that comes with it
    * Manual document sharing is equally risky: we can't simulate the feature without the upload itself, which would mean Campers holding documents that could include highly confidential company strategy
    * Process: releasing this feature even to one customer would require a full DPIA and AICA, with security review and implementation of associated guidelines
    * Timeline: this is not feasible within the Discovery phase (ending 19 June)

* **Coach performance**

    * Any use of customer documents on production would mean deploying untested changes to the Coach service
    * Coach could misbehave, produce unreliable or harmful outputs, or have its behaviour compromised in ways that could leave Culture Amp exposed — all of this needs to be tested internally first

---

## How

| **Phase** | **Design** | **Technical** |
| --- | --- | --- |
| **Requirements Gathering (Now → 22 May)** | Define the minimal feature set needed to generate the target insights | Identify and resolve key technical unknowns (environment, storage, retrieval approach) ahead of spike |
| **Engineering + Design Spike (25 May → 19 Jun)** | Conduct competitor and market research<br>Create and refine the prototype | Create and refine the prototype with feedback from Coach Eng + Security |
| **Testing + Insights (19 Jun → 3 Jul)** | Conduct UXR-led sessions with admins (~5 customers)<br>Produce clear product recommendations | Produce recommendations for production build<br>Propose a slice-based approach to the build |

---

## Open Questions

1. **Testing environment:** What is the best environment for customer testing?
2. **UXR involvement:** What capacity does UXR have to support the Discovery phase?
3. **Recruitment:** Can we line up 5 willing customers in time for the testing window?
4. **Competitive landscape:** How are other SaaS assistants solving this problem (e.g. Amplitude) — what can we learn before we build?

---

## Dependencies & Risks

**Dependencies:**

* UXR support (Darsh) — required for customer testing design and synthesis

**Risks:**

* The design prototype may not generate a strong enough signal on the value proposition of the feature
* Recruitment: finding 5 willing customers within the testing window may be difficult