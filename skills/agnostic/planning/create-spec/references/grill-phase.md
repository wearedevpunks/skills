# Grill Phase

Use this reference after discovery/questioning when unresolved spec questions would affect review trust.

## Goal

Resolve spec-affecting uncertainty before drafting. `Open Questions` should explain real deferred uncertainty, not skipped requirements work.

## When to Run

Run a bounded `$requirements-grill` phase when any of these are true:

- multiple child stories conflict or leave cross-story behavior unclear
- the target actor, outcome, boundary, non-goal, or acceptance signal is ambiguous
- several candidate `Open Questions` would otherwise appear in the spec
- a single unknown would materially change scope or acceptance criteria

Use lightweight direct clarification instead when only one small naming or wording detail is missing.

## Required Inner Behavior

Load and follow:

- `../../../requirements/requirements-grill/references/grilling-flow.md`
- `../../../requirements/requirements-grill/references/artifact-output.md` for serious grilling sessions

Preserve `$requirements-grill` behavior:

- ask one question at a time by default
- include a recommended answer and why it is preferred
- inspect repo/docs/backlog first when the answer can be found locally
- force precise choices when multiple interpretations exist
- close, park, or explicitly defer each branch

## Artifacts

For serious grill sessions, create or reuse:

- `docs/<topic>-grill-log.md`
- `docs/<topic>-grill-status.md`

For tiny clarification-only runs, durable grill artifacts are optional.

## Handoff Into Spec

After the grill phase:

- accepted answers become requirements, constraints, non-goals, acceptance criteria, or decision-log entries
- parked branches become non-goals or future-scope notes when they are outside the epic
- explicitly deferred branches become `Open Questions`
- external-validation branches become `Open Questions` with owner/status
- accepted scope changes must flow through `backlog-sync.md` before final spec drafting

Do not write the spec until each discovered branch is closed, parked, or explicitly deferred.
