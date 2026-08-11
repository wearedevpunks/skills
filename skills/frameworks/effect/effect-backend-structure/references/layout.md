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

Layer ownership:

- `platform/effect/app.ts` or local equivalent composes the app-wide live layer and provides infrastructure once
- `platform/effect/request.ts` or local equivalent builds request-scoped services and runtime context only
- `features/<domain>/layer.ts` composes that domain's action/repository/service requirements
- `features/<domain>/tests/support/layer.ts` provides fake leaf layers and test-state tags for unit tests

Keep dependency requirements visible until one of these layer files provides them. Do not import live implementations directly inside actions, services, repositories, or transport adapters.

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
  fake leaf layers plus state tags for assertions
- `tests/unit`
  action and guard behavior on fake layers
- `tests/integration`
  live router/app behavior on real layers

Do not recreate a package-root `tests/` folder unless the current repo already requires that convention.
