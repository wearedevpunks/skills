---
name: business-finder
description: Structure one product request through Business grilling and stop at its business backlog depth.
disable-model-invocation: true
---

# Business Finder

Human entrypoint for a nontechnical product owner. Use plain business language
and the project's accepted terms. Preserve the user's words when they already
land; explain unfamiliar backlog terms before using them.

## Inputs

- one product request
- optional stable provider or durable wiki Fog identity
- product context the human supplied

## Composition

Directly compose [the Finder engine](../finder-phase/SKILL.md) with target
depth: `Business`. Its [Business grilling gate](../finder-phase/phases/business-grilling.md)
owns the atomic grill, visual decisions, support cycles, and accepted evidence.
This adapter supplies only the audience presentation profile.

## Return

Return the exact Fog identity, accepted Business resolution, resolved Product
Area -> Initiative -> Epic path, exact created-or-enriched readback identities,
and unresolved decisions. Stop at the engine's `target_depth_reached` outcome.
