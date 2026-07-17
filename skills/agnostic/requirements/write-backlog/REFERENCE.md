# Write Backlog Reference

## Purpose

`write-backlog` is the canonical backlog-authoring skill for this repo.

It turns wayfinder routes, requirements discussions, grill artifacts, and accepted decisions into first-class backlog items.

Supported `kind` values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

It does not write specs, plans, or execution handoffs.

Downstream contract:

- every supported `kind` is visible, assignable, searchable, linkable, and closeable in the target provider
- `fog` is root-level only
- concrete `grilling`, `research`, `prototype`, `epic`, and `story` items live under a module/milestone
- one epic maps to one future `SPEC.md`
- child stories remain the product-facing slices beneath that epic
- `PLAN.md` later decomposes execution without replacing the backlog model

## Supported inputs

`write-backlog` can work from:

- a raw requirements discussion
- an existing messy backlog
- `requirements-grill` artifacts from `/Users/stefan/Desktop/repos/weareDevpunks-multiplai/.agents/skills/requirements-grill`
- `wayfinder` or `finder-phase` route decisions
- accepted research, prototype, or grilling closure notes

When grill artifacts exist, treat them as the highest-signal structured source for backlog derivation.

## `requirements-grill` artifact contract

Expected inputs:

- `<wiki-root>/content/docs/project/grilling/<topic>-grill-status.md`
- `<wiki-root>/content/docs/project/grilling/<topic>-grill-log.md`

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

Use this model:

```text
Backlog root
  fog
  module/milestone
    grilling
    research
    prototype
    epic
      story
```

Provider mapping:

- kind -> provider-native single-value kind storage where available
- fog -> root-level issue/work item/item
- module -> milestone or provider-equivalent grouping
- grilling/research/prototype -> module/milestone-scoped issue/work item/item
- epic -> module/milestone-scoped parent issue/work item/capability record
- story -> child issue/sub-issue/work item under an epic

monday.com mapping:

- fog -> root/backlog group item or root planning group item
- module/milestone -> board group
- grilling/research/prototype -> parent item in a module group
- epic/capability -> parent item
- story -> subitem
- story ordering -> dependency column when present

Rules:

- every supported kind must be a first-class backlog item
- `kind` is separate from workflow state, module grouping, and parent/child hierarchy
- `fog` must not have child tickets by default
- concrete non-fog items must first choose or create a module/milestone
- `grilling`, `research`, and `prototype` must close into accepted decisions before they create or update implementation epics/stories
- every story must be independently understandable and product-facing
- one epic may contain multiple stories
- one epic maps to one future `SPEC.md`
- one story does not imply one future `SPEC.md`

## Body ownership

Backlog bodies stay product-facing and kind-appropriate.

Fog bodies may include:

- unclear frontier
- why it is not yet module-scoped
- suspected modules or outcomes
- next route candidates

Grilling bodies may include:

- decision question
- context
- options
- branch/artifact links
- closure note with accepted answer and downstream items

Research bodies may include:

- research question
- evidence sources
- answer criteria
- closure note with evidence and downstream items

Prototype bodies may include:

- learning goal
- artifact expectations
- acceptance signal for the prototype result
- closure note with artifact links and downstream items

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
- approved artifact links or durable visual asset links when they are acceptance context

Do not put these in backlog bodies:

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

## Kind selection workflow

### 1. Decide whether the frontier is still fog

Use `fog` when the work is real but not yet sharp enough to choose a module/milestone or concrete learning/implementation ticket.

Do not use `fog` as:

- a parent for research or grilling tickets
- delivery scope
- a `SPEC.md` anchor
- an execution container

### 2. Derive modules

For concrete non-fog work, split the discussion into durable capability groups that would still make sense if implementation order changed.

Good module/milestone:

- intake and review
- account lifecycle
- notifications

Bad module:

- backend foundation
- frontend polish

### 3. Derive learning items

Use these before implementation scope is accepted:

- `grilling`: the blocker is a human decision.
- `research`: readonly investigation can answer it.
- `prototype`: artifact-driven learning is needed.

Each item must live under a module/milestone and close with an accepted decision note before changing epics/stories.

### 4. Derive epics

Within each module, create epics/capabilities that will later justify one coherent spec.

Good epic:

- submission lifecycle management
- account onboarding and activation

Bad epic:

- database schema
- API routes

### 5. Derive stories

Break each epic into stories only when the slice is product-facing and independently observable.

Good story:

- coordinator creates a new submission from external intake
- lead reassigns ownership to another reviewer

Bad story:

- add column and router
- create mutation and form hook

### 6. Add native order

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

## Closure and handoff

For `grilling`, `research`, and `prototype`, closure notes must include:

- answer
- accepted direction
- artifacts or evidence
- created or updated epics/stories

Do not create or update implementation `epic` or `story` items from unresolved learning work.

## Handoff to `create-spec`

When `create-spec` is given a backlog-backed epic:

- the epic is the spec anchor
- every child story is mandatory source material
- the resulting `SPEC.md` must cover all child stories under that epic
- the spec must preserve per-story requirements while unifying them into one coherent problem-space contract

## Provider policy

This skill documents raw provider create/setup payloads and provider-native kind storage.

In scope:

- create issue/work item payload shapes
- create provider containers needed for the canonical hierarchy
- required vs optional fields
- how `kind` appears at creation time
- how module/epic/story intent appears at creation time

Out of scope:

- completion-time execution sync
- comment payloads
- status churn after backlog creation
- provider-specific asset upload commands; use `repo-asset-management` for backlog attachments and repo-provider fallback links

If a provider cannot express part of the canonical model in one create call:

- document the limitation explicitly
- include the minimal native follow-up call needed to preserve module -> epic -> story
- do not silently flatten or reshape the model

## Anti-patterns

- one backlog item per implementation task
- one `SPEC.md` per child story when the epic is the real capability boundary
- milestone descriptions that duplicate entire epic bodies
- story bodies rewritten into execution handoffs after planning
