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

Project lint rules live in each scope's Authored `oxlint.local.ts`. The Built
`oxlint.config.ts` imports it and applies it last, so its rules win. `hi update`
writes it once and never changes it. On adoption or migration it is seeded from
the previous `oxlint.config.ts` (the last committed one when an interrupted
adoption already replaced it), keeping the project's `extends`; a config hi
cannot evaluate is preserved verbatim under a comment. Put project rules, categories, `env`, `overrides`, and
`ignorePatterns` there; a JS-plugin rule must name a built-in Oxlint plugin or a
`jsPlugins` alias that file declares.

The `react-frontend-layers` asset applies in each Software Scope where the
`react` Pack applies, that is, where the scope's own manifest declares `react`
or `react-dom`. It installs the `frontend-layers` JS plugin at
`<scope>/tools/oxlint/frontend-layers/index.mjs` and checks only a package whose
layer root contains `app/` or `routes/`. Every violation is an error, with no
baseline. To turn a rule off, set `frontend-layers/<rule>` to `off` in
`oxlint.local.ts`. In a Software Scope other than the repository root, the
plugin alias is `frontend-layers-<scope>`, with each scope-path character other than a letter,
digit, `_` or `$` changed to `-` (`apps/web` gives `frontend-layers-apps-web`),
so the key is `frontend-layers-<scope>/<rule>`. For the rules and the layer
model, read `$frontend-domain-structure` `references/structure.md`; after a
Baseline that changes the model, its `references/migration.md` maps old paths
to new ones.

A consumer formatter rewrites copied plugins and Built `oxlint.config.ts`
files, and `hi update` then reports them as local edits. `hi update` therefore
merges `**/tools/oxlint/**` and `**/oxlint.config.ts` into the
`ignorePatterns` of an existing `.oxfmtrc.json`. A repository without
`.oxfmtrc.json` (Prettier, Biome, or no formatter config) gets a report row
that names each pattern to add to its own formatter ignore; `hi update`
creates no formatter file.

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
owner and check kind. Renames affect both endpoints; deleted paths are never passed as files. In the
Commit Gate a deletion-only owner is covered without a check, while a rename out
of a scope still needs coverage. Shared settings, policy, routing, and
toolchain inputs trigger their dependent owners even outside owned source.
Existing Python tooling keeps its own routing while honoring shared exclusions.

## Type-aware backend: tsrs

Type-aware Oxlint rules run on tsrs, the Rust port of TypeScript, by default
(CLI 6.13.0 or later). Each Lint Route of a scope that selects
`effect-tsgo-recommended` carries `tool.typeAwareBackend: "tsrs"`, and the
runner starts `effect-tsgo --tsrs-lint oxlint ...`; other scopes keep their
route. The asset requires the `tsrs` devDependency, not `oxlint-tsgolint`, and
the scope's `@effect/tsgo` must be 0.67.0 or later. A missing or older
`@effect/tsgo` is a tool failure whose message names the fix. `hi update` never
raises a declared version, so an adopting project raises `@effect/tsgo`,
`oxlint` and `@oxlint/plugins` together to versions from the `@effect/tsgo`
README "Supported Package Versions" table.

To run them on tsgolint instead, set settings `lint.typeAwareBackend` to
`"tsgolint"`, keep `oxlint-tsgolint` as a project-owned devDependency in each
such scope, and run `hi update`:

```json
{ "lint": { "typeAwareBackend": "tsgolint" } }
```

Complete this when the routes in `selection.json` carry
`typeAwareBackend: "tsrs"`, managed lint on one of those scopes reports
`passed` or `findings`, not `failed`, and a probe file with a floating Promise
reports `typescript(no-floating-promises)`.

## Effect Language Service plugin

Each scope that gets the `effect-tsgo-recommended` devDependencies carries the
Effect Language Service plugin in its own `tsconfig.json` (CLI 6.14.0 or
later). `hi update` adds this entry to `compilerOptions.plugins` unless an
entry with that `name` is already in effect, its own or an `extends` base's:

