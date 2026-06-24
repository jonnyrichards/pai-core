---
title: Coach | Routing | One-pager
created_date: 2026-06-23
status: draft
---

# Description

We are building cross-agent routing so that a question asked in one Coach context — say Engage Coach — can be answered by the right agent, regardless of where the conversation started.

## The Problem

**User Problem:**
- Coach feels like separate, disconnected tools — asking a performance question inside Engage Coach gets an unhelpful or out-of-scope response
- Users have to navigate to the "right" Coach to get a useful answer, which they shouldn't have to know or care about

**Business Problem:**
- Siloed agents produce seams that erode trust and limit Coach's perceived usefulness
- Every new Coach surface (Goals, Perform, Engage) compounds the problem unless routing is solved centrally

---

## Why This Proposal

**User Benefit:**
- **Seamless answers**: Users get the right response regardless of which Coach surface they used to ask the question
- **Reduced friction**: No need to navigate to a specific Coach context to ask domain-appropriate questions

**Business Benefit:**
- **Coach as one product**: Routing is the infrastructure that makes "one Coach everywhere" real — without it, unification is cosmetic
- **Extensibility**: New agents (Goals, Perform) plug into the routing layer without requiring bespoke integration work for each

---

## Success Metrics

### Primary
- **Routing accuracy**: Orchestrator routes to the correct agent at X% accuracy (new eval)
- **Cross-context query rate**: X% of sessions include a query that is routed to a different agent than the one the user started in (baseline: 0%)

### Secondary
- **Latency**: Routing adds <Xms to median response time
- **User satisfaction**: No regression in Coach satisfaction scores post-routing rollout

---

## Target Audience

All users of Coach across General, Engage, and Perform use cases.

---

## What

A routing layer that:
1. Classifies user intent at inference time to determine which agent is best placed to answer
2. Routes the query to the appropriate agent, transparently and without user action
3. Returns the response within the session the user is already in — no context switch required

### What This Isn't
- Not a UI change — routing is infrastructure; the Coach panel experience stays consistent
- Not a replacement for per-agent context and tool access — agents remain specialised; routing decides which one handles a given query

[Link to technical design when available]

---

## How

### Phase 1: Orchestrator POC

**Goal:** Prove that an orchestrator can classify intent and route correctly between existing agents; establish evals

**Milestones:**
- Spike: orchestrator routes between ≥2 agents (e.g. General + Engage Coach)
- Evals framework for routing accuracy validated
- Decision: intent classification approach (prompt-based, model-as-classifier, tool selection)

**Exit Criteria:** Orchestrator routes correctly in test scenarios; evals confirm accuracy above threshold; approach decision made

---

### Phase 2: Production Routing

**Goal:** Ship routing to production across all Coach surfaces

**Milestones:**
- Decision: which agents are wired up to the orchestrator — agree which agents the orchestrator can hand off to, and which are out of scope for this phase
- Orchestrator productionised and connected to agreed agents
- Latency validated — routing overhead within acceptable bounds
- CZ testing: validate real-user routing behaviour

**Exit Criteria:** All agreed agents reachable via orchestrator; routing accuracy evals passing; CZ validated

---

## Testing

**Approach:** Evals-first, then Customer Zero, then gradual rollout

**Evals (Phase 1):**
- Build a routing eval set covering cross-agent query scenarios
- Validate accuracy before any user-facing rollout

**Customer Zero:**
- Test cross-context queries in realistic workflows
- Identify edge cases (ambiguous intent, multi-domain queries)
- Validate that routing is invisible to users — they shouldn't notice the handoff

**Key Questions:**
- What signals does the orchestrator use — intent classification, URL context, session history?
- How are ambiguous queries handled — default agent, ask the user, or best-effort?
- What happens when a routed agent can't answer either?

---

## Open Questions

1. **Classification approach:** Intent classification via prompt, model-as-classifier, or tool selection — what performs best at acceptable latency?
2. **Ambiguity handling:** How does the orchestrator behave when intent is unclear — fallback to General Coach, or surface options to the user?
3. **Session continuity:** If a query is routed mid-session, does the receiving agent have access to prior session history?
4. **Observability:** How do we log and inspect routing decisions for debugging and eval refinement?

---

## Dependencies & Risks

**Dependencies:**
- LangGraph migration complete (prerequisite — all agents must be on LangGraph for the orchestrator to connect them) ✓
- Routing initiative is a dependency of Unified Sessions (session history must surface sessions from all routed agents)

**Risks:**
- Intent classification accuracy may be lower than expected for domain-ambiguous queries
- Routing adds latency — overhead needs to stay within acceptable UX bounds
- Edge cases (cross-domain queries, session history context across agents) may be harder to handle than the happy path

**Mitigation:**
- Build evals early and set an accuracy threshold before shipping to users
- Spike on latency in Phase 1 before committing to approach
- Limit Phase 1 routing to well-defined agent boundaries; expand gradually
