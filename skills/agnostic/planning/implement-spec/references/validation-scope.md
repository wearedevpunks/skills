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

The **Owned Stack** is the runtime this delivery owns: its processes, its
scratch state, and its data on shared servers. Owned Stack isolation means data
isolation.

Heavy servers (Postgres, RabbitMQ, MinIO and similar) are shared across runs,
deliveries and agents. Reuse a running one; start one only when none runs. Each
run owns its data there: its own database, vhost or bucket, named from the run.
Two risks follow. A shared server is a single point of failure for every run
on it. A test that reads or writes outside its run's data breaks other runs, so
every test stays inside its run's data.

Start the Owned Stack once and reuse it across delivery steps, tasks and tiers.
Between runs, restore known state with a controlled reset: truncate or reseed
owned data, restart only the process a change invalidated. Relaunch only when a
reset cannot restore known owned state.

Reuse any other resource only with proven ownership and isolation. Reuse
earlier evidence only when its relevant input identities (authority, code,
runtime, scenario) match. When the delivery ends, tear the Owned Stack down
through owned cleanup: drop the run's data, stop the run's processes, and leave
shared servers running. Then run the test-resource sweep.

### Test-resource sweep

An agent command timeout kills the test process with SIGKILL, so its own
teardown never runs and its containers stay behind. Every container a test
starts carries these labels, set by the tests or by the project's test resource
manager:

- `hi.test-resource=true`
- `hi.owner-pid=<pid of the test process>`
- `hi.run-id=<id>` (optional)

With Ryuk disabled, the labels are the only way the sweep finds orphans. Start
shared servers without them, so the sweep leaves those servers running.

`hi update` installs the sweep. Run
`node .agents/scripts/test-resource-sweep.mjs` (`--dry-run` lists without
removing). It removes only proven orphans: labeled containers that have exited,
and running labeled containers whose owner pid is dead. It leaves unlabeled
containers alone and exits 0 when Docker is absent.

Run it at delivery closeout and at debugging-phase exit. Where the agent
harness supports it, a SessionEnd hook also runs it; the hook is a backstop, so
closeout and debugging exit still run the sweep.

## Expensive runs need a New Discriminator

An expensive run is any run that rebuilds artifacts, starts the stack, or
drives a multi-service journey. Before another one, state its **New
Discriminator**: the fact it can confirm or reject that earlier runs did not.
Confirm the Observation Manifest (see `verify-behavior`) is complete for that
fact. When the same observation is missing again, revise the diagnostic plan;
another rerun of the same plan cannot supply it.
