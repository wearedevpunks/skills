# hi-cli Commands

The command is `hi`; `hint` is an alias. The npm package remains `@punks/cli`. This reference describes CLI 6.0.0 and newer.

## Terms

- **Registry:** the public, versioned source of every Baseline. Default URL `https://api.harness-intelligence.devpunks.com/r`; override with `HI_REGISTRY_URL` or the `registry` field in `.devpunks/settings.json`. The CLI sends no credential.
- **Baseline:** one immutable Registry version, named `YYYY.MM.DD-<short sha>`. The catalog `latest` pointer names the newest one. Each Baseline declares a compatible CLI range.
- **Registry Item:** one named bundle of files in the Registry. A Pack selects Registry Items.
- **Project settings** (`.devpunks/settings.json`): intent only. Packs, `lint.scopes`/`lint.exclude`, providers, required tools, `commitGate`, optional `registry`. A human, `hi init`, or the agent on request writes it. `hi update` does not.
- **Installed Record** (`.devpunks/installed.json`): written only by the installer, last. Installed Baseline, Recorded Shape (workspaces, Pack ids, detected technologies, wiki root), Registry Items, path-to-item map, added devDependencies, failed links. It contains no content hash.
- **Managed Artifact kinds:** a **Copied Artifact** is written verbatim and overwritten on update. A **Built Artifact** is rendered from a template, Project settings, and the Recorded Shape, and re-rendered on update. An **Authored Artifact** is written once when absent and never compared or overwritten. `AGENTS.md` files, `.agents/subagents/manifest.mjs`, the wiki starter, `.codex/config.toml`, and Project Skills are Authored.
- **Project Skill:** a skill under `.agents/skills/<id>` that no Registry Item provides. The installer never removes, compares, or overwrites it.

## `hi init`

Use once per repository, or again to reconfigure settings. It needs network access.

It detects the repository once, proposes Packs and Software Scopes, asks for providers, writes `.devpunks/settings.json` from the confirmed selection, then runs the `hi update` pipeline. `--yes` accepts the proposed selection; it does not choose Software Scopes for managed lint. Detection only proposes: a detected Pack that is not in settings `packs` is information, not drift.

Skills that exist before Harness under `.claude/skills`, `.codex/skills`, `.cursor/skills`, or `.opencode/skills` move to `.agents/skills/<id>` as Project Skills and stay reachable through the harness links.

After `init`, follow the Init branch in [post-command-flow.md](post-command-flow.md).

## `hi update`

Use to install or refresh the latest Baseline. Flags: `--yes`, `--json`.

The pipeline runs in this order:

