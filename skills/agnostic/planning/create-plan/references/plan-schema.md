# Plan Schema

Use this reference to normalize `PLAN.md` for execution.

## Plan contract

The generated `PLAN.md` is the execution handoff. It must stand alone without hidden context.

Include:

- initial situation
- issue or problem statement
- proposed solution shape
- resolved decision ledger
- assumptions and constraints
- codebase findings
- external research used
- dependency graph
- parallel execution waves
- testing strategy
- risks and mitigations
- validation gates per `Tn` task and dependency wave
- unresolved questions

`unresolved questions` is not a hiding place for skipped planning. Before saving a plan with unresolved questions, prompt the user to resolve each plan-shaping question that they can reasonably answer now. Keep only deferred, externally blocked, or non-blocking questions, and state why each remains open.

## Task contract

Every task must include:

- stable task id
- `depends_on`
- `location`
- `description`
- `validation`
- `status`
- `log`
- `files edited/created`
- `backlog_item_id`
- `backlog_item_url`
- `relation_mode`
- `assigned_skills`
- `tdd_status`
- `tdd_target`
- `red_command`
- `expected_red_failure`
- `green_command`
- `reason_not_testable`
- `red_evidence`
- `green_evidence`
- `codebase_design_notes`
- `review_mode`
- `runtime_validation`
- `runtime_target`
- `runtime_evidence`
- `runtime_cleanup`

`backlog_item_id` and `backlog_item_url` reference the owning product-facing story, not a task-owned backlog record.

Multiple tasks may point to the same story when one story needs several execution steps.

Do not create a new backlog item only because a task boundary exists in the plan.

`assigned_skills` must list the skills used to shape the task during planning, not only skills expected during implementation. Skill guidance should be reflected in the task's boundary, validation, `tdd_target`, `codebase_design_notes`, and `review_mode`.

For behavior-changing code tasks, `tdd_status` must be `required` and the task must include concrete RED/GREEN commands before implementation starts. For docs-only, formatting-only, generated-code-only, config-only, scaffold/bookkeeping-only, or truly non-testable tasks, record `tdd_status: not_applicable` or `not_testable` with an explicit `reason_not_testable`.

`red_evidence` and `green_evidence` are execution fields. They should be present but blank when the plan is created, then filled by `implement-spec` before the task is marked complete.

`reason_not_testable` cannot be used for "forgot RED." If production code came first, the executor must recover by writing a real public-result RED test, capturing failure evidence, patching to GREEN, and setting `tdd_status: recovered`.

`codebase_design_notes` must name the relevant module interface, seam, adapter, or test surface when the task changes code structure. Use `not_applicable` only when the task has no codebase-design consequence.

`runtime_validation` must be `required` when acceptance crosses a process or infrastructure boundary that automated checks or mocks cannot faithfully prove, including workers, queues, persistence, providers, tracing, deployment wiring, or similar runtime integration. Otherwise use `not_required`.

When runtime validation is required:

- `runtime_target` names the supported running product surface.
- `runtime_evidence` names the externally visible result and durable side effect or diagnostic proof required.
- `runtime_cleanup` defines the provenance identifiers and owned-resource cleanup expectation.

Use `not_applicable` for the other runtime fields when `runtime_validation: not_required`. Runtime validation is orthogonal to `review_mode`; a `cli`, `browser`, or `mixed` task may still require it. Execution mechanics are disclosed in [../../implement-spec/references/runtime-product-validation.md](../../implement-spec/references/runtime-product-validation.md).

```md
### T3: Example task

- **depends_on**: [T1, T2]
- **location**: src/example.ts
- **description**: Implement the task behavior.
- **validation**: Public-interface behavior that proves completion.
- **status**: Planned
- **log**:
- **files edited/created**:
- **backlog_item_id**: CP-128
- **backlog_item_url**: https://linear.app/workspace/issue/CP-128/example-story
- **relation_mode**: native | body-links
- **assigned_skills**: [`effect-authoring`, `effect-best-practices`, `tdd`]
- **tdd_status**: required
- **tdd_target**: First failing public behavior to implement.
- **red_command**: Exact command expected to fail before implementation.
- **expected_red_failure**: Expected assertion, error, or mismatch.
- **green_command**: Exact command expected to pass after implementation.
- **reason_not_testable**:
- **red_evidence**:
- **green_evidence**:
- **codebase_design_notes**: Interface/seam/adapter/test-surface notes, or not_applicable.
- **review_mode**: cli | browser | mixed
- **runtime_validation**: required | not_required
- **runtime_target**: Supported local API and background worker.
- **runtime_evidence**: Public response plus correlated persisted state and worker completion.
- **runtime_cleanup**: Tag fixtures with a unique run id; remove only resources carrying that id.
```
