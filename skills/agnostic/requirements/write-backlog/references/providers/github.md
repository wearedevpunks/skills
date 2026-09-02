# GitHub Provider Adapter

Read this reference only when the resolved provider is GitHub. It translates
the provider-neutral mutation envelope into one Projects V2 operating surface;
hierarchy policy and mutation authority remain in Write Backlog.

## Accepted Representation

| Product meaning | GitHub representation |
| --- | --- |
| Product/Backlog Root | one Projects V2 project |
| Product Area | configured Product Area field option |
| Initiative | configured Initiative field option scoped to its Product Area |
| Epic | Issue added to the Project |
| Story | Epic sub-issue through `parentIssueId` or `addSubIssue` |
| Task | nested sub-issue of its Story |
| Story and Task iteration | same repository milestone named `V*` |
| Task precedence | native `addBlockedBy` relation |
| Fog | lateral provenance and immutable source links |

Issues, recursive parent/sub-issue relations, repository milestones, native
blocker relations, semantic fields, and product-owner views must all be
representable. A missing required representation returns actionable setup
guidance and zero provider mutations. There is no flat Issues fallback.

## Destination and Identity

Resolve the configured Product/Backlog Root by stable Projects V2 node ID and
durable wiki identity. Read the linked repository, Project metadata, fields,
views, items, Issues, parents, milestones, blockers, bodies, and immutable
source links before choosing create, reuse, or enrich.

Stable provider identity plus durable wiki identity is the reuse key. A title
match, standalone provenance URL, incomplete search, ambiguous candidate,
conflicting identity, wrong repository, or unsupported parent relation returns
exact steering and zero writes.

## Initialization Metadata, Fields, and Views

Use `updateProjectV2` and `linkProjectV2ToRepository` to project the Product
brief, business objectives, target users, product boundaries, Product Map,
constraints and non-goals, operating rules, owner, repository link, wiki link,
and current and future `V*` context. Richer meaning remains in the wiki.

Read every configured option by stable node ID:

- **Product Area**: one option ID per durable Product Area identity
- **Initiative**: one option ID per durable Initiative identity, with its
  Product Area identity in the canonical Project README map
- **Kind**: Epic, Story, Task, Fog, Grilling, Research, or Prototype

Record durable wiki identities in option descriptions when the API supports
them and in the Project README identity map otherwise. Ordinary writes reuse
configured IDs. Initialization may call `createProjectV2Field` only after a
structural preview and explicit approval.

Create or preserve semantically equivalent product-owner views. Supported
automatic inputs are `createProjectV2View` and `updateProjectV2View` fields
`name`, `layout`, `configuration.visibleFieldIds`, and `filter`:

- **Product Map**: Product Area, Initiative, and Epic structure
- **Roadmap**: repository `V*` milestones with rolled-up Story/Task progress
- **Fogs**: unresolved provenance, affected structures, and production evidence
- **Current Delivery**: active Stories and Tasks with native blocker readiness

If grouping or sorting is required but unavailable through the connected API,
return manual setup guidance naming the exact view, fields, grouping, and sort.
Resume only after exact view readback. A partially configured view is not an
accepted representation.

## Milestones and Blockers

Read open and closed repository milestones and reuse a fitting existing `V*`
before proposing another. Every Story belongs to exactly one repository
milestone and every derived Task belongs to the same milestone as its Story.
Preserve Version name, one-sentence product goal, and included product outcomes
or capability changes in supported milestone metadata; otherwise retain richer
meaning in the linked wiki.

Validate the complete reachable Task graph before mutation. Reject missing
parents or blocker targets, Task/Story milestone mismatch, future-iteration
dependencies, duplicate edges, self-edges, and cycles. Materialize only accepted
edges with native `addBlockedBy` relations.

## Small Mutation

Build the complete mutation envelope in memory: ordered operations, stable IDs,
preconditions, immutable source identities, approval record, and expected
readback. Preview every material structural change and obtain explicit approval.

Write the approved delta parent-first:

1. Reconcile approved Project metadata, fields, views, and milestones.
2. Use `createIssue` with `projectV2Ids`, `parentIssueId`, and `milestoneId` as
   applicable. Attach an existing exact child only with `addSubIssue`.
3. Resolve Project item IDs and set Product Area, Initiative, and Kind through
   `updateProjectV2ItemFieldValue`.
4. Add each validated Task prerequisite with `addBlockedBy`.

Fog stays outside the parent chain. Every enriched or produced Issue records
its Fog backlink when one exists, durable wiki identity, applicable `OUT-###`
traceability, and immutable specification source.

## Exact Readback and Recovery

Exact readback must prove Project membership, recursive parent chain, repository
milestone, Product Area, Initiative, Kind, native blocker relations, Fog
provenance, immutable source links, stable IDs, and URLs. Initialization also
reads back Project metadata, linked repository, identity maps, and all required
view configurations. A response without an exact comparison remains unresolved.

On partial provider failure, stop further writes, read back every affected
object, and return observed writes, the recovery point, and the exact residual
delta. A resumed operation repeats read-before-write and applies only the
remaining validated operations.

## Runtime Coverage Gate

The first workflow-created nested Task must read back its Project membership,
Story parent, repository `V*`, Product Area, Initiative, Kind, native blocker,
Fog backlink, immutable source, stable ID, and URL. Schema introspection is not
runtime proof. When provider capability or authentication blocks this proof,
report the exact blocker and leave runtime coverage unclaimed.
