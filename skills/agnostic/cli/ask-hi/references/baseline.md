# HI Baseline mechanics

How the installed Baseline works inside this repository: what `hi` writes, where it lands, who owns each file. For command flags, report rows and post-command follow-through, activate `$hi-cli`.

## Registry and Baseline

- **Registry**: the public, static source of every Baseline (`https://api.harness-intelligence.devpunks.com/r`). `HI_REGISTRY_URL` or settings `registry` (https only) overrides it. The CLI sends no credential, and the npm package ships no Baseline, so `hi init` and `hi update` need network.
- **Baseline**: one immutable Registry version `YYYY.MM.DD-<short sha>`. A correction ships as a new Baseline.
- **Latest only**: the root catalog's `latest` pointer is the single channel. `hi update` always installs `latest`; it takes no version pin. A "stable" channel belongs to CLI 4/5 history.
- **Compatibility range**: each Baseline catalog carries `cliVersionRange` (for example `>=6.1.0 <7.0.0`). When the running CLI is outside it, `hi init` and `hi update` refuse (`CliOutsideRange`) before any write; `hi check` reports `cliCompatible: false`. The fix is `hi upgrade`, then rerun.
- **Registry Item**: one named bundle (`pack-<id>`, `skill-<id>`, `lint-<asset>`, `source-guide-<id>`, `hooks`, `subagents`, `tools`, ...). A Pack selects Registry Items.

**Source:** `.devpunks/installed.json` (`baseline`, `items`); `$hi-cli` `references/commands.md`

## Lifecycle commands

| Command | Reads | Writes |
| --- | --- | --- |
| `hi init` | repository (detection), git remote, catalog | `.devpunks/settings.json`, then the full `hi update` pipeline |
| `hi update` | settings, Recorded Shape, latest Baseline | every Managed Artifact, then `.devpunks/installed.json` last; runs managed lint |
| `hi diff` | local bytes, installed and latest Baseline | nothing (three-way Drift Check) |
| `hi check` | root catalog, `installed.json`, settings | nothing (version, CLI range, missing tools) |

- `hi init` detects once, proposes Packs and Software Scopes, confirms, and writes settings only after every merge target validates. A re-run pre-fills from settings; it is the way to reconfigure.
- `hi update` is idempotent: an interrupted run converges on re-run. It never writes settings.
- `hi check` is cheap and drift-blind: `unavailable` means drift is unknown.

**Source:** `$hi-cli`

## Artifact kinds and state files

A **Managed Artifact** is any path `installed.json` records. Its kind decides what `hi update` does with it:

| Kind | On `hi update` | Owner |
| --- | --- | --- |
| Copied | written verbatim; a local edit is kept (`kept`, or `partial` when upstream also changed) until `--yes` overwrites it | Baseline |
| Built | re-rendered from template + settings + Recorded Shape | Baseline; change its inputs |
| Authored | written once when absent; never compared or overwritten, even with `--yes` | project |
| symlink | created or repaired; a failure lands in `failedLinks`, with no copy fallback | Baseline |
| merge | HI entries merged into a repo-owned JSON/YAML file; other keys kept | project, outside HI entries |

- **Authored examples**: root `AGENTS.md` starter, `.agents/subagents/manifest.mjs`, `.codex/config.toml`, `<scope>/oxlint.local.ts`.
- **Project settings** `.devpunks/settings.json`: intent. `packs`, `lint.scopes`/`lint.exclude`, `requiredTools`, providers, `commitGate`, optional `registry`, `typescript.compilerProjects`. Writers: a human, `hi init`, or the agent on request.
- **Installed Record** `.devpunks/installed.json`: fact, written only by the installer, last. Holds `baseline`, `shape`, `items`, `paths` (path -> `{artifact, item}`), installer-added `dependencies`, `failedLinks`. It holds no content hashes.
- **Recorded Shape** (`shape`): workspaces with languages and technologies, Pack ids, `monorepo`, `wikiRoot`, `docsRoot`. Built Artifacts render from it.
- **Drift**: local bytes differ from what the Baseline expects. A local edit is a byte difference after normalizing line endings and trailing whitespace. `hi diff` classes: `update-available`, `local-edit`, `conflict`, `shape-drift`, `missing`, `stale`, `link-failed`. Authored files and detected-but-unselected Packs are information rows.
- **Survives an update**: every path `installed.json` omits. That covers Authored files, Project Skills (`.agents/skills/<id>` with no Registry Item), `.agents/rules/**`, and extra files inside a Registry skill directory, such as the Project Verifier in `.agents/skills/verify-behavior/references/`. `hi update` overwrites or prunes recorded paths only.
- **Project Skill collision**: when a later Baseline ships the same id, the Baseline skill takes the id and the Project Skill moves to `.agents/skills/[DEPRECATED] <id>`.

