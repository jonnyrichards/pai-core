---
title: Coach | Unified Sessions | Executive Presentation
created_date: 2026-04-16
status: draft
confluence_page_id: 6147538956
confluence_url: "https://cultureamp.atlassian.net/wiki/spaces/COACHCAMP/pages/6147538956/Coach+Unified+Sessions+Executive+Presentation"
last_synced: "2026-04-17T00:07:46.719Z"
---

# Coach | Unified Sessions — Paths Forward

## Opening framing

We're at an early stage of thinking about how Coach should work across the platform — and we want to share where our heads are at, not present a solution.

The core tension we're navigating is **flexibility vs. accuracy**. Users want Coach to be available everywhere, continuous, and uninterrupted. They also expect it to be accurate — to know what it's talking about and not confuse one person's data with another's. Those two things pull against each other, and the options we'll walk through represent different bets on how to balance them.

We're not making a recommendation today, and we're not looking for a decision. We're here to align on how we're thinking about the problem, surface anything we might be missing, and make sure we're pulling in the same direction before we go deeper.

If you see a different way to frame this problem entirely — we want to hear it.

---

## Options

### Option 1 — Coupled
Coach and the main panel always stay in sync. Navigating one navigates the other.

**Strength:** Simplest mental model. No risk of context mixing — what you see is always what Coach knows about.

**Trade-off:** Less user control. Navigation can feel unexpected, and comparing across employees isn't possible in a single session.

---

### Option 2 — Decoupled with informed consent
Coach and the main panel can diverge. When they do, Coach surfaces a prompt: *"Your context has changed — happy to continue?"* The user stays in control; Coach stays honest about what it knows.

**Strength:** User retains agency. The sync prompt builds trust rather than restricting access — Coach is transparent about context shifts rather than silently proceeding or locking up.

**Trade-off:** Informed consent transfers risk to the user but doesn't eliminate it. If a user consents and Coach subsequently mixes context or gives inaccurate advice, the prompt doesn't meaningfully protect us — and it may not protect the user either. The UX also needs careful design to avoid becoming noise.

---

### Option 3 — Fully decoupled
Coach and the main panel are independent. Context updates as the user navigates, without interrupting the conversation.

**Strength:** Maximum flexibility and continuity. Matches how tools like Amplitude's AI assistant work — there's market precedent and growing user expectation for this pattern.

**Trade-off:** Demands more from the AI layer. Mixed context is the default state, not the exception — this is solvable through smart context management and prompting, but it's a real engineering investment. The risk is Coach behaving unpredictably if that investment isn't made well.

---

### Option 4 — Topic-coupled sessions *(direction, not a design)*
Coach sessions are tied to a topic — a survey, a review cycle, an employee — rather than a page. One topic spans multiple pages but represents a single coherent context for Coach.

**Strength:** Matches how users actually think about their work. Reduces both forced navigation and contamination risk by bounding context to something meaningful rather than a URL.

**Trade-off:** Requires defining and detecting topics — non-trivial product and engineering work. No designs yet.

**Possible shapes** *(provocations only):*
- Tabs in the Coach panel — one per topic, easy to switch between
- A topic switcher — lightweight dropdown showing the current topic, similar to branch switching in a code editor
- Contextual anchoring — a persistent "currently focused on: Casey's Q1 review" indicator that updates as context shifts