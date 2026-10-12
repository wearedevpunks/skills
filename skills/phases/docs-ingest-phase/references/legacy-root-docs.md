# Legacy Root Docs

Use this reference when the repository has a root `docs/` tree. The canonical
article tree is the only knowledge home; a root `docs/` tree is legacy input to
merge into it, never a write target.

## Merge

Merge only when the task holds wiki setup authority. Otherwise name the root
`docs/` tree as legacy input awaiting merge in the ingest outcome.

1. List each root doc, starting from its index (`docs/README.md` when present).
   Done when every leaf doc is listed.
2. Map each root doc to its owning page in the canonical article tree: the same
   route when a projection already serves it, otherwise the owning section such
   as `project/reference/` or `project/runbooks/`. Done when every leaf has one
   target page.
3. Move or merge the content into the target page, and list each new page in
   its section `meta.json` and section index. Fold index entries into the
   section indexes.
4. Remove the root `docs/` projection from the project's sync command, then
   delete the root `docs/` tree. Done when no root doc remains and the contract's
   validation commands pass.

## Rules

- Document implemented reality, not speculative future state.
- Keep agent task instructions out of human-facing pages.
- Link to source artifacts instead of duplicating large specs, plans, or
  implementation notes.
