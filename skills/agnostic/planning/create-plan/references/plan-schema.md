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
- validation gates per phase when phases exist
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
- `review_mode`

`backlog_item_id` and `backlog_item_url` reference the owning product-facing story, not a task-owned backlog record.

Multiple tasks may point to the same story when one story needs several execution steps.

Do not create a new backlog item only because a task boundary exists in the plan.

`assigned_skills` must list the skills used to shape the task during planning, not only skills expected during implementation. Skill guidance should be reflected in the task's boundary, validation, `tdd_target`, and `review_mode`.

For behavior-changing code tasks, `tdd_status` must be `required` and the task must include concrete RED/GREEN commands before implementation starts. For docs-only, formatting-only, generated-code-only, config-only, scaffold/bookkeeping-only, or truly non-testable tasks, record `tdd_status: not_applicable` or `not_testable` with an explicit `reason_not_testable`.

`red_evidence` and `green_evidence` are execution fields. They should be present but blank when the plan is created, then filled by `implement-spec` before the task is marked complete.

`reason_not_testable` cannot be used for "forgot RED." If production code came first, the executor must recover by writing a real public-result RED test, capturing failure evidence, patching to GREEN, and setting `tdd_status: recovered`.

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
- **review_mode**: cli | browser | mixed
```
