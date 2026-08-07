# GitHub Projects and Issues Create Payload

Official sources:

- GraphQL mutations: [docs.github.com/en/graphql/reference/mutations](https://docs.github.com/en/graphql/reference/mutations)
- GraphQL input objects: [docs.github.com/en/graphql/reference/input-objects](https://docs.github.com/en/graphql/reference/input-objects)
- REST issues API: [docs.github.com/en/rest/issues/issues](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28)
- REST milestones API: [docs.github.com/en/rest/issues/milestones](https://docs.github.com/en/rest/issues/milestones?apiVersion=2022-11-28)
- Project fields: [docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields)
- Issue dependencies: [docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)

## Preflight before creation

Before creating any item, build the complete in-memory projection. Resolve every dependency target, reject missing targets, self-edges, and cycles, derive and verify every milestone, and prove the configured hierarchy, classification, and dependency representation is representable in GitHub. A failed preflight writes nothing.

## Intent

Use GitHub Projects V2 and GitHub Issues together.

Canonical mapping:

- capability module -> Project V2 custom single-select field
- execution milestone -> chronological repository milestone derived from native issue dependencies
- epic/capability -> parent GitHub issue in the Project
- story -> child issue/sub-issue in the Project
- story ordering -> native issue dependency

Do not use an issues-only path for GitHub backlog sync when Projects V2 is available.

## Update existing decision tickets

Use the GraphQL `updateIssue` mutation or REST issue update for claim, release, and resolve after reading the current assignees/state and rejecting a conflicting claim. Use only configured Project fields. Resolution closes the issue and records the immutable resolution pointer in the body or a durable comment. Return the updated issue id and URL to Finder.

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

Configured Project fields may include:

- `Kind`: Project custom single-select field named `Kind` with values `fog`, `grilling`, `research`, `prototype`, `epic`, `story`
- `Capability module`: Project custom single-select field with one option per durable product capability
- `Epic`: text, storing the epic issue number/title for story rows

Use `updateProjectV2ItemFieldValue` only for fields named by the project configuration. A missing configured field is a setup blocker; do not bootstrap classification fields implicitly.

## Provider classification

Classification examples assume explicit configuration.

Inspect configured provider metadata before choosing a representation. An adapter-specific Project custom single-select field named `Kind` may represent the direct backlog concepts.

Only when explicitly configured to use that field, resolve it and its matching option. If it is absent, record a setup blocker; do not create classification fields or options by default.

Allowed values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

Prefer the configured Project field when it exists. Issue types are organization-level and may instead be the workspace's chosen adapter representation. No particular field is required across providers.

Fallback order:

1. configured Project field
2. existing GitHub Issue Type or label that exactly preserves the direct concept
3. stable title prefix such as `[story]`

If repository policy permits none of these, fail preflight. Do not create classification fields, types, or labels implicitly.

## Capability grouping

Store durable capability membership in a Project V2 custom single-select field named `Capability module`. This field answers which product capability owns the item. It is independent from repository milestones, parent/sub-issue hierarchy, and dependency order.

Fog leaves `Capability module` empty until sharpening selects a module. Every selected concrete non-fog issue receives exactly one capability-module value. A module can contain issues from multiple execution milestones.

## Chronological execution milestones

Use repository milestones named `M1`, `M2`, and so on only for dependency-derived execution waves. Do not create one repository milestone per capability module.

1. In memory, resolve the complete selected graph and reject missing targets, self-edges, or cycles.
2. Derive blocker-free issues as `M1`; derive every other issue as `M(1 + max(milestone number of each blocker))`.
3. Verify every blocker belongs to a strictly earlier milestone and that GitHub can represent the complete hierarchy and graph.
4. Only after preflight passes, create issues, map planned keys to provider ids, add every native blocker with `addBlockedBy`, and create or reuse milestones.
5. Assign exactly one verified milestone to each selected milestone-eligible issue.

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

When Finder supplies a source fog parent, preserve it with `parentIssueId` or
`addSubIssue`. Keep the concrete issue's `Capability module` value. This is
evidence lineage, not epic/story hierarchy.

After creation, set Project fields:

- `Kind = grilling`, `Kind = research`, or `Kind = prototype`
- `Capability module = <module title>`

Closure notes for these issues record the answer or verdict, evidence, observations, open decisions, and resolution pointer for Wayfinder. They do not authorize delivery.

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
- immutable spec link
- accepted artifact links when relevant

Minimum body headings: `Outcome`, `Scope`, `Constraints`, `Immutable spec`, and `Stories`.

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
- source `US-###`
- covered `AC-###`
- demonstration
- non-goals
- immutable spec link
- accepted artifact links

Minimum body headings: `Outcome`, `Source stories`, `Acceptance criteria`, `Demonstration`, `Non-goals`, and `Links`.

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

1. Resolve repository/owner IDs, Project V2, configured fields, and capability-module options.
2. Complete the in-memory hierarchy, graph, milestone, and representability preflight.
3. Only after preflight passes, create root fog or selected delivery issues and story children.
4. Set only explicitly configured Project field values.
5. Map planned keys to provider ids and add native dependencies.
6. Create or reuse the already-derived chronological repository milestones and assign them.

## Notes

- GitHub REST issue creation is still acceptable for plain issue creation, but GraphQL is preferred for backlog sync because it can attach Project V2 IDs, parent issues, and dependency relations.
- Project fields store capability grouping metadata. Issue hierarchy remains the source for epic -> story.
- Repository milestones store dependency-derived chronology only.
