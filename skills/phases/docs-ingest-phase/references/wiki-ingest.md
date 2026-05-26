# Wiki Ingest

Use this reference when `docs-ingest-phase` receives a spec folder, domain/spec pair, or explicit `SPEC.md`.

## Inputs

Accept any of:

- `<wiki-root>/specs/<domain>/<spec>/`
- a domain name plus spec name
- an explicit `SPEC.md` path

Resolve to a full spec folder before continuing. If ambiguous, ask only for the missing folder.

## Guard

1. Read `SPEC.md`. Stop if missing.
2. Check `SPEC.md` frontmatter for `ingested: true`; if set, exit with a clear no-op.
3. Verify `domain:` exists in frontmatter.
4. Resolve the routed output home from `<wiki-root>/AGENTS.md`, existing `content/docs/project/**/meta.json`, and the current page tree.
   - Use existing `<wiki-root>/content/docs/project/` sections for concise projections and links.
   - If no clear project route home exists, stop and report the missing route policy. Do not scaffold a second routed docs surface to satisfy this phase.

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
ingested: false
last_ingested: null
created: <today>
updated: <today>
---
```

When notes exist, generated flows and concepts should be `status: implemented`. Without notes, they are `status: proposed`.

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

Read [flow-pages.md](flow-pages.md) and apply it to every extracted flow.

Wait for all flow pages to complete before concept writing. If no suitable project section exists for a flow, skip that flow page and report the route-policy gap. If any required flow write fails, stop and report the failure so the run can resume cleanly.

## Extract Concepts

A concept exists when the spec names a domain entity or term with defined attributes, invariants, or bounded scope.

Look for:

- fields listed in acceptance criteria
- explicit data model or entity sections
- recurring nouns with their own attributes or rules
- enum sets representing bounded domain state
- entities referenced through wikilinks

Group related fields under one owning entity. Do not create a concept per field when one domain entity owns them.

## Write Concept Pages

Read [concept-pages.md](concept-pages.md) and apply it to every extracted concept.

Concept pages may cross-link flow pages, which is why flow writing must complete first.

## Bookkeeping

Update `SPEC.md` frontmatter:

```yaml
ingested: true
last_ingested: YYYY-MM-DD
```

If `IMPLEMENTATION-NOTES.md` exists, update:

```yaml
ingested: true
last_ingested: YYYY-MM-DD
```

Also populate its `links` array with the SPEC link plus every routed flow and concept page written in this ingest.

Append to `<wiki-root>/log.md` and cap the log at 50 entries:

```md
## [YYYY-MM-DD] ingest | <spec title>

- Source: [[specs/<domain>/<spec>/SPEC]]
- Flows written: <count>
- Concepts written: <count>
```

If new pages were created, update Concepts and Flows counts in `<wiki-root>/index.md` when that index tracks counts.

## Resumability

Output pages are checkpoints:

- existing routed flow pages with matching source metadata can be skipped
- missing expected flow pages should be rewritten before concepts
- existing routed concept pages with matching source metadata can be skipped
