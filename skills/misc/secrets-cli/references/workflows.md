# Workflows

## Install or Check Version

```bash
node --version
npm install --global @punks/secrets@next
secrets --version
secrets --help
```

Use `npx @punks/secrets@next --help` for a one-off run. The npm `latest` tag still points to `0.1.0-beta.0`, so `@next` is the current/default install until stable 1.0 is published; after that publication, use untagged `@punks/secrets`. Do not assume the local CLI matches this manual; inspect leaf help when syntax is in doubt.

## Authenticate

```bash
secrets login
secrets whoami
```

Complete browser approval and check that the browser code matches the terminal code. `login` reports the existing identity instead of switching accounts when the stored session is still valid. To switch:

```bash
secrets logout
secrets login
secrets whoami
```

## Create a Project and Membership

```bash
secrets projects create "Payments API" --slug payments
secrets projects list
secrets projects users add teammate@example.com --project payments
secrets projects users list payments
```

Membership prerequisite: the target email must complete sign-in once before an admin can add it. If addition says no account exists, ask that person to run `secrets login`, then retry. There is no role option.

## Create an Environment and File

```bash
secrets envs create Production --project payments
secrets envs list payments
secrets files create .env.production --env production --project payments
secrets files list production --project payments
```

The file path is both the configured pull destination and, by default, the display-name source.

## Set and Inspect Values

Prefer stdin for all sensitive values:

```bash
printf '%s' "$API_TOKEN" | secrets values put .env.production API_TOKEN --stdin --env production --project payments
secrets values list .env.production --env production --project payments
```

Set several values without exposing them as arguments:

```bash
secrets values bulk-upsert .env.production --stdin --env production --project payments < values.env
secrets values list .env.production --env production --project payments
```

Use `get` only when the destination requires the raw value. Redirect it directly; do not let the agent quote or summarize it:

```bash
secrets values get FILE_ID API_TOKEN > /secure/destination
```

## Pull One File or an Environment

```bash
secrets files pull .env.production --env production --project payments
secrets envs pull production --project payments
```

Before approval, inspect every planned path and key name. Pull writes relative to the current directory, creates missing parent directories, renders dotenv content, and overwrites existing target files. Interactive pulls ask for approval; non-interactive pulls proceed automatically. Verify expected paths after completion without printing contents.

## Update Names, Slugs, or Paths

```bash
secrets projects update payments --name "Payments Platform"
secrets envs update production --slug prod --project payments
secrets files update .env.production --env prod --path .env --project payments
```

After changing a slug or path, use the new selector for later commands. List the parent scope to confirm the change.

## Destructive Cleanup

Destructive commands do not prompt. List and verify each target first. For complete cleanup, work leaf-to-root so no active child is hidden by a parent deletion:

```bash
secrets values list FILE --env ENVIRONMENT --project PROJECT
secrets values bulk-delete FILE KEY... --env ENVIRONMENT --project PROJECT
secrets files delete FILE --env ENVIRONMENT --project PROJECT
secrets envs delete ENVIRONMENT --project PROJECT
secrets projects users list PROJECT
secrets projects users remove USER_ID_OR_EMAIL --project PROJECT
secrets projects delete PROJECT
```

Remove the operating identity last if it must be removed at all. Project, environment, and file deletes are recoverable backend deletions, but the CLI has no restore command. Value deletion updates the stored file payload and removes the key from later pulls while backend version history remains the recovery boundary. Do not promise restoration from the CLI.
