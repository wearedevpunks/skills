# Public Docs

Use this reference when `docs-ingest-phase` creates or materially updates public-facing documentation.

## Scope

Public documentation is reader-facing product, usage, or domain documentation meant for users, adopters, or scaffold recipients.

Private documentation is internal project, operator, maintenance, implementation, or planning documentation meant to preserve how the project is built and run.

These are audience categories first. Route topology, permission metadata, and scaffold visibility are supporting signals.

## Route Discovery

Infer the repo's docs architecture before writing:

1. Read the wiki/docs `AGENTS.md` when present.
2. Inspect existing routed docs roots, `meta.json` files, sidebars, and root docs indexes.
3. Classify candidate targets as public-facing, private technical, or both.
4. Use the repo's existing public-facing docs surfaces for final reader pages.
5. Use the repo's existing private docs surface for writer artifacts.

Do not hardcode Harness Intelligence route names. In this repo, `/docs/get-started`, `/docs/harness`, `/docs/cli`, and `/docs/changelog` are examples of public-facing surfaces, while `/docs/project` is an example of a private surface.

## When To Run The Writer Flow

Run the public writer flow for substantial public-facing docs work:

- new public-facing page
- major rewrite of an existing public-facing page
- delivery-phase change that materially changes product behavior, usage, positioning, or domain explanation
- private spec/project material being transformed into a reader-facing guide, concept page, usage page, or product/domain article

Skip the writer flow for small public-doc patches:

- typo fixes
- tiny command corrections
- metadata fixes
- changelog ledger updates
- narrow link or wording corrections

When skipped, report the skipped writer stages with an explicit no-op reason.

## Writer Flow

Run these reusable skills in order:

```text
writing-fragments
  -> writing-beats
  -> writing-shape
  -> final public page write/merge
```

The writer flow does not replace spec ingestion. If a spec or implementation notes need durable capture, run the private spec/project ingest path as well.

When `docs-ingest-phase` orchestrates these skills, call each one in docs-ingest artifact mode:

- `writing-fragments` writes or updates `fragments.md`
- `writing-beats` reads `fragments.md` and writes or updates `beats.md`
- `writing-shape` reads `fragments.md` plus `beats.md` and writes or updates `shape.md`
- `docs-ingest-phase` then writes or merges the final public page from those artifacts

## Durable Writer Artifacts

Substantial public-doc work must leave durable private writer artifacts:

- `fragments.md`
- `beats.md`
- `shape.md`

Organize them as one private artifact bundle per public-doc target or substantial docs pass.

Use routed human-facing private pages when the repo has a routed private docs surface. Use source-only private files as a fallback when it does not.

Do not enforce a universal path such as `docs/public-docs`. The path is repo-bounded. In this repo, a natural location would be under the private project docs surface, such as `apps/wiki/content/docs/project/public-docs/<topic-or-page-slug>/`.

## Traceability

Writer artifacts should link forward to the final public page.

Final public pages should not visibly link back to private writer artifacts by default. Public pages should stay reader-facing. Non-visible source/frontmatter metadata is allowed when useful and compatible with the repo's docs system.
