---
name: create-spec
description: Create a SPEC.md file for a new feature, product, or system using the Spec-Driven Development (SDD) approach. The spec works in the problem space — it clarifies the "what", not the "how", and when backlog context exists it maps to one epic/capability and must unify all child-story requirements beneath it. Use this skill whenever the user wants to write a spec, define requirements, capture what needs to be built, create a specification document, or start the SDD workflow.
---

# Spec Creator

## Contract

- **Role:** higher-order spec authoring skill
- **Entrypoint type:** public entrypoint
- **Upstream:** new idea, feature request, epic/capability issue, or problem statement
- **Delegates to:** none
- **Downstream:** reviewed `SPEC.md`, then usually `create-plan` or `implement-spec`
- **Entry conditions:** wiki domain can be resolved, or the user creates one first with `create-wiki-domain`
- **Stop conditions:** `SPEC.md`, wiki index, and wiki log are updated, then wait for user review

This skill creates `SPEC.md` files that stay in the problem space: what to build, who it is for, why it matters, what counts as done, and what is out of scope.

When backlog context exists, one `SPEC.md` maps to one parent epic/capability issue and must cover the full scope of that epic. If the epic has child stories, the spec must explicitly incorporate and unify the requirements of all of them.

The output lives at `apps/wiki/specs/<domain>/<folder-name>/SPEC.md`.

## Quick start

1. Read `apps/wiki/AGENTS.md` first. Stop if the wiki is not bootstrapped.
2. Read `references/discovery.md` and orient yourself in the right wiki domain before asking questions.
3. If backlog context exists, read the parent epic and every child story before asking questions.
4. If the user did not provide a concrete request, ask for a rough description first.
5. Read `references/questioning.md` and ask only the clarifying questions needed to write a trustworthy spec.
6. Read `references/folder-naming.md` to resolve the domain and spec folder path.
7. Read `assets/SPEC-TEMPLATE.md` and write the spec.
8. Read `references/spec-quality-bar.md` before saving.
9. Read `references/wiki-bookkeeping.md` to update `index.md`, `<domain>-specs.md`, and `log.md`.
10. Read `references/handoff.md` to choose the next-step recommendation and stop after user review.

## Workflow

### Default workflow

1. Build orientation first; do not jump straight into writing.
2. Ask only enough to make the spec crisp, testable, and bounded.
3. When an epic has child stories, harvest and preserve each story's requirements before drafting.
4. Keep the spec free of implementation detail.
5. Use the template structure exactly, then remove all template scaffolding.
6. Update wiki bookkeeping in the same run.
7. Stop after presenting the spec and the recommended next step.

## Advanced features

- Discovery and repo orientation: see [references/discovery.md](references/discovery.md)
- Clarifying-question strategy: see [references/questioning.md](references/questioning.md)
- Domain and folder naming rules: see [references/folder-naming.md](references/folder-naming.md)
- Acceptance-criteria and quality bar: see [references/spec-quality-bar.md](references/spec-quality-bar.md)
- Wiki index and log updates: see [references/wiki-bookkeeping.md](references/wiki-bookkeeping.md)
- Review closeout and next-step routing: see [references/handoff.md](references/handoff.md)
- Canonical backlog model: see [../write-backlog/assets/concepts/backlog-model.md](../write-backlog/assets/concepts/backlog-model.md)
