# Write Backlog Examples

## From discussion to backlog

Input:

> We need a workflow module for intake and review. Coordinators should capture submissions, reviewers should assess and route them, reassignment should preserve context, and archived records must remain visible for auditing.

Output shape:

- Module / milestone: `Intake and review`
- Epic: `Submission lifecycle management`
- Stories:
  - Coordinator creates a new submission from external intake
  - Reviewer updates notes and attached evidence
  - Reviewer views the full submission timeline
  - Lead reassigns ownership to another reviewer
  - Lead manages unassigned submissions
  - Lead imports historical submissions
  - System marks submissions unassigned when a reviewer is deactivated

Native order:

- `Lead manages unassigned submissions` is blocked by:
  - `Lead reassigns ownership to another reviewer`
  - `Lead imports historical submissions`
  - `System marks submissions unassigned when a reviewer is deactivated`

## From `requirements-grill` artifacts to backlog

Input artifacts:

- `docs/submission-lifecycle-grill-status.md`
- `docs/submission-lifecycle-grill-log.md`

Read status first:

- branch `ownership-transfer` = `100%`
- branch `unassigned-queue` = `100%`
- branch `historical-import` = `100%`
- branch `deactivation-handling` = `100%`
- recommended next direction = backlog/user-story creation

Read log second:

- accepted decisions define ownership visibility, unassigned handling, and import behavior
- superseded decisions are ignored in favor of the latest locked answer

Output shape:

- Module / milestone: `Intake and review`
- Epic: `Submission lifecycle management`
- Stories:
  - Lead reassigns ownership to another reviewer
  - Lead manages unassigned submissions
  - Lead imports historical submissions
  - System marks submissions unassigned when a reviewer is deactivated

## Story-shape reminder

Good story:

`As a team lead, I want to view and manage unassigned submissions so I can restore ownership quickly without losing context`

Bad story:

`Add queue table and reassignment mutation`
