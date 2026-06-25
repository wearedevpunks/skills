# Backlog Phase

Convert approved design artifacts into backlog work.

## Prerequisite

At least one fresh approved artifact set with an artifact contract.

## Steps

1. Verify approved artifact links, durable asset links, scope, constraints, and acceptance checks.
2. Use `repo-asset-management` for backlog attachments first and repo-provider fallback when backlog attachments are unavailable or unsuitable.
3. Activate `write-backlog` from this phase only.
4. Include approved artifact context in backlog bodies: scope, intent, links, constraints, implementation notes, acceptance checks, and fallback blockers.
5. Record created or updated backlog ids.

## Rules

- Do not copy provider upload commands here; `repo-asset-management` owns them.
- Do not drop visual evidence when attachments fail. Record the fallback path or blocker.
- Backlog conversion is blocked for unapproved scope units.

## Output

- Backlog ids and URLs.
- Approved artifact links attached or linked.
- Attachment fallback or blockers.
- Phase handoff with next route: delivery-handoff.
