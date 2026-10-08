# Concept Pages

Use this reference when `docs-ingest-phase` writes concepts into routed wiki docs. Concept writing starts after the flows pass their [completion rule](flow-pages.md#completion), because concept pages may cross-link flows.

## Input Expansion

For each extracted concept:

1. Read the related routed flow pages.
2. Find the canonical article that already owns the concept, through the discovery map and the concept's route section.
3. Collect the relevant raw inputs from verified `source.json` records in the raw home: records whose [readback](source-capture.md#5-read-back) prints `OK`. Use their originals, or derived text that names its original, as supplementary evidence.

Done when each concept has its flow pages, its owning article or a confirmed absence, and its verified raw inputs.

## Output Contract

Synthesize concept content in this precedence order:

1. implementation evidence, including `IMPLEMENTATION-NOTES.md` deviations, surprises, and judgment calls
2. `SPEC.md` acceptance criteria, data model, and technical notes
3. relevant sections from routed flow pages
4. relevant raw content

Set the status by the [status rule](wiki-ingest.md#status).

Derive the routed output path:

1. The owning article, when one exists: apply [Merge Rules](#merge-rules).
2. Otherwise the domain's existing route section, when it is a clear fit. When no project section fits, record the route-policy gap as unfinished work.
3. Slugify the concept name to kebab-case.

For Harness-style domains, prefer existing topical sections such as `foundations`, `prompt-surfaces`, `skills-and-packs`, `execution-modes`, `validation-and-tools`, and `lifecycle-flows` when they already exist.

Done when every extracted concept has a written or merged page, a _knowledge no-op_, or a route gap recorded as unfinished work.

## Page Shape

Every concept page must include frontmatter:

```yaml
---
title: <Concept Name>
description: <one sentence>
surface: project
permission: project
domain: <domain>
type: concept
status: proposed | implemented
source:
  - <spec or notes path>
sources: # consulted raw originals; see wiki-ingest.md#freshness
  - path: <original path>
    sha256: <sha256 from its source.json>
updated: YYYY-MM-DD
---
```

Every concept page should include:

- a definition or opening explanation
- the concept's invariants, attributes, or boundaries
- links to related flows or mechanics pages
- source links or a short source section when useful

## Merge Rules

Reconcile new reusable knowledge into the owning article rather than creating an overlapping article for a new source or implementation. Re-read the article first; [health.md](health.md#overlapping-writes) governs concurrent changes.

- Preserve established facts.
- Merge new implemented reality into the main article.
- Keep contradictions and unaccepted product choices attributed to their source and visibly unresolved, in a warning callout that names each side. A retained source or answer stays a claim until accepted evidence settles it.
- Update `updated`, `source` and `sources`.

## Knowledge no-op

When the evidence adds no reusable delta to the owning article, leave the article unchanged and record a _knowledge no-op_ with the evidence compared.

The same rule applies to findings returned from planning or an investigation: merge a novel, evidence-backed finding into its owning article, create a new synthesis page only when no article owns it and record why, and record a _knowledge no-op_ otherwise.
