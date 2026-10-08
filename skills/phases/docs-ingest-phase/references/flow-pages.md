# Flow Pages

Use this reference when `docs-ingest-phase` writes flows into routed wiki docs.

## Output Contract

For each extracted flow:

1. Derive the routed output path:
   - use the owning flow page when one exists, else the domain's existing flow section when it is a clear fit
   - when no project section fits, record the route-policy gap as unfinished work
   - slugify the flow name to kebab-case
2. Set the status by the [status rule](wiki-ingest.md#status).
3. Reconcile implementation evidence when present:
   - use `SPEC.md` acceptance criteria as the skeleton
   - override or annotate steps where `IMPLEMENTATION-NOTES.md` records a deviation, surprise, or judgment call
   - mark blocked or unmet steps with a warning callout
4. Write or merge the routed flow page by the [concept merge rules](concept-pages.md#merge-rules).

For Harness-style domains, flow pages usually belong under `lifecycle-flows`.

## Completion

Flow writing is complete when every required flow page, one per extracted flow, is written or merged.

When a required flow write fails or lacks a route, the ingest outcome is **partial**: record the flow as unfinished work and stop before concept writing, because concept pages may link any flow. Concept writing starts only after this completion rule holds.

## Page Shape

Every flow page must include frontmatter:

```yaml
---
title: <Flow Name>
description: <one sentence>
surface: project
permission: project
domain: <domain>
type: flow
status: proposed | implemented
source:
  - <spec or notes path>
sources: # consulted raw originals; see wiki-ingest.md#freshness
  - path: <original path>
    sha256: <sha256 from its source.json>
updated: YYYY-MM-DD
---
```

Every flow page should include:

- trigger
- actors
- ordered steps and decision points
- terminal outcome
- validation or closeout signal
- source links when useful

Use a Mermaid diagram only when it clarifies branching or sequencing. Keep simple flows textual.
