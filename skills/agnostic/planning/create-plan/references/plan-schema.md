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
- `tdd_target`
- `review_mode`

`backlog_item_id` and `backlog_item_url` reference the owning product-facing story, not a task-owned backlog record.

Multiple tasks may point to the same story when one story needs several execution steps.

Do not create a new backlog item only because a task boundary exists in the plan.

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
- **tdd_target**: First failing public behavior to implement.
- **review_mode**: cli | browser | mixed
```
