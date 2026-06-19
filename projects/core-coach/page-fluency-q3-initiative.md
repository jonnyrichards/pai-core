# Page Fluency — Q3 Initiative

## The idea

Coach today is a conversational assistant that lives *beside* the page. Page Fluency is the capability to make Coach genuinely native to the page — able to read it, write to it, respond to its state in real time, and guide users through it. Not just context-aware, but fluent.

## Why now

- Research shows the biggest drag on Coach adoption isn't relevance — it's friction: good outputs still require manual translation into the platform
- The AI services users love most make them feel productive; they feel like the AI is doing the work, not handing it back
- We have proof of concept: Ben's collab demo showed what in-page writing feels like; Ananda's and HackDay's demos showed Coach acting on the platform; Daniel and Will's research showed contextual, field-linked prompts drive significantly more engagement than standalone Coach
- Connected data is already our strongest differentiator — Page Fluency extends that edge from *knowing more* to *doing more*

## What it is (in three parts)

1. **Dynamic prompts** — prompts that know which field the user is in and adapt in real time, replacing the current static prompt set
2. **Page context service** — a shared context layer between Coach and the page: purpose, components, current state, and a clear model for temp state vs. DB writes (source-of-truth question)
3. **Page-fluent agents** — prompts repositioned from task executors ("write a manager review") to in-page partners ("I'm here with you on this page, I know what's filled in, I know what's missing, I can write it with you")

## From → To

| From | To |
|---|---|
| Coach writes text you cut and paste | You watch Coach write the answers; you edit as it goes |
| Coach is set up as a manager review writer | Coach is an in-page partner — fluent in this page |
| Coach doesn't know what's happening until reload | Coach says "looks good — ready to save?" |
| Side panel feels separate | Side panel feels page-coupled |
| Coach is a conversational assistant | Coach is page-fluent |

## Where to start

Manager Review is the natural beachhead: Coach is already present, the use case is well understood, but the experience is visibly broken — decoupled panel, copy-paste outputs, forms Coach can't touch. A tight proof of concept here validates the three-part model before we expand.

## What success looks like

Users feel like Coach is doing the work *with* them, not handing deliverables back. Measurably less copy-paste. Subjectively: "it felt like it was filling it in for me."
