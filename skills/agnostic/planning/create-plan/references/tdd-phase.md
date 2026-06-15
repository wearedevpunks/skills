# TDD Phase

Use this reference for the `$tdd` shaping phase across execution tasks.

## TDD shaping rules

Preserve `$tdd` behavior:

- classify every task as `tdd_status: required | not_testable | recovered | not_applicable`
- surface the public interface change and the behavior priority behind the task
- identify deep-module or testability opportunities while task boundaries are still fluid
- define the first public-interface behavior that should fail before implementation
- prefer integration-style behavior through public interfaces
- avoid implementation-detail or private-method testing
- avoid horizontal slicing; every task should represent a RED -> GREEN tracer bullet
- make the first failing test concrete enough that a worker can start without guessing
- do not leave TDD intent implicit or hidden outside the saved plan artifact
- for behavior-changing code tasks, require `red_command`, `expected_red_failure`, and `green_command`
- require empty `red_evidence` and `green_evidence` fields so implementation can fill proof into the durable plan
- use `reason_not_testable` only for truly non-testable work, never for forgotten RED
- for code-before-RED recovery, require the executor to write the intended public-result test, capture real failure, patch to pass, and mark `tdd_status: recovered`

## Execution metadata

`tdd_status` must be one of:

- `required` for behavior-changing code work
- `not_testable` for behavior that cannot be tested in this task, with `reason_not_testable`
- `recovered` when production code came first and RED was reconstructed honestly
- `not_applicable` for docs-only, formatting-only, generated-code-only, config-only, scaffold/bookkeeping-only, or other non-behavior-changing work

`tdd_target` must name one public behavior to prove first, or explain the non-runtime artifact being validated when `tdd_status` is not applicable.

`red_command` must be the exact command to run before implementation for testable tasks.

`expected_red_failure` must name the failing assertion, error, or observable mismatch expected before implementation.

`green_command` must be the exact command to run after implementation.

`reason_not_testable` must be blank unless `tdd_status: not_testable` or `not_applicable`.

`red_evidence` and `green_evidence` start blank in the plan and must be filled during implementation before task completion.

`review_mode` must be:

- `cli` for tests, commands, APIs, or non-visual validation
- `browser` for interactive UI validation
- `mixed` when both are required
