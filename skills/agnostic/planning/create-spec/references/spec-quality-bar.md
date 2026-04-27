# Spec Quality Bar

Use this reference while filling the template and before saving.

## Core rule

The spec lives in the problem space.

- include what, who, why, acceptance criteria, non-goals, constraints, open questions
- exclude architecture, implementation steps, code structure, or solution design
- when the epic has child stories, include the concrete requirements of each child story instead of summarizing only the parent issue

## Acceptance-criteria bar

Every acceptance criterion should be:

- binary
- observable
- testable

Avoid:

- vague outcomes like "works well" or "feels intuitive"
- hidden implementation requirements disguised as product behavior
- mixed criteria that bundle several independent outcomes into one line

## Epic completeness bar

When writing a spec from an epic with child stories:

- the spec must cover the full scope of the epic
- each child story must contribute concrete requirements, constraints, or acceptance criteria
- cross-story interactions must be resolved in the spec rather than left implicit in backlog items

Avoid:

- a spec that summarizes the epic but omits concrete requirements from one or more child stories
- a spec that treats child stories as links only, without incorporating their product details
- a spec that copies child stories separately without unifying overlaps and shared constraints

## Self-review before saving

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
