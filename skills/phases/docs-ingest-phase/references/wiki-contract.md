# Wiki Contract

The wiki contract is the project's own declaration of where wiki knowledge
lives and who owns each part. It lives in the wiki-root `AGENTS.md`, which the
project owns. Every docs-ingest branch reads the contract; only wiki
setup/adoption writes it.

## Fields

A resolved contract declares all six fields:

- **Wiki location**: the wiki root directory and the framework that renders it.
- **Raw home**: the directory that keeps raw sources and their provenance
  records.
- **Canonical article tree**: the one routed tree of canonical articles and its
  navigation metadata.
- **Discovery entrypoints**: the root and section discovery indexes where agents
  and readers start.
- **Source owners**: per area, whether files are authored, generated from a
  named projection source, or owned by another surface, plus the visibility
  policy.
- **Validation commands**: the project commands that check source storage,
  knowledge/navigation and rendering.

## Resolve

1. Read the repository guidance for the declared wiki location, then the
   wiki-root `AGENTS.md`. Record each field with the file and line that declares
   it. Done when every field has a declared value with its evidence, or is
   marked `missing`.
2. Check each declared value against the working tree. Done when every field is
   `resolved` (declared and present), `missing`, or `conflicting` (declared, but
   the tree disagrees).

All six fields `resolved` gives a resolved contract. Any other result is a
**gap**: continue with [Adopt](#adopt) or [Set up](#set-up) when the task holds
setup authority, else with the [Gap report](#gap-report).

**Setup authority** is the user's request, in this task, to set up or adopt the
wiki, or project guidance that delegates it.

## Adopt

Use when a wiki tree exists and its contract is partial or absent.

- Write into the existing tree: the project keeps one canonical article tree.
- Preserve the deliberate routes, authored content, visibility policy and
  canonical-versus-generated ownership. Change a generated page through its
  projection source.
- Write the contract section into the wiki-root `AGENTS.md` so it describes the
  structure that already exists.

Done when the contract section declares all six fields, each matches an existing
path, and the diff moves, deletes or re-routes no existing page.

## Set up

Use when no wiki exists and the task holds setup authority.

1. Take the destination from project guidance or the user. Done when one
   destination path is named; otherwise write the [Gap report](#gap-report).
2. Create the project-owned destination: the wiki-root `AGENTS.md` with the
   contract section, the raw home, the canonical article tree with its
   navigation metadata, and the root discovery index. Every created file is
   project content; the installer catalog and scaffold data stay unchanged.
   Done when each created path is listed and the contract declares all six
   fields.
3. Report [Readiness](#readiness). Done when all three results are recorded.

## Gap report

Use when the destination or setup authority is unresolved.

- Name each exact gap: the field, the missing or conflicting path, the evidence
  read, and the decision or authority that closes it.
- Place no canonical content in a destination a gap covers.
- Report the outcome as setup incomplete.

Done when every gap names its closing decision and `git status` shows no write
inside a gap-covered destination.

## Readiness

Report three separate results. Each is `ready`, `not ready` with the failing
check, or `unavailable` with the reason the check could not run.

- **Source storage**: the raw home exists inside the Git work tree and accepts a
  raw source with its provenance record.
- **Knowledge/navigation**: the canonical article tree, its navigation metadata
  and the discovery entrypoints exist, and the declared structural check passes.
- **Rendering**: the declared render or build command passes.

Keep each result in its own area: a failing or unavailable check stays in the
area it belongs to. Done when all three results are recorded, each with the
command or inspection that produced it.

## Hand-off

- Capture proceeds once source storage is `ready`. It needs no docs onboarding,
  backlog reconstruction, running app or deployment.
- Ingest and health proceed once knowledge/navigation is `ready`.
- `docs-onboarding` reconstructs existing project knowledge after the
  destination is usable.
- Setup and adoption leave Project Verifier assets as found; see the
  [Project Verifier boundary](../SKILL.md#project-verifier-boundary).
