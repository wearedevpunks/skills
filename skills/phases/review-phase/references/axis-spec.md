# Spec Axis

This Axis Run checks whether the change implements its governing spec
faithfully. The source context holds `SPEC.md`, `ARCHITECTURE.md`, `PLAN.md`
and `IMPLEMENTATION-NOTES.md`. Coding standards belong to the Standards Axis
Run.

The plan tasks this change delivers set the scope: compare every acceptance
criterion and architecture element those tasks name against the change. Each
finding body quotes the spec line with its file and ID (for example
`SPEC.md AC-007`), and its location is the changed line it concerns, or the
closest changed line for a missing behaviour.

Report four kinds of finding:

- **Missing or partial:** a requirement in scope that the change does not
  implement, or implements only in part.
- **Unrequested:** behaviour in the change that no spec, architecture or plan
  line asks for.
- **Wrong:** a requirement that looks implemented, but the implementation
  behaves differently from the quoted line.
- **Unsupported evidence:** a Verification record or RED/GREEN evidence in
  `IMPLEMENTATION-NOTES.md` that claims a criterion passes, where the changed
  code or test does not support the claim, for example a test that never
  exercises the criterion it names. Category `test_gap`.
