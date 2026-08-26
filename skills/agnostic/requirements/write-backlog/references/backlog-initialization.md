# Backlog Initialization

Use this branch to initialize a greenfield backlog, reconstruct an inherited
backlog, or reconcile an existing backlog. It is backlog initialization, not a
separate Epic-creation flow.

## Read Before Proposal

Read the complete wiki context, repository identity, Product/Backlog Root,
Product Areas, Initiatives, Epics, Stories, Tasks, Fogs, provider metadata,
milestones, and saved views. Classify each desired object as exact reuse,
enrichment, missing, ambiguous, or conflicting. Existing coherent structure is
the default; initialization never recreates it under a new title.

For an inherited provider object with a stable provider ID but no durable wiki
binding, run the inherited-object adoption path in
`issue-reconciliation.md` before classifying it as missing or creating a
replacement. Adoption is an explicit identity decision, not automatic reuse.

## Root Metadata

Reconcile this complete product context:

- Product brief
- business objectives
- target users
- product boundaries
- existing Product Map
- durable constraints and non-goals
- operating rules
- owner
- repository link
- wiki link
- current and future `V*` milestone context

Project only provider-supported metadata. Preserve the full authoritative value
in the wiki and link it when the provider has no native field.

## Structure

Create or reconcile one Product/Backlog Root and evidence-backed Product Areas
and Initiatives. Business grilling creates or enriches Epics later; backlog
initialization does not invent empty Epics, Stories, or Tasks.

Creating a root, Product Area, Initiative, semantic field, or saved view is a
material structural change. Use `$show-me` to preview existing versus intended
topology and obtain explicit approval before writing.

## Milestone Context

Ensure one contextual current and one contextual future `V*` milestone are
identifiable. Reuse a fitting existing milestone before proposing another.
Preserve every valid existing `V*` milestone; propose a new one only when none fits
and an accepted version identity exists. Never invent a version number.

When the provider supports milestone metadata, write:

1. Version name
2. One-sentence product goal
3. Included product outcomes or capability changes

When those metadata fields are unsupported, name only is sufficient. Moving
work between milestones changes roadmap commitment and requires explicit
approval.

## Product-Owner Views

Create or preserve exactly these semantic views:

- **Product Map**: Product Area → Initiative → Epic, showing the existing
  product shape without Story or Task noise.
- **Roadmap**: ordered `V*` milestone iterations, with Story and Task progress
  rolled up to Epic and Initiative outcomes.
- **Fogs**: business status, affected Product Areas, Initiatives, and Epics,
  target iteration, generated Stories and Tasks, completion iteration, and
  production evidence.
- **Current Delivery**: active Stories and Tasks grouped by milestone iteration,
  status, owner, and blocker readiness.

Reuse an equivalent configured view. Creating or materially changing a view
requires the structural preview and approval gate.

## Completion

Write only the approved missing or stale delta. Read back the root metadata,
hierarchy, milestone context, semantic fields, and four views. Return exact
created, enriched, and unchanged identities. Initialization is incomplete when
any intended structure or representation cannot be read back.
