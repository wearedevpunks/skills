# Write Backlog Examples

## Reconstruct An Existing Product

The wiki identifies the product goal, owner, repository, two Product Areas, and
three Initiatives. Fresh provider reads find the same Product/Backlog Root and
one current and one future `V*` milestone under stable identities.

Existing structure is reused. The proposal enriches missing root metadata,
links the wiki and repository, and adds the missing Fogs view. `$show-me`
presents that structural delta. After explicit approval, exact readback proves
the metadata, links, milestone context, and Product Map, Roadmap, Fogs, and
Current Delivery views.

## Cumulative Finder Projection

One Fog records a product owner's request.

1. **Business**: accepted Business grilling reuses Product Area `Knowledge` and
   Initiative `Reliable answers`, then enriches Epic `Source quality`. The Fog
   links to all three; no duplicate structure is created.
2. **Functional**: one accepted Functional child creates Story `Reader sees why
   an answer is trustworthy` in `V4.0`. Its body preserves the product outcome,
   `US-001`, `AC-001`, demonstration, evidence, and Fog provenance.
3. **Technical**: an authoritative agent-ready `SPEC.md` at a stable blob URL
   enriches the existing Epic and Story with immutable spec authority, then
   creates required Task `Expose source confidence` and Task `Render confidence
   explanation`. Both inherit `V4.0`; the second is blocked by the first.

The Task graph has stable provider identities, no missing target, no
future-iteration dependency, no self-edge, and no cycle. Exact readback proves
the Story parent and milestone, both Task parents and milestones, the native
blocker, source links, and Fog relations.

## Existing Milestone Wins

The accepted Functional resolution targets the current product increment. A
fresh provider read finds a fitting `V4.0` milestone with the same goal and
outcomes. Reuse it. Do not propose another milestone because its display title
differs from the draft wording.

If milestone metadata is supported, preserve Version name, One-sentence product
goal, and Included product outcomes or capability changes. Otherwise preserve
the version name alone.

## Ambiguous Identity

Two Epics share a similar title, and neither carries the Fog's durable wiki
identity. Show both candidates and return the identity gap with zero writes.
Title similarity cannot select an upsert target.

## Partial Provider Failure

The Story write succeeds and the second Task relation fails. Stop, read back the
Story, Tasks, milestone memberships, and blockers, then return observed IDs plus
the missing relation. A retry reconciles fresh state and writes only that
validated relation.
