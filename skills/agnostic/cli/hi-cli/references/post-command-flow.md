# Post-Command Flow

## 1. Classify the Result

Capture the command, mode, summary, and paths changed by this run. Choose one branch: init, scaffold, check, ensure, update, tools ensure, report, upgrade, or operator.

Existing `.devpunks/` artifacts describe project state. Read an artifact only when the active branch or changed category points to it.

## 2. Follow the Active Branch

### Init

- inspect the generated docs-onboarding, requirements/backlog/spec skills, and wiki root
- activate `$docs-onboarding`
- reconcile the wiki root with the real repository before durable docs are written
- reconcile pre-existing skills only when the command reports relevant evidence
- do not start requirements discovery unless the user asks for it
- run `hi scaffold` only when the repository is ready for repo-aware setup

### Scaffold

Read available generated artifacts in this order:

1. `.devpunks/AGENT-SYSTEM-PROMPT.md`
2. `.devpunks/AGENT-HANDOFF.md`
3. `.devpunks/scaffold-manifest.json`
4. `.devpunks/required-tools.json`
5. `.devpunks/settings.json`
6. `.devpunks/specs/**`

If an expected artifact is missing, continue and report it.

Then:

- activate `$writing-for-agents`, then `$rule-authoring`
- author the requested root, docs, and workspace guidance
- treat `.devpunks/specs/prompts/**` as the complete prompt-authoring contract; apply every scoped-prompt criterion it contains
- ground scoped prompts in current code evidence: structure, placement, dependencies, and boundaries first; applied coding conventions second; enforced constraints outrank the nearest stable module-family pattern
- keep each scoped prompt lean with exact-trigger pointers to co-authored reference content; references disclose content and never create deeper prompt scopes
- render every selected non-phase skill in one final `## Skills` table with
  `Skill | Exact trigger`; each row names the exact invocation condition
- open every selected installed skill's `SKILL.md`; that installed file remains
  workflow authority
- keep root `AGENTS.md` table-free; phase wrappers remain global orchestration
  entrypoints and are excluded from scoped tables
- always link `opensrc/README.md` from scoped prompts and read it when work depends on third-party library behavior
- reconcile only the generated skills, prompts, lint, hooks, scripts, subagents, tools, and wiki assets in scope
- preserve repo-owned edits and ask before changing project policy
- run targeted validation for the outputs reconciled

Do not stop merely because generated files exist.

### Check

Read the current summary only. Report CLI, baseline, managed-file, settings, pack, or tool drift without writing.

A clean result is complete. If drift exists, name the matching `hi update`, `hi ensure`, `hi tools ensure`, or `hi upgrade` action without running a mutation unless authorized.

`hi update --check` follows this branch as a supported compatibility preview.

### Ensure

Verify only the repository manager, backlog provider, asset provider, backlog project URL, and resulting settings summary.

Do not inspect or mutate external tools. A settings failure is complete when its exact validation or write blocker is reported.

### Update

Read the command summary before any generated artifact. If it reports no diff, report success and stop.

For a diff, inspect only paths changed or flagged by this run. Apply every matching row:

| Changed category | Required follow-through |
| --- | --- |
| Settings or manifest pins only | Confirm accepted pins. |
| Skill content; IDs unchanged | Inspect affected skills and active mirrors only. |
| Skill added, removed, or renamed | Reconcile affected IDs and their mirrors. |
| `local-edited` conflict | Preserve local intent; ask when project and baseline intent conflict. |
| Missing or stale path | Confirm the named recreation or deletion and direct references. |
| Prompt or Rule Registry input | Activate `$writing-for-agents`, then `$rule-authoring`; reconcile only affected scopes and mirrors. |
| Subagent input | Reconcile only generated and final subagent manifests. |
| Lint, hook, or script input | Validate the affected config or command; ask before changing policy. |
| Required tools | Check only added, changed, or failed tools. |
| Source-guide content | Inspect only affected guide files. |
| Wiki input | Reconcile affected routes or documents, then validate them. |
| Default or detected pack addition | Follow only categories changed by that addition. |
| Optional/removal/policy/surface decision | Ask for the unresolved decision. |
| First adoption or missing final output | Run applicable scaffold follow-through. |

After write modes, run targeted validation and one fresh `hi check --json`. Rerun `hi update` once only when that check detects new CLI or baseline drift, then finish with one final `hi check --json`.

Before completing a changed update, activate `$writing-for-agents`, then `$rule-authoring`. A no-op Rule Registry reconciliation is valid.

### Tools Ensure

Treat the command as a global or external mutation.

- report every auto-managed tool refreshed through its trusted latest target
- report every manual platform CLI as validation-only; do not upgrade it
- preserve successful tool work when another tool fails
- return the exact failed install, refresh, validation, or recovery command from the result
- do not read `.devpunks/` beyond paths explicitly named by the command result
- do not run scaffold, settings, or update follow-through

### Report

Confirm the command returned a GitHub issue URL before saying the report was submitted. Return the URL, labels, command, skill pack, and any blocker.

### Upgrade

Report whether the CLI upgraded, was current, could not detect its install manager, or failed. Include the package manager and command when available.

### Operator

Classify `hi operator status`, `install`, `update`, or `migrate` from the command result only. `hi skills rename` follows the same branch as a deprecated alias for `hi operator migrate`.

Never read `.devpunks/`, run scaffold follow-through, or scan unrelated skill homes.

Report `hi-cli` and legacy `dp-cli` state for global and project scopes:

- `status`: report detected installations without changing them
- `install`: verify the resulting global `hi-cli` copy
- `update`: verify every detected `hi-cli` copy
- `migrate`: verify replacements before every detected legacy `dp-cli` copy is removed

Operator writes require Skills CLI 1.5.20 or newer. If an action partially fails, return the exact failed Skills CLI command from the result. After successful install, update, or migrate, reload or reactivate `$hi-cli`.

## 3. Complete the Branch

- init: generated onboarding/skills/wiki state is reported and the next bounded action is clear
- scaffold: applicable generated instructions are reconciled, targeted validation ran, and unresolved policy choices are named
- check: current drift is reported without writes
- ensure: settings were reconfigured or the exact blocker is reported
- update: changed categories were handled and the final `hi check --json` result is reported
- tools ensure: tool refresh/validation outcomes and exact failures are reported
- report: a GitHub issue URL or exact submission blocker is returned
- upgrade: install manager, command, and outcome are returned
- operator: both scopes are reported; mutation outcomes are verified; reload/reactivation is requested after success

Report only active-branch evidence, files changed by the command, validation run, and unresolved items.
