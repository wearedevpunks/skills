# Parallel Worker Brief

Use this reference when spawning a worker for one task in a parallel wave.

## Required context

Every worker brief should include:

- plan file or spec-folder context
- relevant goals or overview from the plan
- task id and task name
- task dependencies
- related tasks when they matter
- file locations
- full description
- acceptance criteria
- validation contract
- `tdd_target`
- `tdd_status`
- `codebase_design_notes`
- `red_command`
- `expected_red_failure`
- `green_command`
- `reason_not_testable`
- `review_mode`
- relevant risks or constraints from the plan

## Required instructions

Each worker brief should require:

1. reading the plan and understanding the specific task first
2. reading all relevant files first, then doing targeted codebase research before editing
3. starting from `tdd_target` and driving the task RED first when it is testable
4. preserving or explicitly reconciling `codebase_design_notes` for module interface, seam, adapter strategy, and test surface
5. capturing failing evidence for the expected behavior gap before implementation
6. recording `red_evidence` and `green_evidence` in the plan before marking behavior-changing tasks complete
7. recovering code-before-RED by writing the intended public-result RED test and marking `tdd_status: recovered`, not by using `reason_not_testable`
8. recording an explicit `reason_not_testable` plus exact alternative verification when the task is not a good TDD candidate
9. treating RED-phase tests or the approved non-testable verification plan as the implementation contract
10. not weakening or removing tests unless requirements changed
11. implementing only the assigned task scope and satisfying all acceptance criteria
12. running the exact task validation evidence before returning, plus extra plan validation when feasible
13. resolving any in-goal debt immediately instead of leaving TODOs, temporary workarounds, or "later" notes
14. stopping for parent clarification when a debt item requires a product/scope decision outside the assigned task
15. updating the plan entry with status, log, touched files, and gotchas before handoff closes

## Worker output contract

Require the worker to return:

- files modified or created
- concise summary of changes
- how the acceptance criteria are satisfied
- verification evidence: RED -> GREEN for testable tasks, or the exact non-testable alternative that was run
- validation evidence performed
- validation intentionally deferred
- anything blocked or risky, with exact reason and required decision

## Scope rule

The worker is not responsible for overall wave orchestration.

The worker owns:

- one assigned task
- its local validation
- its plan-entry updates

The parent `implement-spec` run owns:

- wave construction
- cross-task dependency handling
- review of worker outputs
- retry and escalation decisions
- deciding when the wave is complete
