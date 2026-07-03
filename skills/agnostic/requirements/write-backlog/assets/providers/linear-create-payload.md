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

Linear label groups allow only one label from the group per issue. Do not use workflow state as kind. Other labels may mirror domain or module metadata, but the `Kind/...` label is canonical.

## Repo mapping

- fog -> root-level issue with `Kind/fog`; no parent, no module milestone required until sharpened
- module -> Linear project milestone
- grilling -> module/milestone-scoped issue with `Kind/grilling`
- research -> module/milestone-scoped issue with `Kind/research`
- prototype -> module/milestone-scoped issue with `Kind/prototype`
- epic -> top-level issue with `Kind/epic`
- story -> child issue created with `parentId` and `Kind/story`

`grilling`, `research`, and `prototype` closure notes must name the answer, accepted direction, artifacts or evidence, and created or updated epics/stories.

## Notes

- Linear issues belong to a single team.
- If `stateId` is omitted, Linear assigns the team’s default backlog or triage state.
- If the `Kind` label group is absent, create or request it before backlog sync.
- Linear’s GraphQL schema is introspectable. If you need a workspace-specific or newly-added create field, inspect `IssueCreateInput` before hardcoding it.
- Project milestone assignment is part of project-backed issue creation in Linear. Treat the current schema or SDK types as the source of truth for the exact milestone input field name in your workspace version.
