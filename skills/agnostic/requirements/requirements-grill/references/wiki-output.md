# Wiki Output From Grill Artifacts

Use this reference only after the user explicitly closes the grill.

## Inputs

`<wiki-root>` and the canonical article tree come from the resolved
[wiki contract](../../../../phases/docs-ingest-phase/references/wiki-contract.md)
(`docs-ingest-phase/references/wiki-contract.md`).

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

Publish each accepted domain context's glossary at:

`<wiki-root>/content/docs/project/domains/<context>-glossary.mdx`

Synthesize it from the active grill glossary after `$domain-modeling`'s final consistency pass. The grill log remains the decision trail.

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

Keep domain glossaries inside the routed project surface above. Do not create a separate `<wiki-root>/domains/` article tree.

Do not duplicate the full grill log into concept, flow, or decision pages.
Summarize stable meaning, glossary, and axioms; link back to source docs when useful.

## Bookkeeping

After wiki changes:

- apply the [discovery rules](../../../../phases/docs-ingest-phase/references/fumadocs-routing.md#discovery)
  (`docs-ingest-phase/references/fumadocs-routing.md#discovery`) to every
  routed page written
- append one `grill` entry to `<wiki-root>/log.md` by the
  [log rule](../../../../phases/docs-ingest-phase/references/wiki-ingest.md#log)
  (`docs-ingest-phase/references/wiki-ingest.md#log`)
- preserve existing frontmatter
- update `updated`

Do not mark grill docs as `ingested` unless they have frontmatter designed for ingest tracking.
