# Plan Schema

Use this reference to normalize `PLAN.md` for execution.

## Plan contract

The generated `PLAN.md` is the execution handoff. It must stand alone without hidden context.

Include:

- `architecture_applicability: local | architecture-bearing` with evidence
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

When `architecture_applicability: architecture-bearing`, also include the normative **Target Ownership
Topology**, **Declared Dependency Graph**, **Responsibility Acceptance Criteria**, **Architecture Waves**,
**Public Seam Contract**, and **Migration Ledger** defined in
[architecture-convergence.md](architecture-convergence.md). Persist each view using `$show-me`; the migration
ledger starts with every planned temporary seam and final closure requires it to be empty.

`unresolved questions` is not a hiding place for skipped planning. Include only `$grilling`-deferred, externally blocked, or non-blocking questions, and state why each remains open.

Each wave contains every currently unblocked task whose `owned_paths` are
disjoint. A wave contains one task only when dependencies or ownership leave
one task unblocked.

## Task contract

Every task must include:

- stable task id
- `depends_on`
- `location`
- `owned_paths`
- `wave_boundary`
- `description`
- `validation`
- `status`
- `log`
- `files edited/created`
- `task_identity_mode`
- `backlog_item_id`
- `backlog_item_url`
- `relation_mode`
- `backlog_sync_skip_reason`
- `assigned_skills`
- `implementation_skill_guidance`
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

Every architecture-bearing task must also include:

- `architecture_wave`
- `behavior_owner`
- `integration_surface`
- `public_seam`
- `topology_delta`
- `forbidden_ownership`
- `temporary_seams`
- `responsibility_acceptance_criteria`

These fields bind the task to cumulative ownership rather than file placement. Local-plan tasks omit them;
their plan-level applicability evidence and ordinary `codebase_design_notes` are the explicit escape hatch.

`architecture_wave` is a stable architecture sequence id, for example `A2`; `wave_boundary` remains the worker
parallelism id. `responsibility_acceptance_criteria` lists the stable criterion ids this task advances or proves.
Every listed id must exist in the plan-level Responsibility Acceptance Criteria view, whose entry declares its
`due_architecture_wave`. Each criterion maps to at least one task and exactly one due architecture wave.

`task_identity_mode` is uniform across the plan:

- `provider-task`: `backlog_item_id` records the stable provider Task identity,
  `backlog_item_url` records that exact Task's provider URL, `relation_mode` is
  `native` or `body-links`, and `backlog_sync_skip_reason` is blank. Each `Tn`
  is a plan alias for one provider Task, never a second execution identity.
  Preserve the Task's exact parent Story, same `V*`, source links, and provider
  readback in the plan context.
- `planning-only`: `Tn` is the execution identity. Set `backlog_item_id` and
  `backlog_item_url` to `not_applicable`, `relation_mode` to `unprojected`, and
  record a nonempty `backlog_sync_skip_reason`. Provider parent, milestone,
  provenance, blocker, and readback claims are absent.

In `provider-task` mode, `depends_on` preserves or mirrors native provider Task
blocker edges through the `Tn` alias map. In `planning-only` mode, it names
other `Tn` identities in the same plan. Worker waves derive from the applicable
graph and disjoint ownership.

`owned_paths` lists the exact write scope assigned to the task. Tasks in the
same wave must have disjoint `owned_paths`.

`wave_boundary` names the explicit execution wave derived from completed
dependencies and disjoint ownership, for example `W1`.

Multiple provider Tasks may share one parent Story. Planning preserves those
separate provider identities and cannot create another Task identity for them.

`assigned_skills` must list the skills used to shape the task during planning, not only skills expected during implementation. Skill guidance should be reflected in the task's boundary, validation, `tdd_target`, `codebase_design_notes`, and `review_mode`.

`implementation_skill_guidance` is the executor contract for the task. Assess
every `assigned_skills` item for implementation applicability. Every
implementation-applicable `assigned_skills` item maps to exactly one guidance
entry; omit planning-only items. Each entry carries the exact skill identity and
concise applicable behavior:

- `skill`: exact skill identity
- `applicable_behavior`: concise behavior the executor must follow while
  implementing this task

Deduplicate by skill within one task. Do not replace `assigned_skills`; it
remains planning provenance.

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
- **owned_paths**: [src/example.ts, tests/example.test.ts]
- **wave_boundary**: W2
- **description**: Implement the task behavior.
- **validation**: Public-interface behavior that proves completion.
- **status**: Planned
- **log**:
- **files edited/created**:
- **task_identity_mode**: provider-task | planning-only
- **backlog_item_id**: CP-128
- **backlog_item_url**: https://linear.app/workspace/issue/CP-128/example-task
- **relation_mode**: native | body-links | unprojected
- **backlog_sync_skip_reason**:
- **assigned_skills**: [`effect`, `tdd`]
- **implementation_skill_guidance**:
  - **skill**: `effect`
    **applicable_behavior**: Model the boundary with typed effects and preserve typed failure channels.
  - **skill**: `tdd`
    **applicable_behavior**: Capture the named public-result RED before implementation and preserve its GREEN evidence.
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
- **architecture_wave**: A2
- **behavior_owner**: Target domain or module responsible for the changed behavior.
- **integration_surface**: Composition, transport, UI, or caller surface consuming the owner.
- **public_seam**: Declared entrypoint and command/result/port contract, or unchanged.
- **topology_delta**: Exact owner or dependency edge moved toward the target topology.
- **forbidden_ownership**: Policy or mechanics this task must keep outside its owner.
- **temporary_seams**: Ledger entries introduced or removed by this task, or none.
- **responsibility_acceptance_criteria**: [RAC-2, RAC-3]
```
