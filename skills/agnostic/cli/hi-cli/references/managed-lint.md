# Managed lint

Use this flow for lint setup, changed software ownership, policy migration, or a
lint selection/route finding from init, update, diff, or check. Keep the work within
the current command's scope. Existing accepted decisions remain authoritative.

## Select Software Scopes

1. Inventory shallow `apps/*` and `packages/*` packages, declared workspaces,
   and any deliberately selected root or custom package layout. Inspect each
   candidate's manifest, source, and command/install context. Candidates are
   evidence; a workspace glob or recursively found manifest is not permission to
   lint a project. Record which candidates own application/library software and
   which are documentation or embedded example/fixture projects.
2. Save exact repository-relative package roots in `.devpunks/settings.json`
   under `lint.scopes`, with repository-relative file/directory glob exclusions
   under `lint.exclude`. Use `hi init` (run again to reconfigure) or authorized
   settings authoring, preserving unrelated fields. `hi update` never writes
   settings. Complete this step when every selected owner has a contained
   `package.json` and a supported JavaScript/TypeScript command/install context.
3. Run `hi update` to apply the selection. Resolve invalid, missing, moved,
   escaping, or aliased owners before dependent lint activation. `hi init --yes` saves detection's proposed TypeScript workspaces; review
   them as candidates, not as a deliberate owner decision. Keep derived framework and route data out of settings.

Merge the `lint` object into existing settings; this is an example, not a default
selection:

```json
{
  "lint": {
    "scopes": ["apps/api", "apps/web", "packages/core"],
    "exclude": ["apps/api/fixtures/embedded/**", "examples/demo/**"]
  }
}
```

| Setting or layout | Meaning |
| --- | --- |
| Missing `lint` or `lint.scopes` | Selection is required; do not infer an empty list or recursive enrollment. |
| `"scopes": []` | Intentionally no managed JavaScript/TypeScript ownership; existing Python/Ruff routing remains independent. |
| Omitted `lint.exclude` | Empty exclusion list; hard boundaries still apply. |
| `"scopes": ["."]` | Root application explicitly owns eligible root software. Root tooling dependencies alone do not justify this choice. |
| `"scopes": ["app/backend/core"]` | Exact custom package root; execution is not limited to conventional layouts. |
| No root `package.json` | Select supported nested packages; do not create a root package just to qualify. |

Use normalized paths with deterministic ordering and deduplication. Absolute or
escaping paths, unresolved manifest roots, and canonical aliases that escape or
duplicate an owner are invalid.

`wiki`, `app/wiki`, and `apps/wiki`, including descendants, are hard exclusions.
Selecting one is invalid even when a workspace declaration includes it. Save
other documentation and embedded project exclusions explicitly. An unselected
nested package/project boundary is outside its ancestor's source ownership;
enumerating boundaries for exclusion does not enroll or analyze those projects.
Ordinary `test`, `tests`, `.test`, and `.spec` source stays eligible. A directory
name containing `wiki` or `test` is not by itself a universal exclusion.

Each eligible file belongs to the most-specific selected owner once. A selected
`.` excludes nested boundaries and more-specific owners; an unselected root only
dispatches. Persistent exclusions win over selections and rule overrides. New
source within an owner is covered; new packages require deliberate selection.

## Preserve Project Lint Policy

Inventory existing configs, explicit script config arguments, parent policy,
renamed shared inputs such as `oxlint.base.json`, and transitive `extends`.
Retain compatible authored JSON/JSONC at its original project-owned path and
compose it as an explicit input. `oxlint.project.json` is the convention for
**new** policy, not a mandatory rename or a generated copy of existing policy.

One `<scope>/oxlint.config.ts` is the owner's effective execution target. It
composes applicable Harness defaults and local framework assets, then deliberate
project choices. The resulting rules, settings, exclusions, and failure semantics
are the Effective Lint Policy. Shared policy remains reusable input. Preserve severities and
options, categories, overrides, ignores, environments, globals, plugin/settings
references, and applicable typed settings throughout the inherited chain.
Relative extends, globs, and plugin paths must retain their meaning; copying
bytes to a new directory is insufficient. Preview added defaults and semantic
differences. Preserve opaque/dynamic policy and report a migration conflict when
composition cannot be verified safely.

Framework lint needs owner-local evidence: manifest, source usage, framework/test
config, or an explicit command relationship to shared tooling. Root installation,
hoisted/transitive dependencies, a frontend-like name, and broad agent guidance
packs do not authorize execution. React email use may justify React without
Next/TanStack; Jest does not establish Vitest. Keep reasons in derived selection
evidence, not a second settings registry.

## Verify Lint Routes

