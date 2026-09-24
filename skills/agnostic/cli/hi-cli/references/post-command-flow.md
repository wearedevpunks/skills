# Post-Command Flow

## 1. Classify the Result

Capture the command, mode, summary, and paths changed by this run. Choose one branch: init, scaffold, check, ensure, update, tools ensure, report, upgrade, or operator.

Existing `.devpunks/` artifacts describe project state. Read an artifact only when the active branch or changed category points to it.

## 2. Follow the Active Branch

### Init

- inspect the generated docs-onboarding and requirements/backlog/spec skills
- complete the [existing wiki structure check](wiki-structure.md)
- when the check reports `pass` for an existing wiki root, activate `$docs-onboarding` against that root
- when the check reports `not-applicable`, defer onboarding and hand off project-owned wiki creation or selection; resume onboarding after an authorized setup produces an existing wiki that passes the check
- when the check reports `fail` or a blocker, report the required correction before onboarding can proceed
- reconcile pre-existing skills only when the command reports relevant evidence
- do not start requirements discovery unless the user asks for it
- run `hi scaffold` only when the repository is ready for repo-aware setup

### Scaffold

Apply [Project Verifier preservation](#project-verifier-preservation) before reconciliation.

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
- reconcile only the generated skills, prompts, lint, hooks, scripts, subagents, and tools in scope
- complete the [existing wiki structure check](wiki-structure.md)
- for lint output, complete [managed lint selection and adoption](managed-lint.md); saved owners and verified routes are the completion evidence
- preserve repo-owned edits and ask before changing project policy
- run targeted validation for the outputs reconciled

Do not stop merely because generated files exist.

### Check

Read the current summary. Report CLI, baseline, managed-file, settings, pack, tool, or managed lint route drift without writing. For lint selection, policy, or command conflicts, follow [result interpretation](managed-lint.md#interpret-the-result) and retain the named owner, paths, and execution context.

A clean result is complete. If drift exists, name the matching `hi update`, `hi ensure`, `hi tools ensure`, or `hi upgrade` action without running a mutation unless authorized.

`hi update --check` follows this branch as a supported compatibility preview.

### Ensure

Verify the repository manager, backlog provider, asset provider, backlog project URL, and resulting settings summary. When managed lint ownership is in scope, confirm the exact `lint.scopes` and `lint.exclude` arrays using [scope selection](managed-lint.md#select-software-scopes). Saving settings is not evidence that dependent lint routes have been adopted.

Do not inspect or mutate external tools. A settings failure is complete when its exact validation or write blocker is reported.

### Update

Apply [Project Verifier preservation](#project-verifier-preservation) before reconciliation.

Read the command summary before any generated artifact. If it reports no diff and no unresolved health or adoption finding, report that result and stop. A matching baseline pin or empty changed-file list alone does not prove live route health.

For a diff, inspect only paths changed or flagged by this run. Apply every matching row:

| Changed category | Required follow-through |
| --- | --- |
| Settings or manifest pins only | Confirm accepted pins; changed lint settings require scope/route reconciliation in [managed-lint.md](managed-lint.md). |
| Skill content; IDs unchanged | Inspect affected skills and active mirrors only. |
| Skill added, removed, or renamed | Reconcile affected IDs and their mirrors. |
| `local-edited` conflict | Preserve local intent; ask when project and baseline intent conflict. |
| Missing or stale path | Confirm the named recreation or deletion and direct references. |
| Prompt or Rule Registry input | Activate `$writing-for-agents`, then `$rule-authoring`; reconcile only affected scopes and mirrors. |
| Subagent input | Reconcile only generated and final subagent manifests. |
| Lint, hook, or script input | Follow [managed lint adoption](managed-lint.md#reconcile-lint-adoption); validate affected routes and preserve accepted project policy. |
| Required tools | Check only added, changed, or failed tools. |
| Source-guide content | Inspect only affected guide files. |
| Wiki guidance, routes, content schema, source documents, or sync inputs | Complete the [existing wiki structure check](wiki-structure.md) for the affected paths and their routed copies. |
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
- `install`: verify the resulting global `hi-cli` copy against the resolved source content
- `update`: verify every detected `hi-cli` copy against the resolved source content
- `migrate`: verify replacements before every detected legacy `dp-cli` copy is removed

With CLI 5.0.1 or newer, each install or update command resolves the newest canonical shared-skills `main` revision once and verifies installed files against that source content. Report and use the exact revision returned by the command. On CLI 5.0.0 or 4.x, run `hi upgrade` before requesting the newest operator skill.

Operator writes require Skills CLI 1.5.20 or newer. If an action partially fails, return the exact failed Skills CLI command from the result. After successful install, update, or migrate, reload or reactivate `$hi-cli`.

## Project Verifier preservation

The shared `verify-behavior` skill is the single entrypoint. Its project-owned references describe how to verify this project's runnable apps and behaviors.

For scaffold, update, and their generated Post-Command Handoffs, preserve every existing file below `.agents/skills/verify-behavior/references/` byte-for-byte. This includes the index, Surface Verification References, Feature Maps, Cross-App Journeys, and helpers. Scaffold or update can refresh the shared `verify-behavior/SKILL.md` entrypoint, while the project-owned references keep their exact bytes.

Keep an absent Project Verifier absent. These command flows never invoke `create-verification-skill` or `update-verification-skill`. During delivery, `implement-spec` creates a Surface Verification Reference when its selected scenario has an Uncovered Surface. It updates the existing references and Feature Map when the scenario has Uncovered Behavior.

Generated handoffs state the preserve action and residual scopes for the current run and point here. Structured scope and receipt evidence and generated prompt specs remain the authority for new scope structure.

Before completing reconciliation, compare existing project-owned paths and bytes with the pre-command inventory, report any unexpected change as a blocker, and retain the comparison outside command cleanup.

## 3. Complete the Branch

- init: generated skills and existing wiki check are reported; onboarding runs only after a passing check, otherwise the wiki setup or correction handoff is clear
- scaffold: applicable generated instructions are reconciled, targeted validation ran, and unresolved policy choices are named
- check: current drift is reported without writes
- ensure: settings were reconfigured or the exact blocker is reported
- update: changed categories were handled and the final `hi check --json` result is reported
- tools ensure: tool refresh/validation outcomes and exact failures are reported
- report: a GitHub issue URL or exact submission blocker is returned
- upgrade: install manager, command, and outcome are returned
- operator: both scopes are reported; mutation outcomes are verified; reload/reactivation is requested after success

Report only active-branch evidence, files changed by the command, validation run, and unresolved items.
