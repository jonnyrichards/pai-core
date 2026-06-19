---
title: Routing vs Skills Architecture — 2026-04-24
confluence_page_id: 6173327545
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6173327545/Routing+vs+Skills+Architecture+2026-04-24"
last_synced: "2026-04-24T03:09:56.060Z"
---

# Routing vs Skills Architecture — 2026-04-24

## Question 1

> I need help thinking through an architectural decision relating to how we handle and route requests within our chat application.
>
> **Context:** we are an HR application (web app) that has a series of domains - engagement, performance etc. Across a series of pages within the product, user can do a bunch of things: create or fill out a survey, interpret survey results, write a self-reflection, fill out a performance review - these kinds of things. The chat application is basically a 'coach' that sits across these domains and is calibrated to be able to 'help out' with specific jobs to be done in these contexts. For instance, in the engagement domain the coach is calibrated to help a user interpret survey results; in the performance space the coach is calibrated to help write a high quality performance review. When I say 'calibrated', I just mean: at present there are different agents (ie. different prompts) that power coach in these different settings. The work ahead is to unify these 'coaches' into one 'coach' so that no matter where a user is or what they are doing, they can summon the coach and the coach will give a meaningful and helpful answer in that setting. Another important piece of context is: we have recently shifted to Langgraph as our 'agent framework'.
>
> **Problem:** the current thinking is that to solve this problem, we should use Langgraph to create an 'orchestration' flow, where an orchestration agent is making decisions about which graph we should route user requests to. Each 'subgraph' would have its own domain that it specialises in (eg. a performance sub graph) and handle the user query in that domain. If the user started to ask about something the subgraph decided was outside its domain or didn't know enough about, it would hand the user back to the orchestrator, whose job it would be to find a more suitable graph to handle the query. In other words we're currently framing the problem we need to solve as a 'routing' problem.
>
> Here is my question: as I've started to use Claude Code more and more, I increasingly see another mental model to frame how this situation is handled. Instead of an orchestrator routing to different graphs, I just see one agent (Claude Code) with many skills, and as it needs to process different jobs / tasks, it engages these skills to carry out these tasks. Each skill is equipped with tools it needs for its particular domain; there are some 'default' skills (eg. web fetch), and the user can add more if they like. But fundamentally Claude Code is not operating with a routing architecture so much as a 'skills usage' architecture where the main agent is augmented as necessary from time to time with new, relevant skills.
>
> Perhaps these architectures are not as different as they sound, but one doubt I have in my mind re. the routing architecture is just: the conversation (say with the engineering team) frequently travels to a place where you're discussing: the rules for how the routing will work, what happens when the rules aren't as easy to apply (for example: using the URL (of the main page) is often cited as a rule to guide which agent to route to, but we're also proposing a world where a user can revisit previous sessions via a chat history, so when they're on page [x], they may load a chat that took place on page [y]. What is the right agent to apply to the chat in this context? etc. We're also imagining a world where the existing web application will be less and less relevant to the user journey - as we move to a more 'agent-native' application.)
>
> Can you help me think this through? I don't need a full architectural solution. I need some useful mental models to understand the problem we're trying to solve here, and ideally some provocations for the engineers who are making these decisions? (Note: I'm not an engineer, so be honest about some / any of my assumptions here, and pick them apart where necessary.)

---

## Response 1

### The core tension

The routing architecture treats **location** as the primary signal for what the coach should do. The skills architecture treats **intent** as the primary signal.

These are meaningfully different. A user on the performance review page asking "why did my team's engagement scores drop?" isn't really doing a performance task — they're doing an engagement interpretation task. A routing-by-URL architecture has to handle this as an edge case. A skills/intent architecture handles it naturally.

**The page the user is on is a weak proxy for what they actually need.**

### Two mental models worth holding

**1. Context injection vs. routing**

The routing framing assumes the coach needs to *be a different thing* depending on domain. But there's an alternative: the coach is always the same agent, and what changes is the *context it receives*.

When a user is in the performance review flow, you don't route them to a "performance agent" — you inject the relevant context (their review draft, the rubric, their direct reports' data) into a single capable agent. The agent's behavior changes because its *information environment* changed, not because it *is* a different agent.

This is closer to how Claude Code actually works — there isn't really a "git skill" and a "web skill" with an orchestrator choosing between them. There's one model that receives tools and context, and uses whatever's relevant.

**2. Routing vs. tool selection**

In the routing architecture, the *architecture* makes decisions about what capability to apply. In the skills architecture, the *model* makes those decisions at inference time.

This is a real tradeoff: routing gives you predictability and auditability ("we can prove it went to the performance graph"). Tool/skill selection gives you flexibility and graceful handling of ambiguous situations. The question worth asking your engineers is: **who is better at understanding user intent — a routing rule, or the model itself?** In 2024/2025, the honest answer is usually: the model.

### Provocations for the engineering team

**"What problem does the orchestrator actually solve?"**

If the answer is "it decides which specialized agent handles the request," then ask: why can't the model just decide which tools/context to use? The orchestrator is essentially a classifier sitting in front of capable models. Modern LLMs are very good classifiers. You may be building a routing layer to solve a problem the model would solve anyway — and adding latency, complexity, and new failure modes in the process.

**"What are the subgraphs protecting against?"**

Specialization architectures often emerge from a distrust of the base model — the fear that a general agent will give a mediocre answer about performance reviews. But that's usually a *context problem*, not a *routing problem*. If the performance subgraph is better at performance tasks, it's probably because it has access to better context or a better prompt. Those are portable. The graph boundary isn't what's doing the work.

**"What happens at the seams?"**

Every routing architecture has seams — moments where the routing logic doesn't know what to do. Each seam is a failure mode you have to design around. The more the product evolves (agent-native applications will blur page/domain boundaries significantly), the more seams you'll have. Ask: are we designing a system whose complexity grows with the product, or one that stays relatively constant?

### Where routing genuinely earns its keep

- When different domains have **genuinely different data access patterns** (different databases, APIs) that need isolation for security or compliance
- When you need **auditability** — "this conversation was handled by the performance agent" for compliance or analytics
- When **latency** is a constraint and you want to load only domain-relevant context

If those aren't the real drivers, the routing complexity may not be earning its cost.

### The reframe

Instead of "routing to specialized agents," try: **"a single capable agent that receives rich, domain-appropriate context."**

The engineering challenge then becomes: how do we inject the right context at the right moment? That's a much more tractable problem, and it survives product evolution (agent-native, cross-domain sessions, chat history) far better than a routing topology does.

---

## Question 2

> Great stuff. Here is an early diagram of the proposed routing flow. Are you able to allude to / draw out a parallel architecture that reflects your alternative thinking?
>
> *(Diagram showed: START → guardrails_subgraph → deterministic_router → [engage_node | engage_culture_quadrant_node | develop_node | insights_node | manager_review_node] → session_decision → [END | session_rename_node | session_summary_node])*

---

## Response 2

### Their architecture (what the diagram shows)

```
START
  └─► guardrails_subgraph
        ├─► [blocked] END
        └─► [passed] deterministic_router
              ├─► engage_node
              ├─► engage_culture_quadrant_node
              ├─► develop_node
              ├─► insights_node
              └─► manager_review_node
                    └─► (all feed into) session_decision
                          ├─► END
                          ├─► session_rename_node
                          └─► session_summary_node
```

The key structural fact: **five separate domain nodes**, chosen by a router before the model does any thinking. The router decides what the agent *is* before it starts.

### The alternative architecture

```
START
  └─► guardrails_node
        ├─► [blocked] END
        └─► [passed] coach_agent  ◄─── context_builder
                                          ├─ page_context (URL, page type)
                                          ├─ user_context (who they are, their data)
                                          ├─ session_context (chat history)
                                          └─ available_tools (domain-specific)
              │
              │  (model decides what to do)
              │
              ├─► tool: get_survey_results
              ├─► tool: get_performance_review_draft
              ├─► tool: get_insights_data
              ├─► tool: get_manager_review_context
              │         (uses whichever are relevant)
              │
              └─► response
                    └─► session_decision (same as before)
                          ├─► session_rename_node
                          └─► session_summary_node
```

### What changed and why it matters

| | Routing architecture | Skills/context architecture |
|---|---|---|
| **Who classifies intent** | The router (before the model) | The model (during inference) |
| **Domain boundaries** | Hard (node per domain) | Soft (tools available, used as needed) |
| **Cross-domain query** | Edge case, needs a rule | Handled naturally |
| **Chat history on wrong page** | Ambiguous — which node? | Irrelevant — model reads context |
| **Adding a new domain** | New node + new routing rule | New tool + description |
| **Complexity trend** | Grows with number of domains | Stays roughly flat |

### The structural provocation

The `deterministic_router` box is doing one job: **classifying the user's intent before the model sees it.** But you have a state-of-the-art language model one step downstream. You are using a rule-based classifier to pre-decide what a powerful reasoning system should think about.

In the alternative, the `context_builder` still does real work — it assembles everything relevant — but it doesn't *decide*. It informs. The model decides.

The `guardrails_subgraph` is fine and should stay. Guardrails are a legitimate pre-flight check that doesn't depend on intent. But the `deterministic_router` is doing classification work the model is better at.

**Honest caveat:** the routing architecture is easier to observe and debug. "It went to `develop_node`" is a clear audit trail. "The model chose these tools" is fuzzier. That's a real tradeoff — but it's solvable with good logging, not with a routing layer.