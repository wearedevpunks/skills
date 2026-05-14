# Concept Pages

Use this reference when `docs-ingest-phase` writes concepts into routed wiki docs.

## Input Expansion

For each extracted concept:

1. Read related routed flow pages under `<wiki-root>/content/docs/wiki/<domain>/`.
2. Scan `<wiki-root>/raw/` recursively and collect files where frontmatter `ingested: false` or `ingested` is absent.
3. Use relevant raw content only as supplementary material. Do not mark raw files as ingested here.

## Output Contract

Synthesize concept content in this precedence order:

1. `IMPLEMENTATION-NOTES.md` deviations, surprises, and judgment calls
2. `SPEC.md` acceptance criteria, data model, and technical notes
3. relevant sections from routed flow pages
4. relevant raw file content

Determine status:

- `proposed` when only `SPEC.md` is present
- `implemented` when `IMPLEMENTATION-NOTES.md` is present

Derive the routed output path:

1. Use the domain's existing route section if the concept clearly belongs there.
2. Otherwise write to `<wiki-root>/content/docs/wiki/<domain>/<concept-name>.mdx`.
3. Slugify the concept name to kebab-case.

For Harness-style domains, prefer existing topical sections such as `foundations`, `prompt-surfaces`, `skills-and-packs`, `execution-modes`, `validation-and-tools`, and `lifecycle-flows` when they already exist.

## Page Shape

Every concept page must include frontmatter:

```yaml
---
title: <Concept Name>
description: <one sentence>
surface: wiki
permission: internal
domain: <domain>
type: concept
status: proposed | implemented
source:
  - <source path>
updated: YYYY-MM-DD
---
```

Every concept page should include:

- a definition or opening explanation
- the concept's invariants, attributes, or boundaries
- links to related flows or mechanics pages
- source links or a short source section when useful

## Merge Rules

When a routed concept page already exists:

- preserve established facts
- merge new implemented reality into the main article
- flag contradictions inline with a warning callout
- update `updated` and `source`

Update the nearest `meta.json` and section index page so the concept is discoverable.
