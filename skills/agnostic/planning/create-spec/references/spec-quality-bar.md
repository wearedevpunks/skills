# Spec Quality Bar

Use this reference while filling the template and before saving.

## Core rule

A spec lives in the problem space.

- include what, who, why, requirements and outcomes, acceptance criteria,
  non-goals, constraints, accepted technical and testing decisions, prototype
  verdicts, verification seams, `Dependency Readiness`, and `Branch/Base Intent`
- exclude unaccepted solution design and plan-owned files, commands, workers,
  task graph, or execution order
- incorporate confirmed source evidence into unified requirements rather than
  treating provider backlog items as specification identities

## Acceptance-criteria bar

Every acceptance criterion should be:

- binary
- observable
- testable
- identified as `AC-###` with one or more one-way `OUT-###` coverage links

Avoid:

- vague outcomes such as "works well" or "feels intuitive"
- hidden implementation requirements disguised as product behavior
- mixed criteria that bundle several independent outcomes into one line

## Capability completeness bar

When compiling confirmed capability decisions:

- keep the spec as provider-neutral authority for the capability boundary
- retain concrete requirements, constraints, and acceptance criteria from all
  accepted source evidence
- resolve cross-outcome interactions in the spec rather than leaving them
  implicit in backlog items
- keep specification outcomes independent from provider Epic, Story, and Task
  identities and cardinality

Avoid:

- omitting confirmed requirements from an outcome
- retaining source backlog items as links without incorporating their product
  details
- copying overlapping source items separately instead of unifying them

## Self-review before saving

- ensure frontmatter has a non-empty string `title`, especially for specs saved
  directly in routed Fumadocs trees
- ensure frontmatter contains `readiness: agent-ready`
- ensure `Dependency Readiness` records `No Stack Required` or `Ready` with
  evidence
- ensure `Branch/Base Intent` records accepted parent/base constraints or
  `Not applicable`
- ensure every outcome passes the one-way coverage contract
- remove all template scaffolding and empty irrelevant sections
- ensure the document reads cleanly without ghost instructions
- check that terminology matches repository domain language

## Field naming rule

Any field name in backticks must use English identifiers.

Examples:

- `first_name`, not `nome`
- `acquisition_channel`, not `canale_acquisizione`
- `visits`, not `visite`

If a business term needs clarification, explain it in prose only.
