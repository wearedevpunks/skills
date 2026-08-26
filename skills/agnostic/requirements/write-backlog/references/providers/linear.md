# Linear Provider Adapter

Read this reference only when the resolved provider is Linear. It translates the
provider-neutral mutation envelope into native Linear objects; it does not
change product terms or authorize a mutation.

## Native Representation

| Product meaning | Linear representation | Required ownership |
| --- | --- | --- |
| Product/Backlog Root | top-level Linear Initiative | no semantic parent |
| Product Area | Linear Initiative | direct child of the Root |
| Initiative | nested Linear Initiative | exactly one Product Area parent |
| Epic | Linear Project | exactly one owning Initiative |
| Story | Linear Issue | member of its Epic Project |
| Task | Linear sub-issue | `parentId` is its Story; same Project and team |
| Fog | lateral Linear Issue | provenance, never a hierarchy parent |

Linear permits multiple initiative parents. The semantic contract is narrower:
each Product Area has the resolved Root as its only product parent, and each
nested Initiative has exactly one Product Area parent. An Epic has exactly one
owning Initiative membership. Additional native parents or owning Initiative
memberships are ambiguous hierarchy, not harmless metadata.

Product Area and Initiative are native Initiative layers, not labels or
milestones. Story has no parent Issue standing in for its Epic: Project
membership represents the Epic. Task nesting uses `parentId` to reference the
Story's stable provider ID.

## Read Before Write

Resolve and read the actual Linear workspace first:

1. Read `.devpunks/settings.json`. Resolve `backlogProjectUrl` as the top-level
   Linear Initiative by stable provider ID; the URL is a locator, not proof.
2. Read that Root Initiative, including its workspace ID and workspace URL, and
   match both to the workspace encoded by the configured Root URL.
3. Treat a Linear Project URL or any non-Initiative URL as a legacy or invalid
   destination. Return exact `hi ensure` migration guidance and zero writes.
4. Continue with the native object reads below only after Root and workspace
   identity agree.

- workspace ID, workspace name, and workspace URL
- Product/Backlog Root Initiative ID and URL
- expected parent and child Initiative IDs
- Epic Project IDs, owning Initiative memberships, and team memberships
- Story and Task Issue IDs, parents, Projects, teams, labels, and relations
- every Project milestone and selected milestone membership
- configured `Kind` and `Grilling Stage` label-group IDs and options
- every saved view's stable ID, type, filters, grouping, ordering, and scope

A connector alias is a routing hint, not identity evidence. Match the workspace
returned by the connected authority to the workspace encoded by the configured
Root URL. Resolve known objects by stable provider ID plus durable wiki identity.
A title-only match, alias-only workspace match, ambiguous candidate, unexpected
parent, or missing representation returns the evidence and zero writes.

Use provider search only to discover candidates. Before the first mutation,
read every candidate by ID and prove the complete intended hierarchy,
membership, milestone, field, view, provenance, and blocker delta in memory.

## Backlog Initialization

Use the Root Initiative as the compact Linear projection of the wiki-owned
product context. Preserve the full values under stable headings in its
description and use supported native fields where they add structure:

- `summary` or the opening description: Product brief
- description: business objectives
- description: target users
- description: product boundaries
- description: existing Product Map
- description: durable constraints and non-goals
- description: operating rules
- `owner`: owner
- description: verified repository link
- description: verified wiki link
- description: current and future `V*` milestone context

Keep repository link and wiki link as explicit Markdown links when the connected
Initiative API exposes no native link collection. Read their exact URLs back
from the Root description. Richer product meaning remains authoritative in the
wiki; the Linear projection links to it rather than inventing a substitute.

Reconcile existing Product Areas, nested Initiatives, and Epic Projects before
proposing new objects. New Root, Area, Initiative, Project, semantic field, or
view provisioning is structural: preview the current and intended topology and
obtain explicit approval. Write only the approved stable-ID delta.

### Semantic Fields

Use configured Linear label groups as issue-level semantic fields:

