# Spec Quality Bar

Use this reference while filling the template and before saving.

## Core rule

The spec lives in the problem space.

- include what, who, why, user stories, acceptance criteria, non-goals,
  constraints, accepted technical/testing decisions, prototype verdicts, and
  verification seams, `Dependency Readiness`, and `Branch/Base Intent`
- exclude unaccepted solution design and plan-owned files, commands, workers,
  task graph, or execution order
- when the epic has child stories, include the concrete requirements of each child story instead of summarizing only the parent issue

## Acceptance-criteria bar

Every acceptance criterion should be:

- binary
- observable
- testable
- identified as `AC-###` with one or more one-way `Covers: US-###` links

Avoid:

- vague outcomes like "works well" or "feels intuitive"
- hidden implementation requirements disguised as product behavior
- mixed criteria that bundle several independent outcomes into one line

## Capability completeness bar

When compiling confirmed capability and story decisions:

- the spec is the provider-neutral authority for the capability boundary
- each child story must contribute concrete requirements, constraints, or acceptance criteria
- cross-story interactions must be resolved in the spec rather than left implicit in backlog items

Avoid:

- a spec that omits confirmed requirements from one or more user stories
- a spec that treats child stories as links only, without incorporating their product details
- a spec that copies child stories separately without unifying overlaps and shared constraints

## Self-review before saving

- ensure frontmatter has a non-empty string `title`, especially for specs saved directly in routed Fumadocs trees
- ensure frontmatter contains `readiness: agent-ready`
- ensure `Dependency Readiness` records `No Stack Required` or `Ready` with
  evidence
- ensure `Branch/Base Intent` records accepted parent/base constraints or
  `Not applicable`
- remove all template scaffolding
- remove empty or irrelevant sections
- ensure the document reads cleanly with no ghost instructions
- check that terminology matches the repo domain language

## Field naming rule

Any field name in backticks must use English identifiers.

Examples:

- `first_name`, not `nome`
- `acquisition_channel`, not `canale_acquisizione`
- `visits`, not `visite`

If a business term needs clarification, explain it in prose only.