1. Fetch the catalog. If the running CLI is outside the Baseline's CLI range, write nothing and report the required range; run `hi upgrade`.
2. Migrate an older manifest-based repository that has no `installed.json` (see [Migration of older repositories](#migration-of-older-repositories-historical-files)).
3. Resolve the Packs in settings to Registry Items.
4. Plan every path. Validate that every JSON or YAML merge target parses. One invalid target stops the run before any write.
5. Write Copied Artifacts (identical content is `skipped`), render Built Artifacts, write absent Authored Artifacts, apply merges, create symlinks, add required workspace devDependencies and remove stale ones, remove stale Copied Artifacts and report stale Authored Artifacts.
6. Write the Installed Record last.
7. Run managed lint on the real repository when Software Scopes exist. Lint findings do not change the update exit code.
8. Report one row per path.

Rules to know:

- With `--yes`, a Copied Artifact that has a local edit and an upstream change is overwritten and reported. Git keeps the local version.
- Authored Artifacts are never overwritten, with or without `--yes`.
- A Project Skill whose id a Registry Item now provides is renamed to `.agents/skills/[DEPRECATED] <id>`, the Registry skill installs under the original id, and the rename is reported.
- A stale devDependency is removed only when no first-party source in that workspace imports it; otherwise it is kept and reported.
- A symlink that cannot be created is reported with its path and target. No copy is made. The next update retries.
- The harness agent files under `.claude/agents`, `.codex/agents`, `.cursor/agents`, and `.opencode/agents` are Built from `.agents/subagents/manifest.mjs` by the Harness Adapters. Edit the manifest (self-contained, no relative imports), then run `hi update`.
- A failed or interrupted run converges when you run it again.

Row actions: `written`, `skipped`, `overwritten-local-edit`, `created`, `kept`, `merged`, `linked`, `link-failed`, `dependency-added`, `dependency-removed`, `dependency-kept`, `removed`, `stale-reported`, `renamed-project-skill`, `migrated-deleted`. The report also has `status`, previous and applied Baseline, `lint` (`passed`, `findings`, `failed`, or `skipped`), and the migration summary.


## Migration of older repositories (historical files)

The first `hi update` in a repository that has `.devpunks/scaffold-manifest.json` and no Installed Record migrates in the same run. It copies the old selected Packs into settings `packs` once, builds the Recorded Shape, moves `.devpunks/pre-existing-skills` into `.agents/skills` as Project Skills, keeps every Authored Artifact, and deletes the old files: `scaffold-manifest.json`, `harness-projection-receipt.json`, `context-plan.json`, `specs/lint/assets.json`, `commit-gate-lifecycle-receipt.json`, `required-tools.json`, `specs/subagents/manifest-spec.json`, the `replaced-scaffold` and `replaced-skills` archives, `.devpunks-cache/`, `.agents/scripts/sync-subagents.mjs`, and `.agents/scripts/harness-projection/`. Each deletion is a report row. There is no separate migrate command.

## `hi diff`

Use to see drift without writing. Flag: `--json`.

It compares each managed path three ways: local bytes, the Registry Item at the installed Baseline, and the Registry Item at the latest Baseline. It writes nothing. Offline, it works from the download cache at the installed Baseline.

| Class | Meaning | Usual action |
| --- | --- | --- |
| `update-available` | Local matches the installed Baseline; the latest Baseline differs. | `hi update`. |
| `local-edit` | Local differs from the installed Baseline; upstream is unchanged. | Keep the edit, or restore it with `hi update --yes`. |
| `conflict` | Local edit and an upstream change on the same Copied Artifact. | Decide; `hi update --yes` overwrites and git keeps the local version. |
| `shape-drift` | A Built Artifact renders differently with the current repository shape (for example, a new workspace). | `hi update`. |
| `missing` | A recorded path is absent. | `hi update` recreates it. |
| `stale` | Output no longer matches its input, for example harness agent files after a `manifest.mjs` edit. | `hi update`. |
| `link-failed` | A recorded symlink is missing or could not be created. | Fix the filesystem cause, then `hi update`. |

Copied Artifacts compare after normalizing line endings and trailing whitespace only. Authored Artifacts are never byte-compared.

## `hi check`

Use as the cheap read-only status. Flag: `--json`.

It fetches only the root catalog, compares the installed Baseline with `latest`, checks the CLI range, and checks required tools. It reads only `installed.json` and settings. It returns `status`:

| `status` | Meaning |
| --- | --- |
| `current` | The installed Baseline is `latest`. |
| `update-available` | A newer Baseline exists. |
| `unavailable` | The Registry could not be reached. The output names the installed Baseline. Drift is unknown, not absent. |
| `not-installed` | No `.devpunks/installed.json`. |

`hi check` does not run the Drift Check. Use `hi diff` for per-path drift.

## `hi tools ensure`

Use to install or refresh external Harness tools from the installed Baseline's tool list. This command may mutate global or external tool installations. Manual platform CLIs such as `gh`, `az`, and `glab` are validation-only; the command does not upgrade them.

Report each failed tool with the exact failed command or recovery guidance from the result. Do not convert a tool failure into settings or update work.

## `hi commit-gate verify`

Use after the Commit Gate is installed to verify the live Lefthook hook, dependency, lockfile, and configuration. It writes no file.

## `hi report`

Use to submit reusable Harness friction for GitHub-backed maintainer triage. Reports are for shared Harness, docs, tooling, skill, or workflow issues, not ordinary project backlog.

Include `--type`, `--severity`, `--area`, `--skill-pack`, `--command`, `--expected`, `--actual`, `--steps`, and `--labels` when applicable. Success requires a returned GitHub issue URL.

## `hi upgrade`

Use to update the installed CLI executable through its detected global package manager. Use `--tag next` for prerelease channels, `--force` to reinstall the selected tag, and `--json` for structured output.

The command bypasses package-manager minimum-release-age gates for the selected CLI release. Startup update checks remain advisory and do not replace `hi upgrade`.

## `hi operator status`

Report global and project `hi-cli` installations plus legacy `dp-cli` installations without changing them.

With CLI 5.0.1 or newer, each install or update command resolves the newest canonical shared-skills `main` revision once and verifies installed files against that source content. Report and use the exact revision returned by the command. On CLI 5.0.0 or 4.x, run `hi upgrade` before requesting the newest operator skill.

## `hi operator install`

Install the global copy when absent and verify its files against the revision resolved for this command.

## `hi operator update`

Update every detected global or project `hi-cli` copy and verify its files against the revision resolved for this command.

## `hi operator migrate`

Verify replacement `hi-cli` copies before removing detected legacy `dp-cli` copies.

Operator writes require Skills CLI 1.5.20 or newer. After successful install, update, or migration, reload or reactivate `$hi-cli` before relying on its instructions.

`hi skills rename` is a deprecated compatibility alias for `hi operator migrate`.

## Retired commands

`hi scaffold` is retired into `hi init`. `hi ensure` is retired; run `hi init` again to reconfigure settings. `hi update --check` and `--write` are retired; use `hi check` or `hi diff` to inspect and `hi update` to apply.