- `Kind`: the accepted Issue kind, including Fog, grilling, Story, and Task
- `Grilling Stage`: exactly Business, Functional, or Technical for a grilling
  Issue; absent from other kinds

Native Initiative and Project entity types already distinguish Root, Product
Area, Initiative, and Epic. Provisioning or changing a field, group, or option
requires a field or view preview and explicit approval. Ordinary projection
reuses exact configured IDs and never creates labels ad hoc. Overlapping,
missing, or non-exclusive representations stop with zero writes and setup
guidance.

### Product-Owner Views

Preserve an equivalent existing view before proposing a new one. The required
semantic views are:

- **Product Map**: Root -> Product Area -> Initiative -> Epic, without Story or
  Task noise
- **Roadmap**: `V*` iterations and their Story/Task progress rolled up through
  Epic and Initiative outcomes
- **Fogs**: Fog status, affected structures, target and completion iteration,
  generated work, and production evidence
- **Current Delivery**: active Stories and Tasks grouped by `V*`, status,
  owner, and blocker readiness

Compare semantics, not display title: view type, scope, filters, grouping,
ordering, and visible fields must match. View creation or material change needs
the structural preview and explicit approval. When the connected view API is
unavailable or unsupported, return the missing capability and zero writes for
initialization. A document, issue list, or guessed UI configuration is not an
exact view readback.

## Contextual Version Milestones

Reuse a fitting existing `V*` milestone before proposing one. Linear milestones
are project-scoped, so each Story's milestone must belong to its Epic's Linear
Project. When one product version crosses Epics, reconcile the same durable
version identity in each affected Project; a shared title alone is not identity.

Every Story has exactly one contextual `V*` milestone. Every Task has the same
Project milestone as its Story. Reject zero or multiple memberships and reject
a Task whose Project or milestone differs from its Story. Product Areas,
Initiatives, and Epics span versions. A Fog may target a fitting version; use a
native milestone only when its Issue belongs to the applicable Project,
otherwise preserve the target as a stable milestone link in its body.

When supported, milestone metadata contains:

1. Version name
2. One-sentence product goal
3. Included product outcomes or capability changes

Store goal and outcomes in the milestone description when that field is
supported. When milestone description metadata is unsupported by the connected
authority, the name-only fallback is sufficient and the full meaning remains in
the linked wiki. Moving an existing Story, Task, or Fog between milestones
changes roadmap commitment and requires explicit approval.

Blockers define delivery precedence. Before writing, traverse the complete
reachable Task graph and reject missing targets, future-iteration dependencies,
self-edges, and cycles. Materialize accepted edges with native `blockedBy` and
`blocks` relations; milestone order never creates a blocker.

## Lateral Fog Provenance

Fog remains lateral. Use native `relatedTo` relations between the Fog and every
resulting Story and Task Issue. Record stable Product Area, Initiative, and Epic
URLs in the Fog body. Add the immutable Fog source link to each enriched
Initiative or Project description so non-Issue objects preserve reciprocal
provenance. Read back both the Issue relation and every body or description
source link. A source link supplements native relations; it never becomes a
parent edge.

## Mutation And Exact Readback

Apply the validated, approved delta parent-first and use stable IDs for every
update or relationship. After each create, capture its returned ID before a
dependent write. On a partial provider failure, stop, read the affected objects,
and return the observed writes plus unresolved delta; resume from fresh reads
instead of replaying the batch.

RAC-2 is satisfied only after exact readback proves:

1. workspace and Root identity
2. Root -> Product Area -> Initiative parent hierarchy
3. Epic Project owning Initiative and team membership
4. Story Project membership and Task parent, Project, and team membership
5. exactly-one contextual milestone for every Story and the same milestone for
   every Task
6. semantic fields and all four views
7. Fog provenance, immutable evidence, and source links
8. every native `relatedTo`, `blockedBy`, and `blocks` relation
9. created, enriched, repaired, or unchanged state for each stable object

Any mismatch remains unresolved reconciliation. Report stable IDs, URLs,
observed provider state, approval record, and the first missing representation;
never claim success from mutation responses alone.
