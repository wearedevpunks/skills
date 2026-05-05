# Grill Phase

Use after discovery/questioning when unresolved spec questions would affect review trust.

## Trigger

Run bounded `$requirements-grill` when:

- multiple child stories conflict or leave cross-story behavior unclear
- the target actor, outcome, boundary, non-goal, or acceptance signal is ambiguous
- candidate `Open Questions` would materially change scope, trust, or acceptance criteria

Use lightweight direct clarification instead when only one small naming or wording detail is missing.

## Load

Follow:

- `../../../requirements/requirements-grill/references/grilling-flow.md`
- `../../../requirements/requirements-grill/references/artifact-output.md` for serious grilling sessions

## Rules

- Ask one question at a time by default.
- Include a recommended answer and why it is preferred.
- Inspect repo/docs/backlog first when the answer can be found locally.
- Force precise choices when multiple interpretations exist.
- Close, park, or explicitly defer each branch.

## Artifacts

For serious sessions, create or reuse:

- `docs/<topic>-grill-log.md`
- `docs/<topic>-grill-status.md`

Tiny clarification-only runs do not need durable grill artifacts.

## Handoff

- accepted answers become requirements, constraints, non-goals, acceptance criteria, or decisions
- parked branches outside the epic become non-goals or future scope
- explicitly deferred branches become `Open Questions`
- external-validation branches become `Open Questions` with owner/status
- accepted scope changes must flow through `backlog-sync.md` before final spec drafting

Do not write the spec until each discovered branch is closed, parked, or explicitly deferred.
