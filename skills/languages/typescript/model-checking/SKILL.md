---
name: model-checking
description: Model a flow as a TypeScript `*.proof.ts` module and check every reachable state with tsprover. Use when a flow has two or more writers on shared state, a background job or retry touching client-written state, recovery or resync, or a delivery guarantee such as "eventually delivered".
---

# Model Checking

A **Model** is a `*.proof.ts` module that states the state, actions and invariants of one flow. `tsprover` compiles it to TLA+, and `tla-ts` checks every reachable state of it. A violation prints a trace: the sequence of actions, with the state after each, that breaks an invariant or property.

Use exactly `tsprover@0.0.2` and `tla-ts@0.0.3`. Both are 0.0.x releases, so any release can change the Model language or the checker; an exact pin keeps a check result reproducible.

## Trigger

Write a Model for each flow that has at least one of:

- two or more writers on shared state;
- a background job or retry that touches client-written state;
- recovery or resync;
- a delivery guarantee, such as "eventually delivered".

A flow without one of these gets no Model.

## Model Rules

- Scope one Model to one service. Read the service's composition file as the map: state that the service owns becomes a top-level `let`; each dependency wired there stays outside the Model and enters only as an action.
- A top-level `let` is a variable. An exported function that changes state is an action. An exported function that returns a boolean is an invariant; keep a helper unexported so it stays a definition.
- Give every action parameter a finite type: literal unions, `boolean`, enums, records and tuples of these, and `Set` or `Map` of these. `tsprover` rejects `number`, `string` and arrays as parameter types, unless the action starts with a guard that selects the parameter from a set.
- Write each precondition as a guard `if (<condition>) return;` before any change. The guards are the design decisions that the Model checks.
- Mark each action that must eventually run (a job, a retry, a delivery) with `@fair`. State each delivery guarantee as `@leadsTo <target>` on the boolean function that starts it. Without `@fair`, the checker may stall the action forever, and the guarantee fails.
- Bound each counter and queue with a `@constraint` boolean function, so the search ends.
- Run `tsprover --emit <file>` to read the generated TLA+ when a result surprises you.

```ts
// documents/hash-refresh.proof.ts: a client save and a background hash job both write `hashed`.
type Content = "a" | "b";

let content: Content = "a";
let hashed: Content | null = "a";
let jobs = new Set<Content>();
let saves = 0;

export const save = (next: Content) => {
  if (next === content) return;
  content = next;
  hashed = null;
  jobs.add(next);
  saves += 1;
};

/** @fair */
export const hashJob = (job: Content) => {
  if (!jobs.has(job)) return;
  jobs.delete(job);
  if (job !== content) return;
  hashed = job;
};

export const hashMatchesContent = () => hashed === null || hashed === content;

/** @leadsTo isHashed */
export const isPending = () => hashed === null;
const isHashed = () => hashed !== null;

/** @constraint */
export const boundedSaves = () => saves <= 3;
```

This Model passes with 11 distinct states. Without the guard `if (job !== content) return;`, `hashMatchesContent` fails on the trace `save` → `save` → `hashJob`: a stale job writes the hash of old content.

## Steps

Run the steps that your caller needs: architecture runs 1–3, `tdd` runs 4, a plan task runs 5.

1. **Write** the Model of one triggered flow under the Model Rules. Done when each accepted guarantee of the flow is an invariant or a `@leadsTo` property, and each writer of shared state is an action.
2. **Check** it with `npx --yes tsprover@0.0.2 <file>`, where `<file>` is absolute or relative to the package root (`npx` runs from the nearest package root). Exit 0 prints the distinct state count. Exit 1 prints the failed invariant or property and its trace. A trace is a design fault: return it to the caller with the invariant name, unless the Model differs from the accepted design; then correct the Model and check again. Done when the check exits 0 and you have the state count, or the caller has the trace.
3. **Prove** each invariant and property with a [Sensitivity Proof](../tdd/sensitivity.md). For an invariant, the Mutant removes one guard; for a `@leadsTo` property, it removes `@fair` from one action. A Mutant that passes with the same distinct state count as the Model is unreachable: widen the bounds or add an actor until the guarded case is reachable, then prove again. Done when `tsprover` reports a violation of that invariant or property on the Mutant and exits 0 again after the revert.
4. **Replay** each trace as a [Pinned Replay](../tdd/properties.md): map each action of the trace to one command of the stateful property, in trace order. A trace prints the state after each action, not the action's parameters; read each parameter from the state change. Done when every trace action has exactly one command and the Pinned Replay runs as an example test.
5. **Commit** each Model and wire CI under **Commit and CI**. Done when `check:models` exits 0 on the committed Models and CI runs it.

## Commit and CI

An architecture Model is a draft in the spec folder. One plan task moves each Model to `<feature-or-service>/<flow>.proof.ts`, beside the code that it models, and wires the check in the same change:

- Add both tools as exact devDependencies: `"tsprover": "0.0.2"` and `"tla-ts": "0.0.3"`.
- Add the package script `"check:models": "tsprover"`. With no file arguments, `tsprover` checks every `*.proof.ts` below the package and exits 1 on any failure.
- CI runs `check:models`; a violation exits 1 and fails the build.
- A pin bump of either tool reruns `check:models` and every Model Sensitivity Proof in the same change.
- The type check stays on for `*.proof.ts`. When a managed lint rule fires on a Model, add an ignore for that rule scoped to `**/*.proof.ts`.
