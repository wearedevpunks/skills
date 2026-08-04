---
name: create-spec
description: Compile confirmed product decisions into SPEC.md. Use when requirements are closed or explicitly parked and an agent-ready provider-neutral specification is needed before backlog or planning.
---

# Create Spec

`create-spec` is a no-interview compiler of confirmed decisions. Upstream
Wayfinder, research, prototyping, and grilling own uncertainty. This skill asks
no questions, runs no local grill, and performs no backlog mutation.

## Inputs

Accept confirmed user decisions and their evidence: grill status/logs, research
reports, prototype verdicts, ADRs, glossary, axioms, constraints, system facts,
and accepted implementation or testing decisions.

## Steps

1. Resolve the planning surface using [folder-naming.md](references/folder-naming.md).
2. Validate readiness using [readiness.md](references/readiness.md). If anything
   required is missing, return one atomic `spec-not-ready` result and write no
   partial `SPEC.md`.
3. Compile [SPEC-TEMPLATE.md](assets/SPEC-TEMPLATE.md). Preserve only confirmed
   decisions; never invent closure.
4. Apply [spec-quality-bar.md](references/spec-quality-bar.md).
5. Update existing planning-surface indexes through
   [wiki-bookkeeping.md](references/wiki-bookkeeping.md).
6. Persist the completed spec and its bookkeeping in a dedicated git commit.
   Never stage unrelated changes.
7. Push or explicitly retain the spec commit through a repository-approved
   remote mechanism, verify the retained ref contains the spec commit, then
   construct and verify a stable blob URL before `write-backlog` may consume it.
   A local commit SHA plus path is insufficient.
8. Return `spec-written` with `readiness: agent-ready` and the verified stable
   blob URL. If retention or URL verification fails, return one atomic
   `spec-not-ready` result and do not invoke backlog projection.

## Boundaries

- `SPEC.md` is provider-neutral authority. `write-backlog` projects epics and
  stories afterward; `create-plan` owns concrete files, commands, workers, and
  execution order.
- A mutable path or local-only commit is not a backlog handoff. `write-backlog`
  receives only the verified stable blob URL.
- Accepted technical and testing decisions belong in the spec. Detailed task
  choreography does not.
- `readiness: agent-ready` is sufficient downstream. Do not add a review or
  approval stop; pause only for a user-requested HITL checkpoint.
