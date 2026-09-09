# Delivery Context Continuity

Use this contract at delivery entry and after each Phase Result. Durable sources
remain authoritative; routing is native-harness reasoning, not a runtime service.

## Select instructions and validate pointers

1. Keep project facts and hard ownership/authority boundaries always loaded.
2. Load the selected workflow contract required by the current action. Load an
   optional technique only when its named trigger applies; retain its pointer
   until then. Record selected instruction-surface Context Pointers, identities
   and freshness in the packet's `context_pointers` and `evidence_freshness`.
   Do not assemble all skills or phase bodies at entry.
3. Resolve only the Context Pointers needed for that action. Each pointer has
   `authority_kind`, `locator`, optional `selector`, `identity` (content digest,
   revision or observed state identity), and `freshness_rule` checked by its
   consumer. A timestamp alone is not semantic freshness.
4. A missing, stale, malformed or ambiguous pointer stops its dependent action.
   The parent may perform exactly one bounded refresh of the named authority
   for that resolution episode. Continue only after proving exactly one current
   identity. Otherwise emit `blocked`, naming the exact pointer and missing
   proof. Never choose a near match, infer missing content or copy a broad
   authority set. A retry with unchanged evidence cannot restart the refresh
   allowance; a new authoritative observation defines a new resolution episode.

Completion: every required pointer resolves uniquely and its consumer checked
freshness, or the dependent action is blocked with retained resolution evidence.

## Warm or cold route

Only Full Delivery carries a continuing Delivery Context Packet in memory.
Warm routing requires the same native task, delivery goal, accepted bounds,
next-action authority, branch/base/target and fresh required evidence. Compare
identities before action, including each affected Relevant Input Set: declared
Read Dependencies and Shared Runtime Resources as well as Active Write Scopes.

A new task, Delivery Handoff, changed bounds or required authority, inconsistent
Git target, stale evidence or unresolved contradiction cold-routes before further
action. Discard the packet and resolve current named authorities from durable
pointers. Invalidate only affected evidence and eligibility; independent work
with matching inputs remains eligible. Route affected task proof back to the
parent's [execution gates](../../../agnostic/planning/implement-spec/references/parallel-orchestration.md)
before dependent release or finalization. This adds no lock or execution engine.

On cold resume, read durable mutation receipts and provider readback before any
retry. Reuse matching complete proof; perform only the unproven remainder.
Never duplicate a repository or provider mutation already proven complete.

Completion: record `warm` or `cold`, the identity comparison and exact invalidated
proof behind an evidence pointer; the next action has current authority.

## Disposable Delivery Context Packet

Carry only `delivery_goal_identity`, `accepted_bounds_identity`, authoritative
`context_pointers`, `git_identity` (branch/base/target), `phase`, `next_action`,
`active_identity` (Task or review), `evidence_freshness`, `blocker` and
`stop_condition`. Explicit `none` is valid for an absent active identity or
blocker. Create it from resolved authority; update it only through Phase Results.

Each optional Derived Context Excerpt contains only bounded action-relevant
content or rationale, with a source Context Pointer, source identity, freshness
rule and explicit `non_authoritative: true`. Its source always wins. Full
artifact/report/skill bodies, command logs, unsourced excerpts and unbounded
narrative fail contract validation. A missing required identity, pointer,
freshness, blocker or stop field also fails closed before action.

The packet is disposable: never write it into a Delivery Handoff or other durable
artifact. A packet is not a receipt, plan, report or acceptance record.

## Common Phase Result

Every phase emits this compact envelope, including failure, no-op and human stops:

```text
phase:
outcome: complete | blocked | failed | skipped | human_steering_required
authority_or_evidence_created: Context Pointer[]
changed_facts: bounded delta (explicit none when unchanged)
invalidated_evidence: Context Pointer[] (explicit none when unchanged)
next_eligible_phase: phase or none
blocker_or_stop_reason: exact reason or explicit none
context_pointers: only those needed next
```

Validate all fields before consuming the result. Pointer entries obey the
pointer contract above; required delta and stop fields cannot be omitted.
Keep phase-specific state, logs and detailed rationale in pointed durable
artifacts. `failed` records an attempted action's observed failure; `blocked`
records unavailable required proof or prerequisite. `skipped` requires an exact
no-op reason. `human_steering_required` points to the retained handback outcome.
A Phase Result neither accepts a Task nor replaces its Task Gate.

Full Delivery updates its packet and re-enters the router. Direct phase, explicit
HITL checkpoint, standalone review, narrow resume and closeout invocations emit
one Phase Result and stop at the requested boundary. Resume intent alone does
not grant Full Delivery continuation.

## Legacy cold reconstruction

For a legacy plan, notes, handoff or retained report, derive the current compact
projection at read time. Preserve every historical byte, valid report identity
and ordinal. Resolve goal/bounds, Git target, next action and evidence from the
legacy artifact's named durable authorities, not absent guessed fields. Keep
unknowns explicit. Unreconstructable required authority returns `blocked` with
the exact artifact pointer and missing proof. Only new writes use the compact
contracts; normalization never bulk-migrates history or resets review lineage.

Completion: before/after legacy digests match, recovered report identities and
ordinals match, and all required projected authority is proven or exactly blocked.
