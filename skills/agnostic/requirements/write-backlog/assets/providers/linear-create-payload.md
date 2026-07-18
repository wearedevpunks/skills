# Linear Create Payload

Official sources:

- GraphQL getting started: [linear.app/developers/graphql](https://linear.app/developers/graphql)
- Issue creation overview: [linear.app/docs/creating-issues](https://linear.app/docs/creating-issues)

## Transport

- endpoint: `POST https://api.linear.app/graphql`
- headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <ACCESS_TOKEN>`

## Minimum documented mutation

```graphql
mutation IssueCreate($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    success
    issue {
      id
      identifier
      title
      url
    }
  }
}
```

```json
{
  "query": "mutation IssueCreate($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier title url } } }",
  "variables": {
    "input": {
      "teamId": "TEAM_UUID",
      "title": "Lead manages unassigned submissions",
      "description": "## Outcome\n\n...\n\n## Acceptance signals\n\n- [ ] ...",
      "projectId": "PROJECT_UUID",
      "parentId": "EPIC_UUID",
      "priority": 2,
      "labelIds": ["KIND_STORY_LABEL_UUID"],
      "stateId": "STATE_UUID",
      "dueDate": "2026-05-01"
    }
  }
}
```

## Required fields

- `teamId`
- `title`

## Common optional fields for backlog creation

- `description`
- `projectId`
- `parentId`
- `priority`
- `labelIds`
- `stateId`
- `dueDate`

## Kind storage

Canonical `kind` storage is a single-select Linear label group.

Use one label from the `Kind` group:

- `Kind/fog`
- `Kind/grilling`
- `Kind/research`
- `Kind/prototype`
- `Kind/epic`
- `Kind/story`

Linear label groups allow only one label from the group per issue. Do not use workflow state as kind. Other labels may mirror domain or capability-module metadata, but the `Kind/...` label is canonical.

## Repo mapping

- fog -> root-level issue with `Kind/fog`; no parent or capability module required until sharpened
- capability module -> non-milestone capability metadata, such as a dedicated module label
- execution milestone -> chronological Linear project milestone derived from native blockers
- grilling -> capability-module-scoped issue with `Kind/grilling`
- research -> capability-module-scoped issue with `Kind/research`
- prototype -> capability-module-scoped issue with `Kind/prototype`
- epic -> top-level issue with `Kind/epic`
- story -> child issue created with `parentId` and `Kind/story`

`grilling`, `research`, and `prototype` closure notes must name the answer, accepted direction, artifacts or evidence, and created or updated epics/stories.

## Chronological execution milestones

Linear project milestones answer first/next/later. Name them chronologically, such as `M1`, `M2`, and `M3`, and derive every assignment from native `blockedBy` / `blocks` relations:

1. Create the issues and native blocker relations first across the full selected scope.
2. Stop materialization on a missing blocker target or cycle.
3. Assign issues with no blockers to `M1`.
4. Assign every other issue to `M(1 + max(milestone number of each blocker))`.
5. Create or reuse the derived chronological project milestones and assign exactly one to each issue in scope.
6. Verify every blocker is in a strictly earlier milestone than the issue it blocks.

Issues in the same derived wave share a milestone and can proceed in parallel, even when they belong to different capability modules. A capability module can span multiple milestones. Capability grouping, parent/child hierarchy, and existing milestone assignment never determine chronology. Native blocker relations remain authoritative; recompute milestone assignment and numbering whenever they change.

## Notes

- Linear issues belong to a single team.
- If `stateId` is omitted, Linear assigns the team’s default backlog or triage state.
- If the `Kind` label group is absent, create or request it before backlog sync.
- Linear’s GraphQL schema is introspectable. If you need a workspace-specific or newly-added create field, inspect `IssueCreateInput` before hardcoding it.
- Project milestone assignment is part of project-backed issue creation in Linear. Treat the current schema or SDK types as the source of truth for the exact milestone input field name in your workspace version.
