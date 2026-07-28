# GitHub Projects and Issues Create Payload

Official sources:

- GraphQL mutations: [docs.github.com/en/graphql/reference/mutations](https://docs.github.com/en/graphql/reference/mutations)
- GraphQL input objects: [docs.github.com/en/graphql/reference/input-objects](https://docs.github.com/en/graphql/reference/input-objects)
- REST issues API: [docs.github.com/en/rest/issues/issues](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28)
- REST milestones API: [docs.github.com/en/rest/issues/milestones](https://docs.github.com/en/rest/issues/milestones?apiVersion=2022-11-28)
- Project fields: [docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields)
- Issue dependencies: [docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)

## Intent

Use GitHub Projects V2 and GitHub Issues together.

Canonical mapping:

- capability module -> Project V2 custom single-select field
- execution milestone -> chronological repository milestone derived from native issue dependencies
- epic/capability -> parent GitHub issue in the Project
- story -> child issue/sub-issue in the Project
- story ordering -> native issue dependency

Do not use an issues-only path for GitHub backlog sync when Projects V2 is available.

## Required bootstrap

Resolve these IDs before creating backlog items:

- `ownerId`
- `repositoryId`
- existing `projectV2.id` by title, if present
- existing repository milestone IDs/numbers by title

If the target Project V2 does not exist, create it:

```graphql
mutation CreateBacklogProject($ownerId: ID!, $repositoryId: ID!, $title: String!) {
  createProjectV2(input: {
    ownerId: $ownerId
    repositoryId: $repositoryId
    title: $title
  }) {
    projectV2 {
      id
      title
    }
  }
}
```

Expected Project fields:

- `Kind`: Project custom single-select field named `Kind` with values `fog`, `grilling`, `research`, `prototype`, `epic`, `story`
- `Capability module`: Project custom single-select field with one option per durable product capability
- `Epic`: text, storing the epic issue number/title for story rows

Create missing fields with `createProjectV2Field`; set values with `updateProjectV2ItemFieldValue`.

## Kind storage

Canonical `kind` storage is the Project custom single-select field named `Kind`.

Allowed values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

Avoid GitHub Issue Type as the default kind storage. Issue types are organization-level and better for broad org taxonomy. Labels may mirror kind for compatibility, but `Kind` is canonical when the Project field exists.

## Capability grouping

Store durable capability membership in a Project V2 custom single-select field named `Capability module`. This field answers which product capability owns the item. It is independent from repository milestones, parent/sub-issue hierarchy, and dependency order.

Fog leaves `Capability module` empty until sharpening selects a module. Every selected concrete non-fog issue receives exactly one capability-module value. A module can contain issues from multiple execution milestones.

## Chronological execution milestones

Use repository milestones named `M1`, `M2`, and so on only for dependency-derived execution waves. Do not create one repository milestone per capability module.

1. Create selected concrete non-fog issues without a milestone.
2. Add every native blocker with `addBlockedBy`.
3. Stop on a missing blocker target or dependency cycle.
4. Assign blocker-free issues to `M1`.
5. Assign every other issue to `M(1 + max(milestone number of each blocker))`.
6. Create or reuse the derived repository milestones and assign exactly one to each selected milestone-eligible issue.
7. Verify every blocker belongs to a strictly earlier milestone.

Issues from different capability modules can share one milestone, and one capability module can span multiple milestones. Recompute milestone assignment whenever native dependencies change.

## Create missing execution milestones

Create only the chronological repository milestones derived above.

Endpoint:

`POST https://api.github.com/repos/{owner}/{repo}/milestones`

Headers:

- `Accept: application/vnd.github+json`
- `Authorization: Bearer <TOKEN>`
- `X-GitHub-Api-Version: 2022-11-28`

Body:

```json
{
  "title": "M1",
  "state": "open",
  "description": "Dependency-derived execution wave 1.",
  "due_on": "2026-09-30T23:59:59Z"
}
```

Required field:

- `title`

For GraphQL milestone assignment after dependency derivation, use the returned milestone node ID as `milestoneId`.
For REST milestone assignment after dependency derivation, use the returned milestone number as `milestone`.

## Create a fog issue

Use a root-level issue for fog. Add it to the Project V2 at creation time. Do not assign it to an epic parent.

After creation, set Project fields:

- `Kind = fog`
- `Capability module` empty

## Create grilling, research, or prototype issues

Use first-class issues in the matching capability module. These are not child stories unless the provider explicitly needs a parent for visibility.

After creation, set Project fields:

- `Kind = grilling`, `Kind = research`, or `Kind = prototype`
- `Capability module = <module title>`

Closure notes for these issues must name the answer, accepted direction, artifacts or evidence, and created or updated epics/stories.

## Create an epic issue

Use a parent issue for each epic/capability. Add it to the Project V2 at creation time.

```graphql
mutation CreateEpic(
  $repositoryId: ID!
  $projectV2Ids: [ID!]
  $title: String!
  $body: String!
) {
  createIssue(input: {
    repositoryId: $repositoryId
    projectV2Ids: $projectV2Ids
    title: $title
    body: $body
    labelIds: []
  }) {
    issue {
      id
      number
      title
    }
  }
}
```

Epic body ownership:

- outcome
- scope
- cross-story constraints
- child story list
- links to source grill/status artifacts when relevant

After creation, set Project fields:

- `Kind = epic`
- `Capability module = <module title>`

## Create story issues

Use child issues/sub-issues for stories. Prefer `parentIssueId` at story creation time.

```graphql
mutation CreateStory(
  $repositoryId: ID!
  $projectV2Ids: [ID!]
  $parentIssueId: ID!
  $title: String!
  $body: String!
) {
  createIssue(input: {
    repositoryId: $repositoryId
    projectV2Ids: $projectV2Ids
    parentIssueId: $parentIssueId
    title: $title
    body: $body
    labelIds: []
  }) {
    issue {
      id
      number
      title
      parent {
        id
      }
    }
  }
}
```

Story body ownership:

- outcome
- acceptance signals
- non-goals
- links

After creation, set Project fields:

- `Kind = story`
- `Capability module = <module title>`
- `Epic = <epic issue number/title>`

If a story was created before the epic parent was known, attach it with `addSubIssue`:

```graphql
mutation AddStoryToEpic($issueId: ID!, $subIssueId: ID!) {
  addSubIssue(input: {
    issueId: $issueId
    subIssueId: $subIssueId
  }) {
    issue { id }
    subIssue { id }
  }
}
```

## Add native blockers

Use native issue dependencies for every real blocker between selected concrete non-fog issues.

```graphql
mutation AddBlockedBy($issueId: ID!, $blockingIssueId: ID!) {
  addBlockedBy(input: {
    issueId: $issueId
    blockingIssueId: $blockingIssueId
  }) {
    issue { id }
  }
}
```

`issueId` is the blocked issue. `blockingIssueId` is the prerequisite issue.

## Minimal creation order

1. Resolve repository/owner IDs.
2. Resolve Project V2 by title; create it if absent.
3. Resolve or create the `Kind`, `Capability module`, and `Epic` Project fields.
4. Resolve capability-module options.
5. Create root fog issues when the route remains root-level.
6. Create selected concrete non-fog issues with `projectV2Ids` and no execution milestone.
7. Create story child issues with `parentIssueId` and `projectV2Ids`.
8. Set Project field values for kind/capability/epic grouping.
9. Add native issue dependencies for every real blocker.
10. Derive, create or reuse, and assign chronological repository milestones from the complete dependency graph.

## Notes

- GitHub REST issue creation is still acceptable for plain issue creation, but GraphQL is preferred for backlog sync because it can attach Project V2 IDs, parent issues, and dependency relations.
- Project fields store capability grouping metadata. Issue hierarchy remains the source for epic -> story.
- Repository milestones store dependency-derived chronology only.
