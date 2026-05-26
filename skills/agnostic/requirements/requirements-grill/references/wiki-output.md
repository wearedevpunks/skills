# Wiki Output From Grill Artifacts

Use this reference when closed grill branches should be reflected in `apps/wiki`.

## Inputs

Use the grill artifacts as source:

- `<wiki-root>/content/docs/project/grilling/<topic>-grill-status.md`
- `<wiki-root>/content/docs/project/grilling/<topic>-grill-log.md`

Read status first to understand:

- active and parked branches
- branch completion
- current locked direction
- current glossary, relationships, axioms, and flagged ambiguities
- remaining non-design validation work

Read log second to extract:

- accepted decisions
- superseded decisions
- branch closure notes
- exact canonical terms
- why glossary or axiom choices changed

## Ownership

`requirements-grill` owns wiki synthesis from grilled requirements.

`docs-ingest-phase` owns formal spec ingest and ordinary docs upkeep.

## What Belongs In Wiki

Write durable domain/product knowledge into wiki pages.

Good wiki targets:

- product scope
- user-visible modes and behaviors
- high-level features
- canonical domain glossary and relationships
- domain axioms that constrain future design
- conversation model
- lifecycle concepts
- memory model
- data model boundaries
- multi-step user or system flows
- major decisions whose rationale should stand alone

Usually keep out of wiki:

- retry constants
- wire-frame field lists
- DDL naming polish
- exact indexes
- low-level timeout values
- model artifact ids unless they change product capability

## Page Selection

Create or update concept pages for stable entities, terms, and invariants.

Create or update flow pages for sequences with:

- trigger
- actors
- ordered steps
- decision points
- terminal outcome

Create or update decision pages only when:

- a major tradeoff was resolved
- future maintainers will likely ask why an alternative was rejected
- the rationale would clutter a concept page

## Boundary

Keep the routed grilling log/status files as the detailed requirements record.

Use other routed `<wiki-root>/content/docs/project/` pages for synthesized project knowledge.
For the default scaffold, that routed project surface is `apps/wiki/content/docs/project/`.

Do not create a separate `apps/wiki/domains/` article tree. That duplicates the routed Fumadocs surface and makes later docs ingest choose between competing homes.

Do not duplicate the full grill log into concept, flow, or decision pages.
Summarize stable meaning, glossary, and axioms; link back to source docs when useful.

## Bookkeeping

After wiki changes:

- update the domain index page
- update root wiki index counts if pages were added
- append a concise entry to `apps/wiki/log.md`
- preserve existing frontmatter
- update `updated`

Do not mark grill docs as `ingested` unless they have frontmatter designed for ingest tracking.
