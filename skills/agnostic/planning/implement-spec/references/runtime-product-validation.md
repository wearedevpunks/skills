# Runtime Product Validation

Use this reference only for tasks with `runtime_validation: required`. The plan fields define what must be proved; this reference defines how to obtain and report the proof.

## Recover Project Verifier coverage

For visibly exercisable acceptance, retain the original scenario, affected criteria,
selected apps and authority/code/runtime/scenario identities, then invoke the single
`verify-behavior` entrypoint. It progressively selects project-owned references.

- **Uncovered Surface**: invoke `create-verification-skill` for the selected missing
  app. Wait for `ready` with complete Reference Smoke Proof before resuming.
- **Uncovered Behavior**: invoke `update-verification-skill` for the selected missing
  drive path. `unchanged` or `updated` resumes the original scenario with live proof;
  `blocked` keeps every affected criterion blocked with its exact prerequisite;
  `product-failure` routes the retained symptom to `debugging-phase` without changing
  expected product semantics.

Coverage recovery remains inside implementation and on the current branch/PR. Shared
skills own the protocol; app mechanics remain project-owned below
`.agents/skills/verify-behavior/references/`. Missing references or paths require these
branches before acceptance classification; improvised automation cannot bypass them.

Compare returned proof with the original scenario's authority, code, runtime and
scenario identities and every required observation/side effect. Reuse only complete
matching proof; otherwise invoke `verify-behavior` for the missing proof before
classifying affected acceptance. A Reference Smoke Proof is readiness evidence, not
a blanket acceptance pass. Recheck identities after execution; changed inputs invalidate
only affected proof. `implement-spec` owns evidence freshness and affected reruns;
Code Review consumes retained evidence without executing or maintaining the verifier.

## Discover and recover the supported runtime

Read scoped repository guidance, runbooks, manifests, and scripts to identify:

- the supported startup command and required services
- health or readiness gates
- public product actions
- privileged setup or diagnostic adapters
- durable evidence sources
- cleanup rules

Start the supported runtime and dependencies. Treat a missing or broken runtime as a diagnosis and recovery task before declaring a blocker. Record an exact blocker only after relevant recovery attempts fail or required authority or infrastructure is unavailable.

## Run an isolated scenario

1. Create fixtures with a unique correlation or provenance id for this validation run.
2. Exercise the public product entrypoint a real client uses: API, command, browser flow, mobile action, or equivalent supported surface.
3. Verify the public result and the durable evidence named by `runtime_evidence`, such as persisted state, operation reports, queue or worker completion, emitted resources, provider results, correlated logs, traces, or spans.
4. Confirm automated checks also pass; they complement runtime proof but do not replace it.
5. Clean up only resources conclusively owned by the validation run through its correlation, provenance, or returned resource ids.

## Privileged adapter boundary

A privileged local adapter or hidden controller is allowed only for:

- fixture setup the public product cannot perform
- agent-only or otherwise unreachable actions required by the scenario
- diagnostics needed to reach a conclusive result

Do not use it as the default action path, a second product API, or a substitute for exercising a reachable public entrypoint. Record why each privileged use was necessary.

## Evidence and reporting

Keep evidence durable enough for another reviewer to inspect or replay. Under `## Runtime Validation Evidence` in `IMPLEMENTATION-NOTES.md`, record exactly:

- task, scenario, and `runtime_target`
- public action performed
- correlation or provenance ids
- expected result
- observed public result and durable evidence
- cleanup performed and owned resources removed or retained
- status, or the exact blocker

An exact blocker names the command or action attempted, observed failure, recovery attempted, missing dependency or authority, and next action needed. Also keep the task and affected acceptance criterion marked blocked.

Runtime validation is conclusive only when the supported public action produces the expected public result and the required durable evidence is correlated to the same isolated run. Missing correlation, mock-only proof, direct database mutation as the primary action, a success response without the required side effect, or unverified cleanup cannot satisfy completion.