To change a Copied or Built file, change its source: settings, an Authored input, or the shared skill upstream, then `hi update`.

**Source:** `.devpunks/installed.json`; `.devpunks/settings.json`; `.devpunks/AGENT-HANDOFF.md`

## Packs

- **Selection**: settings `packs` (ids without `pack-`) is the only record of intent. `installed.json` `shape.packs` mirrors it at install time.
- **pack-core**: always installed, never listed. It carries the shared prompt, prompt specs, handoff, subagents, harness links, hooks, managed lint, Commit Gate, source guide index and required tools.
- **default**: preselected by `hi init`; deselectable in the prompt or by editing `packs`.
- **detected**: proposed when a manifest lists a trigger package. A trailing `/` is a prefix match (`@effect/` matches `@effect/platform`).
- **surface**: proposed from repository signals: technologies, or `api`/`backend`/`server`/`service(s)` path or package-name segments for backend; Next.js or React for frontend.
- **language**: proposed from detected Python or TypeScript.
- **Detection proposes; settings select.** Wiki roots, harness dirs and git-ignored paths never drive detection. To add or drop a Pack, rerun `hi init` or edit `packs`, then `hi update`.

| Pack | Category | Trigger | Members |
| --- | --- | --- | --- |
| debug | default | - | debugging-phase, bug-discovery-phase, bug-resolution-phase, debug-agent |
| docs | default | - | docs-ingest-phase, docs-onboarding, writing-fragments, writing-beats, writing-shape, writing-for-agents, write-graph-based-skills, rule-authoring |
| misc | default | - | show-me, wait-what |
| planning | default | - | business-finder, finder-phase, functional-finder, wayfinder, prototype-phase, delivery-phase, goalify, grilling, handoff, create-architecture, create-spec, create-plan, implement-spec, repo-asset-management, resolve-debt-phase, review-phase, review, autoreview |
| quality | default | - | tdd, make-tsuite, codebase-design, simplify; lint vitest-core |
| research | default | - | parallel-research, prototype, improve-codebase-architecture |
| requirements | default | - | requirements-phase, requirements-grill, brainstorm, flow-lenses, domain-modeling, repo-asset-management, write-backlog |
| security | default | - | architect-pipeline, audit-cicd-security, security-best-practices |
| subagents | default | - | swarm-planner |
| verification | default | - | create-verification-skill, update-verification-skill, verify-behavior |
| backend | surface | signals above | backend-domain-structure, backend-recoverable-actions, logging-best-practices |
| frontend | surface | nextjs/react | agent-browser, animate, brandkit, break-ui, design-phase, design-taste-frontend, emil-design-eng, find-animation-opportunities, full-output-enforcement, image-to-code, imagegen-frontend-mobile, imagegen-frontend-web, frontend-domain-structure, mobile-native, prototype-variants, redesign-existing-projects, review-animations, shadcn |
| better-auth | detected | better-auth | better-auth-best-practices |
| drizzle | detected | drizzle-kit, drizzle-orm | source guide only |
| effect | detected | effect, @effect/ | effect, effect-backend-structure, effect-recoverable-actions, effect-service-design; lint effect-no-barrel-imports, effect-tsgo-recommended |
| elysia | detected | elysia | elysiajs |
| expo | detected | expo, @expo/ | 20 Expo skills (expo-*, eas-*, building-native-ui, ...) |
| nextjs | detected | next | next-best-practices, next-cache-components; lint next-core |
| pulumi | detected | @pulumi/ | pulumi-* skills, provider-upgrade, package-usage |
| react | detected | react, react-dom | async-react-patterns, react-doctor, vercel-composition-patterns, vercel-react-best-practices; lint react-core, react-you-might-not-need-an-effect |
| sqlalchemy | detected | sqlalchemy, alembic | sqlalchemy-schema-design |
| tanstack-query | detected | @tanstack/react-query | tanstack-query; lint tanstack-query-core |
| trpc | detected | @trpc/ | source guide only |
| turborepo | detected | turbo | turborepo |
| python | language | Python files | async-python-patterns, backend-domain-structure, python-backend-structure, python-code-style, python-design-patterns, python-testing-patterns |
| typescript | language | typescript | quality-types; lint typescript-anti-slop; `typegraph-runtime` |

Source guides (`opensrc/<lib>.md`) ride with their Pack; `opensrc/README.md` indexes them.

**Source:** `.devpunks/settings.json` (`packs`); `.devpunks/installed.json` (`items`)

## Skills

