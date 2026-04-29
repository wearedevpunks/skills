# Effect Flow Examples

Use these generic flow shapes as grounding examples.

## Role Change

Shape:

- preflight membership lookup and role checks
- external auth-provider role mutation
- local audit insert
- optional local notification insert

Risk:

- if the local DB write fails after the auth-provider mutation, the external state already changed

Guidance:

- do not pretend DB rollback covers the auth provider
- force an explicit compensation or durable repair story
- keep expected recoverable failures typed

## Member Lifecycle Update

Shape:

- preflight member lookup and guard checks
- member active-state update
- session revocation

Risk:

- if later durable work fails, the lifecycle transition can partially apply

Guidance:

- make the transaction and step-boundary story explicit
- default to one transaction boundary for DB-only multi-write groups

## Bootstrap and Resolve

Shape:

- resolve session
- resolve active member
- maybe activate an organization
- maybe bootstrap an organization
- follow-up identity resolution

Risk:

- bootstrap-related work can succeed and later resolution can still fail or return incomplete state

Guidance:

- make recoverable bootstrap sequencing explicit
- separate preflight, external mutation, and follow-up resolution steps
- preserve clear failure semantics rather than silently collapsing distinct states

## Canonical DB-Only Shape

Use this as the default shape for a recoverable DB-only multi-step Effect action:

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

Default test shape:

- unit test with fake repos/services to inject failure at each step
- integration test proving the DB transaction actually rolls back on later failure
- explicit assertion for the compensation or repair path when external work is involved

## Canonical Cross-System Shape

Use this as the default shape for an Effect action that touches DB, an auth provider, and email:

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
      Effect.catchTag("AuthProviderOperationError", (error) =>
        Effect.fail(
          new CrossSystemRepairRequiredError({
            message: "Local state committed but auth-provider sync failed.",
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
- no claim that DB rollback undoes auth-provider or email work
- explicit typed failure or repair state for auth-provider sync failure
- explicit delivery policy for email instead of pretending it is transactional
