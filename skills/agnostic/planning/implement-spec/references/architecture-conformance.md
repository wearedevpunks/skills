# Architecture Conformance

Use this contract when `PLAN.md` declares architecture applicability as
`architecture-bearing`. A `local` plan keeps the normal task design checks and
does not invent an architecture contract during execution.

The plan is authoritative. Execute its **Target Ownership Topology**, **Declared
Dependency Graph**, **Responsibility Acceptance Criteria**, **Architecture Waves**,
public seam contract, and migration ledger. Execution may clarify
evidence. An evidence-only clarification may be recorded locally when it changes
no owner, edge, criterion, wave, seam, migration, or task contract. Any target
contract change pauses execution and routes back through `$create-plan` on the
same spec folder for architecture convergence authoring and plan review. Reload
the amended plan before dispatching more architecture-bearing work.

## Load the theory

Before the first architecture wave, load `$backend-domain-structure` for
backend scope and `$frontend-domain-structure` for frontend scope. Read their
required references. Use their responsibility classifiers, public boundaries,
and dependency direction to interpret the plan against the actual repository.
Preserve project-native folder names: responsibility is authoritative; an
example tree is not.

When an accepted amendment changes the target contract, re-ground the affected
scope in `$backend-domain-structure` and `$frontend-domain-structure` as
applicable, including their required references. Rewrite every affected
`$show-me` persisted view from the amended authority before execution resumes.

Invoke `$show-me` to render each persisted architecture evidence view from the
authoritative plan and observed code. Persist the smallest useful ownership
tree, dependency graph, wave delta, or seam diff beside its textual conclusion
in `IMPLEMENTATION-NOTES.md`. The view preserves plan labels, status,
uncertainty, and violations; it introduces no architecture decision.

## Before dispatch

For each architecture wave:

1. Resolve its required starting topology and dependency state from the prior
   checkpoint.
2. Map every task's `architecture_wave`, `behavior_owner`,
   `integration_surface`, `public_seam`, `topology_delta`,
   `forbidden_ownership`, `temporary_seams` including `expiry_wave`, and
   `responsibility_acceptance_criteria` including each `criterion_id` and
   `due_wave` into its worker brief unchanged.
3. Verify the tasks collectively advance the declared architecture wave and
   have responsibility acceptance criteria that can be evidenced.
4. Block dispatch when a prerequisite checkpoint failed or the wave would
   introduce an undeclared dependency, public seam change, or temporary seam.

Dispatch is ready when every architecture-bearing task has an accountable
owner, expected graph delta, seam contract, and checkable responsibility bound.

## Cumulative conformance checkpoint

Run a cumulative conformance checkpoint after every architecture wave, before
computing the next wave. Inspect the whole affected graph, not only the latest
diff:

- compare actual responsibility placement with the Target Ownership Topology;
- compare static imports and semantic calls with the Declared Dependency Graph;
- prove every Responsibility Acceptance Criterion due through the current
  architecture wave, keyed by `criterion_id`, with changed artifacts and focused
  validation;
- rerun each previously met criterion as a regression check and revoke its met
  status when current evidence fails;
- reconcile every planned `topology_delta` and `forbidden_ownership` rule;
- detect public seam additions, removals, signature changes, aliases, and deep
  imports, and reconcile each with the public seam contract;
- reconcile the migration ledger: introducing task, reason, allowed consumers,
  removal task, expiry wave, current status, and removal proof;
- reject undeclared temporary seams and migrations due through the current
  architecture wave whose removal proof is absent;
- run the narrowest available architecture, import-boundary, cycle, type, and
  focused behavior checks.

Record the checkpoint in `PLAN.md` and under `## Architecture Conformance
Evidence` in `IMPLEMENTATION-NOTES.md`. Include expected state, observed state,
evidence, violations, public seam delta, migration delta, and verdict. A failed
checkpoint blocks dependent architecture waves. Repair the current wave or
route a target-contract amendment through `$create-plan`; final closure is not
the first cleanup pass.

## Final closure

After the last architecture wave, rerun the checkpoint across the complete
affected topology. Closure requires:

- zero drift from the Target Ownership Topology and Declared Dependency Graph;
- every Responsibility Acceptance Criterion met with cited evidence;
- every public seam change declared and accepted;
- the entire migration ledger is empty, with removal proof for every retired
  temporary seam;
- no expired or undeclared temporary seam remains;
- focused architecture and behavior validation is green.

Keep the spec incomplete when closure fails. Record exact drift and the task or
decision required to remove it; never convert in-goal architecture drift into
generic tech debt.
