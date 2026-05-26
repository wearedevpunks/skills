# Flow Pages

Use this reference when `docs-ingest-phase` writes flows into routed wiki docs.

## Output Contract

For each extracted flow:

1. Derive the routed output path:
   - use the domain's existing flow section when one exists
   - write only when an existing project section is a clear fit; otherwise skip the flow page and report the route-policy gap
   - slugify the flow name to kebab-case
2. Determine status:
   - `proposed` when only `SPEC.md` is present
   - `implemented` when `IMPLEMENTATION-NOTES.md` is present
3. Reconcile implementation notes when present:
   - use `SPEC.md` acceptance criteria as the skeleton
   - override or annotate steps where `IMPLEMENTATION-NOTES.md` records a deviation, surprise, or judgment call
   - mark blocked or unmet steps with a warning callout
4. Write or merge the routed flow page:
   - preserve established facts
   - integrate new implemented reality into the main flow
   - flag contradictions inline with a warning callout
5. Update the nearest `meta.json` and section index page so the flow is discoverable.

For Harness-style domains, flow pages usually belong under `lifecycle-flows`.

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
  - <source path>
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

Use a Mermaid diagram only when it clarifies branching or sequencing. Do not force diagrams for simple flows.
