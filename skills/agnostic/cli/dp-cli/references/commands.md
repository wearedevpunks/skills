# DP CLI Commands

## `dp scaffold setup`

Use for repo-aware full scaffold setup.

It detects package manifests, resolves packs, writes `.agents/`, harness files, selected skills, prompt specs, lint specs, subagent specs, required tools metadata, and `.Devpunks/scaffold-manifest.json`.

It does not finish all repo-specific authoring. The next agent must use `.Devpunks/AGENT-SYSTEM-PROMPT.md` and `.Devpunks/specs/**` to generate final scoped guidance and reconcile assets.

## `dp scaffold stage init`

Use before boilerplate exists.

It scaffolds requirements-stage assets and prints an operator prompt. Follow that prompt before moving to another stage.

## `dp scaffold stage backlog`

Use to inspect or enter the backlog stage.

When no backlog-stage packs are available, the command still prints the operator prompt so the stage boundary is explicit.

## `dp update --check`

Use to preview managed scaffold drift from `.Devpunks/scaffold-manifest.json`.

Report missing, changed, or pack-drift findings. Do not write files.

## `dp update --write`

Use to refresh scaffold-managed files recorded in `.Devpunks/scaffold-manifest.json`.

After writing, verify the refreshed files still fit the repo shape and any pack drift is handled intentionally.
