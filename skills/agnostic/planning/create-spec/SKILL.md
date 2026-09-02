---
name: create-spec
description: Compile confirmed product decisions into SPEC.md. Use when requirements are closed or explicitly parked and an agent-ready provider-neutral specification is needed before backlog or planning.
---

# Create Spec

`create-spec` is the no-interview compiler of confirmed decisions. Upstream
Wayfinder, research, prototyping, and grilling own uncertainty. This skill asks
no questions, runs no local grill, and performs no backlog mutation.

## Inputs

Accept confirmed decision evidence: grill status and logs, research reports,
prototype verdicts, ADRs, glossary, axioms, constraints, system facts, accepted
implementation and testing decisions, dependency evidence, and accepted
parent/base constraints. Provider backlog items may be source evidence, but
they are not specification identities or readiness prerequisites.

## Steps

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

1. Resolve the planning surface using
   [folder-naming.md](references/folder-naming.md).
2. Validate readiness using [readiness.md](references/readiness.md). If required
   evidence is missing, return one atomic `spec-not-ready` result and write no
   partial `SPEC.md`.
3. Compile [SPEC-TEMPLATE.md](assets/SPEC-TEMPLATE.md). Preserve only confirmed
   decisions; never invent closure. Serialize `Dependency Readiness` and
   `Branch/Base Intent` using the readiness contract.
4. Apply [spec-quality-bar.md](references/spec-quality-bar.md).
5. Update existing planning-surface indexes through
   [wiki-bookkeeping.md](references/wiki-bookkeeping.md).
6. Persist the completed spec and bookkeeping in a dedicated git commit. Never
   stage unrelated changes.
7. Push or explicitly retain the spec commit through the repository-approved remote
   mechanism. Verify the retained ref contains the spec commit, then construct and
   verify a stable blob URL before `write-backlog` may consume it. A local
   commit SHA plus path is insufficient.
8. Invoke `$show-me` to present the completed spec in `SPEC.md`. Derive the presentation
   only from the compiled spec and continue without adding an approval gate or
   inferring new closure.
9. Return `spec-written`, `readiness: agent-ready`, and the verified stable blob
   URL. If retention or URL verification fails, return one atomic
   `spec-not-ready` result and do not invoke backlog projection.

## Boundaries

- `SPEC.md` is the provider-neutral authority for resolved requirements. It
  identifies requirements and outcomes as `OUT-###`; these identifiers imply
  no provider Epic, Story, or Task identity or count.
- `write-backlog` receives only the verified stable blob URL, then derives or
  reuses the provider Epic, Stories, Tasks, and blocker graph supported by the
  compiled requirements and current provider evidence.
- A mutable path or local-only commit is not a backlog handoff.
- Accepted technical and testing decisions belong in the spec. Detailed task
  choreography does not.
- `create-plan` preserves provider Task identities and owns files, commands,
  workers, and validation detail.
- `Dependency Readiness` and `Branch/Base Intent` preserve accepted dependency
  evidence and parent/base constraints for `create-plan`.
- `readiness: agent-ready` is sufficient downstream. Do not add a review or
  approval stop; pause only for a user-requested HITL checkpoint.
- Compiler state is `compiled`. Human approval, when explicitly requested, is
  a separate optional action and is never inferred or stamped by the compiler.
