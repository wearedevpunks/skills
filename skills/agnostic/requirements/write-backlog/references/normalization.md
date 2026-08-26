# Normalization

Use this branch only for an explicit Normalization request. Invocation cadence
belongs to the caller.

## Inventory

Read the project wiki, fresh provider state, and every durable wiki and stable
provider identity before classifying drift. Read the configured
Product/Backlog Root, full product topology, Fog children, semantic fields,
views, milestones, statuses, relations, provenance, and immutable evidence.
Complete the inventory only when every relevant object is classified as exact,
drifted, ambiguous, or conflicting.

Detect every accepted drift class:

- invalid Fog child placement
- missing or invalid `Grilling Stage`
- duplicate or ambiguous structures
- stale links or status
- hierarchy drift
- roadmap or milestone drift
- wiki/provider disagreement

Audit the Fog-child lifecycle against these exact semantics:

- Fog direct children are `grilling`, Research, or Prototype items.
- Every `grilling` child has exactly one `Grilling Stage`: Business,
  Functional, or Technical. `Grilling Stage` is absent from every other kind.
- One Fog has one Business child, one or more Functional children, and one
  Technical child per Story.
- Research and Prototype children link to the exact grilling child they support.

New and resumed work uses the Fog-child lifecycle immediately. There is no
compatibility writer for the former Fog-graduation model. Normalization may
describe a legacy-shape migration, but that migration is a structural proposal
subject to preview and explicit approval.

Provider state proves operational facts. The wiki proves durable product
meaning. Stable provider identity plus durable wiki identity proves an exact
object; title similarity remains discovery evidence.

## Classify The Delta

For each finding, record the stable identities, owning authority, observed
state, intended state, drift class, dependent objects, and proposed action.
Ambiguous identities, incomplete searches, or conflicting authorities produce
zero writes. A wiki/provider disagreement about product meaning requires a new
human decision persisted in the wiki before another attempt.

Automatically repair only an unambiguous additive mapping or stale operational
field after complete preflight proves all of these conditions:

1. Durable wiki identity and stable provider identity select one exact object.
2. Fresh authority makes the intended value single-valued.
3. The delta adds a missing provenance or source relation, or replaces one
   stale status, link, owner, or other operational value with that exact value.
4. The delta preserves hierarchy, product boundary, goal, roadmap commitment,
   milestone membership, duplicate semantics, and every dependent relation.

Apply one safe repair at a time. Exact readback must prove the repaired field or
relation before the next write. For example, when one exact Story retains its
Fog relation but lacks the immutable reciprocal Fog source link required by the
accepted evidence, add that link and read back the exact Story body and Fog
relation. A similar title or inferred intent never qualifies.

## Structural Approval

Treat duplicate closure, merge, split, boundary change, goal change,
reparenting, milestone movement, reorganization, and migration from the former
Fog-graduation shape as structural. Use `$show-me` to present the exact current
and proposed topology before asking for explicit approval:

```text
Current (fresh provider read + durable wiki identity)
Root [stable ID]
└── Area A [stable ID]
    └── Initiative A [stable ID]
        └── Epic A [stable ID]

After (proposal only)
Root [same stable ID]
└── Area B [stable ID]
    └── Initiative A [same stable ID, proposed new parent]
        └── Epic A [same stable ID]

State: awaiting explicit approval
Provider mutations: zero
```

Label every unchanged, added, removed, moved, merged, split, and superseded
object. Include affected Fogs, Stories, Tasks, `V*` memberships, blockers,
views, source links, and the durable authority for the intended shape. The
visual explains the decision; it cannot grant approval. Keep zero provider
mutations until the user explicitly approves that exact proposal. A revised
proposal requires a new preview and approval.

## Apply And Return

Load provider-specific mechanics only from the selected Linear or GitHub
adapter. Apply the validated delta through that adapter, then use its exact
readback contract. Return each finding, classification, stable identity,
authority, approved decision, repair result, readback, and unresolved blocker.
Normalization is complete only when every finding is repaired, unchanged,
awaiting an explicit structural decision, or stopped with exact evidence.
