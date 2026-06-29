---
title: Coach | Customer Knowledge Base | One-pager
created_date: 2026-03-04
status: draft
confluence_page_id: 5986156868
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/5986156868/Coach+Customer+Knowledge+Base+One-pager"
last_synced: "2026-06-26T06:35:54.229Z"
---

# Description

We are building a Customer Knowledge Base (CKB) that enables a company or organisation to upload documents (eg. company values / priorities) so Coach can provide contextually relevant responses   
  
**Q3 scope:** CZ release; stretch goal: EAP (5-10 customers); Q4 scope: EAP (5-10 customers) + Beta release (100% customers)

---

## The Problem

**User Problem:**

* Coach doesn't know anything about the user's company — its priorities, initiatives, competency frameworks, or values
* Responses feel generic and disconnected from the user's day-to-day context

**Business Problem:**

* Competitors (Lattice, Windmill) already offer AI coaches with company context
* Without organisational context, Coach adoption and engagement are limited
* Generic responses reduce perceived value and stickiness

---

## Market Context

Several customers have shared that they have already uploaded their company context — values, frameworks, priorities — to a Frontier Lab assistant (e.g. Claude.ai, ChatGPT), and have expressed a preference that Coach access this context directly rather than requiring them to re-upload it. This feedback has surfaced through CSMs (via #feedback-product) and in user testing sessions. A broader strategy for how Culture Amp responds to customer requests for platform access via MCP is under review.

---

## Work To Date

### 1. Customer Research - Findings

We tested a design prototype with 5 customers.

Key findings ([research deck](https://docs.google.com/presentation/d/1CLVUAp4h6F1AotyJG1HauJsvQobNhy21H2ndEcZiqsI/edit?slide=id.p3#slide=id.p3)):

1. **Document-level access control is a launch blocker.** Companies want to upload documents scoped to specific groups. Without this, the feature only serves the simplest single-audience use case (values)
2. **Admins need to verify and audit what's been uploaded.** Admins want to be able to preview documents and see upload history (who, when) - key for managing risk in multi-admin environments.
3. **Coach doesn't currently speak the company's language.** Admins expect Coach's responses to change at the language level (eg. use specific terms) and at the awareness level (eg. we just had a re-org; people are sensitive right now); this may be a prompt injection problem rather than a retrieval problem.

### 2. Technical Discovery — Findings

Discovery (Dan F) has surfaced several technical concerns that will shape how we approach this initiative:

* **Architecture risk**: A proposed technology stack switch (Jakob's proposal) vs. the current expedient stack introduces both product and technology risk. The stack is unproven, and changing the architecture without proving it end-to-end is high-risk.

    * may not be able to be turned to meet the requirements
    * can add a complexity and maintenance overhead if we don't test its capability
    * what level of performance and non-functional scale do we require at day one?
    
* **People Science requirements**: CKB requires _**significantly more PSX engagement than prior features**_ — this capability transfers meaningful control of how Coach behaves from CA to the customer. Key areas:

    * **Document scanning**: Uploaded content must be screened for suitability, agent poisoning, and sensitive material. "Level Zero" evaluation criteria are non-trivial — without them we risk misuse, reputational damage, or harm to employees
    * **Synthetic data**: Testing requires a large, realistic dataset covering both happy-day and misuse scenarios across varied document types
    * **RAG tuning**: How many documents to retrieve, at what relevance threshold, and how to integrate them into Coach's response all require prompt experimentation
    * **Business rules**: Behaviour when uploaded content conflicts internally, or with People Science advice, needs to be defined and exposed appropriately to users
    * **Elapsed time risk**: As new content types surface, new risks and required adaptations will emerge — this is a long-tail effort risk, not just a point-in-time one
    
* **Testing and evals complexity**: The prototype must be tested across both "happy day" and "unhappy" scenarios. Customers will use CKB in ways we don't anticipate — treating Coach as a policy search tool, uploading bulk HR documents, surfacing edge cases where uploaded content clashes with Coach's trained responses. This requires significant elapsed time for tuning and feedback
* **Security threshold**: A security penetration test is non-negotiable before any external release. Account isolation and secure handling of customer documents are hard requirements. Security clearance is a reputational risk with this feature. Customers need to be sure we safeguard uploaded data with the same care and commitments as other Platform Data.
* **Timeline realism**: The team is uncertain whether a security-verified external release is achievable by September. Customer Zero is the right strategy to manage expectations — and communicating to executives that this is not purely engineering work (it requires experience design, PSX tuning, guardrails, and feedback loops) is essential.

---

## What

Proposed CKB features:

### Coach Settings Page

_An admin user can:_

* Open the Knowledge Base dashboard

### Knowledge Base Dashboard Page

_An admin user can_:

* See a list of uploaded documents (file name per document)
* Preview a document
* See and edit a name for a document
* For a 'recently uploaded document' see a proposed name for the document (ie. a name that would appear in citations)
* See and edit auto-generated tags for a document
* See and edit an active status for a document (active / not active)
* See a processing status for a document (processing / passed / blocked / review)
* If a processing status for a document is 'blocked' or 'review', see an explanation for the processing status
* Remove a document
* See which admin user uploaded a document (and when)
* Control which cohort / demographic can access a document

### Document Upload Page

_An admin user can:_

* Browse files / drag files to uploader (supports batch uploads)
* Tap 'Process files' (ie. trigger 'Upload + process')

### Coach Page / Coach Conversation

_A Coach user can:_

* observe the spirit of uploaded context in the normal course of a conversation  
  eg. An admin user uploads a document saying Coles refers to staff as team members not employees -> Coach refers to team members in all responses  
  eg. An admin user uploads a document saying that the org is sensitive right now becauase of a recent re-org -> Coach references the likelihood that employees may feel unsettled as a result of the re-org  
  as a distinction between 'company context' (lives in the prompt?) and 'company knowledge' (lives in RAG).]

* see a Knowledge Base document as a source for responses anchored in / retrieved from the Knowledge Base

---

### What This Isn't

* A formal commitment to a Q3 EAP — Q3 scope is CZ only, with EAP as a stretch goal subject to all architectural, PSX, and security risks being mitigated

---

## How

[TBC - Jakub to provide guidance; suggestions here are from Dan following Tech Discovery]

### Phase 1: Prototype (~4 weeks, target end July)

**Goal:** Build a working prototype with generated data to enable PSX validation and a go/no-go decision on proceeding to production.

**Exit Criteria:**

* Prototype running end-to-end with dummy data
* PSX has stress-tested Coach's behaviour with company context in the loop
* Guardrails defined

---

### Phase 2: Production CKB for CZ (~6 weeks, target mid-August)

**Goal:** Ship a production pipeline to Customer Zero and validate the full experience ahead of any broader release.

**Exit Criteria:**

* Security penetration test passed; account isolation verified
* Production pipeline live; Coach uses uploaded documents in responses
* CZ stress-testing complete (varied document types, edge cases tested)
* Clear recommendation on EAP readiness

_~2 weeks buffer remaining in Q3 for refinement based on CZ feedback._

---

## Testing

_Key areas to test:_

* RAG retrieval accuracy — does Coach surface the right content from uploaded documents?
* Document parsing quality — are documents processed correctly across formats?
* Prompt strategies — how does company context best integrate with Coach's existing behaviour?
* Document upload usability — is the upload and management experience clear?
* Response relevance / perceived value — do users find Coach's responses meaningfully more relevant with company context?
* Document controls — are admin controls (edit, delete) sufficient?
* Permissions controls — is access to uploaded documents correctly scoped and does document-level access work?
* Citation — does Coach surface which documents it drew from?

---

## Open Questions

1. **Will customers bother uploading?** Several customers already have their company context in a Frontier Lab assistant and would prefer Coach access it there. Does a manual upload model deliver enough value to justify the friction — or does this point toward an MCP-based approach?
2. **How do we strike a balance between prompt injection and RAG across tasks?** There may be a role for lighter-weight, structured context alongside or instead of document retrieval — e.g. company narratives, "top of mind" priorities, recent events, terminology preferences (e.g. "employees" → "team members"). Is document RAG the right primary model, or should we explore a hybrid?
3. **What does Lattice offer specifically?** We cite competitive parity as a motivator — what is the actual feature parity bar?

---

## Dependencies & Risks

TBC