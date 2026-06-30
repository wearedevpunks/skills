---
name: dp-cli
description: Operates the Devpunks `dp` CLI and interactively follows scaffold, update, report, upgrade, and post-command handoff artifacts through to completion. Use when a repo contains `.devpunks/` output, when the user mentions `dp scaffold`, `dp update`, `dp report`, `dp upgrade`, Devpunks CLI setup, or asks what to do after running a `dp` command.
metadata: {"Devpunks":{"entrypoint":true}}
---

# DP CLI

The `dp` CLI scaffolds Devpunks agent assets and writes follow-up instructions for the next agent.

## Quick Start

```bash
dp scaffold setup
dp scaffold setup --yes
dp scaffold init
dp update --check
dp update --write
dp update --yes
dp report --help
dp upgrade --help
```

After any command, read the command output and generated artifacts before acting.

## Core Rule

`.devpunks/` is an active work queue.

Do not summarize the generated files and stop. Read the handoff, execute the specs, reconcile generated assets, and report only remaining unresolved items.

## Interactive Rule

Prompt the user frequently when post-scaffold choices affect project policy or shape.

Ask before:

- choosing which generated prompt scopes to collapse, split, or prioritize
- replacing existing lint or format tooling with Oxlint/Oxfmt
- deciding which core libraries to clone and inspect with `opensrc`
- changing package scripts, task pipelines, CI, hooks, or docs
- resolving conflicts between existing repo guidance and scaffold specs

Do not ask for trivial file reads, validation commands, or direct execution of already-approved scaffold instructions.

## Command Workflows

See [references/commands.md](references/commands.md) for command intent and when to use each command.

See [references/post-command-flow.md](references/post-command-flow.md) for the required agent flow after `dp scaffold` or `dp update`.

The former backlog scaffold subcommand is not part of current guidance. `dp scaffold init` provides the requirements/backlog skills and initial wiki structure; `dp scaffold setup` provides repo-aware managed scaffold output.

## Scaffold Init

After `dp scaffold init`, expect `.agents/skills/requirements-grill`, `.agents/skills/write-backlog`, and an initial wiki root.

Run the requirements grill before backlog authoring. If the generated wiki root does not match the real repository layout, move or refactor it before creating durable specs, plans, or routed docs. Monorepos usually use `apps/wiki`; single-repo layouts usually use `wiki`.

Pre-existing skills are reconciled by the follow-up agent, not by the command. Inspect `.agents/skills`, `.claude/skills`, `.codex/skills`, `.cursor/skills`, and `.opencode/skills`. If `.devpunks/pre-existing-skills` exists, inspect it as blind pre-command evidence. Exact canonical directory id/name overlap keeps the HI baseline skill active: archive local evidence under `.devpunks/replaced-skills/<skill-id>/...`, then remove active local copies or mirrors. Preserve non-overlapping local skills and expose them through harness mirrors or symlinks. Use `dp report` when archived local knowledge should be proposed for HI baseline integration; semantic overlap belongs there, not command runtime.

## Scaffold Setup

After `dp scaffold setup`, expect artifacts such as:

- `.devpunks/AGENT-SYSTEM-PROMPT.md`
- `.devpunks/AGENT-HANDOFF.md`
- `.devpunks/scaffold-manifest.json`
- `.devpunks/required-tools.json`
- `.devpunks/specs/prompts/**/*.md`
- `.devpunks/specs/lint/*`
- `.devpunks/specs/subagents/manifest-spec.json`

Read `.devpunks/AGENT-SYSTEM-PROMPT.md` first when present.

Then author or reconcile the final repo files requested by the specs, including prompt files, harness mirrors, lint configuration, and subagent manifests.

Reconcile generated wiki guidance with the real repository layout. Do not assume a newly seeded wiki root is canonical until it matches the project boundary.

