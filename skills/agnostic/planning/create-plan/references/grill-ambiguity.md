# Grill Ambiguity

Use this reference to reduce ambiguity before building the swarm graph.

## Goal

Reduce ambiguity before the plan hardens.

## Run inputs

Infer as much as possible from:

- the checkout
- git remotes
- existing plans
- docs
- issues
- backlog references

Ask only for missing high-impact inputs:

- domain or scope
- goal statement or issue set
- backlog target
- backlog context required by that target

## Operator-visible control panel

Before the first question, keep the current state obvious:

- current graph step
- locked decisions
- open decisions
- next step

## Question-block contract

Every plan-shaping question in a `$grilling` round must contain exactly these headings, in this order:

- `Decision`
- `Recommendation`
- `Question`
- `Why it matters`

Rules:

- never replace the `Question` line with only a recommendation
- never emit an empty or implied question
- if the block is malformed, regenerate it before continuing
- keep the recommendation concise and opinionated

## Grill behavior

Use `$grilling` as the sole question-scheduling and traversal behavior. This wrapper adds only plan-specific handling:

- apply the question-block contract to each question
- if a question can be answered from the codebase, answer it by inspecting instead
- before recording an unresolved question in the plan, ask the user whether to resolve it now or defer it
- when the user defers a branch, record the assumption or unresolved question explicitly in the plan with its planning impact
- when the frontier is empty, obtain explicit confirmation of shared understanding before synthesizing the task graph, writing `PLAN.md`, or syncing backlog

## Decision ledger

After each response set, process every answer individually and restate:

- decisions locked
- assumptions made
- still-open decisions

This ledger must stay visible both in the conversation and in the saved plan artifact.

## Synthesis checkpoints

After a whole response set is processed and the decision ledger is updated, emit a checkpoint when either condition is met:

- five plan-shaping decisions have been resolved since the last checkpoint
- the planning exchange is long enough that the user could lose orientation

Summarize the current situation, locked decisions, open planning blockers, and whether more ambiguity reduction is needed. This checkpoint reports plan-wrapper state only; `$grilling` remains the sole source of frontier scheduling and traversal.
