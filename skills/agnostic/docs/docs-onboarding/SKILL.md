---
name: docs-onboarding
description: Onboard an existing project into a scaffolded Harness wiki by inspecting code, docs, and backlog context, building a Project Map, running a targeted requirements grill, and calling create-spec to reconstruct evidence-backed specs. Use immediately after dp scaffold init when the generated prompt says to activate docs-onboarding, or when an existing repository needs initial wiki/spec context reconstructed from current sources.
---

# Docs Onboarding

Use this skill to turn an existing repository into initial Harness wiki context after `dp scaffold init`.

## Workflow

1. Read repo guidance and the scaffolded wiki guidance.
2. Read `<wiki-root>/backlog-provider.md` and `<wiki-root>/wiki-framework.md`.
3. Discover backlog context:
   - Probe the pinned remote backlog provider first when connector/tool/auth access exists.
   - Inspect local backlog clues after that: existing specs, issue matrices, backlog markdown, project docs, and `.devpunks` metadata.
   - Treat remote backlog evidence and local clues as equally important and mandatory when available.
   - If either lane is missing or inaccessible, ask the developer for the backlog location or access path before assuming no backlog exists.
4. Build and persist the Project Map before asking developer questions.
5. Run a targeted `requirements-grill` against the Project Map.
6. After grill closure, call `create-spec` to reconstruct evidence-backed specs.

For the required Project Map sections, onboarding artifacts, evidence labels, and spec reconstruction rules, read [references/artifact-contract.md](references/artifact-contract.md).

## Discovery Depth

Inspect entrypoints, routes/pages, commands, API handlers, schemas/models, tests, config/env examples, and existing docs.

Do not deep-read every implementation file by default. Deep-read implementation files only when needed to explain a flow, resolve a contradiction, or map a data boundary.

## Targeted Grill

Grill contradictions, missing backlog location, unclear feature ownership, and high-impact inferred requirements before `create-spec` runs.

Low-risk current-state facts can proceed into `create-spec` as `Inferred`. Keep code-only low-risk facts `Inferred` unless the developer confirms them or unambiguous docs/backlog intent backs them.

## Resumability

Persist the Project Map and grill status before developer questions. On resume, continue from saved discovery/grill state instead of rescanning from zero.

## Guardrails

- Code can prove observed behavior, not original intent.
- Reconstructed spec history must be evidence-backed.
- Do not invent implementation notes, rationale, or tech-debt history without supporting artifacts.
- Backlog mutation is out of scope; use backlog evidence as input only.