Reconcile pre-existing repo skills from the same homes as `dp scaffold init`: `.agents/skills`, `.claude/skills`, `.codex/skills`, `.cursor/skills`, and `.opencode/skills`. Commands do not detect overlap. If `.devpunks/pre-existing-skills` exists, inspect it as blind pre-command evidence. Exact name/id overlap keeps the HI baseline skill active; archive local evidence under `.devpunks/replaced-skills/<skill-id>/...` and remove active local copies or mirrors. Non-overlapping local skills remain repo-owned guidance and should stay exposed through harness mirrors or symlinks. Suggest `dp report` for archived local knowledge that should influence the shared baseline.

Use `dp scaffold setup --yes` only when the harness cannot answer interactive prompts. It accepts the resolved default pack selection; it does not add optional packs or resolve repo-policy decisions.

Before authoring prompts or plans, identify the detected core libraries whose source behavior matters. Ask the user which ones to prioritize if the choice is not obvious, then run `opensrc path <package>` or `opensrc path owner/repo` only for that focused set.

When lint specs suggest Oxlint or hooks suggest Oxfmt, treat migration as a repo-policy change. Ask before replacing existing ESLint/Prettier/Biome scripts or CI, then update package scripts, task pipelines, editor/docs references, and hooks together.

## Update

After `dp update` or `dp update --check`, inspect `.devpunks/scaffold-manifest.json` and the update summary.

- `--check` reports managed-file drift without writing.
- `--write` refreshes scaffold-managed assets.
- `--yes` refreshes scaffold-managed assets without prompting and is the non-interactive apply flag.
- drift output can include changelog summaries; use them to explain why update/upgrade matters.
- pack drift is a setup decision point, not a silent auto-fix.

Apply the same pre-existing skill policy after update: the command does not detect overlap, the agent checks `.agents/skills`, `.claude/skills`, `.codex/skills`, `.cursor/skills`, `.opencode/skills`, and `.devpunks/pre-existing-skills` when present, exact name/id overlap keeps HI baseline active, non-overlaps remain mirrored, and `dp report` carries semantic overlap or baseline integration proposals.

## Report

Use `dp report` when reusable Harness friction should enter maintainer triage: stale generated guidance, confusing CLI output, missing docs, broken setup, or shared tooling issues.

Do not use reports as the default destination for project product backlog. `dp report` submits to the Harness API, which must create or dedupe a GitHub issue in `wearedevpunks/harness-intelligence`; pass `--type`, `--severity`, `--area`, `--skill-pack`, `--command`, `--expected`, `--actual`, `--steps`, and `--labels` so maintainers can triage the issue from GitHub/backoffice without replaying the whole session.

Reports are GitHub-backed. Backoffice fetches `harness-report` issues from GitHub and treats GitHub state/labels as the triage source of truth. API persistence is audit/local-smoke context, not a substitute for a returned GitHub URL.

`dp report` emits product telemetry only after the API returns a GitHub issue URL. If issue creation fails or the API stores the report internally without a URL, do not claim the report was submitted; capture the blocker and suggest the exact GitHub/API config missing.

## Upgrade

Use `dp upgrade` to update the CLI executable itself. It checks the selected npm dist-tag, detects whether the current global install came from Bun, pnpm, npm, or Yarn, and runs the matching global reinstall command.

Use `--tag next` for prerelease channels and `--force` to reinstall the selected tag even when no newer version is detected.

Upgrade deliberately bypasses package-manager release-age gates for the CLI package so just-published releases can install immediately:

- Bun: `bun add -g @punks/cli@<tag> --minimum-release-age=0`
- npm: `npm install -g @punks/cli@<tag> --min-release-age=0`
- pnpm: `npm_config_minimum_release_age=0 pnpm add -g @punks/cli@<tag>`
- Yarn: `YARN_NPM_MINIMAL_AGE_GATE=0 yarn global add @punks/cli@<tag>`

Startup update checks are advisory and detached. They should not mutate installs during normal command startup; `dp upgrade` is the explicit update path.

## Completion Checklist

- `.devpunks/AGENT-SYSTEM-PROMPT.md` was followed or consciously superseded.
- `.devpunks/specs/**` items were implemented or listed as unresolved.
- required tools were checked when `.devpunks/required-tools.json` exists.
- final prompt files and harness mirrors match the handoff contract.
- subagent manifests were reconciled when specs exist.
- user decisions were requested for policy-level choices instead of guessed silently.
