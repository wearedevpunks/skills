# Motion Plan

## Entry Guard

Enter only when the router selected this gate: a scope unit lacks a fresh
Motion Plan whose every entry is decided.

## Inputs

- the scope unit, its route, and its recorded content sources
- the target route's current code
- in composition mode `images`, the accepted Compositions and their Artifact
  Index rows
- DESIGN.md motion tokens, its Do's and Don'ts, and accepted constraints
- any motion direction the user gave, quoted from a reply or Verdict
- the handoff's Motion Plan section

## Actor-Like Gate Boundary

Motion-plan owns the Motion Plan entries in `proposed` and `accepted`. It
delegates the search to `find-animation-opportunities` and keeps the
acceptance decision and the handoff write. `variant-round` and
`quality-gate` own the later states.

## Bounded Action

1. Activate `find-animation-opportunities` with a concrete target: the
   scope unit and its content sources, the route's current code, the
   DESIGN.md motion tokens, and the accepted Composition images when present.
2. Record each row of its opportunities table as one Motion Plan entry in
   state `proposed`: id, location, purpose, frequency, and the suggested
   motion with exact values. Record its rejected candidates as evidence on
   the scope unit's Motion Plan.
3. Set an entry to `accepted` when every check holds: its element appears in
   the accepted Compositions, or in mode `code-first` in the route code or
   the scope unit's content; its motion uses DESIGN.md tokens and obeys the
   Do's and Don'ts and accepted constraints; the user has not declined it.
   Leave every other entry `proposed` with the failing check as its reason.
4. When a scope unit's Compositions changed, return its entries to
   `proposed` and decide them again.

## Invariants

- One Motion Plan per scope unit.
- Only `accepted` entries reach `variant-round`.

## Completion Evidence

- every scope unit has a Motion Plan; a plan with no accepted entry
  records "no motion" and the reason
- each entry has a state and, for `proposed`, its reason

## Declared Exits

- `complete` `motion_plan_decided`: every entry of every scope unit's
  Motion Plan is decided.
- `blocked` `motion_plan_input_missing`: an accepted Composition image or
  the route code cannot be read; the record names it.
- `human_steering_required`: the user's motion direction conflicts with
  DESIGN.md or accepted constraints; the record names the decision needed.

## Durable Handoff

Write the Motion Plan section and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After `motion_plan_decided`, re-enter [`router.md`](router.md). On a blocked
or steering exit, stop.
