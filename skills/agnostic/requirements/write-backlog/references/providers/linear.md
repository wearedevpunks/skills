# Linear Provider Adapter

Read this reference only when the resolved provider is Linear. It translates
the provider-neutral mutation envelope into native Linear objects; hierarchy
policy and mutation authority remain in Write Backlog.

## `linear-free-v1` Representation

`linear-free-v1` is the sole default Linear Free representation.

| Product meaning | Linear representation | Required ownership |
| --- | --- | --- |
| Product/Backlog Root | top-level Linear Initiative | no semantic parent |
| Product Area | Linear Project | member of the Root Initiative |
| Initiative | Linear Issue labeled `Kind/initiative` | member of its Product Area Project |
| Epic | child Issue labeled `Kind/epic` | `parentId` is its Initiative |
| Story | child Issue labeled `Kind/story` | `parentId` is its Epic |
| Task | child Issue labeled `Kind/task` | `parentId` is its Story |
| Fog | lateral Issue labeled `Kind/fog` | provenance, never a hierarchy parent |

The Root is the only native Initiative. Each Product Area has one Root
Initiative membership. Initiative, Epic, Story, and Task Issues share the
Product Area Project and team; required `Kind/*` labels and recursive
`parentId` relations preserve semantic type and ownership. A nested native
Initiative, a Project per semantic Initiative or Epic, an extra parent, or a
mismatched Project is divergent topology. It remains unchanged until an
explicitly approved Normalization operation targets it.

## Destination and Read-Before-Write

1. Read `.devpunks/settings.json`. Keep the current `backlogProjectUrl` key; it
   identifies the Product/Backlog Root Initiative.
2. Resolve that Root by stable provider ID. Read its workspace ID, workspace
   name, workspace URL, and configured Root URL. A connector alias is only a
   routing hint.
3. Require the returned workspace ID and workspace URL to identify the same
   workspace encoded by the configured Root URL. A wrong workspace returns its
   observed identity, expected identity, and zero provider mutations.
4. Treat a Linear Project URL, legacy project destination, or any non-Initiative
   Root URL as invalid. Return exact `hi ensure` destination guidance and zero
   writes rather than guessing or creating another Root.
5. Read all candidate Projects, Issues, parents, labels, milestones, relations,
   views, and durable identity links before choosing create, reuse, or enrich.

Stable provider identity plus durable wiki identity is the reuse key. A title
match, incomplete search, ambiguous candidate, conflicting identity, unexpected
parent, or unsupported representation returns exact steering and zero writes.

## Initialization Metadata and Views

Project wiki content remains authoritative. Project the Root's Product brief,
business objectives, target users, product boundaries, Product Map, constraints
and non-goals, operating rules, owner, repository link, wiki link, and current
and future `V*` context into supported Initiative fields and description.

Use the configured issue label group for exact labels including
`Kind/initiative`, `Kind/epic`, `Kind/story`, `Kind/task`, `Kind/fog`,
`Kind/grilling`, `Kind/research`, and `Kind/prototype`. Entity type already
distinguishes the Root and Product Area Project. Missing, overlapping, or
non-exclusive Kind labels return setup guidance and zero writes. Ordinary
projection reuses configured label IDs; initialization may provision labels
only after a structural preview and explicit approval.

Preserve semantically equivalent existing views before proposing another:

- **Product Map**: Product Area, Initiative, and Epic structure without Story
  or Task noise
- **Roadmap**: ordered `V*` milestones and Story/Task progress rolled up through
  Epic and Initiative outcomes
- **Fogs**: unresolved provenance, affected structures, and production evidence
- **Current Delivery**: active Stories and Tasks with milestone, owner, status,
  and native blocker readiness

If the connected provider cannot create, update, or read back a required view,
return exact manual setup guidance and zero initialization writes.

## Milestones and Blockers

Reuse a fitting existing `V*` milestone before proposing one. Linear milestones
are project-scoped, so every Story belongs to exactly one milestone in its
Product Area Project. Every derived Task belongs to the same Project and
milestone as its Story. Product Areas, Initiatives, and Epics may span
iterations. A milestone record retains the Version name, one-sentence product
goal, and included product outcomes or capability changes when supported; a
name-only fallback keeps richer meaning in the linked wiki.

Validate the complete reachable Task graph before mutation. Reject missing
parents or blocker targets, Task/Story milestone mismatch, future-iteration
dependencies, duplicate edges, self-edges, and cycles. Materialize only accepted
edges as native `blockedBy` and reciprocal `blocks` relations.

## Provenance

Fog remains lateral. Use native `relatedTo` relations for Fog-to-Issue
provenance and immutable source links in every enriched or produced Issue and
Project description. Historical staged tickets are read-only compatibility
evidence and are excluded from automatic Normalization.

## Small Mutation and Exact Readback

Build the complete intended mutation envelope in memory: ordered operations,
stable IDs, preconditions, immutable source identities, approval record, and
expected readback. Preview every material structural change and obtain explicit
approval before writing. Write only the validated delta, parent-first, using
stable IDs; capture each returned ID before a dependent operation.

Exact readback must prove:

1. workspace and Root identity
2. Root Initiative membership for every Product Area Project
3. recursive Initiative → Epic → Story → Task parent chain
4. Product Area Project, team, and `Kind/*` identity for every Issue
5. exactly one contextual `V*` milestone per Story and the same one per Task
6. semantic views, Fog provenance, immutable sources, and source links
7. every native `relatedTo`, `blockedBy`, and `blocks` relation
8. created, enriched, repaired, or unchanged classification for every object

A mismatch remains unresolved reconciliation. On partial provider failure,
stop further writes, read back every affected object, and return observed writes,
the recovery point, and exact residual delta. Resume only after fresh reads.
