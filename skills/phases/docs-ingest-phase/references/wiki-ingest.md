# Wiki Ingest

Use this reference when `docs-ingest-phase` receives a spec folder, domain/spec pair, or explicit `SPEC.md`. Ingest ends with exactly one [outcome](#outcome).

## Inputs

Accept any of:

- `<wiki-root>/content/docs/project/specs/<domain>/<spec>/`
- `<wiki-root>/specs/<domain>/<spec>/`
- a domain name plus spec name
- an explicit `SPEC.md` path

`<wiki-root>` and the canonical article tree come from the resolved [wiki contract](wiki-contract.md). Resolve routed `content/docs/project/specs` folders first, then legacy root `specs` folders. If ambiguous, ask only for the missing folder.

## Freshness

Ingest records the identity of every source it consumed, so a later run can tell _fresh_ knowledge from _stale_ knowledge:

- `ingested_revision` in `SPEC.md` and `IMPLEMENTATION-NOTES.md` frontmatter: the Git blob ID of the file as read, before this run's bookkeeping writes. `git hash-object -w <path>` prints it and stores the blob for later comparison.
- `sources` in routed page frontmatter: one entry per consulted raw original, with its `path` and the `sha256` from its verified `source.json` ([source-capture.md](source-capture.md)).

Classify `SPEC.md`, `IMPLEMENTATION-NOTES.md`, and the `sources` of every routed page whose `source` lists them:

- _fresh_: the content of blob `ingested_revision` (`git cat-file -p <ingested_revision>`) differs from the current file only in the bookkeeping fields `ingested_revision`, `last_ingested`, `links` and `updated`; and each `sources` entry is still the newest revision of its source with an equal `sha256`.
- _stale_: any other line differs, a newer revision of a consulted original exists, or a recorded source is gone.
- _freshness unknown_: no identity is recorded or the recorded blob is unreadable. A legacy `ingested: true` without `ingested_revision` is _freshness unknown_: evaluate it as _stale_.

Source path, `last_ingested` and dates never prove freshness; only the recorded identities do.

## Guard

1. Read `SPEC.md`. Stop if missing.
2. Verify `domain:` exists in frontmatter.
3. Classify [freshness](#freshness). Done when every source has a classification with both identities compared. All _fresh_ ends the run with a freshness no-op [outcome](#outcome).
4. Resolve the routed output home from the canonical article tree and [fumadocs-routing.md](fumadocs-routing.md). When no project section is a clear home, record the missing route policy as unfinished work; the outcome can reach at most partial. Keep one routed docs surface.

## Feature Map navigation

When a Feature Map links to applicable product or domain authority, follow only the needed links as read-only navigation. Apply the [Project Verifier boundary](../SKILL.md#project-verifier-boundary) even when the ingested source describes changed behavior. Write ordinary routed docs and record any observed coverage gap; preserve the verifier tree and its expected behavior.

## Source Read

Read in order:

1. `SPEC.md` — mandatory
2. `IMPLEMENTATION-NOTES.md` — optional

If implementation notes exist and lack frontmatter, add:

```yaml
---
domain: <domain from SPEC.md>
type: implementation-notes
spec: <spec id from SPEC.md>
links:
  - "[[specs/<domain>/<spec>/SPEC]]"
ingested_revision: null
last_ingested: null
created: <today>
updated: <today>
---
```

## Status

Each flow and concept page carries one status:

- `implemented`: implementation evidence shows the behavior: code in the repository, tests or verification output that exercise it, or notes entries that cite such evidence. Record that evidence in the page's source section.
- `proposed`: every other case. The `IMPLEMENTATION-NOTES.md` file is a pointer to evidence; on its own it establishes nothing.

## Extract Flows

A flow exists when the spec describes a sequence of user or system actions with a defined start, steps, and end outcome.

Look for:

- multi-step acceptance criteria
- explicit journeys or process descriptions
- conditional chains across acceptance criteria
- sections titled Flow, Process, Journey, or similar

For each flow, extract:

- descriptive flow name
- trigger
- actors
- ordered steps and decision points
- terminal outcome
- implementation deviations, surprises, or blocked steps when notes exist

If no multi-step sequence exists, record the absence and skip flow writing.

## Write Flow Pages

Apply [flow-pages.md](flow-pages.md) to every extracted flow. Its [completion rule](flow-pages.md#completion) gates concept writing.

## Extract Concepts

A concept exists when the spec names a domain entity or term with defined attributes, invariants, or bounded scope.

Look for:

- fields listed in acceptance criteria
- explicit data model or entity sections
- recurring nouns with their own attributes or rules
- enum sets representing bounded domain state
- entities referenced through wikilinks

Group related fields under one owning entity, with one concept page per entity.

## Write Concept Pages

Apply [concept-pages.md](concept-pages.md) to every extracted concept.

## Discovery

Apply the [discovery rules](fumadocs-routing.md#discovery) to every routed page this run created or changed.

## Outcome

Report exactly one outcome:

- **complete**: every required flow page, concept page, discovery entry and validation command finished with evidence.
- **partial**: some required route, output or validation work is missing or failed. List each item as unfinished work with its reason. A later run finishes it before any complete claim.
- **no-op**: a freshness no-op (all sources _fresh_) or a knowledge no-op (the _stale_ evidence adds no reusable delta), with the evidence that set it.

Write the bookkeeping below for **complete** and for a knowledge no-op; a freshness no-op writes nothing. A **partial** run keeps the earlier `ingested_revision` and writes only its [log](#log) entry, which lists each unfinished item; the next run finds the source _stale_ and resumes that work.

## Bookkeeping

Update `SPEC.md` frontmatter, and `IMPLEMENTATION-NOTES.md` frontmatter when the file exists. Replace a legacy `ingested` field:

```yaml
ingested_revision: <blob ID recorded in Freshness>
last_ingested: YYYY-MM-DD
```

Also populate the notes `links` array with the SPEC link plus every routed flow and concept page written in this ingest.

Done when both files carry the blob IDs this run read, and the [log](#log) entry is written.

## Log

`<wiki-root>/log.md` is the wiki's chronology. Every writer of it follows this rule: capture, ingest, health, grill and spec bookkeeping.

- Append each new entry at the end of the file. The log is append-only and oldest-first, with no entry cap.
- Keep the existing order of older entries as history, also where it is mixed.
- Move older entries to an archive file only when the root log links that archive.

```md
## [YYYY-MM-DD] <capture | ingest | maintenance | grill | spec> | <subject>

- Source: <path> @ <revision or blob ID>
- Outcome: <outcome>
- Outputs: <pages written or changed, with counts>
- Unfinished: <each unfinished item, or none>
```

Done when the new entry is the last entry of `log.md` and every earlier entry is still in the root log or a linked archive.

## Resumability

Output pages are checkpoints. Skip a _fresh_ page. Rewrite a missing or _stale_ flow page before concepts, then a missing or _stale_ concept page. [health.md](health.md#resume) owns resume after an interruption.
