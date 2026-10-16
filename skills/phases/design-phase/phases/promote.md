# Promote

## Entry Guard

Enter only when the router selected this gate: a `keep` Verdict is recorded
for exactly one variant and no promote commit exists for it.

## Inputs

- the kept variant: round, id, route, build identity, quality results, and
  "Decisions for you" with any the user closed
- the Design Target section, DESIGN.md, accepted constraints, Compositions,
  and the Motion Plan
- [the design handoff contract](../references/design-handoff.md) for the
  approved artifact contract fields

## Actor-Like Gate Boundary

Promote owns the full `break-ui` pass, the in-place rewrite, the promote
commit, and the approved artifact contract. It delegates the pass to
`break-ui` and the integration to `prototype-variants`, and keeps the final
checks, the commit, and the handoff write.

## Bounded Action

1. Run the full `break-ui` workflow on the kept variant, invoked as
   `<kept variant route> + fix`: every applicable catalog row; the real
   container width, 320px, and the widest layout; 200% zoom; dark mode and
   RTL when the product supports them; the empty, one, and huge cases. It
   applies the fix for every "What broke" item outside "Decisions for you"
   and re-verifies every toggle state.
2. Pass requires all three: zero open "What broke" items; every "Decision
   for you" closed by the user; the fixture and toggle dev-only. When a
   decision is open, record it with break-ui's recommendation and exit
   `human_steering_required`.
3. Rewrite the kept variant in place as production code on the real route,
   following the project's file layout, naming, and token usage.
4. Remove the `?variant=` switch and the losing variants' code.
5. Keep the worst-case fixtures and their toggle, dev-only, as the regression
   test.
6. Verify: typecheck passes; the route renders at 375px and 1280px without
   `?variant=`; the console is clean; a production build contains neither the
   switch nor the toggle.
7. Commit the design-owned files on the working branch. This commit is the
   promote commit; its files are Design-Owned UI Code.
8. Write the approved artifact contract for the scope unit, including the
   promote commit SHA and its file list.

## Invariants

- Promote follows exactly one recorded `keep`.
- When any step before 7 fails, the kept variant stays behind the switch and
  no promote commit exists.

## Completion Evidence

- the full `break-ui` report with zero open items and every decision closed
- step 6 results
- the promote commit SHA and file list
- the approved artifact contract

## Declared Exits

- `complete` `promoted`: the commit and the contract exist.
- `blocked` `promote_check_failed`: a step 1 or step 6 check still fails
  after fixes; the record names it.
- `human_steering_required`: a "Decision for you" is open; the record lists
  each decision, its recommendation, and the reply needed.

## Durable Handoff

Write the approved artifact contract and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After `promoted`, re-enter [`router.md`](router.md). On a blocked or steering
exit, stop.
