# GitHub Provider Adapter

Use one Projects V2 surface as the Product/Backlog Root and GitHub Issues for
the delivery hierarchy. Keep these storage mechanics inside this adapter; the
mutation envelope and callers use provider-neutral terms.

## Semantic Mapping

| Product meaning | GitHub representation |
| --- | --- |
| Product/Backlog Root | one Projects V2 project |
| Product Area | configured Project field value |
| Initiative | configured Project field value scoped to its Product Area |
| Epic | Issue added to the Project |
| Story | Epic sub-issue, created with `parentIssueId` or attached with `addSubIssue` |
| Task | required nested sub-issue of its Story |
| Story and every Task iteration | the same repository milestone named `V*` |
| Task precedence | native `addBlockedBy` relation |
| Fog | lateral provenance and source links in every object it enriches or produces |

Preflight the complete intended mapping. If any required hierarchy, semantic
field, Project membership, repository milestone, blocker relation, or source
link is not representable, return zero provider mutations. Return actionable setup guidance for the missing GitHub capability.

## Backlog Initialization

Resolve the Project by stable node ID and durable wiki identity. Read its
metadata, linked repositories, fields, views, items, and repository milestones
before proposing a delta. A title is discovery evidence, never an upsert key.

Use `updateProjectV2` and `linkProjectV2ToRepository` to reconcile:

- title: the Product/Backlog Root name
- short description: the Product brief
- README: business objectives, target users, product boundaries, the existing
  Product Map, durable constraints and non-goals, operating rules, owner,
  repository link, wiki link, and current and future `V*` milestone context
- repository link: the verified repository selected by project context

Preserve richer product meaning in the wiki. The Project README links that
authority and carries only the context needed to interpret its backlog.

### Semantic fields

Read every field and option by node ID before matching values. The required
configured fields are:

- configured **Product Area** single-select: each stable option ID maps to one
  durable wiki identity
- configured **Initiative** single-select: each stable option ID maps to one
  durable wiki identity and its Product Area identity, so equal titles remain
  distinct
- configured **Kind** single-select: Fog, Epic, Story, Task, Grilling, Research,
  or Prototype
- configured **Grilling Stage** single-select: Business, Functional, or
  Technical; populated only when Kind is Grilling

Put durable wiki identities in Product Area and Initiative option descriptions
when that field is API-supported. In the Project README, also maintain the
canonical identity map: field ID, option ID, option name, durable wiki identity,
and Initiative parent Area identity. Every Issue body records the selected durable
identities and stable option ID references. A standalone URL is provenance only
and is not an identity.

Backlog initialization may propose `createProjectV2Field` for missing required
fields or options, then `createProjectV2View` for missing semantic views. Show
the complete existing-versus-intended topology in a structural preview and wait
for explicit approval before provisioning. Ordinary writes never provision
fields, options, or views; they stop with the exact missing metadata and setup
action.

### Semantic views

Create or preserve equivalent configured views. The `createProjectV2View`
input can set `name`, `layout`, and `configuration.visibleFieldIds`.
`updateProjectV2View` can set `name`, `layout`, `filter`, and
`configuration.visibleFieldIds`. Automatic view mutation is limited to these
schema-supported inputs.

- **Product Map**: Epics grouped by Product Area and Initiative, without Story
  or Task rows.
- **Roadmap**: Stories and Tasks grouped by repository `V*` milestone, with
  Product Area, Initiative, Epic, and progress visible.
- **Fogs**: Fog rows with business status, affected Area/Initiative/Epic,
  target iteration, generated Stories and Tasks, completion iteration, and
  production-evidence links.
- **Current Delivery**: active Stories and Tasks grouped by repository `V*`,
  status, owner, and native blocker readiness.

GitHub's view mutation inputs leave grouping and sorting unavailable. When an
accepted view needs either and the current view does not match, preflight stops
with zero provider mutations. Return exact manual setup guidance naming the
view, layout, filter, visible fields, group fields, and sort fields. Resume only
after the user saves that configuration; then read back the view ID, layout,
filter, visible fields, `groupByFields`, `verticalGroupByFields`, and
`sortByFields`. A partially automated view is not accepted representation.

### Repository V* milestones

Read open and closed repository milestones and reuse a fitting existing `V*`
before proposing a new one. Never invent a version identity. A supported full
milestone records:

1. Version name
2. One-sentence product goal
3. Included product outcomes or capability changes

Use the repository milestone title for the Version name and its description
for the accepted goal and outcomes. When description metadata is unsupported,
name only is sufficient. Story and Task assignment still requires exact
milestone readback.

## Read-Before-Write Mutation

Stable provider identity plus durable wiki identity is the upsert key. Resolve
both identities, then read the exact Project, Issues, Project items, parents,
milestones, fields, blockers, bodies, and source links. A title-only or
ambiguous match authorizes zero provider mutations; return every candidate and
the identity needed to resume.

Construct the complete delta in memory before the first write. Validate every
Project item, parent, repository `V*`, configured field option, Fog/source link,
and reachable Task blocker. All intended objects must use the same verified
repository and Product/Backlog Root.

After representability and approval gates pass, use this order:

1. Reconcile approved Project metadata, semantic fields, views, and milestone
   definitions required by this operation.
2. Use `createIssue` with `projectV2Ids`, `parentIssueId`, and `milestoneId` as
   applicable. Create or enrich the Epic, then each Story under its Epic, then
   every required Task under its Story. Use `addSubIssue` only to attach an
   existing exact child.
3. Resolve each new Project item ID and apply configured Product Area,
   Initiative, Kind, and Grilling Stage values with
   `updateProjectV2ItemFieldValue`.
4. Add each validated Task prerequisite with `addBlockedBy`; the blocked Task is
   `issueId` and its prerequisite is `blockingIssueId`.

The Fog body records its durable wiki identity, immutable accepted evidence,
and stable links to every Area, Initiative, Epic, Story, and Task it enriched or
produced. Each produced Issue links back to the Fog and immutable source that
authorized it. Fog remains outside the Epic parent chain.

## Exact Readback

Read back and compare the Project membership, parent chain, repository `V*`,
configured field values, `blockedBy` edges, source and Fog links, and stable
Issue IDs and URLs for every intended item. For initialization, also compare
Project metadata, linked repository, every option ID-to-durable-wiki-identity
mapping, and all four view configurations. A response without this exact match
is unresolved, not success.

If a partial provider failure occurs, stop further writes. Read back every
intended object, return observed identities and relations, and identify the
first unresolved delta. A resumed run repeats read-before-write and applies only
the still-missing validated operations.

## Runtime Coverage Gate

The first workflow-created nested Task must be read back with its exact Project
membership, Story parent, repository `V*`, Product Area, Initiative, Kind,
native blocker, Fog backlink, and immutable source in its body, plus stable ID
and URL. GraphQL schema introspection is not runtime proof. This gate does not
claim full view runtime capability. Retain immutable command output and provider
URLs before closing or deleting run-owned fixtures. When provider capability or
authentication blocks this proof, report the exact blocker and leave runtime
coverage unclaimed.