- **Install path**: every skill file is Copied to `.agents/skills/<id>/`. Read skills there, whatever the harness.
- **Harness reach**: `.claude/skills -> ../.agents/skills` is the only skill symlink. Codex, Cursor and OpenCode read `.agents/skills` natively. Codex subagents also list skills as `[[skills.config]] path = "../../.agents/skills/<id>"`.
- **Invocation flags**: shipped inside each skill and Copied verbatim; the CLI never reads them. Claude reads SKILL.md front matter `disable-model-invocation: true`; Codex reads `agents/openai.yaml` `policy.allow_implicit_invocation: false`. The two lists differ per skill (for example `verify-behavior` is explicit-only on Codex alone), so check each file. See ask-hi Vocabulary for Explicit-only and Model-invoked.
- **Changes**: reusable skill text changes upstream in the shared skills repository and arrives with a new Baseline. Project-specific knowledge belongs in a Project Skill or project guidance.

**Source:** `.agents/skills/<id>/SKILL.md`; `.agents/skills/<id>/agents/openai.yaml`

## Harness Adapters and subagents

- **Harness Adapters**: fixed set Claude, Codex, Cursor, OpenCode; all four always render.
- **Input**: Authored `.agents/subagents/manifest.mjs`, exporting `agents` and `capabilityPacks`. The CLI loads it from a `data:` URL, so it stays self-contained (no relative imports). Agent fields: `name`, `description`, `ownedPaths`, `guidanceFiles`, `activationInstructions`, `boundaries`, `packs`, `skills`.
- **Skills per agent**: `skills` when present; otherwise the union of its `packs` from `capabilityPacks`. `skills` replaces pack skills.
- **Body**: ownership, capability packs, boundaries, activation, execution expectations, then each `guidanceFiles` file inlined. A missing guidance file renders a placeholder asking for the scoped `AGENTS.md`.
- **Built mirrors**: `.claude/agents/<n>.md` (with `skills:`), `.codex/agents/<n>.toml` (with `[[skills.config]]`), `.cursor/agents/<n>.md`, `.opencode/agents/<n>.md`. Each carries a "Generated by hi" marker.
- **Edit flow**: edit `manifest.mjs` following the Built guide `.agents/subagents/manifest.prompt.md`, then `hi update`. Until then `hi diff` reports the mirrors `stale`. Only `hi update` rebuilds them.
- **Codex depth**: Authored `.codex/config.toml` sets `[agents] max_depth = 1`.

**Source:** `.agents/subagents/manifest.mjs`; `.agents/subagents/manifest.prompt.md`

## Prompt surfaces

| File | Kind | Role |
| --- | --- | --- |
| `.agents/AGENTS.md` | Copied | shared house rules; final as shipped |
| `.devpunks/specs/prompts/shared-agents.md` | Built | structure reference for the shared prompt |
| `.devpunks/specs/prompts/root.md` | Built | spec for root `AGENTS.md` |
| `.devpunks/specs/prompts/<ws>/prompt.md` | Built | spec for `<ws>/AGENTS.md`, one per non-root workspace |
| `.devpunks/specs/prompts/docs.md` | Built | spec for `docs/AGENTS.md`; only with the docs Pack and a non-ignored `docs/` |
| root `AGENTS.md` | Authored | starter, written once; the agent refines it |
| `CLAUDE.md` (root and scoped) | symlink | mirror of the sibling `AGENTS.md` |
| `.claude/CLAUDE.md`, `.codex/AGENTS.md`, `.opencode/AGENTS.md` | symlink | point to `.agents/AGENTS.md`; Cursor reads `AGENTS.md` natively |
| `.devpunks/AGENT-HANDOFF.md`, `.devpunks/AGENT-SYSTEM-PROMPT.md` | Built | post-command handoff and the prompt for the next agent |

- **Ownership**: hi writes only the root `AGENTS.md` starter and the harness links. The agent writes every scoped `AGENTS.md` and its `CLAUDE.md` symlink from the matching spec; hi never compares them.
- **Specs are instructions**: they re-render when Packs or workspaces change. After `hi update` writes a spec, reconcile the affected `AGENTS.md`.
- **Spec skill rows**: root lists every installed Pack plus phase entrypoints in routing order; scoped specs drop `*-phase`, `business-finder` and `functional-finder`, and link `opensrc/README.md`.
- **AGENT-HANDOFF**: artifact-kind rules, installed Packs and skills, Software Scopes, Recorded Shape, spec-to-target table, ordered next steps. Done when `hi diff` shows no `local-edit`, `conflict` or `missing`.
- **Post-command handoff**: before writing prompts, scoped guidance or rules, activate `$writing-for-agents`, then `$rule-authoring`. `rule-authoring` runs only from the `hi init`/`hi update` handoffs.

**Source:** `.devpunks/specs/prompts/`; `.devpunks/AGENT-HANDOFF.md`; `$hi-cli` `references/post-command-flow.md`

