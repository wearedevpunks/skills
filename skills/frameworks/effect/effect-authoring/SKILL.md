---
name: effect-authoring
description: >-
  Use when asked to plan, write, build, fix, refactor, or review Effect-TS
  code. Apply before editing so the first implementation follows repo
  conventions for Effect primitives, branded IDs, observability, error design,
  `@effect/vitest`, and Effect-Atom, especially in `packages/api`.
---

# Effect-TS Authoring Guide

Use this skill before edits. Optimize for correct code on first pass, not a scorecard after the fact.

## Workflow

### Step 1: Classify the Task Before Writing

Sort the requested change into the smallest relevant set:

- **Backend Effect code**: Effect services, procedures, repositories, layers, schemas, domain actions
- **Test code**: `.test.ts` files, test layers, failure-path coverage
- **UI / Effect-Atom code**: `.tsx` files using Effect-Atom, RPC, HttpApi clients

Skip config/docs unless they change the implementation contract.

### Step 2: Load Only the References Needed for the Task

Read the minimum reference set before editing:

- **Backend Effect code**: `references/effect-primitives.md`, `references/branded-types.md`, `references/otel-patterns.md`, `references/error-patterns.md`
- **Test code**: `references/test-patterns.md`
- **UI / Effect-Atom code**: `references/effect-atom-patterns.md`

If uncertain about Effect library behavior, run `opensrc path effect` or `opensrc path Effect-TS/effect` to resolve the local checkout path, then inspect there instead of guessing.

### Step 3: Build a Pre-Write Checklist

Turn the loaded references into a short implementation checklist for the exact files/functions being changed.

For backend Effect work, check for these constraints up front:

- Make dependencies visible as Effect requirements or `Effect.Service` dependencies; do not hide them behind concrete imports
- Provide implementations with `Layer`s; avoid call-site `Effect.provide` except at runner/test boundaries
- Use Effect primitives over native patterns where the repo expects them: `Array`, `Match`, `Option`, `Schema`, `Effect.forEach`, `Layer`
- Avoid `try/catch`, `async/await`, `console.log`, ad-hoc validation, and plain `Error` classes in Effect code
- Carry branded IDs through boundaries; do not fall back to raw `string` / `number`
- Use named `Effect.fn("Service.method")` wrappers for named effectful functions
- Annotate spans with essential IDs and business context only
- Prefer `Schema.TaggedError` and `catchTag` with rich context over generic failures

For test work, check for these constraints up front:

- Use `@effect/vitest`, not plain `vitest`
- Prefer `it.layer(...)` and `it.scoped(...)`
- Replace Effect services with test layers, not `vi.mock`
- Test failures with `Effect.either` / tagged errors, not `try/catch`

For UI work, check for these constraints up front:

- Prefer Effect-Atom typesafe clients for first-party Effect backends
- Avoid `useEffect` + `fetch` state machines when an atom/query should own the data flow

### Step 4: Inspect Local Patterns Before Editing

Read adjacent modules before writing:

- existing tagged error names
- local branded type definitions
- layer composition style
- service/action boundaries
- trace naming conventions
- nearby test harness patterns

Prefer repo-local patterns over generic examples from the references.

### Step 5: Write the Code Against the Checklist

Implement directly against the pre-write checklist. Treat the references as authoring constraints, not post-hoc review criteria.

If a reference conflicts with established local conventions, follow the local convention and call out the mismatch briefly in the final response.

Do not start with a review-style `git diff` workflow when the task is code generation or refactoring. Start from the requested change and the target files.

### Step 6: Validate Immediately After Editing

Run the narrowest useful validation for the touched area:

- targeted tests
- relevant typecheck
- lint if the changed surface is lint-sensitive
- any repo-specific command that proves the new behavior

If validation fails, fix the code before moving on.

### Step 7: Switch to Review Mode Only When Needed

Use review-style findings only when:

- the user explicitly asks for a review, audit, or score
- the task is read-only
- a final spot-check is needed after implementation

In review mode, use the same references, but report findings instead of treating them as a pre-write checklist.

Do not default to spawning review subagents during authoring. That adds latency and pushes correctness to the end of the workflow.

## Reference Files

Load on demand:

- `references/effect-primitives.md` — Effect Array, Match, Option, Schema, `Effect.forEach`, Layer
- `references/branded-types.md` — branded IDs and boundary consistency
- `references/otel-patterns.md` — `Effect.fn`, span annotations, structured logging
- `references/error-patterns.md` — `Schema.TaggedError`, `catchTag`, error context
- `references/test-patterns.md` — `@effect/vitest`, `it.layer`, failure-path testing
- `references/effect-atom-patterns.md` — Effect-Atom queries, mutations, client patterns
