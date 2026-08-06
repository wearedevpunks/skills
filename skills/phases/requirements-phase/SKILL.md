---
name: requirements-phase
description: Close requirements, retain an agent-ready spec, and verify its backlog projection.
disable-model-invocation: true
---

# Requirements Phase

Resumable requirements readiness: `requirements-grill -> create-spec -> write-backlog`.

## Workflow

1. Read [`phases/router.md`](phases/router.md) on every entry and cold resume.
2. Inspect the planning surface and derive exactly one route from current evidence.
3. Load only the selected gate file. Complete its bounded delegation and durable handoff update.
4. Stop on a checkpoint, blocker, or explicit lifecycle handoff. Otherwise re-enter the router.

## Runtime State

Each gate records resume evidence in `<planning-surface>/REQUIREMENTS-HANDOFF.md` using [`references/runtime-handoff.md`](references/runtime-handoff.md). Direct artifacts outrank this record, and its next suggested route is advisory.

## Gate Inventory

- [`phases/requirements-grill.md`](phases/requirements-grill.md): close or park product decisions and confirm shared understanding.
- [`phases/create-spec.md`](phases/create-spec.md): compile and retain the agent-ready specification.
- [`phases/write-backlog.md`](phases/write-backlog.md): verify a current provider projection of the retained specification.

Research and prototype needs return `finder-required`. A valid retained spec plus its verified matching projection returns `requirements-complete` for an explicit lifecycle handoff.
