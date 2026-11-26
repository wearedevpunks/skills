# Verify

## Entry Guard

Enter only when the router selected this gate: a Track is `shipped` without
verification evidence for that landing.

## Inputs

- the `shipped` Track rows, their landed changes and live versions
- the Charter targets and test identities

## Actor-Like Gate Boundary

Verify owns proof that the landing works where it was shipped. A Worker runs
the check; Verify keeps the verdict and the Ledger write. The Track's own
delivery already proved the behavior before merge.

## Bounded Action

1. **Live.** Confirm the target serves the landed version before checking.
2. **Method.** Choose the method that fits the change:
   - user interface: an end-to-end check through `$agent-browser`;
   - API or product behavior: `$verify-behavior`;
   - state, retry or concurrency flows: `$model-checking`.
3. **Run.** Hand the check to a Worker with the target, the identity, the
   changed behavior and the expected outcome.
4. **Verdict.** Pass marks the Track `verified`. Fail sends the defect, with
   its evidence, to the owning Track, or to a new small Track, and returns
   that Track to `delivering`.

## Invariants

- A landing counts as verified only with recorded evidence from one of the
  three methods.
- A Track that returns to `delivering` never stays `verified`.

## Completion Evidence

- the method, target, live version and result per Track

## Declared Exits

- `complete` `verified`: the check passed on the live version.
- `complete` `verification_failed`: the defect is with its owning Track.
- `no-op` `verification_running`: the Worker has not reported yet.

## Durable Handoff

Write the Track rows and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
