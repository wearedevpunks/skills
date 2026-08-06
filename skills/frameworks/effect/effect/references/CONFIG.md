# Config

Use this when reading runtime configuration, env vars, `.env` files, provider-specific settings, or writing `layerConfig(...)` helpers.

Read runtime configuration through Effect `Config` recipes and provider layers, not direct `process.env` access inside application logic.

```ts
export const dataDirectoryConfig = Config.schema(
  AbsolutePath,
  "APP_DATA_DIR",
)

export const appConfig = Config.all({
  apiKey: Config.redacted("API_KEY"),
  optionalModel: Config.option(Config.string("MODEL")),
  enabled: Config.boolean("FEATURE_ENABLED").pipe(
    Config.withDefault(false),
  ),
})
```

## Config Recipes

- `Config<T>` is yieldable and reads the current `ConfigProvider` reference.
- The default provider is `ConfigProvider.fromEnv()`.
- Use `Config.redacted(...)` for credentials.
- Use `Config.schema(...)` or `Config.mapOrFail(...)` for refined values.
- Use `Config.option(...)` for semantic absence.
- Use `Config.withDefault(...)` for missing-data defaults only; malformed values still fail.
- Use `Config.orElse(...)` only when intentionally catching any config parse failure.
- Use `Config.unwrap(...)` / `Config.Wrap<T>` for `layerConfig(...)` helpers.

## Providers

- Use `ConfigProvider.layer(provider)` to replace the active provider for an app or suite.
- Use `ConfigProvider.layerAdd(provider)` for fallbacks; pass `{ asPrimary: true }` when the added provider must override the current provider.
- Use `ConfigProvider.fromUnknown(...)` for deterministic test config.
- Use `ConfigProvider.fromEnv(...)` for environment variables.
- Use `ConfigProvider.constantCase` when camelCase schema keys should read `SCREAMING_SNAKE_CASE` env vars.
- Use `ConfigProvider.nested(...)` to scope a provider under a prefix.
- Treat `.env`, directory, and environment providers as startup/boundary sources, not business-workflow reads.

## Layer Config Helpers

Library-style layers often expose both concrete `layer(options)` and config-backed `layerConfig(options: Config.Wrap<Options>)`.

```ts
export const layerConfig = (
  config: Config.Wrap<ClientOptions>,
) =>
  Layer.unwrap(
    Config.unwrap(config).pipe(
      Effect.map(layer),
    ),
  )
```

Use this pattern when a Layer naturally supports runtime config while still allowing callers to pass concrete values.
