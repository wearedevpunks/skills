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

If the block is malformed, regenerate it before continuing.

## Grill behavior

Use `$grilling` as the sole question-scheduling and traversal behavior. This wrapper adds only plan-specific handling:

- apply the question-block contract to each question
- record a question as unresolved in the plan only when `$grilling` leaves it deferred
- record its assumption or planning impact explicitly

## Decision ledger

After each response set, process every answer individually and update the planning decision ledger from the current `$grilling` state. Keep this ledger visible both in the conversation and in the saved plan artifact.

## Synthesis checkpoints

After a whole response set is processed and the decision ledger is updated, emit a checkpoint when either condition is met:

- five plan-shaping decisions have been resolved since the last checkpoint
- the planning exchange is long enough that the user could lose orientation

Summarize the current situation, locked decisions, open planning blockers, and whether more ambiguity reduction is needed. This checkpoint reports plan-wrapper state only; `$grilling` remains the sole source of frontier scheduling and traversal.