```json
{ "name": "@effect/language-service", "ignoreEffectWarningsInTscExitCode": true }
```

It keeps other entries such as `{ "name": "next" }`, comments, and an existing
entry's options; it never creates a tsconfig. A tsconfig it cannot edit
(absent, symlinked, unparsable, or with an `extends` it cannot resolve) is a
`merge-reported` row: add the entry from the detail to the tsconfig that
scope's `check-types` uses. `hi diff` reports a missing entry as `missing`, and
`hi check --json` as `tsconfigPluginFindings`.

Type-check without `tsc` or tsgo. Each Effect scope's `check-types` is
`effect-tsgo tsrs --noEmit -p tsconfig.json`: `bun check` ignores tsconfig
`plugins` and reports no Effect diagnostic. Other scopes use `bun check
--no-script -p tsconfig.json` (Bun 1.4.4 or later; `--no-script` stops it
running a `check` script instead). CI runs the same `lint` and `check-types`
scripts.

Both gates report the same Effect rules. Managed lint (`maxWarnings: 0`) fails
on Effect warnings and errors; the type check prints every Effect diagnostic and
fails on type errors and Effect errors. Suppress an Effect rule in both gates
with `// @effect-diagnostics-next-line <rule>:off -- Effect edge: <reason>` (or
a file-level `@effect-diagnostics`); an `oxlint-disable` comment silences only
managed lint, so the type check still fails.

The editor needs the same entry and no `@effect/language-service` package:
`@effect/tsgo` reads the entry by name. Run `effect-tsgo tsc --lsp --stdio` as
the editor's TypeScript server, or `effect-tsgo patch` where `typescript` 7 or
`@typescript/native` is installed.

Complete this when each Effect scope's tsconfig has the entry in effect
(`hi diff` shows its tsconfig `current`), its `check-types` runs
`effect-tsgo tsrs --noEmit -p tsconfig.json`, and a probe file with a floating
Effect fails that type check with `TS377001`.

## Decline a Lint Asset

When a project owns a capability that a Pack's lint asset would also install,
decline that one asset instead of removing the Pack or reverting update output.
For example, a project that runs its own Effect diagnostics declines
`effect-tsgo-recommended`; to keep those rules on tsrs instead, follow
[Type-aware backend: tsrs](#type-aware-backend-tsrs). List its id in settings
`lint.disabledAssets`; the ids are the `lint-<id>` Registry Items named in
`.devpunks/installed.json` and `selection.json`:

```json
{ "lint": { "disabledAssets": ["effect-tsgo-recommended"] } }
```

`hi update` then installs nothing of that asset: no oxlint config extension,
rules, plugin files, tsconfig plugin entry, or required devDependency. It
leaves tsconfigs untouched, keeps an entry an earlier update wrote, and reports the
asset's previously installed paths as stale and keeps the project's own scripts
and dependencies. An id the Baseline no longer provides is ignored, and
`hi diff` reports it as information. Complete this when `selection.json` no
longer lists the asset and `hi check --json` reports no dependency finding for it.

A missing required devDependency is added with the range the repository root
`package.json` declares for it, and only otherwise with the Baseline seed. A
declared version always stays as it is.

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
| Asset conflicts with a project-owned toolchain | Name the asset id and the project's own route; propose `lint.disabledAssets` ([Decline a Lint Asset](#decline-a-lint-asset)) instead of reverting Built output. |
| Healthy routes | Report the observed health scope. A `current` `hi check` status alone does not prove lint health. |

`hi check` and `hi diff` stay read-only: report the smallest next action and affected paths.
Run mutations only within the user's authorization. Keep actual diagnostics and
execution context so the next agent can continue without guessing configs.

For a process failure, retain the original exit status, signal, and bounded stdout/stderr alongside the route context. A recognized empty-source JSON report is empty work; malformed output and config/tool failures require repair before dependent adoption.

In rootless repositories, assess lint-route health separately from outstanding prompt-authoring findings. A valid selected nested owner does not erase another incomplete adoption step.
