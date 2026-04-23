# Spec Quality Bar

Use this reference while filling the template and before saving.

## Core rule

The spec lives in the problem space.

- include what, who, why, acceptance criteria, non-goals, constraints, open questions
- exclude architecture, implementation steps, code structure, or solution design

## Acceptance-criteria bar

Every acceptance criterion should be:

- binary
- observable
- testable

Avoid:

- vague outcomes like "works well" or "feels intuitive"
- hidden implementation requirements disguised as product behavior
- mixed criteria that bundle several independent outcomes into one line

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
