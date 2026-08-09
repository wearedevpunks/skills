---
name: docs-onboarding
description: Onboard an existing project into a scaffolded Harness wiki by inspecting code, docs, and backlog context, building a Project Map, closing a targeted requirements grill, compiling specs, then projecting them to the backlog. Use immediately after hi init or when an existing repository needs initial wiki/spec context reconstructed.
---

# Docs Onboarding

Use this skill to turn an existing repository into initial Harness wiki context after `hi init`.

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
6. Compile confirmed grill decisions with `create-spec`. It writes agent-ready specs only when its readiness contract passes; preserve `spec-not-ready` gaps upstream.
7. Only after each spec is written and exposed at a verified stable blob URL, activate `write-backlog` to project it into provider-native delivery items.

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
- Never mutate backlog before a spec is written and agent-ready.
