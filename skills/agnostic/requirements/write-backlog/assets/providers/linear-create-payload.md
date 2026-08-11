# Linear Create Payload

Official sources:

- GraphQL getting started: [linear.app/developers/graphql](https://linear.app/developers/graphql)
- Issue creation overview: [linear.app/docs/creating-issues](https://linear.app/docs/creating-issues)

## Transport

- endpoint: `POST https://api.linear.app/graphql`
- headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <ACCESS_TOKEN>`

## Preflight before creation

Before creating any item, build the complete in-memory projection. Resolve every dependency target, reject missing targets, self-edges, and cycles, derive and verify every milestone, and prove the configured hierarchy, classification, and dependency representation is representable in Linear. A failed preflight writes nothing.

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

## Update existing decision tickets

Use Linear `issueUpdate(id: ..., input: ...)` for claim, release, and resolve after reading the issue's current assignee/state and rejecting a conflicting claim. Use only configured assignee/state/label fields. Resolution updates the terminal state and appends the immutable resolution pointer to the issue body or closure comment. Return the updated identifier and URL to Finder.

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

The example `labelIds` value assumes an explicitly configured classification label group. Without it, use the fallback below and change the example title accordingly.

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

## Provider classification

Classification examples assume explicit configuration.

Inspect configured provider metadata before choosing a representation. An adapter-specific single-select Linear label group may represent the direct backlog concepts.

Only when explicitly configured to use a `Kind` label group, use one matching label:

- `Kind/fog`
- `Kind/grilling`
- `Kind/research`
- `Kind/prototype`
- `Kind/epic`
- `Kind/story`

Linear label groups allow only one label from the group per issue. Do not use workflow state as classification. Do not create a label group by default.

Fallback order:

1. configured label group
2. existing native issue label or category that exactly preserves the direct concept
3. stable title prefix such as `[story]`

If workspace policy permits none of these, fail preflight. Do not create labels implicitly.

## Repo mapping

- fog -> root-level issue with `Kind/fog`; no parent or capability module required until sharpened
- capability module -> non-milestone capability metadata, such as a dedicated module label
- execution milestone -> chronological Linear project milestone derived from native blockers
- grilling -> capability-module-scoped issue with `Kind/grilling`
- research -> capability-module-scoped issue with `Kind/research`
- prototype -> capability-module-scoped issue with `Kind/prototype`
- epic -> top-level issue with `Kind/epic`
- story -> child issue created with `parentId` and `Kind/story`

`grilling`, `research`, and `prototype` closure notes record the answer or verdict, evidence, observations, open decisions, and resolution pointer for Wayfinder. They do not authorize delivery.

## Delivery body contracts

Epic body ownership:

- outcome
- scope and cross-story constraints
- child story list
- immutable spec link
- accepted artifact links when relevant

Story body ownership:

- outcome
- source `US-###`
- covered `AC-###`
- demonstration
- non-goals and dependencies
- immutable spec link
- accepted artifact links

Use these headings in `description`; do not substitute a mutable local spec path.

## Chronological execution milestones

Linear project milestones answer first/next/later. Name them chronologically, such as `M1`, `M2`, and `M3`, and derive every assignment from native `blockedBy` / `blocks` relations:

Only selected non-fog `grilling`, `research`, `prototype`, `epic`, and `story` issues are milestone-eligible. Fog has no execution milestone until sharpened into concrete work. Capability-module metadata remains grouping and is not an execution issue.

1. In memory, resolve the complete selected graph and reject missing targets, self-edges, or cycles.
2. Derive blocker-free issues as `M1`; derive every other issue as `M(1 + max(milestone number of each blocker))`.
3. Verify every blocker is in a strictly earlier milestone and that the configured Linear representation supports the full graph.
4. Only after preflight passes, create issues, map planned keys to provider ids, create native blocker relations, and create or reuse the derived milestones.
5. Assign exactly one verified milestone to each selected milestone-eligible issue.

Issues in the same derived wave share a milestone and can proceed in parallel, even when they belong to different capability modules. A capability module can span multiple milestones. Capability grouping, parent/child hierarchy, and existing milestone assignment never determine chronology. Native blocker relations remain authoritative; recompute milestone assignment and numbering whenever they change.

## Notes

- Linear issues belong to a single team.
- If `stateId` is omitted, Linear assigns the team’s default backlog or triage state.
- If an explicitly configured label group is absent, record a provider setup blocker. Do not create classification labels or groups without explicit configuration.
- Linear’s GraphQL schema is introspectable. If you need a workspace-specific or newly-added create field, inspect `IssueCreateInput` before hardcoding it.
- Project milestone assignment is part of project-backed issue creation in Linear. Treat the current schema or SDK types as the source of truth for the exact milestone input field name in your workspace version.
