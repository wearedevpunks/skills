# Questioning

Use this reference after discovery and before writing.

## Goal

Ask only enough to decide whether the spec is ready to draft or needs a bounded `$requirements-grill` phase. A vague spec creates false confidence.

Before writing `Open Questions`, route meaningful spec-affecting unknowns through `grill-phase.md`. Do not silently invent an open-question table as a substitute for requirements work.

## Priority topics

Surface these as needed:

- which epic/capability is in scope
- which child stories under that epic are in scope
- who this is for
- why it needs to exist
- what "done" looks like
- what is out of scope
- what constraints exist
- what is still unknown
- whether a ticket or project id should influence naming

## Asking strategy

- Group questions naturally instead of dumping a long questionnaire.
- Skip questions already answered by repo context or by the user.
- If a fact is ambiguous and matters to the spec, ask directly.
- Prefer concrete examples over abstract wording.
- When backlog context exists, ask about cross-story interactions only after reading all child stories first.
- If multiple or material unknowns remain, stop lightweight questioning and run the grill phase.
- If a tiny unknown would become an `Open Question`, ask whether the user can resolve it now or wants to defer it.

## Stop asking when

- the core problem is clear
- the epic boundary is clear
- every child story in scope has been harvested into the spec
- affected actors or stakeholders are clear
- success is concrete and observable
- major functional requirements are identifiable
- key non-goals are explicit

Only leave `Open Questions` in the spec when one of these is true:

- the user explicitly chose to defer the question
- the answer requires external validation outside the current spec session
- the question is non-blocking and the spec can still be reviewed honestly

If a branch remains open after the grill phase or lightweight prompt, capture it as an open question or assumption inside the spec rather than pretending certainty. Include the prompt/grill outcome so reviewers know why it remains unresolved.
