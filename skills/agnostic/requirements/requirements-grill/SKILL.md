---
name: requirements-grill
description: Runs a rigorous requirements grilling session that resolves design branches and persists decisions into durable docs. Use when the user wants a long design interview, product/architecture requirements discovery, branch-by-branch decision closure, or compaction-safe grill logs/status updates.
---

# Requirements Grill

Interview the user relentlessly about every aspect of a plan until shared understanding exists.
Walk the design tree branch by branch, resolve dependencies, and persist the resulting requirements so they survive context compaction.

## Core Rules

- Walk the design tree branch by branch until each branch is either closed, parked, or explicitly deferred.
- Ask one question at a time by default.
- For every question, provide a recommended answer and the reason for it.
- Inspect code/docs first when the answer can be found locally.
- Challenge conflicting glossary, vague terms, and hidden tradeoffs immediately.
- Prefer conservative defaults once enough context exists.
- If the user authorizes auto-pinning defaults, close obvious remaining decisions without needless extra questions.
- Treat parked branches as preserved knowledge, not deleted scope.

## During The Session

If the user uses a term that conflicts with existing specs, docs, or code language, call it out immediately and force a precise choice.

When the user uses fuzzy or overloaded terms, propose a canonical term and make them choose the right one.

Stress-test relationships and boundaries with specific scenarios, including edge cases that force precision.

When the user states how the system works, verify it against the code. Surface contradictions instead of smoothing them over.

## Durable Artifacts

At the start of a serious grilling session, create or reuse topic-named docs:

- `docs/<topic>-grill-log.md`
- `docs/<topic>-grill-status.md`

The log is the durable decision record.
The status file is the current branch dashboard.

## Grill Log Contract

The log should be structured, not raw transcript.

Record each accepted decision as:

```md
### Q<N>
Question:
<question asked>
Accepted answer:
- <locked answer>
```

Group related decisions under branch headings.
When the user changes an earlier decision, add a new entry that explicitly supersedes the old one.

## Status File Contract

Maintain a compact branch dashboard with branch name, completion percentage, locked direction, still-open items, and parked branches.

- `0-50%`: branch discovered but unsettled
- `50-85%`: major direction set, important questions remain
- `85-99%`: mostly closed, only constants/schema/naming remain
- `100%`: design closed; remaining work is implementation/tuning
- `parked`: preserved for later, out of current scope

## Branch Closure Workflow

When a branch closes:

1. Update the grill log with the final accepted decisions.
2. Update the status file percentage and open items.
3. Update wiki/domain docs when the branch changes durable product or domain knowledge.
4. Skip wiki updates for low-level implementation details that the domain contract scopes out.
5. Say exactly what changed and which artifacts were updated.

Wiki-worthy branches include product behavior, conversation model, data model boundaries, memory scope, and user-visible modes.
Usually not wiki-worthy: retry constants, wire-frame field lists, DDL naming polish, and low-level transport timing.

## Conservative Closure

When the user asks to reduce scope or stop widening the design:

- choose the smallest already-justified model
- avoid new tables, modes, enum values, services, or abstractions
- keep future branches parked instead of partially designing them
- prefer app-layer projections before adding DB views or materialized layers
- prefer ordinary text/enforced-in-code enums before DB-native enum churn

## Final Handoff

At the end, report all branch percentages, parked branches, remaining non-design validation work, and the recommended next planning direction.

If all active branches are `100%`, explicitly say the requirements grill is done and the likely next direction is backlog/user-story creation, outside this skill's scope.
