# Grill Phase

Use this reference for the ambiguity-reduction phase.

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

- current phase
- locked decisions
- open decisions
- next step

## Question-block contract

Every plan-shaping question must contain exactly these headings, in this order:

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

Preserve `$grill-me` behavior:

- ask one question at a time
- provide a recommended answer with each question
- if a question can be answered from the codebase, answer it by inspecting instead
- keep grilling until every plan-shaping branch is resolved enough to plan safely
- before recording an unresolved question in the plan, ask the user whether to resolve it now or defer it
- when the user defers a branch, record the assumption or unresolved question explicitly in the plan with its planning impact

## Decision ledger

After every user answer, restate:

- decisions locked
- assumptions made
- still-open decisions

This ledger must stay visible both in the conversation and in the saved plan artifact.

## Synthesis checkpoints

Emit a checkpoint summary when either condition is hit:

- five plan-shaping decisions have been resolved since the last checkpoint
- the planning exchange has become long enough that the user could reasonably lose orientation

A checkpoint must summarize:

- current situation
- decisions locked so far
- open decisions still blocking the plan
- whether more questions are actually needed

If ambiguity is already low enough, stop asking questions and move to plan synthesis.
