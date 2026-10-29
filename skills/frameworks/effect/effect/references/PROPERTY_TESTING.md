# Property Testing

Use this when writing an Effect property or stateful property. Patterns, slice order, Generator rules, Pinned Replay and run policy live in [`tdd` properties](../../tdd/properties.md); this file maps them to the Effect API.

## Version

This reference targets the API of the npm `latest` `effect` and `@effect/vitest` release (4.1.0). `effect/Arbitrary` is `@stability unstable`. On any other installed version, verify each name below through `opensrc path effect` before you write a property.

## Generators From Schemas

`Arbitrary.schema(schema)` derives a Generator from a Schema, checks included. `it.prop` and `it.effect.prop` take a record of Schemas or Arbitraries:

- `it.prop`: synchronous body; returning `false` or throwing falsifies.
- `it.effect.prop`: Effect body; `false`, a typed failure or a defect (a failed `expect`) falsifies. Each evaluation gets its own Scope and test services.

```ts
it.prop("an amount survives JSON storage", { amount: Schema.Finite }, ({ amount }) =>
  JSON.parse(JSON.stringify(amount)) === amount,
)
```

Use `Schema.Finite` for numbers stored as JSON. `Schema.Number` also generates `NaN` and `Infinity`, which JSON writes as `null`. `Schema.Finite` still generates `-0`, which comes back as `0`: `===` accepts it; `Object.is` and `toEqual` reject it.

## DB-Backed Properties

Reduce the run count per test with `{ arbitrary: { runs: 25 } }`:

```ts
it.effect.prop(
  "saving a draft twice stores one row",
  { draft: Arbitrary.schema(Draft) },
  ({ draft }) =>
    Effect.gen(function* () {
      const drafts = yield* DraftRepo
      yield* drafts.save(draft)
      yield* drafts.save(draft)
      expect(yield* drafts.countById(draft.id)).toBe(1)
    }),
  { arbitrary: { runs: 25 } },
)
```

## Local Deep Runs

`Arbitrary.configureGlobal` sets defaults for every later check. Call it in the vitest setup file, gated so CI keeps the default count:

```ts
// vitest.setup.ts, listed in test.setupFiles
import { Arbitrary } from "effect"

const runs = Number(process.env.PROPERTY_RUNS)
if (runs > 0) Arbitrary.configureGlobal({ check: { runs } })
```

`check` takes the `CheckOptions` fields `runs`, `concurrency`, `size`, `maxDiscards`, `maxShrinks` and `seed`; `sample` sets `Arbitrary.sampleEffect` defaults. A per-test `arbitrary` option wins over the global value, so DB-backed properties keep their reduced count in a deep run.

## Stateful Properties

Generate a Schema array of tagged commands. Acquire a fresh fixture inside each evaluation, and compare it with an in-memory model after every command:

```ts
const Command = Schema.Union([
  Schema.TaggedStruct("Deposit", { amount: Schema.Int }),
  Schema.TaggedStruct("Withdraw", { amount: Schema.Int }),
])

it.effect.prop("balance matches the model after every command", { commands: Schema.Array(Command) }, ({ commands }) =>
  Effect.gen(function* () {
    const account = yield* makeAccount // released when this evaluation ends
    let model = 0
    for (const command of commands) {
      model += command._tag === "Deposit" ? command.amount : -command.amount
      yield* account.apply(command)
      expect(yield* account.balance).toBe(model)
    }
  }),
)
```

The runner does not rebuild layers between evaluations: services from `it.layer` are shared, so per-evaluation state belongs in the fixture.

## Generated Values

Treat generated values as read-only. The runner does not clone them, so a mutation corrupts the reported shrunk input and the replay.

## Failures

A falsified property prints `Shrunk input` and `Replay`. The `Replay` value is the Replay Token: record it in evidence only. `CheckOptions.replay` reproduces the failure only against the same implementation, so the shrunk input becomes a [Pinned Replay](../../tdd/properties.md#pinned-replay).
