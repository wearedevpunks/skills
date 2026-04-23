# TDD Phase

Use this reference for the `$tdd` shaping phase across execution tasks.

## TDD shaping rules

Preserve `$tdd` behavior:

- surface the public interface change and the behavior priority behind the task
- identify deep-module or testability opportunities while task boundaries are still fluid
- define the first public-interface behavior that should fail before implementation
- prefer integration-style behavior through public interfaces
- avoid implementation-detail or private-method testing
- avoid horizontal slicing; every task should represent a RED -> GREEN tracer bullet
- make the first failing test concrete enough that a worker can start without guessing
- do not leave TDD intent implicit or hidden outside the saved plan artifact

## Execution metadata

`tdd_target` must name one public behavior to prove first.

`review_mode` must be:

- `cli` for tests, commands, APIs, or non-visual validation
- `browser` for interactive UI validation
- `mixed` when both are required
