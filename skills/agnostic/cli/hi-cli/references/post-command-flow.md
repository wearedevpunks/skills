# Post-Command Flow

## 1. Classify the Result

Capture the command, mode, summary, and paths changed by this run. Choose one branch: scaffold setup, scaffold init, update, report, or upgrade.

Existing `.devpunks/` artifacts describe project state. Their existence does not make them current work. Read an artifact only when the active branch or a changed category below points to it.

## 2. Read the Active Branch

### Scaffold Setup

Read available artifacts in this order:

1. `.devpunks/AGENT-SYSTEM-PROMPT.md`
2. `.devpunks/AGENT-HANDOFF.md`
3. `.devpunks/scaffold-manifest.json`
4. `.devpunks/required-tools.json`
5. `.devpunks/settings.json`
6. `.devpunks/specs/**`

If an expected artifact is missing, continue and report it.

Artifact meanings:

- `AGENT-SYSTEM-PROMPT.md`: next-agent instructions
- `AGENT-HANDOFF.md`: scaffold summary and follow-up
- `scaffold-manifest.json`: managed-file and update authority
- `required-tools.json`: tools implied by selected skills
- `settings.json`: accepted CLI and baseline pins
- `specs/prompts/**`: instructions for final prompts, not prompt bodies
- `specs/lint/**`: lint selection and starter guidance
- `specs/subagents/**`: desired subagent manifest shape

Then:

- author the requested root, docs, and workspace guidance plus sibling `CLAUDE.md` symlink mirrors
- keep `.agents/AGENTS.md` as shared global prompt source and `.agents/skills/` as the main skill directory; only `.claude/skills` mirrors it
- reconcile the seeded wiki with the real repo boundary before durable docs are written
- inspect pre-existing skill homes and `.devpunks/pre-existing-skills` when present; keep the HI baseline active for exact IDs, archive replaced evidence, preserve non-overlaps through mirrors, and use `hi report` for semantic overlap
- reconcile `.agents/subagents/manifest.mjs` with its prompt and generated spec
- implement applicable lint specs; ask before replacing lint or format policy, scripts, CI, hooks, or docs
- ask which detected core libraries matter when source context is broad, then inspect only that set

Do not stop because generated files exist. Finish applicable repo-authored outputs and validation.

### Scaffold Init

- inspect the generated requirements skills and seeded wiki root
- reconcile pre-existing skills with the same exact-ID policy as setup
- treat the wiki root as provisional and move or refactor it to match the repo
- do not start requirements discovery by default
- run `requirements-grill` before `write-backlog` only when the user asks for requirements or backlog generation
- use `hi scaffold setup` only when the repo is ready for repo-aware setup

### Update

Read the command summary before any generated artifact. If it reports no diff, report success and stop.

For a diff, classify only paths changed or flagged by this run. If the summary is insufficient, read the matching manifest entries. Read settings only for pin changes. Read a prompt, handoff, tool list, or spec only when its own category changed.

Apply every matching row:

| Changed category | Required follow-through |
| --- | --- |
| Settings or manifest pins only | Confirm accepted pins. The standard fresh drift gate below is the only follow-through. |
| Skill content; IDs unchanged | Inspect affected skills and active mirrors only. Preserve repo-owned edits. Do not scan every skill home or touch prompts, subagents, packs, or wiki. |
| Skill added, removed, or renamed | Reconcile affected IDs and their mirrors. Inspect overlap evidence only for those IDs. |
| `local-edited` conflict | Inspect the flagged path and its relevant snapshot/evidence. Preserve local intent; ask only when project and baseline intent conflict. |
| Missing or stale path | Confirm the named recreation or deletion and its direct references. Do not audit unrelated managed files. |
| Prompt spec or prompt input | Reconcile only affected prompt scopes and their mirrors. |
| Subagent contract input | Reconcile only the generated and final subagent manifests. Do not spawn agents merely to perform reconciliation. |
| Lint, hook, or script input | Validate the affected config or command. Ask before changing project policy. |
| Required tools | Check only added, changed, or failed tools. |
| Source-guide content | Inspect only affected guide files. Do not run `opensrc` unless the user's current task requires that library's source. |
| Wiki input | Reconcile affected routes or documents against the real repo boundary, then run route- or runtime-targeted validation. |
| Auto-accepted default or detected pack addition | Follow only the other changed categories caused by that addition. Do not ask or rerun setup. |
| Optional pack addition, pack removal, policy change, surface reshape, or explicit unresolved setup decision | Ask for the required decision. Run full setup follow-through only when the accepted decision requires repo-authored final outputs. |
| First adoption or missing/corrupt final output | Run the applicable scaffold setup follow-through. |

After write modes, run targeted validation for the affected category and one fresh `hi check --json` drift gate. Do not rerun `hi update` merely because an earlier command mentioned a possible version race. Rerun once only when `hi check --json` detects new CLI or baseline drift; then run the final `hi check --json` gate.

For `hi update --check`, report the classified preview without writing. A clean preview is complete.

### Report

Confirm that the command returned a GitHub issue URL before saying the report was submitted. Return the URL, labels, command, skill pack, and any blocker. Do not duplicate project backlog into Harness reports unless maintainers explicitly promote it.

### Upgrade

Report whether the CLI upgraded, was current, could not detect its install manager, or failed. Include the package manager and command when available. For registry or install-manager failure, give the matching manual reinstall command instead of treating the repo as broken.

## 3. Complete the Branch

- scaffold setup/init: applicable generated instructions are reconciled into final repo outputs; targeted validation ran; unresolved policy choices are named
- update: only changed categories were handled; the required drift gate is clean, or its remaining findings are reported
- report: a GitHub issue URL or exact submission blocker is returned
- upgrade: install manager, command, and outcome are returned

Report only artifacts consumed for the active branch, final files changed, validation run, and unresolved items.
