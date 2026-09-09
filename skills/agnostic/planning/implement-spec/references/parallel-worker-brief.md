# Task Worker Brief

Use this reference when spawning a worker for one task released from the Execution Frontier.

## Compact task kernel

Keep these execution decisions inline in every brief:

- task id/name, provider identity and task-identity/relation mode when applicable
- dependencies, intended outcome, acceptance references, execution status
- recorded current branch, owned paths / Active Write Scope, Read Dependencies
  and Shared Runtime Resources forming the Relevant Input Set
- validation commands and RED/GREEN targets, `tdd_status`, evidence requirements
  or exact `reason_not_testable` and alternative verification
- applicable TDD, runtime, UI, provider-readback, Verification and acceptance gates
- Architecture Checkpoint identifiers, due responsibility criterion ids,
  architecture wave and ownership/risk constraints

Supply specification detail, code symbols, architecture views and exact skill
instructions through Context Pointers. Each pointer names its authority path or
URL, a task-relevant selector (heading, criterion, symbol or guidance entry),
when to read it, and the source identity to compare with current bytes. Read
selected pointers before implementing; unrelated sections remain disclosed.
Resolve applicable skill guidance without paraphrasing its obligations. Preserve
`assigned_skills` as provenance and every `implementation_skill_guidance` identity
for one-to-one result evidence.

A Derived Context Excerpt may avoid a predictable lookup. Label it subordinate,
keep it bounded to the needed rationale, retain its resolvable Context Pointer,
and record a source revision or content digest plus the selector used. A timestamp
alone cannot detect changed inputs. Compare identity before consuming the excerpt
and before validating its result. A missing source, changed relevant input,
unsourced excerpt, full copied authority, or excerpt/source mismatch requires
refresh from authority or an exact blocked Task Result; stale material cannot
justify implementation or release. Update the affected Relevant Input Set and
repeat affected checks before parent acceptance.

Read [ui-screenshot-evidence.md](ui-screenshot-evidence.md) for UI work and
[runtime-product-validation.md](runtime-product-validation.md) when
`runtime_validation: required`. Read the task's architecture contract when its
checkpoint or responsibility criteria apply.

## Required instructions

Each worker brief should require:

1. reading the plan and understanding the specific task first
2. reading all relevant files first, then doing targeted codebase research before editing
3. starting from `tdd_target` and driving the task RED first when it is testable
4. preserving or explicitly reconciling `codebase_design_notes` for module interface, seam, adapter strategy, and test surface
5. capturing failing evidence for the expected behavior gap before implementation
6. returning `red_evidence` and `green_evidence` in the Task Result before marking behavior-changing tasks complete
7. recovering code-before-RED by writing the intended public-result RED test and marking `tdd_status: recovered`, not by using `reason_not_testable`
8. recording an explicit `reason_not_testable` plus exact alternative verification when the task is not a good TDD candidate
9. treating RED-phase tests or the approved non-testable verification plan as the implementation contract
10. not weakening or removing tests unless requirements changed
11. implementing only the assigned task scope and satisfying all acceptance criteria
12. running the exact task validation evidence before returning, plus extra plan validation when feasible
13. resolving any in-goal debt immediately instead of leaving TODOs, temporary workarounds, or "later" notes
14. stopping for parent clarification when a debt item requires a product/scope decision outside the assigned task
15. capturing and linking durable before/after screenshot evidence when the task changes UI
16. returning status, log, touched files, and gotchas for parent reconciliation before handoff closes
17. loading every forwarded skill and applying its stated behavior where the
    task evidence supports it
18. returning exactly one evidence record per guidance entry with skill,
    `loaded`, `applied`, or `not_applicable` status, and a how/where pointer;
    `not_applicable` also states why and where it was assessed
19. refusing completion for required runtime validation without conclusive recorded evidence; returning an exact blocker leaves the task blocked
20. for an architecture-bearing task, implementing toward the declared ownership topology and dependency graph, proving each due `responsibility_acceptance_criteria` item by `criterion_id`, and reporting every public-seam and migration-ledger delta with its architecture wave

## Task Result

Return one Task Result with task/provider identity, `ready_for_gate | blocked`
status, source and Relevant Input Set identities, exact blocker when blocked,
and:

- files modified or created
- concise summary of changes
- how the acceptance criteria are satisfied
- verification evidence: RED -> GREEN for testable tasks, or the exact non-testable alternative that was run
- validation evidence performed
- durable UI before/after screenshot links when UI changed
- required runtime-validation scenario, observed evidence, cleanup result, or exact blocker
- validation intentionally deferred
- one skill-application evidence record for every forwarded guidance item,
  preserving the exact skill identity
- anything blocked or risky, with exact reason and required decision
- architecture evidence: observed ownership and dependency delta,
  responsibility-acceptance proof keyed by `criterion_id`, public-seam delta,
  and temporary-seam status including `expiry_wave`

## Parent reconciliation

The worker owns assigned paths and local validation in the recorded current
branch. It returns its Task Result to the parent; shared `PLAN.md` and
`IMPLEMENTATION-NOTES.md` remain parent-only writes. Workers neither create
branches/worktrees nor edit another task's result or canonical summaries.

The parent validates the Task Result, evidence freshness and Active Write Scope,
then records its Task Gate decision. A passed Task Gate can release safe
dependents through the Execution Frontier while mechanical summary reconciliation
is pending. Retain the accepted result and reconciliation status in parent-owned
execution state so a summary backlog cannot erase acceptance or imply completion.
A stale or blocked summary is visible with affected tasks, exact reason and next
action; parent reconstructs it from fresh Task Results, never from worker guesses.

Track the Task Gate result (`passed | repair_required | blocked`) separately
from evidence eligibility (`pending | current | invalidated`), reconciliation
(`pending | complete | stale | blocked`), final acceptance and post-implementation
Code Review separately. A failed summary write leaves reconciliation blocked,
not the Task Gate falsely failed or final acceptance passed. If the failure hides
or invalidates task evidence, hold affected release until evidence is recovered.

Before an applicable Architecture Checkpoint, reconcile every contributing result
and assess cumulative ownership, dependency, public-seam, responsibility and
migration conformance. Finalization requires all results reconciled, applicable
Verification and acceptance proof, final zero architecture drift and an empty
migration ledger. Shared summaries describe these gates; they never replace them.
The parent owns frontier decisions, scope transfer, retries, escalation and
canonical record reconciliation. Delivery review follows implementation acceptance
through the lifecycle contract.
