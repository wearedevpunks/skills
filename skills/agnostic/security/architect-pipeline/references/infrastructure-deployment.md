# Infrastructure deployment criteria

Use this reference when a pipeline previews, applies, updates, destroys, or promotes infrastructure or other desired-state environments. It defines the orchestration contract; the matching infrastructure-engine skill owns APIs, resource semantics, state commands, and configuration formats.

## Deployment theory

Treat a deployment as a controlled transition from declared intent to an identified environment. A preview or plan is a non-mutating projection of that transition against a particular revision, environment identity, state snapshot, policy set, and input set. Apply only a reviewed plan whose inputs and identity remain unchanged; when the system cannot preserve that association, record the limitation and add an equivalent verification gate.

Keep desired state, state authority, and live environment distinct. The pipeline must know which system owns state, how concurrent writers are serialized, how state is backed up or recovered, and what happens when live reality drifts from recorded state. A successful command is not proof that the intended environment is current.

Prefer idempotent transitions and explicit recovery over blind retries. A retry must identify whether the prior transition completed, partially completed, or failed before mutation. Rollback is a declared capability with tested prerequisites; when rollback is unsafe or unavailable, define forward repair and operator recovery instead.

## Required criteria

Before implementation, establish:

- the target environment and immutable revision or artifact identity;
- the preview or plan command and the exact apply gate;
- policy checks, human approvals, and conditions that block unsafe changes;
- the state authority, locking or concurrency mechanism, backup, and recovery owner;
- environment-scoped identity and the minimum capability needed for each stage;
- drift detection, refresh, reconciliation, and escalation behavior;
- timeout, cancellation, partial-failure, retry, rollback, and forward-repair behavior;
- outputs passed to later stages without leaking secrets;
- audit evidence sufficient to connect intent, plan, approval, apply, and outcome.

Run preview or plan before apply and preserve the reviewed result or its verifiable identity whenever the engine permits. Recompute when revision, environment, policy, state, or inputs change. Keep credentials out of plans, logs, caches, artifacts, and process arguments; use short-lived identity and the narrowest environment scope available.

If the repository lacks a supported preview, policy, state-locking, drift, or recovery capability, surface that gap as a design decision. Do not invent provider-specific behavior or weaken the gate to force implementation.
