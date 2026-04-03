# Test Matrix

Every multi-step mutating action needs failure-path coverage, not only happy-path coverage.

## Required scenarios

- later DB step fails and earlier DB writes are rolled back
- nested DB helper usage still preserves the outer transaction boundary
- external step succeeds and a later local step fails, triggering compensation or leaving a deliberate repairable state
- transient retryable integration step retries only that step
- non-retryable integration failure surfaces once as a typed error
- preflight accumulation returns the intended set of validation failures
- intentionally parallel validation or read fan-out uses the right collection primitive and expected error semantics
- simple one-step actions are not over-engineered with unnecessary orchestration machinery

## Unit-level expectations

- fake leaf services and repos should make each failure point injectable
- tests should assert which step ran and which step did not
- tests should prove the chosen retry / compensation / transaction story, not just the final error message

## Integration-level expectations

- verify DB rollback behavior with live layers when the flow relies on transactions
- verify that public router/action behavior exposes typed expected failures correctly
- verify that recoverable degraded states are observable when compensation is impossible

## Review checklist

When reviewing a new multi-step action, ask:

- where is the transaction boundary
- what external writes escape the DB boundary
- what is the retry scope
- what is the compensation or repair path
- which tests prove the story
