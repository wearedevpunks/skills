# hi-cli Commands

The command is `hi`; `hint` is an alias. The npm package remains `@punks/cli`.

## `hi init`

Use before repo-aware setup. It seeds docs onboarding, requirements/backlog/spec skills, and the initial wiki structure.

Activate `$docs-onboarding` after the command. Reconcile a generated wiki root with the real repository layout before writing durable specs or routed docs.

## `hi scaffold`

Use for repo-aware AI setup. It detects the repository, resolves packs, and writes managed `.agents/`, `.devpunks/`, skill, prompt, lint, subagent, tool, and scaffold-manifest assets.

The command does not finish repo-specific authoring. Reconcile its generated instructions with the real repository. Use `hi scaffold --yes` only when a non-interactive harness must accept the resolved default pack selection; it does not select optional packs or resolve policy choices.

## `hi check`

Use as the preferred read-only drift command. It checks managed scaffold, baseline, and CLI drift without writing files.

Report the current findings. A clean result needs no update follow-through.

## `hi ensure`

Use to reconfigure repository manager, backlog provider, asset provider, and backlog project URL settings in an existing Harness setup.

It does not install, repair, validate, or refresh external tools. Use `hi tools ensure` for tools.

## `hi update`

Use to refresh scaffold-managed files recorded in `.devpunks/scaffold-manifest.json`.

- `--write` applies accepted managed-file updates.
- `--yes` applies them non-interactively.
- `--check` remains a supported compatibility preview, but prefer `hi check` for read-only drift inspection.

After a write, follow only the changed categories in [post-command-flow.md](post-command-flow.md).

## `hi tools ensure`

Use to refresh external Harness tool requirements.

This command may mutate global or external tool installations. It refreshes every auto-managed required tool through the verified baseline's trusted latest target, even when the installed version already satisfies setup minimums. Manual platform CLIs such as `gh`, `az`, and `glab` are validation-only; the command does not upgrade them.

Report each failed tool with the exact failed command or recovery guidance from the result. Do not convert a tool failure into scaffold or settings work.

## `hi report`

Use to submit reusable Harness friction for GitHub-backed maintainer triage. Reports are for shared Harness, docs, tooling, skill, or workflow issues, not ordinary project backlog.

Include `--type`, `--severity`, `--area`, `--skill-pack`, `--command`, `--expected`, `--actual`, `--steps`, and `--labels` when applicable. Success requires a returned GitHub issue URL.

## `hi upgrade`

Use to update the installed CLI executable through its detected global package manager. Use `--tag next` for prerelease channels, `--force` to reinstall the selected tag, and `--json` for structured output.

The command bypasses package-manager minimum-release-age gates for the selected CLI release. Startup update checks remain advisory and do not replace `hi upgrade`.

## `hi operator status`

Report global and project `hi-cli` installations plus legacy `dp-cli` installations without changing them.

Each CLI release installs and verifies the canonical shared-skills revision pinned by that release. Report and use the exact revision returned by the command. To receive a newer operator-skill target, first install a CLI release that pins it; CLI 5.0.0 and 4.x users should run `hi upgrade` before using these commands.

## `hi operator install`

Install the global copy when absent and verify its files against the revision resolved for this command.

## `hi operator update`

Update every detected global or project `hi-cli` copy and verify its files against the revision resolved for this command.

## `hi operator migrate`

Verify replacement `hi-cli` copies before removing detected legacy `dp-cli` copies.

Operator writes require Skills CLI 1.5.20 or newer. After successful install, update, or migration, reload or reactivate `$hi-cli` before relying on its instructions.

`hi skills rename` is a deprecated compatibility alias for `hi operator migrate`.