Read the affected routes in `.devpunks/specs/lint/selection.json` alongside the
command's evidence. Each Lint Route binds owner, cwd, explicit effective config,
project-local supported tool/version, exclusions, and failure threshold.
`selection.json`, `.devpunks/specs/lint/README.md`, and each
`<scope>/oxlint.config.ts` are Built Artifacts: `hi update` re-renders them from
settings and the Recorded Shape. Do not hand-author them; change settings or
project policy inputs, then run `hi update`.

The runner is `node .agents/scripts/managed-lint-runner.mjs`. Pass large file
sets with `--files-from <path>` (one repository-relative path per line) instead
of argv. The runner streams Oxlint output through a temporary file and batches
file arguments below the operating-system limit, so a very large report is still
classified as findings. The Commit Gate passes its staged file list to the
runner through the file named by `HI_STAGED_FILES_PATH`; a lint configuration
change still lints the full owner file set.

Package scripts, root dispatch, CI invoking those scripts, Lefthook, edited-file
verification, and update validation must consume the same route. Managed Oxlint
uses the explicit config with nested discovery disabled. Root dispatch adds no
second `.` or recursive lint pass. Resolve tool failures in the named local
context; never substitute a global or freshly downloaded latest binary.

Compare verification on identical bytes, file sets, toolchain, and check mode.
Edited-file formatting and safe fixes can change bytes, so compare the subsequent
verification stage. Diagnostic severity and failure threshold are separate:
new generated lint retains `--max-warnings 0`; represented project thresholds
must agree across routes. An unrepresentable threshold is a migration conflict.
Keep precommit format checks read-only and edited-file safety/retry limits intact.

Apply exclusions before coverage or empty-work detection. Excluded-only changes
run no managed lint or formatter; mixed changes check eligible work once per
owner and check kind. Renames affect both endpoints; deletion checks use the
owner without passing nonexistent files. Shared settings, policy, routing, and
toolchain inputs trigger their dependent owners even outside owned source.
Existing Python tooling keeps its own routing while honoring shared exclusions.

## Reconcile Lint Adoption

1. Preview selected scopes/exclusions, preserved policy inputs, effective configs,
   scripts/hooks, dependency changes, and proposed retirements together. Inventory
   known lint/check aliases, repository checks, and CI commands. Keep compatible
   custom commands only when their canonical route and threshold are verified;
   preserve incompatible or opaque commands and report the exact conflict.
2. Apply with `hi update`. It writes the lint Registry Items, then runs managed
   lint on the real repository and reports `lint: passed`, `findings`, `failed`,
   or `skipped`. Configuration, local-tool, or process failures (`failed`) block
   dependent activation. Source findings neither prove broken configuration nor
   authorize bulk autofixes, and they do not change the update exit code.
3. `hi update` removes stale Copied lint files it recorded; git keeps their
   previous bytes. It never removes project policy files it did not record.
   Exclusion alone never authorizes deletion. Preserve `commitGate: "disabled"`,
   consumer hooks, and other hook-manager coexistence decisions.
4. Run affected validation and one `hi check --json`. Record actual adoption and
   remaining conflicts; planned writes alone are insufficient. Follow the
   bounded update retry rule in
   [post-command-flow.md](post-command-flow.md#update).

## Interpret the result

| State | Next action |
| --- | --- |
| Missing selection | Inventory candidates and save the deliberate scopes/exclusions; dependent lint activation stays pending. |
| Invalid/moved owner or stale route | Correct the named settings/path issue and reconcile derived output; preserve unsupported content. |
| Intentional exclusion or no eligible work | Report the excluded path or empty work; this is not proof of repository-wide cleanliness. |
| Explicit `lint.scopes: []` | Report disabled JavaScript/TypeScript ownership; preserve independent Python/Ruff routing. |
| Stale Built lint output (`hi diff` `stale` or `shape-drift`) | Retain the changed input paths; run `hi update` to re-render before route execution. Do not hand-edit Built files or revert policy merely to pass. |
| Lint findings | Retain file/rule/severity/location and threshold; repair only authorized source targets. Findings do not mean adoption failed operationally. |
| Config/tool/process failure | Report exact owner, cwd, config, tool/version, command, and diagnostics; repair that boundary before dependent adoption. |
| Command/policy/ownership conflict | Preserve the named command or file, explain competing authority, and resolve only the outstanding decision within existing authorization. |
| Healthy routes | Report the observed health scope. A `current` `hi check` status alone does not prove lint health. |

`hi check` and `hi diff` stay read-only: report the smallest next action and affected paths.
Run mutations only within the user's authorization. Keep actual diagnostics and
execution context so the next agent can continue without guessing configs.

For a process failure, retain the original exit status, signal, and bounded stdout/stderr alongside the route context. A recognized empty-source JSON report is empty work; malformed output and config/tool failures require repair before dependent adoption.

In rootless repositories, assess lint-route health separately from outstanding prompt-authoring findings. A valid selected nested owner does not erase another incomplete adoption step.
