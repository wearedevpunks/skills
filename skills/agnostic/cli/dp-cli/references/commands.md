# DP CLI Commands

## `dp scaffold setup`

Use for repo-aware full scaffold setup.

It detects package manifests, resolves packs, writes `.agents/`, harness files, selected skills, prompt specs, lint specs, subagent specs, required tools metadata, and `.devpunks/scaffold-manifest.json`.

It does not finish all repo-specific authoring. The next agent must use `.devpunks/AGENT-SYSTEM-PROMPT.md` and `.devpunks/specs/**` to generate final scoped guidance and reconcile assets.

## `dp scaffold init`

Use before boilerplate exists.

It scaffolds `requirements-grill`, `write-backlog`, and the initial wiki tree, then prints an operator prompt. Follow that prompt before moving to repo-aware setup.

If the generated wiki root does not match the repository layout, move or refactor it before writing specs, plans, or routed docs. Monorepos usually use `apps/wiki`; single-repo layouts usually use `wiki`.

## `dp update --check`

Use to preview managed scaffold drift from `.devpunks/scaffold-manifest.json`.

Report missing, changed, or pack-drift findings. Do not write files.

## `dp update --write`

Use to refresh scaffold-managed files recorded in `.devpunks/scaffold-manifest.json`.

After writing, verify the refreshed files still fit the repo shape and any pack drift is handled intentionally.

## `dp report`

Use to open reusable Harness friction in the Harness Intelligence GitHub repository. Include `--area`, `--skill-pack`, `--command`, `--expected`, `--actual`, and `--steps` whenever they apply so labels and issue body are useful for backoffice triage.

Reports are for shared Harness/docs/tooling/workflow issues, not the default path for project product backlog.
