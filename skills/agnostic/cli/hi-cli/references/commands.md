# hi-cli Commands

The command is `hi`; `hint` is an alias. The npm package remains `@punks/cli`.

## `hi scaffold setup`

Use for repo-aware full scaffold setup.

It detects package manifests, resolves packs, writes `.agents/`, harness files, selected skills, prompt specs, lint specs, subagent specs, required tools metadata, and `.devpunks/scaffold-manifest.json`.

It does not finish all repo-specific authoring. The next agent must use `.devpunks/AGENT-SYSTEM-PROMPT.md` and `.devpunks/specs/**` to generate final scoped guidance and reconcile assets.

Use `hi scaffold setup --yes` in non-interactive harnesses. It accepts the resolved default pack selection and skips pack-selection prompts. It does not select optional packs.

## `hi scaffold init`

Use before boilerplate exists.

It scaffolds `requirements-grill`, `write-backlog`, and the initial wiki tree, then prints an operator prompt. Follow that prompt before moving to repo-aware setup.

If the generated wiki root does not match the repository layout, move or refactor it before writing specs, plans, or routed docs. Monorepos usually use `apps/wiki`; single-repo layouts usually use `wiki`.

After init, the agent must reconcile pre-existing skills. The command does not detect overlap. Inspect `.agents/skills`, `.claude/skills`, `.codex/skills`, `.cursor/skills`, `.opencode/skills`, and `.devpunks/pre-existing-skills` when present; exact name/id overlap keeps HI baseline active, non-overlaps stay exposed through mirrors or symlinks, and `hi report` carries semantic overlap or baseline integration proposals.

## `hi update --check`

Use at session start when `.devpunks/` exists or to preview managed scaffold drift from `.devpunks/scaffold-manifest.json`.

Report CLI, baseline, missing, changed, or pack-drift findings. Do not write files. If remediation is accepted, the parent may assign one bounded execution worker for `hi upgrade`, `hi update --write`, or `hi update --yes` under the core execution rule.

## `hi update --write`

Use to refresh scaffold-managed files recorded in `.devpunks/scaffold-manifest.json`.

After writing, follow only the matching update branches in [post-command-flow.md](post-command-flow.md).

## `hi update --yes`

Use in non-interactive harnesses to apply managed scaffold updates without answering the terminal confirmation prompt.

It has the same managed-file apply behavior and branch-sensitive follow-through as `--write`.

## `hi report`

Use to open reusable Harness friction in the Harness Intelligence GitHub repository. Include `--area`, `--skill-pack`, `--command`, `--expected`, `--actual`, and `--steps` whenever they apply so labels and issue body are useful for backoffice triage.

Reports are for shared Harness/docs/tooling/workflow issues, not the default path for project product backlog.

Useful classification flags:

- `--type bug|docs|workflow|tooling|other`
- `--severity low|medium|high`
- `--area cli|wiki|skill|docs|workflow|backoffice|other`
- `--skill-pack <name>`
- `--command <command>`
- `--expected <text>`
- `--actual <text>`
- `--steps <text>`
- `--labels <comma-separated-labels>`

The report path is GitHub-backed. The CLI submits typed context to the Harness API; the API creates or dedupes an issue with `harness-report` metadata and labels, then the CLI emits report-submitted telemetry only after the API returns a GitHub issue URL. Backoffice reads GitHub issues for report triage.

## `hi upgrade`

Use to update the installed CLI executable through its original global package-manager path.

The command checks the selected npm dist-tag, detects Bun, pnpm, npm, or Yarn from the current install path, and runs the corresponding global reinstall command. Use `--tag next` for prerelease channels, `--force` to reinstall the selected tag, and `--json` when automation needs structured output.

`hi upgrade` bypasses minimum-release-age gates for the CLI package:

- Bun uses `--minimum-release-age=0`.
- npm uses `--min-release-age=0`.
- pnpm uses `npm_config_minimum_release_age=0`.
- Yarn uses `YARN_NPM_MINIMAL_AGE_GATE=0`.

## `hi operator status`

Use to report global and project `hi-cli` installations plus legacy `dp-cli` installations without changing them.

## `hi operator install`

Use to install `hi-cli` when absent. Report both scopes and reload or reactivate `$hi-cli` after success.

## `hi operator update`

Use to update every detected global or project `hi-cli` installation. Verify each detected copy and reload or reactivate `$hi-cli` after success.

## `hi operator migrate`

Use to install or update `hi-cli`, then remove detected legacy `dp-cli` installations. Verify every affected scope and reload or reactivate `$hi-cli` after success.

`hi skills rename` is a deprecated compatibility alias for `hi operator migrate`.
