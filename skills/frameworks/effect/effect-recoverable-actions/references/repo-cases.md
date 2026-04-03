# Flow Cases

Use these representative flow shapes as grounding examples.

## `changeRole`

Current shape:

- preflight membership lookup and role checks
- external Better Auth role mutation
- local audit insert
- optional local owner-alert insert

Current risk:

- if the local DB write fails after the Better Auth mutation, the external state already changed

Target guidance:

- do not pretend DB rollback covers Better Auth
- force an explicit compensation or durable repair story
- keep expected recoverable failures typed

## `setMemberLifecycle`

Current shape:

- preflight member lookup and guard checks
- member active-state update
- session revocation

Current risk:

- if later DB work fails, the lifecycle transition can partially apply

Target guidance:

- make the transaction / step-boundary story explicit
- default to one transaction boundary for DB-only multi-write groups

## `resolveRequest`

Current shape:

- resolve session
- resolve active member
- maybe activate an organization
- maybe bootstrap an organization
- follow-up identity resolution

Current risk:

- bootstrap-related work can succeed and later resolution can still fail or return incomplete state

Target guidance:

- make recoverable bootstrap sequencing explicit
- separate preflight, external mutation, and follow-up resolution steps
- preserve clear failure semantics rather than silently collapsing distinct states

## Why these cases matter

These examples cover the main flow shapes the skill must steer:

- DB-only transactional groups
- DB plus Better Auth / external mutation
- staged bootstrap logic with follow-up reads and validation

## Canonical DB-only shape

Use this as the default shape for a recoverable DB-only multi-step action in a backend workspace/app:

```ts
import { SqlClient } from "@effect/sql"
import * as Effect from "effect/Effect"

export const performAction = Effect.fn("Feature.performAction")(function* (input: Input) {
  const sql = yield* SqlClient.SqlClient
  const repoA = yield* RepoA
  const repoB = yield* RepoB

  // 1. Preflight before the durable mutation group starts.
  const state = yield* repoA.loadPreflight(input.id)
  if (!state) {
    return yield* new EntityNotFoundError({ id: input.id, message: "Entity not found." })
  }

  // 2. Keep the commit path sequential and inside one transaction boundary.
  return yield* sql.withTransaction(
    Effect.gen(function* () {
      yield* repoA.writeStepOne(...)
      yield* repoB.writeStepTwo(...)
      return yield* repoA.loadResult(...)
    }),
  )
})
```

For a cross-system action:

- keep preflight checks before the first durable mutation
- isolate the DB-only group in its own transaction
- do not pretend the transaction rolls back Better Auth or another external write
- add explicit compensation or durable repair handling around the external step

Default test shape:

- unit test with fake repos/services to inject failure at each step
- integration test proving the DB transaction actually rolls back on later failure
- explicit assertion for the compensation or repair path when external work is involved

## Canonical cross-system shape

Use this as the default shape for an action that touches DB, Better Auth, and email:

```ts
import { SqlClient } from "@effect/sql"
import * as Effect from "effect/Effect"

export const performCrossSystemAction = Effect.fn("Feature.performCrossSystemAction")(
  function* (input: Input) {
    const sql = yield* SqlClient.SqlClient
    const repo = yield* Repo
    const authClient = yield* AuthClient
    const emailClient = yield* EmailClient

    // 1. Preflight before any durable mutation starts.
    const state = yield* repo.loadPreflight(input.id)
    if (!state) {
      return yield* new EntityNotFoundError({ id: input.id, message: "Entity not found." })
    }

    // 2. Keep local durable writes atomic.
    const committed = yield* sql.withTransaction(
      Effect.gen(function* () {
        yield* repo.insertAuditRow(...)
        yield* repo.insertRepairMarker(...)
        return yield* repo.loadCommittedState(...)
      }),
    )

    // 3. External writes are outside DB rollback. Handle them explicitly.
    yield* authClient.updateMemberRole(...).pipe(
      Effect.catchTag("BetterAuthOperationError", (error) =>
        Effect.fail(
          new CrossSystemRepairRequiredError({
            message: "Local state committed but Better Auth sync failed.",
            cause: error.message,
          }),
        ),
      ),
    )

    // 4. Email delivery needs its own explicit policy.
    yield* emailClient.send(...).pipe(
      Effect.catchTag("EmailSendError", () => repo.markEmailRepairRequired(committed.id)),
    )

    return committed
  },
)
```

What this example is teaching:

- one DB transaction for local atomic writes
- no claim that DB rollback undoes Better Auth or email
- explicit typed failure or repair state for Better Auth sync failure
- explicit delivery policy for email instead of pretending it is transactional
