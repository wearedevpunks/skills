# Motion Plan

## Entry Guard

Enter only when the router selected this gate: an accepted Composition lacks
a fresh Motion Plan whose every entry is decided.

## Inputs

- accepted Compositions and their Artifact Index rows
- the target route's current code
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
   accepted Composition images, the route's current code, and the DESIGN.md
   motion tokens.
2. Record each row of its opportunities table as one Motion Plan entry in
   state `proposed`: id, Composition, location, purpose, frequency, and the
   suggested motion with exact values. Record its rejected candidates as
   evidence on the Composition.
3. Set an entry to `accepted` when every check holds: its element appears in
   the accepted Composition; its motion uses DESIGN.md tokens and obeys the
   Do's and Don'ts and accepted constraints; the user has not declined it.
   Leave every other entry `proposed` with the failing check as its reason.
4. When a Composition changed, return its entries to `proposed` and decide
   them again.

## Invariants

- One Motion Plan per Composition.
- Only `accepted` entries reach `variant-round`.

## Completion Evidence

- every accepted Composition has a Motion Plan; a Composition with no
  accepted entry records "no motion" and the reason
- each entry has a state and, for `proposed`, its reason

## Declared Exits

- `complete` `motion_plan_decided`: every entry of every accepted Composition
  is decided.
- `blocked` `motion_plan_input_missing`: a Composition image or the route
  code cannot be read; the record names it.
- `human_steering_required`: the user's motion direction conflicts with
  DESIGN.md or accepted constraints; the record names the decision needed.

## Durable Handoff

Write the Motion Plan section and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After `motion_plan_decided`, re-enter [`router.md`](router.md). On a blocked
or steering exit, stop.
