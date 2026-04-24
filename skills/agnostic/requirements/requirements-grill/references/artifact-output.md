# Artifact Output

Use this reference to maintain the durable grill artifacts.

This workflow is always paired with [grilling-flow.md](grilling-flow.md) during a serious grilling session.

## Durable Artifacts

At the start of a serious grilling session, create or reuse:

- `docs/<topic>-grill-log.md`
- `docs/<topic>-grill-status.md`

The log is the durable decision record.
The status file is the current branch dashboard.

## Grill Log Contract

The log is structured, not a raw transcript.

Record accepted decisions as:

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

Maintain a compact branch dashboard with:

- branch name
- completion percentage
- locked direction
- still-open items
- parked branches

Completion percentages are working signals:

- `0-50%`: branch discovered but unsettled
- `50-85%`: major direction set, important questions remain
- `85-99%`: mostly closed, only constants/schema/naming remain
- `100%`: design closed; remaining work is implementation/tuning
- `parked`: preserved for later, out of current scope

## Branch Closure

When a branch closes:

1. Update the grill log with final accepted decisions.
2. Update the status file percentage and open items.
3. If the branch changes durable domain/product knowledge, run the wiki-output workflow.
4. Say exactly what changed and which artifacts were updated.

## Final Handoff

At the end, report:

- branch percentages
- parked branches
- remaining non-design validation work
- recommended next planning direction

If all active branches are `100%`, say the requirements grill is done and the likely next direction is backlog/user-story creation.
