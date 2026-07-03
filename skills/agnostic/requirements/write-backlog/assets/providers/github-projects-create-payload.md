# GitHub Projects and Issues Create Payload

Official sources:

- GraphQL mutations: [docs.github.com/en/graphql/reference/mutations](https://docs.github.com/en/graphql/reference/mutations)
- GraphQL input objects: [docs.github.com/en/graphql/reference/input-objects](https://docs.github.com/en/graphql/reference/input-objects)
- REST issues API: [docs.github.com/en/rest/issues/issues](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28)
- REST milestones API: [docs.github.com/en/rest/issues/milestones](https://docs.github.com/en/rest/issues/milestones?apiVersion=2022-11-28)

## Intent

Use GitHub Projects V2 and GitHub Issues together.

Canonical mapping:

- module/milestone -> repository milestone plus a Project V2 grouping field
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
- `Module/Milestone`: text or single-select
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

## Create missing milestones

Use repository milestones for the module/milestone container.

Endpoint:

`POST https://api.github.com/repos/{owner}/{repo}/milestones`

Headers:

- `Accept: application/vnd.github+json`
- `Authorization: Bearer <TOKEN>`
- `X-GitHub-Api-Version: 2022-11-28`

Body:

```json
{
  "title": "M1 - Intake and Review",
  "state": "open",
  "description": "Module container for intake and review backlog.",
  "due_on": "2026-09-30T23:59:59Z"
}
```

Required field:

- `title`

For GraphQL issue creation, use the returned milestone node ID as `milestoneId`.
For REST issue creation, use the returned milestone number as `milestone`.

## Create a fog issue

Use a root-level issue for fog. Add it to the Project V2 at creation time. Do not assign it to an epic parent.

After creation, set Project fields:

- `Kind = fog`
- `Module/Milestone` empty or root/backlog value

## Create grilling, research, or prototype issues

Use first-class issues in the matching module/milestone. These are not child stories unless the provider explicitly needs a parent for visibility.

After creation, set Project fields:

- `Kind = grilling`, `Kind = research`, or `Kind = prototype`
- `Module/Milestone = <module title>`

Closure notes for these issues must name the answer, accepted direction, artifacts or evidence, and created or updated epics/stories.

## Create an epic issue

Use a parent issue for each epic/capability. Add it to the Project V2 at creation time.

```graphql
mutation CreateEpic(
  $repositoryId: ID!
  $projectV2Ids: [ID!]
  $milestoneId: ID
  $title: String!
  $body: String!
) {
  createIssue(input: {
    repositoryId: $repositoryId
    projectV2Ids: $projectV2Ids
    milestoneId: $milestoneId
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
- `Module/Milestone = <module title>`

## Create story issues

Use child issues/sub-issues for stories. Prefer `parentIssueId` at story creation time.

```graphql
mutation CreateStory(
  $repositoryId: ID!
  $projectV2Ids: [ID!]
  $milestoneId: ID
  $parentIssueId: ID!
  $title: String!
  $body: String!
) {
  createIssue(input: {
    repositoryId: $repositoryId
    projectV2Ids: $projectV2Ids
    milestoneId: $milestoneId
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
- `Module/Milestone = <module title>`
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

## Add story blockers

Use native issue dependencies for story ordering.

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

`issueId` is the blocked story. `blockingIssueId` is the prerequisite story.

## Minimal creation order

1. Resolve repository/owner IDs.
2. Resolve Project V2 by title; create it if absent.
3. Resolve or create Project fields.
4. Resolve or create repository milestones for modules.
5. Create root fog issues when the route remains root-level.
6. Create grilling, research, prototype, or epic issues with `projectV2Ids` and `milestoneId`.
7. Create story child issues with `parentIssueId`, `projectV2Ids`, and `milestoneId`.
8. Set Project field values for kind/module/epic grouping.
9. Add native issue dependencies for real story blockers.

## Notes

- GitHub REST issue creation is still acceptable for plain issue creation, but GraphQL is preferred for backlog sync because it can attach Project V2 IDs, parent issues, and dependency relations.
- Project fields mirror planning/grouping metadata. Issue hierarchy remains the source for epic -> story.
- Repository milestones remain the source for module/milestone grouping when GitHub is the provider.
