# Business Grilling Gate

## Entry guard

One exact Fog exists and its Business grilling evidence is missing or invalid.

## Inputs

Fog snapshot; project wiki; existing Product Areas, Initiatives, Epics, and
milestones; accepted project language; wrapper presentation profile.

## Bounded action

1. Read all direct Business-stage children before ensuring one. Resume reuses
   the exact child and its durable wiki/provider identities.
2. When none exists, allocate and persist one durable Business grilling-child
   wiki identity. Authorize its child shell by the exact Fog identity, Stage
   `Business`, and singleton cardinality key. Send that child-shell ensure
   intent to `$write-backlog` and require exact readback before grilling. This
   ensure does not require accepted grilling evidence. Ambiguity or duplicate
   child identity produces zero writes and routes to human steering.
3. Read the relevant existing Product Areas, Initiatives, Epics, milestones,
   and their stable identities before proposing structure.
4. Use `$show-me` to visualize all relevant existing Product Areas, Initiatives,
   Epics, and milestones together with the proposed impact. If the request
   crosses a Product Area or Initiative boundary, show the split and stop at
   `scope-expansion-checkpoint` for an explicit split-or-proceed choice.
5. Activate atomic `$grilling` on the ensured Business child. Use `$wait-what`
   language whenever the request, project term, outcome, boundary, or proposed
   placement does not land: pause, repitch plainly in project language, and ask
   again.
6. Settle why the request matters, target user or stakeholder, intended product
   outcome, boundaries/non-goals, durable constraints, and the exact existing
   or proposed Product Area -> Initiative -> Epic path.
7. Prefer stable-identity reuse and enrichment. A new Product Area, Initiative,
   or Epic is a scope-expansion proposal, never a title-only default. Existing
   Product Areas and Initiatives may be changed after the required structural
   preview and approval. Never duplicate an Initiative.
8. Persist the immutable accepted resolution for that child. Only then emit one
   semantic Business projection intent for reconciliation.

## Invariants

This gate uses `$grilling`, not `$requirements-grill`. It asks no implementation
architecture questions. Fog stays lateral and records every object enriched or
proposed. Creating the child shell does not require accepted grilling evidence.
Resume reuses the exact child; ambiguity or duplicate identity produces zero
writes and routes to human steering.

## Completion evidence

Exactly one Business child, accepted immutable resolution pointer, stable
resolved hierarchy identities or approved proposals, and one semantic
projection intent.

## Declared exits

- `business_accepted` -> reconciliation.
- `support_required` -> Research or Prototype through router re-entry.
- `scope-expansion-checkpoint` -> persist the exact decision and stop.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing evidence.

## Durable handoff

Persist durable child wiki/provider identities before the grill, then its
accepted evidence pointer, support relations, hierarchy identities, decision
checkpoints, projection intent, and exit.
