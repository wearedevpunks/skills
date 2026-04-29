# Test Matrix

Every multi-step mutating action needs failure-path coverage, not only happy-path coverage.

## Required Scenarios

- later local write fails and earlier local writes are rolled back
- nested helper usage still preserves the outer transaction boundary
- external step succeeds and a later local step fails, triggering compensation or leaving a deliberate repairable state
- transient retryable integration step retries only that step
- non-retryable integration failure surfaces once as a typed or structured error
- preflight accumulation returns the intended set of validation failures
- intentionally parallel validation or read fan-out uses the expected error semantics
- simple one-step actions are not over-engineered with unnecessary orchestration machinery

## Unit-Level Expectations

- fake leaf services and repositories should make each failure point injectable
- tests should assert which step ran and which step did not
- tests should prove the chosen retry, compensation, or transaction story, not just the final error message

## Integration-Level Expectations

- verify rollback behavior with live infrastructure when the flow relies on transactions
- verify public action or transport behavior exposes expected failures correctly
- verify recoverable degraded states are observable when compensation is impossible

## Review Checklist

- where is the transaction boundary
- what external writes escape the local transaction boundary
- what is the retry scope
- what is the compensation or repair path
- which tests prove the story
