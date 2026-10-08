# Validation Scope

The delivery-wide validation policy. Read it when choosing task validation,
starting or reusing a runtime, choosing a verification run, diagnosing a
failure, or closing out. Local validation follows the plan; CI owns broad
regression.

## Local validation is focused

Run only:

- focused tests for the changed behavior
- integration checks the change directly touches
- type and lint checks for the affected workspaces

Broaden local validation only for a concrete changed dependency, a focused
failure, or an explicit user request. Rerun a check only when its relevant
inputs changed.

A failure outside the plan's changed behavior is **unrelated**: record it with
its evidence as out of scope and continue. Classify it from that evidence; an
unchanged-baseline run is never the classifier.

## CI owns broad regression

The project's CI owns the full suite and broad regression. CI is the only fresh
run. At closeout, await the CI result for the pushed commit and report it.
Report focused local checks as focused; a full-suite pass comes only from CI or
the fallback below.

**Fallback**: when the project has no full-suite CI, or CI runs no E2E, closeout
runs one **local broad run** covering only what CI lacks: the full suite when
there is no CI; the E2E journeys when CI has no E2E. It runs on the Owned Stack
after a controlled reset. Unrelated failures follow the rule above. Report it as
a local broad run, never as a CI result.

## Verification Tiers

Pick the cheapest tier that can answer the current question:

1. **Tier 1**: saved receipts and pure-helper checks, to correct a diagnosis.
2. **Tier 2**: a focused reproduction for one hypothesis, on the Owned Stack.
3. **Tier 3**: the plan-scoped acceptance journey, once focused checks settle.

Saved receipts never replace current runtime acceptance. Tier 3 exercises only
the stories the plan changes.

## Owned Stack

The **Owned Stack** is the runtime (containers, services, processes, scratch
state) that this delivery started and owns, isolated from other runs and users.
Start it once and reuse it across delivery steps, tasks and tiers. Between runs,
restore known state with a controlled reset: truncate or reseed owned data,
restart only the process a change invalidated. Relaunch only when a reset cannot
restore known owned state.

Reuse a resource only with proven ownership and isolation. Reuse earlier
evidence only when its relevant input identities (authority, code, runtime,
scenario) match. Tear the Owned Stack down through owned cleanup when the
delivery ends.

## Expensive runs need a New Discriminator

An expensive run is any run that rebuilds artifacts, starts the stack, or
drives a multi-service journey. Before another one, state its **New
Discriminator**: the fact it can confirm or reject that earlier runs did not.
Confirm the Observation Manifest (see `verify-behavior`) is complete for that
fact. When the same observation is missing again, revise the diagnostic plan;
another rerun of the same plan cannot supply it.
