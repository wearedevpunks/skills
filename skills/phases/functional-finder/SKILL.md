---
name: functional-finder
description: Define shippable product behavior through cumulative Business and Functional grilling.
disable-model-invocation: true
---

# Functional Finder

Human entrypoint for a technical or proficient nontechnical user. Use precise
project language. Define product behavior one level below Business scope and
stop before engineering design or Task decomposition.

## Inputs

- one product-behavior request
- optional stable provider or durable wiki Fog identity
- optional exact accepted Business child and Product Area -> Initiative -> Epic
  path
- product context, constraints, dependencies, and milestone preference supplied
  by the human

## Composition

Directly compose [the Finder engine](../finder-phase/SKILL.md) with target
depth: `Functional`. This is cumulative Business and Functional depth over one
Fog; this adapter supplies only its audience, presentation, and return profile.

Reuse a fresh accepted Business child. When none exists, an exact existing
Product Area -> Initiative -> Epic path from provider readback plus the
human's explicit `reuse-unchanged` decision takes the fast path without
changing business scope. Its Business-path adoption gate creates the required
Business child and immutable resolution without a Business grill. Otherwise
let the engine complete Business grilling
before Functional grilling. When accepted lower-stage evidence needs repair,
the engine may enrich existing Business structures before it continues. The
engine's
[Functional gate](../finder-phase/phases/functional-grilling.md) composes atomic
`$grilling` and resolves one Functional child per accepted Story intent.

## Presentation

Before grilling, use the smallest authoritative `$show-me` view to show the
current Business path, relevant existing Stories and `V*` milestones, and the
requested product behavior. Continue to use `$show-me` at each decision about:

- the observable workflow
- the Story split and Story boundaries
- an alternate path or failure path
- a product dependency
- the milestone iteration
- the final Story write

When terminology or behavior does not land, use `$wait-what`: pause, repitch in
plain language with accepted project terms, and ask again. Preserve the user's
language when it already matches those terms.

## Functional depth

For each proposed Story, settle the actor, trigger, observable workflow and
result, applicable business rules, visible alternate or failure paths,
product-level edge cases, acceptance signals, Story boundaries, known product
dependencies, and unresolved engineering questions.

Assign exactly one contextual `V*` milestone to each Story. Reuse a fitting
existing `V*` milestone before proposing a new one. Show and obtain approval
before moving accepted work to another milestone.

After immutable Functional evidence is accepted, hand semantic projection
intent to `$write-backlog`. It is the physical mutation authority and must
write and read back exactly one Story per accepted Functional child.

## Return

Return the exact Fog identity, accepted Business child identity and resolution
pointer, selected Functional child identities and resolution pointers, the
resolved Product Area -> Initiative -> Epic path, exact Story provider
identities and readback, milestone membership, unresolved decisions, and the
durable Finder handoff. Stop at the engine's `target_depth_reached` outcome.
