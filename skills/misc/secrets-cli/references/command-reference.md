# Command Reference

Use `secrets <group> <leaf> --help` as the live authority when an installed version differs from this reference.

## Install and Global Utilities

Node.js 22.14 or newer is required for the npm package.

```bash
npm install --global @punks/secrets@next
npx @punks/secrets@next --help
secrets --version
secrets --help
secrets --completions bash|zsh|fish|sh
secrets --log-level all|trace|debug|info|warn|warning|error|fatal|none <command>
```

The npm `latest` tag still points to `0.1.0-beta.0`, so use `@punks/secrets@next` for the current/default install. An untagged `@punks/secrets` install becomes appropriate after stable 1.0 is published. A release executable from GitHub is standalone; verify it against the release `SHA256SUMS` before use.

Global flags are `--help` (`-h`), `--version` (`-v`), `--completions`, and `--log-level`. Put a log-level flag before the command when debugging, for example `secrets --log-level debug files list production`.

## Authentication

```text
secrets login
secrets whoami
secrets logout
```

`login` opens device authorization in a browser. `whoami` prints email and role. `logout` clears local CLI authentication.

## Projects

```text
secrets projects list
secrets projects create NAME [--slug SLUG]
secrets projects update [PROJECT] [--project PROJECT] [--name NAME] [--slug SLUG]
secrets projects delete [PROJECT] [--project PROJECT]
```

For `update` and `delete`, use either positional `PROJECT` or `--project`, never both. `update` requires at least one of `--name` or `--slug`. Create derives a kebab-case slug from `NAME` when `--slug` is absent.

Project create, update, delete, and membership administration require an admin identity. Project members can operate environments, files, and values within their memberships.

## Project Membership

```text
secrets projects users list [PROJECT] [--project PROJECT]
secrets projects users add EMAIL [--project PROJECT]
secrets projects users remove USER_ID_OR_EMAIL [--project PROJECT]
```

For `users list`, use either positional `PROJECT` or `--project`, never both. Add has no public role flag; membership is binary. The target email must have signed in once before it can be added. Remove accepts a user ID or exact email address.

## Environments

```text
secrets envs list [PROJECT] [--project PROJECT]
secrets envs create NAME [--slug SLUG] [--project PROJECT]
secrets envs update ENVIRONMENT [--name NAME] [--slug SLUG] [--project PROJECT]
secrets envs delete ENVIRONMENT [--project PROJECT]
secrets envs pull ENVIRONMENT [--project PROJECT]
```

For `envs list`, use either positional `PROJECT` or `--project`, never both. `update` requires at least one of `--name` or `--slug`. Create derives a kebab-case slug from `NAME` when `--slug` is absent.

## Files

```text
secrets files list ENVIRONMENT [--project PROJECT]
secrets files create PATH --env ENVIRONMENT [--name NAME] [--project PROJECT]
secrets files update FILE [--env ENVIRONMENT] [--name NAME] [--path PATH] [--project PROJECT]
secrets files delete FILE [--env ENVIRONMENT] [--project PROJECT]
secrets files pull FILE [--env ENVIRONMENT] [--project PROJECT]
```

Files are dotenv format. Create requires `--env`; its display name defaults to the basename of `PATH`. Update requires at least one of `--name` or `--path`.

## Values

`values` is preferred:

```text
secrets values list FILE [--env ENVIRONMENT] [--project PROJECT]
secrets values get FILE KEY [--env ENVIRONMENT] [--project PROJECT]
secrets values put FILE KEY [VALUE] [--stdin] [--env ENVIRONMENT] [--project PROJECT]
secrets values set FILE KEY [VALUE] [--stdin] [--env ENVIRONMENT] [--project PROJECT]
secrets values update FILE KEY [VALUE] [--stdin] [--env ENVIRONMENT] [--project PROJECT]
secrets values delete FILE KEY [--env ENVIRONMENT] [--project PROJECT]
secrets values bulk-read FILE KEY... [--env ENVIRONMENT] [--project PROJECT]
secrets values bulk-upsert FILE [KEY=value...] [--stdin] [--env ENVIRONMENT] [--project PROJECT]
secrets values bulk-delete FILE KEY... [--env ENVIRONMENT] [--project PROJECT]
```

`put` and `set` perform the same set operation. `update` targets an existing value. Each single-value mutation requires exactly one source: positional `VALUE` or `--stdin`. Bulk upsert requires exactly one source: one or more `KEY=value` arguments or newline-delimited stdin. Values may contain `=` because only the first `=` separates key from value.

`bulk-read` returns only the keys found, not their values. `get` intentionally prints one raw value; redirect or capture it safely and never echo it into agent output.

## Compatibility Tree

Every `values` leaf and option above is also available under `secrets secrets`:

```text
secrets secrets list|get|put|set|update|delete|bulk-read|bulk-upsert|bulk-delete ...
```

Do not use the compatibility tree for new examples or automation.
