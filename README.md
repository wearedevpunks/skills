# Devpunks Skills

Public Devpunks skill library.

This repo is the public Devpunks skills database and the baseline skill source used by the Harness Intelligence CLI.

The CLI vendors this repository as reusable skill content. Keep shareable skill behavior here first, then let the CLI consume it through its normal skills sync/update flow.

## CLI Entrypoint

The only Harness Intelligence CLI skill users should manually install with the Skills CLI is `hi-cli`:

```bash
skills add https://github.com/wearedevpunks/skills/tree/main/skills/agnostic/cli/hi-cli --skill hi-cli --global --yes
```

`hi-cli` is the entrypoint for `hi`/`hint` usage, setup-stage guidance, `hi update`, GitHub-backed `hi report`, explicit `hi upgrade`, and the post-command `.devpunks/` artifact flow. Other Devpunks skills are intended to be scaffolded or vendored by the CLI rather than manually installed one by one.

## Structure

- `skills/agnostic/*` holds cross-stack packs like planning, research, frontend, docs, quality, and subagents
- `skills/phases/*` holds lifecycle phase packs like requirements, delivery, debugging, review, docs ingest, and debt resolution
- `skills/frameworks/*` holds stack-specific packs like Better Auth, Effect, Elysia, Next.js, tRPC, and Turborepo
- `skills/misc/*` holds focused operational workflows that do not belong to a stack or lifecycle phase
- each skill still owns its own `SKILL.md` plus any local references, templates, scripts, or helper assets
- some pack semantics overlap; physical grouping follows the main domain owner, so shared packs can reuse the same skill family

## Consumers

- CLI and tooling integrations that want Devpunks skills as reusable content
- future consumers that vendor or read this library directly
