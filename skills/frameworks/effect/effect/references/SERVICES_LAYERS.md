# Module Surfaces, Scoped Work, And Operation Helpers

Use this for the local module namespace convention, scoped long-lived work, whole-function `Effect.fn` transforms, and operation error helpers. Use `$effect-service-design` for service qualification, service module construction, Layer composition, requirement propagation, test Layers, and audits.

## Module Surface

One opinionated application-module style uses file-local role names and one canonical ES module namespace projection. Follow the existing codebase's module style when it has one; this convention is not required by Effect. Consumers use the module namespace.

```ts
import { UserRepo } from "./user-repo.js"

const program = Effect.gen(function* () {
  const repo = yield* UserRepo.Service
  return yield* repo.get(id)
})
```

The self-export is deliberate. It lets the file remain the module while giving every consumer the same domain-first name, without a TypeScript `namespace`, wrapper object, or repeated consumer-side aliases.

```ts
// Sibling module: import the owning leaf directly.
import { UserRepo } from "./user-repo.js"

// Folder or package barrel: relay the identity established by the leaf.
export { UserRepo } from "./user-repo.js"
```

Guidance:

- Do not name the tag class `UserRepo` inside `user-repo.ts`; the module namespace is the domain name.
- In this module style, single-file modules self-export their canonical namespace at the bottom: `export * as UserRepo from "./user-repo.js"`.
- Sibling modules import that namespace from the owning leaf; they do not import through their own aggregate barrel.
- Folder and package barrels relay established leaf identities with `export { UserRepo } from "./user-repo.js"`.
- The resulting `UserRepo.UserRepo === UserRepo` self-reference is unusual. Use this pattern only where the runtime and toolchain support it; otherwise use named exports or a separate barrel.
- Export only intentional surface; keep local schemas, row codecs, helpers, and implementation details unexported.
- Do not introduce TypeScript `namespace` declarations for organization.

## Long-Lived Work

A layer that starts a stream, listener, worker, subscription, or forever loop must fork that work into the layer scope. Layer acquisition must complete.

```ts
export const layer = Layer.effectDiscard(
  Effect.gen(function* () {
    const events = yield* Events.Service

    yield* events.stream.pipe(
      Stream.runForEach(handleEvent),
      Effect.forkScoped,
    )
  }),
)
```

Guidance:

- Use `Effect.forkScoped`, `FiberSet`, or `FiberMap` for scoped background work.
- Do not run forever work inline during layer acquisition.
- Do not expose public `start` methods unless the domain explicitly needs manual lifecycle control.

## Effect.fn

Use extra `Effect.fn(...)` arguments for wrappers that apply to the whole function call. Each transform receives `(effect, ...originalArgs)`.

```ts
const readAttachment = Effect.fn("Attachment.read")(
  function* (ref: AttachmentRef) {
    return yield* api.read(ref)
  },
  (effect, ref) =>
    effect.pipe(
      attachmentError("Attachment.read", { attachmentId: ref.id }),
    ),
)
```

Good whole-function transforms:

- error classification
- localized recovery
- logging annotations
- spans
- retry
- timeout
- ensuring cleanup
- small local provisioning
- result mapping

Guidance:

- Keep the generator body focused on the core workflow.
- Use transforms when the wrapper needs original arguments.
- Do not build long clever pipelines; one or two transforms is usually enough.
- Do not use this for local branch-level handling inside the workflow.

## Operation Error Helpers

For boundary errors with operation labels, prefer a shared curried `mapError` helper over hand-writing wrappers in every module.

```ts
const persistenceError = operationError(PersistenceError.make)

const row = yield* query.pipe(
  persistenceError("UserRepository.findById"),
)
```

Name the local helper after the error it produces, such as `persistenceError`, `projectionError`, or `processingError`. Use `Effect.fn(...)` and spans for observability in addition to payload labels, not instead of them.
