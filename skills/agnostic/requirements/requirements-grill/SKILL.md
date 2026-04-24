---
name: requirements-grill
description: Runs rigorous requirements grilling, persists branch decisions, and optionally synthesizes high-level wiki knowledge. Use when the user wants a long design interview, product/architecture requirements discovery, branch-by-branch decision closure, compaction-safe grill logs/status updates, or wiki synthesis from grilled requirements.
---

# Requirements Grill

Use this skill to turn uncertain product, architecture, or implementation ideas into pinned requirements that can feed backlog/user-story creation.

This skill has three scoped references:

- Live grilling behavior: see [references/grilling-flow.md](references/grilling-flow.md)
- Durable grill artifacts: see [references/artifact-output.md](references/artifact-output.md)
- Wiki synthesis from closed grill branches: see [references/wiki-output.md](references/wiki-output.md)

## Quick Routing

Use active grilling when the user is still iterating on requirements, terminology, tradeoffs, branch closure, or status percentages. During a serious grilling session, load both `grilling-flow` and `artifact-output`; the interview and durable artifacts move together.

Use wiki synthesis when the user asks to persist closed grill decisions into `apps/wiki`, extract high-level flows/concepts, or sync domain knowledge from grill artifacts.

Both workflows can happen in one long session, but keep the responsibilities distinct:

- `docs/<topic>-grill-log.md` and `docs/<topic>-grill-status.md` are the detailed requirements record
- `apps/wiki/domains/` is synthesized domain knowledge
- backlog/user-story creation is the next phase after the grill gate, outside this skill's scope

## Core Behavior

- Ask one question at a time by default.
- For every question, provide a recommended answer and the reason for it.
- Inspect code/docs first when the answer can be found locally.
- Challenge conflicting glossary, vague terms, and hidden tradeoffs immediately.
- Prefer conservative defaults once enough context exists.
- If the user authorizes auto-pinning defaults, close obvious remaining decisions without needless extra questions.
- Treat parked branches as preserved knowledge, not deleted scope.

## Handoff

At the end, report branch percentages, parked branches, remaining non-design validation work, and the recommended next planning direction.

If all active branches are `100%`, say the requirements grill is done and the likely next direction is backlog/user-story creation.
