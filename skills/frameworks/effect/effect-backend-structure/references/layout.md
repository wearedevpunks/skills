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

- `platform/effect/app.ts` or local equivalent is the app-wide composition root
- `platform/effect/request.ts` or local equivalent owns request-scoped runtime context
- `features/<domain>/layer.ts` is the domain composition root
- `features/<domain>/tests/support/` owns feature-local reusable test support

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