## Codebase Rule Registry

- **Location**: `.agents/rules/index.md`, a table `id | scope | path trigger | task trigger | tags | file`, one rule file per stable invariant. Project-owned: no Registry Item writes it and hi never reads it.
- **Rule file**: `id`, authority, one positive requirement, triggers, verification, exceptions.
- **Activation**: agent-side, before editing or reviewing. Match each touched path to `path trigger` and the task to `task trigger`; tags only group.
- **Evidence**: record each active rule as `pass`, `fail` or `not-applicable` with current evidence in the handoff or work log.
- **Pointers**: each scoped `AGENTS.md` holds one pointer to `.agents/rules/index.md`; rule detail lives in rule files.
- **Maintenance**: through `$rule-authoring` after `hi init`/`hi update`, backed by code evidence or an accepted architecture decision.

**Source:** `.agents/rules/index.md`; `$rule-authoring`

## Hooks, managed lint and tool runtimes

- **Session hook** `scaffold-update-check.mjs`: runs `hi check --json` at session start and prints "Run hi update." on `update-available`. It checks version only, never drift.
- **Edit hook** `format-edited-file.mjs`: runs after each edit and formats/lints the edited file (Oxfmt and the scope's lint route; Ruff via `uv` for `.py`). It skips every Copied/Built path in `installed.json`, and a missing record means it manages nothing. The edit always lands; lint findings return as feedback (on Codex as a repair request, until three unchanged attempts).
- **Hook layout**: Copied to `.agents/hooks/`, symlinked into `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.opencode/plugins/`. Registered by merge into `.claude/settings.json` and `.cursor/hooks.json`, and in Authored `.codex/config.toml`; OpenCode auto-loads plugins.
- **Git hooks (Commit Gate)**: Copied `.agents/scripts/commit-gate-runner.mjs`, Built `.devpunks/commit-gate-contracts.json` (one contract per Software Scope), one HI `pre-commit` entry merged into `lefthook.yml`, `lefthook` devDependency. Run `lefthook install` once, then `hi commit-gate verify`. Settings `commitGate: disabled` turns it off; CI stays merge authority.
- **Managed lint**: Copied runners `.agents/scripts/managed-lint*.mjs`; Built `<scope>/oxlint.config.ts` per `lint.scopes` entry; Authored `<scope>/oxlint.local.ts` for project rules (applied last); Copied lint assets under `.devpunks/specs/lint/assets/`; merged `scripts.lint`. Tool versions are seeded once, then project-owned. For adoption and findings, see `$hi-cli` `references/managed-lint.md`.
- **Required tools**: settings `requiredTools` (Baseline: agent-browser, opensrc, portless, skills; plus skill `requiresTools`). `hi check` lists `missingTools`; `hi tools ensure` installs them.
- **Tool Runtime `typegraph-runtime`**: typescript Pack only. `hi update` installs a pinned `typegraph-mcp` under `~/.local/share/hi-tools/`, probes Compiler Projects, and writes `[mcp_servers.typegraph_<project>]` inside the fenced `# BEGIN hi typegraph` block of `.codex/config.toml`. Codex gets semantic reads (`ts_find_symbol`, `ts_definition`, `ts_references`, `ts_type_info`, `ts_module_exports`); start a new session after tsconfig, dependency or branch changes. Typecheck and lint stay the gates.

**Source:** `.agents/hooks/`; `lefthook.yml`; `.devpunks/specs/lint/`; `.codex/config.toml`; `.devpunks/AGENT-HANDOFF.md`

## Verification

- **Project Verifier**: project-owned executable knowledge in `.agents/skills/verify-behavior/references/` (index `README.md`, then app, feature, journey and helper references). The Installed Record omits it, so `hi update` keeps it byte-for-byte.
- **`verify-behavior`**: single entrypoint; mode `verify` from `implement-spec`, mode `reproduce` from `debugging-phase`.
- **App references**: `create-verification-skill` adds one for an Uncovered Surface; `update-verification-skill` repairs an Uncovered Behavior. `hi init`/`hi update` flows invoke neither.

**Source:** `$verify-behavior`; `$create-verification-skill`; `$update-verification-skill`

## Telemetry and control plane

- **Separation**: `hi init`, `update`, `diff` and `check` talk only to the static Registry, credential-free.
- **Reports**: `hi report` submits reusable Harness friction to the control plane, which may open a `harness-report` GitHub issue. Use it for shared skill, tooling or workflow friction; project work goes to the project backlog.
- **Telemetry**: the only event is `cli.harness.report.submitted`, sent after a report (CLI version, event id, time, redacted git remote, source). It is best-effort and never blocks.

**Source:** `$hi-cli` (`hi report`)
