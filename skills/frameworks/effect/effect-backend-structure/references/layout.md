# Effect Backend Layout Addendum

Use `$backend-domain-structure` for the shared backend layout.

Inside the current Effect backend root, prefer:

```text
<backend-root>/src/
  platform/
    effect/
      app.ts
      request.ts
    <transport>/
      context.ts
      run.ts
      router.ts
  integrations/
    <provider>/
      client.ts
  features/
    <domain>/
      actions/
      models/
      repositories/
      services/
      errors.ts
      layer.ts
      router.ts
```

Dependency direction:

- `platform -> features -> integrations`
- features may depend on other features only when the domain relationship is explicit and stable
- integrations do not import features

Composition file placement:

- `platform/effect/app.ts` or local equivalent is the process production root
- `platform/effect/request.ts` or local equivalent owns request-scoped runtime context
- a leaf `features/<domain>/layer.ts` implements the capability owned by that domain
- the nearest common parent domain's `layer.ts` composes its public child Layers; those children are siblings to one another
- `features/<domain>/tests/support/` owns feature-local reusable test support

## Three Layer Levels

### Leaf/module capability implementation Layer

A leaf or module Layer implements only its owned public capability. Keep dependency-requiring variants available so callers can compose without inheriting an inner implementation choice. Cross-child coordination has the nearest common parent as its owner.

**Complete when:** the Layer outputs only the module's public capability and every unowned dependency remains in its requirement type.

### Nearest common parent business Layer

The nearest common parent business Layer composes its public child Layers. Those child features are siblings to one another. Actions or services owned by the parent hold ordering, authorization, state transitions, and other cross-child product policy. The parent imports public child surfaces and keeps child internals private.

**Complete when:** every cross-child product decision has one parent owner and the parent Layer exposes the composed parent-domain capability.

### Process production root

`platform/effect/app.ts`, or the repository's equivalent, closes the final Layer graph. It selects runtime and cross-module integration adapters, binds otherwise independent public contracts, and supplies the remaining requirements.

**Complete when:** the production graph has no unsatisfied runtime requirements, the root contains technical binding, and reusable product policy remains with its business owner.

## Effect v4 Layer Operators

- `Layer.merge` and `Layer.mergeAll` combine Layer outputs, errors, and requirements. Use them for capabilities that remain available side by side. Feeding outputs into requirements uses `provide` or `provideMerge`.
- `Layer.provide` feeds provider outputs into the target Layer's requirements and returns the target outputs. Provider outputs stay private to that binding.
- `Layer.provideMerge` feeds provider outputs into the target Layer's requirements and retains both target and provider outputs.
- Preserve dependency-requiring Layers until the module, nearest parent business, or process root that truthfully owns the choice supplies them.

Choose the operator from the intended public output. Side-by-side capabilities use `merge` or `mergeAll`; a private dependency uses `provide`; a dependency that remains public uses `provideMerge`.

**Complete when:** every operator's retained outputs match the boundary's public contract and every supplied dependency is chosen by its truthful owner.

## Composition terminology

Reserve composition terminology for Layers that assemble public capabilities. Name private `Context.Service` seams by capability under `services/` or in an owner-named module. Use `features/<domain>/layer.ts` for domain Layer ownership and `platform/effect/app.ts`, or the repository's equivalent, for the production root.

Do not import live implementations directly inside actions, services, repositories, or transport adapters.

Test layout:

```text
<backend-root>/src/features/<domain>/
  tests/
    support/
      layer.ts
    unit/
      *.test.ts
    integration/
      *.test.ts
```

Testing split:

- `tests/support`
  feature-local reusable test support
- `tests/unit`
  action and guard behavior
- `tests/integration`
  live router/app behavior

Do not recreate a package-root `tests/` folder unless the current repo already requires that convention.
