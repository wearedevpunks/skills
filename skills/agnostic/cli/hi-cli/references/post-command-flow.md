# Post-Command Flow

## 1. Classify the Result

Capture the command, flags, `status`, and the paths the report lists for this run. Choose one branch: init, update, diff, check, tools ensure, report, upgrade, or operator.

Existing `.devpunks/` files describe project state. Read a file only when the active branch or a reported path points to it.

## 2. Follow the Active Branch

### Init

`hi init` wrote Project settings and then ran the update pipeline, so apply the [Update](#update) rows first. Then complete first adoption:

1. Apply [Project Verifier preservation](#project-verifier-preservation).
2. Read `.devpunks/installed.json` (installed Baseline, Recorded Shape, path-to-item map, failed links), then `.devpunks/AGENT-HANDOFF.md`, then `.devpunks/AGENT-SYSTEM-PROMPT.md`. If one is missing, continue and report it.
3. Activate `$writing-for-agents`, then `$rule-authoring`. Author root and scoped `AGENTS.md` files from `.devpunks/specs/prompts/**`. These prompt specs are Built Artifacts and are the complete prompt-authoring contract; the `AGENTS.md` files are Authored Artifacts that the installer never overwrites.
   - ground scoped prompts in current code evidence: structure, placement, dependencies, and boundaries first; applied coding conventions second; enforced constraints outrank the nearest stable module-family pattern
   - keep each scoped prompt lean with exact-trigger pointers to co-authored reference content; references disclose content and never create deeper prompt scopes
   - render every selected non-phase skill in one final `## Skills` table with `Skill | Exact trigger`; each row names the exact invocation condition
   - open every selected installed skill's `SKILL.md`; that installed file remains workflow authority
   - keep root `AGENTS.md` table-free; phase wrappers remain global orchestration entrypoints and are excluded from scoped tables
   - always link `opensrc/README.md` from scoped prompts and read it when work depends on third-party library behavior
   - keep each sibling `CLAUDE.md` as a symlink to its `AGENTS.md`
4. Tailor `.agents/subagents/manifest.mjs` (Authored) to the real owned paths, guidance files, and skills, following the Built guide `.agents/subagents/manifest.prompt.md`. Keep the manifest self-contained with no relative imports; the CLI loads it from a `data:` URL. Then run `hi update` once so the Harness Adapters rebuild the agent files in `.claude/agents`, `.codex/agents`, `.cursor/agents`, and `.opencode/agents`. Never hand-edit those agent files.
5. Report each Project Skill the run moved into `.agents/skills`, and each `renamed-project-skill` row (`.agents/skills/[DEPRECATED] <id>`). A deprecated copy is project knowledge: compare it with the Registry skill, keep what the project still needs in project guidance, and suggest `hi report` when the knowledge belongs in the shared skill.
6. Review the `lint.scopes` and `lint.exclude` that `hi init` saved against the real software owners, using [managed lint selection and adoption](managed-lint.md).
7. Complete the [existing wiki structure check](wiki-structure.md). When it reports `pass` for an existing wiki root, activate `$docs-onboarding` against that root. When it reports `not-applicable`, defer onboarding and hand off project-owned wiki creation or selection. When it reports `fail` or a blocker, report the required correction before onboarding.
8. Run targeted validation for the files authored, then one `hi check --json`.

Do not start requirements discovery unless the user asks for it. Do not stop merely because files exist.

### Update

Read the report before any file. If `refusal` is present, report it and stop: a CLI range refusal needs `hi upgrade`; an invalid merge target needs that file repaired; nothing was written.

If `status` is `partial` because a locally edited Copied Artifact also changed upstream, report those paths and ask whether to run `hi update --yes`; git keeps the local version.

If `status` is `applied`, every row is `skipped` or `kept`, lint is `passed` or `skipped`, and there are no failed links, report that result and stop.

Otherwise apply [Project Verifier preservation](#project-verifier-preservation), inspect only the reported paths, and apply every matching row:

| Report row or field | Required follow-through |
| --- | --- |
| `migration` present | The run migrated a manifest-based repository. Confirm the settings `packs` it wrote, list each `migrated-deleted` path, and confirm moved Project Skills. Then complete the [Init](#init) steps 2 to 5 that the repository has not done yet. |
| `written` or `overwritten-local-edit` on a skill | Inspect the affected skills only. For an overwritten local edit, read the previous bytes from git and move project-specific knowledge into project guidance. |
| Prompt spec (`.devpunks/specs/prompts/**`) written | Activate `$writing-for-agents`, then `$rule-authoring`; reconcile only the affected `AGENTS.md` scopes. |
| `.devpunks/AGENT-HANDOFF.md` written | Read it and follow only its new items. |
| `renamed-project-skill` | Handle as in [Init](#init) step 5. |
| `stale-reported` | A file is no longer in the Baseline. An Authored Artifact is project-owned; a locally edited Copied file was kept without `--yes`. Ask before deleting either, or before `hi update --yes` removes the Copied file. |
| `link-failed` | Report path and target. Fix the filesystem cause (permissions, Windows Developer Mode) and run `hi update` again. There is no copy fallback. |
| `dependency-added`, `dependency-removed`, `dependency-kept` | The update already ran the package-manager install once (`dependencyInstall`); on `failed`, report the detail and rerun the install. Report any post-install command the detail names as skipped outside the CLI allowlist. For `dependency-kept`, report the importing file. |
| `lefthook install` hint | Run `lefthook install`, then `hi commit-gate verify`. |
| Lint, hook, script, or Commit Gate path | Follow [managed lint adoption](managed-lint.md#reconcile-lint-adoption); validate the affected routes. |
| `lint: findings` | Report file, rule, and location. Repair only authorized source targets. Findings do not mean the update failed. |
| `lint: failed` | Report owner, command, and diagnostics; repair that boundary. |
| Source guide (`opensrc/*.md`) | Inspect only the affected cards. |

After write follow-through, run targeted validation and one `hi check --json`. Rerun `hi update` once only when that check reports `update-available`, then finish with one final `hi check --json`.

Before completing a changed update, activate `$writing-for-agents`, then `$rule-authoring`. A no-op Rule Registry reconciliation is valid.

### Diff

Report one line per path with its class. `hi diff` wrote nothing. Name the action from the class table in [commands.md](commands.md#hi-diff) and run no mutation unless the user authorized it. `conflict` needs a user decision before `hi update --yes`.

### Check

Report `status` and the installed and latest Baseline:

- `current`: complete.
- `update-available`: name `hi update`; run it only when authorized.
- `unavailable`: say the Registry could not be reached and name the installed Baseline. Do not say there is no drift.
- `not-installed`: name `hi init`.

Also report a CLI outside the Baseline range (`hi upgrade`) and missing required tools (`hi tools ensure`).

### Tools Ensure

Treat the command as a global or external mutation.

- report every auto-managed tool refreshed through its trusted latest target
- report every manual platform CLI as validation-only; do not upgrade it
- preserve successful tool work when another tool fails
- return the exact failed install, refresh, validation, or recovery command from the result
- do not read `.devpunks/` beyond paths explicitly named by the command result
- do not run update follow-through

### Report

Confirm the command returned a GitHub issue URL before saying the report was submitted. Return the URL, labels, command, skill pack, and any blocker.

### Upgrade

Report whether the CLI upgraded, was current, could not detect its install manager, or failed. Include the package manager and command when available.

### Operator

Classify `hi operator status`, `install`, `update`, or `migrate` from the command result only. `hi skills rename` follows the same branch as a deprecated alias for `hi operator migrate`.

Never read `.devpunks/`, run update follow-through, or scan unrelated skill homes.

Report `hi-cli` and legacy `dp-cli` state for global and project scopes:

- `status`: report detected installations without changing them
- `install`: verify the resulting global `hi-cli` copy against the resolved source content
- `update`: verify every detected `hi-cli` copy against the resolved source content
- `migrate`: verify replacements before every detected legacy `dp-cli` copy is removed

With CLI 5.0.1 or newer, each install or update command resolves the newest canonical shared-skills `main` revision once and verifies installed files against that source content. Report and use the exact revision returned by the command. On CLI 5.0.0 or 4.x, run `hi upgrade` before requesting the newest operator skill.

Operator writes require Skills CLI 1.5.20 or newer. If an action partially fails, return the exact failed Skills CLI command from the result. After successful install, update, or migrate, reload or reactivate `$hi-cli`.

## Project Verifier preservation

The shared `verify-behavior` skill is the single entrypoint. Its project-owned references describe how to verify this project's runnable apps and behaviors.

For init, update, and their handoffs, preserve every existing file below `.agents/skills/verify-behavior/references/` byte-for-byte. This includes the index, Surface Verification References, Feature Maps, Cross-App Journeys, and helpers. `hi update` refreshes only the paths its Registry Item records, so the shared `verify-behavior/SKILL.md` entrypoint can change while the project-owned references keep their exact bytes.

Keep an absent Project Verifier absent. These command flows never invoke `create-verification-skill` or `update-verification-skill`. During delivery, `implement-spec` creates a Surface Verification Reference when its selected scenario has an Uncovered Surface. It updates the existing references and Feature Map when the scenario has Uncovered Behavior.

Before completing reconciliation, compare existing project-owned paths and bytes with the pre-command inventory, report any unexpected change as a blocker, and retain the comparison outside command cleanup.

## 3. Complete the Branch

- init: update rows handled, `AGENTS.md` scopes authored from prompt specs, subagent manifest tailored and harness agents rebuilt, Project Skills reported, wiki check reported, final `hi check --json` reported
- update: every reported row handled and the final `hi check --json` result reported
- diff: one class per path reported without writes
- check: `status` and next action reported without writes
- tools ensure: tool refresh/validation outcomes and exact failures are reported
- report: a GitHub issue URL or exact submission blocker is returned
- upgrade: install manager, command, and outcome are returned
- operator: both scopes are reported; mutation outcomes are verified; reload/reactivation is requested after success

Report only active-branch evidence, files changed by the command, validation run, and unresolved items.
