---
name: create-spec
description: Create a SPEC.md file for a new feature, product, or system using the Spec-Driven Development (SDD) approach. The spec works in the problem space — it clarifies the "what", not the "how", and when backlog context exists it maps to one epic/capability and must unify all child-story requirements beneath it. Use this skill whenever the user wants to write a spec, define requirements, capture what needs to be built, create a specification document, or start the SDD workflow.
---

# Spec Creator

## Contract

- **Role:** higher-order spec authoring skill
- **Entrypoint type:** public entrypoint
- **Upstream:** new idea, feature request, epic/capability issue, or problem statement
- **Delegates to:** `planning-discovery` for bounded readonly orientation when subagents are available; `$parallel-research` for split-friendly readonly discovery; `$requirements-grill` when discovery leaves meaningful spec-affecting unknowns; `$write-backlog` when the spec objective or grill outcomes change epic/story scope; `spec-reviewer` for a final readonly quality pass when subagents are available
- **Downstream:** reviewed `SPEC.md`, then usually `create-plan` or `implement-spec`
- **Entry conditions:** a planning surface can be resolved from routed wiki docs, legacy wiki specs, existing docs, backlog context, or the user's request
- **Stop conditions:** `SPEC.md` and any existing planning-surface indexes/logs are updated, then wait for user review

This skill creates `SPEC.md` files that stay in the problem space: what to build, who it is for, why it matters, what counts as done, and what is out of scope.

When backlog context exists, one `SPEC.md` maps to one parent epic/capability issue and must cover the full scope of that epic. If the epic has child stories, the spec must explicitly incorporate and unify the requirements of all of them.

Resolve the output root from the repo before writing. Prefer `apps/wiki/content/docs/project/specs/<domain>/<folder-name>/SPEC.md`, then legacy `apps/wiki/specs/<domain>/<folder-name>/SPEC.md`, then `docs/specs/<domain>/<folder-name>/SPEC.md`.

## Quick start

1. Resolve the planning surface with `references/discovery.md`; do not block solely because legacy `apps/wiki/AGENTS.md` is absent.
2. Read `references/discovery.md` and orient yourself in the right spec domain or project area before asking questions.
3. When discovery spans independent code paths, docs, backlog items, prior specs, or hypotheses, read and use `$parallel-research` for readonly sidecar coverage before synthesizing.
4. If backlog context exists, read the parent epic and every child story before asking questions.
5. If the user did not provide a concrete request, ask for a rough description first.
6. Read `references/questioning.md` and ask only the lightweight clarifying questions needed to identify whether a grill phase is required.
7. If draft `Open Questions` would affect spec trust, read `references/grill-phase.md` and run a bounded `$requirements-grill` phase before writing.
8. If the requested objective, discovery, or grill changes accepted scope, child stories, deferred scope, story wording, or story order, read `references/backlog-sync.md` and run `$write-backlog` to sync the backlog automatically before final drafting.
9. Read `references/folder-naming.md` to resolve the domain and spec folder path.
10. Read `assets/SPEC-TEMPLATE.md` and write the spec.
11. Read `references/spec-quality-bar.md` before saving.
12. If subagents are available, use `spec-reviewer` for a readonly pass over the draft before user review.
13. Read `references/wiki-bookkeeping.md` to update the indexes/logs that exist for the resolved planning surface.
14. Read `references/handoff.md` to choose the next-step recommendation and stop after user review.

## Workflow

### Default workflow

1. Build orientation first; do not jump straight into writing.
2. Ask only enough to make the spec crisp, testable, and bounded.
3. Use `$parallel-research` when readonly orientation can be split cleanly across independent evidence sources; keep synthesis and spec decisions local.
4. When an epic has child stories, harvest and preserve each story's requirements before drafting.
5. Use `$requirements-grill` for meaningful spec-affecting unknowns; do not replace that phase with ad hoc `Open Questions` prompts.
6. Use `$write-backlog` automatically before final drafting when accepted spec direction implies backlog changes, whether that direction came from the user's objective, discovery, or a grill phase.
7. Keep the spec free of implementation detail.
8. Use the template structure exactly, then remove all template scaffolding.
9. Use `spec-reviewer` to catch invented requirements, missing constraints, vague acceptance criteria, and contradictions before yielding when subagents are available.
10. Update planning-surface bookkeeping in the same run.
11. Stop after presenting the spec and the recommended next step.

### Dependency readiness and stack intent

When backlog context exists, inspect backlog dependencies before drafting.

- A task-level `depends_on` inside one epic or plan is implementation ordering,
  not PR stack topology.
- A backlog dependency between epics/stories is a dependency-readiness gate.
- If the dependency has an `IMPLEMENTATION-NOTES.md` or equivalent
  implemented-status artifact, trust it as implemented. Record
  `No Stack Required` unless another open PR dependency still applies.
- If no implemented-status artifact exists, use local code evidence or merged PR
  evidence as fallback proof that the dependency landed.
- If the dependency is represented by an open parent PR, record
  `Branch/Base Intent`.
- If the dependency is neither proven implemented nor represented by an open
  parent PR, block spec creation and report the missing dependency evidence.

When backlog dependencies exist, add this section to `SPEC.md`:

```md
## Dependency Readiness

- Status: No Stack Required | Branch/Base Intent | Blocked
- Dependency: <epic/story/pr/link>
- Evidence: <implementation notes path | implemented-status artifact | merged PR | parent PR>
- Reason: <why this status was chosen>
```

Only for stack-dependent work, also add:

```md
## Branch/Base Intent

- Parent PR: #123
- Parent branch: team/name/parent
- Child branch: team/name/child
- PR base: team/name/parent
- Required gate: stack sync --dry-run after PR creation/update
```

`create-spec` records stack intent only. Do not create, switch, or push git
branches unless the user explicitly requests branch setup during the spec turn.

## Advanced features

- Discovery and repo orientation: see [references/discovery.md](references/discovery.md)
- Clarifying-question strategy: see [references/questioning.md](references/questioning.md)
- Requirements grill phase: see [references/grill-phase.md](references/grill-phase.md)
- Backlog sync after grilling: see [references/backlog-sync.md](references/backlog-sync.md)
- Domain and folder naming rules: see [references/folder-naming.md](references/folder-naming.md)
- Acceptance-criteria and quality bar: see [references/spec-quality-bar.md](references/spec-quality-bar.md)
- Planning surface index/log updates: see [references/wiki-bookkeeping.md](references/wiki-bookkeeping.md)
- Review closeout and next-step routing: see [references/handoff.md](references/handoff.md)
- Canonical backlog model: see [../write-backlog/assets/concepts/backlog-model.md](../write-backlog/assets/concepts/backlog-model.md)
