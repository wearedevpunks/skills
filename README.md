# Devpunks Skills

Public Devpunks skill library.

This repo is the public Devpunks skills database and the baseline skill source used by the Devpunks `dp` CLI.

The CLI vendors this repository as reusable skill content. Keep shareable skill behavior here first, then let the CLI consume it through its normal skills sync/update flow.

## CLI Entrypoint

The only Devpunks skill users should manually install with the Skills CLI is `dp-cli`:

```bash
npx skills add https://github.com/weareDevpunks/skills --skill dp-cli
```

`dp-cli` is the entrypoint for `dp` usage, setup-stage guidance, `dp update`, and the post-command `.Devpunks/` artifact flow. Other Devpunks skills are intended to be scaffolded or vendored by the `dp` CLI rather than manually installed one by one.

## Structure

- `skills/agnostic/*` holds cross-stack packs like planning, research, frontend, docs, quality, and subagents
- `skills/frameworks/*` holds stack-specific packs like Better Auth, Effect, Elysia, Next.js, tRPC, and Turborepo
- each skill still owns its own `SKILL.md` plus any local references, templates, scripts, or helper assets
- some pack semantics overlap; physical grouping follows the main domain owner, so shared packs can reuse the same skill family

## Consumers

- CLI and tooling integrations that want Devpunks skills as reusable content
- future consumers that vendor or read this library directly
