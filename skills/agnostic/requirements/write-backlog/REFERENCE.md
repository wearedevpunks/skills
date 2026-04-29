# Write Backlog Reference

## Purpose

`write-backlog` is the canonical backlog-authoring skill for this repo.

It turns a large requirements discussion into:

- modules
- epics
- stories
- native ordering relations

It does not write specs, plans, or execution handoffs.

Downstream contract:

- one epic maps to one future `SPEC.md`
- child stories remain the product-facing slices beneath that epic
- `PLAN.md` later decomposes execution without replacing the backlog model

## Supported inputs

`write-backlog` can work from:

- a raw requirements discussion
- an existing messy backlog
- `requirements-grill` artifacts from `/Users/stefan/Desktop/repos/weareDevpunks-multiplai/.agents/skills/requirements-grill`

When grill artifacts exist, treat them as the highest-signal structured source for backlog derivation.

## `requirements-grill` artifact contract

Expected inputs:

- `docs/<topic>-grill-status.md`
- `docs/<topic>-grill-log.md`

Read order:

1. status file first
2. log file second

Use the status file to extract:

- branch names
- completion percentages
- locked direction
- still-open items
- parked branches

Use the log file to extract:

- accepted decisions
- superseded decisions
- canonical terms
- branch closure notes

Backlog derivation rules from grill artifacts:

- derive backlog from locked direction and accepted decisions
- do not promote unresolved still-open items into committed story scope without marking them explicitly
- preserve parked branches as deferred scope, follow-up epic candidates, or backlog notes when relevant
- if two decisions conflict, the latest explicit superseding decision wins

Good handoff signal from `requirements-grill`:

- active branches are `100%`
- remaining work is non-design validation
- recommended next direction is backlog/user-story creation

If the grill is still materially open:

- keep backlog conservative
- reflect the unresolved branch as an open scope note instead of pretending closure

## Canonical model

Use this hierarchy:

- module
- epic
- story

Provider mapping:

- module -> milestone or provider-equivalent grouping
- epic -> parent issue/work item/capability record
- story -> child issue/sub-issue/work item

Rules:

- every story must be independently understandable
- every story must describe product behavior, not implementation chores
- one epic may contain multiple stories
- one epic maps to one future `SPEC.md`
- one story does not imply one future `SPEC.md`

## Body ownership

Backlog bodies stay product-facing.

Epic bodies may include:

- outcome
- scope
- cross-story constraints
- links

Story bodies may include:

- outcome
- acceptance signals
- non-goals
- links

Do not put these in epic or story bodies:

- plan task ids
- TDD targets
- file paths
- validation commands
- worker handoffs
- code-structure notes

## Ordering rules

Implementation order belongs in the backlog only through native dependency primitives when supported.

Preferred order signal:

- native `blockedBy` / `blocks`

Avoid:

- prose-only dependency paragraphs
- fake ordering labels when native blockers exist
- using plan tasks as backlog children

## Derivation workflow

### 1. Derive modules

Split the requirements discussion into durable capability groups that would still make sense if implementation order changed.

Good module:

- intake and review
- account lifecycle
- notifications

Bad module:

- backend foundation
- frontend polish

### 2. Derive epics

Within each module, create epics/capabilities that will later justify one coherent spec.

Good epic:

- submission lifecycle management
- account onboarding and activation

Bad epic:

- database schema
- API routes

### 3. Derive stories

Break each epic into stories only when the slice is product-facing and independently observable.

Good story:

- coordinator creates a new submission from external intake
- lead reassigns ownership to another reviewer

Bad story:

- add column and router
- create mutation and form hook

### 4. Add native order

Only add blockers when one story truly depends on another story outcome.

Use blockers for:

- foundational product slices
- gating flows
- prerequisite user-visible capability

Do not add blockers for:

- internal code layering preferences
- one engineer wanting to implement one file before another

## Using grill artifacts during derivation

When the source is a grill status/log pair:

- use branch names and locked direction to identify likely module boundaries
- use accepted decisions to define epic boundaries
- use branch closure notes and concrete accepted answers to derive stories
- use still-open items only as:
  - explicit open questions for the backlog author
  - deferred scope notes
  - follow-up epic/story candidates when the source already frames them that way

Do not:

- turn every grill question into a story
- treat partially closed branches as committed epic scope by default
- ignore canonical terminology captured in the grill log

## Handoff to `create-spec`

When `create-spec` is given a backlog-backed epic:

- the epic is the spec anchor
- every child story is mandatory source material
- the resulting `SPEC.md` must cover all child stories under that epic
- the spec must preserve per-story requirements while unifying them into one coherent problem-space contract

## Provider policy

This skill documents raw provider create payloads only.

In scope:

- create issue/work item payload shapes
- required vs optional fields
- how module/epic/story intent appears at creation time

Out of scope:

- update payloads
- comment payloads
- completion-time execution sync

If a provider cannot express part of the canonical model in the create payload alone:

- document the limitation explicitly
- do not silently reshape the model

## Anti-patterns

- one backlog item per implementation task
- one `SPEC.md` per child story when the epic is the real capability boundary
- milestone descriptions that duplicate entire epic bodies
- story bodies rewritten into execution handoffs after planning
