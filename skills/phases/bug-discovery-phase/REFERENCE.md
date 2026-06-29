# Bug Discovery Phase Reference

## Scope Policy

Default to the smallest certain target:

- open PR changes
- highlighted diff
- supplied code portions
- named files, paths, packages, apps, domains, or features

Use a full-codebase scan only when no PR is open and no certain domain, portion,
or path is provided, or when the user explicitly asks for full-codebase
discovery.

Pass the bounded scope into every ClawPatch command or reviewer prompt that
accepts path, diff, file, feature, package, or scope guidance. Do not let
ClawPatch default to repo-wide review when a bounded target exists.

## Preflight Record

Before running ClawPatch, write down the run contract in the conversation, goal
handoff, or local run notes:

```text
repo root: <absolute path>
scope: <whole repo | path | feature/project selector>
provider: <automatic current agent/launcher default | explicit override>
model: <automatic default | explicit override | unset>
limit: <number or unset>
jobs: <number or unset>
state dir: <repo>/.clawpatch/
report path: <repo>/.clawpatch/reports/<name>.md
dirty posture: include dirty changes? <yes|no>
output format: markdown file | markdown stdout | json stdout redirected to file
```

This record is part of the phase contract. Do it before launching any long AFK
review so the user can understand scope, provider inheritance or override,
state, and replay boundaries.

## Provider Defaults And Overrides

Default to the current agent or launcher provider. Do not ask the user to choose
a ClawPatch provider/model before discovery just to make the route explicit.
Codex should launch the Codex-backed default, Claude should launch the
Claude-backed default, and other launchers should inherit their configured
default.

Record provider/model as:

- `automatic current agent/launcher default` when no override was selected
- `explicit override: <provider>` and, when selected, `<model>` when the user
  chose a ClawPatch route

Only add `--provider` or `--model` in generated commands when the user selected
an override. Do not add duplicated no-op notes about provider pricing.

## Command Rules

Let generated ClawPatch commands inherit the current agent/launcher provider by
default. Keep `--root`, `--state-dir`, `--limit`, `--jobs`, and `--output`
visible when they matter.

Prefer repo-local state:

```sh
clawpatch doctor --root "$REPO" --state-dir "$REPO/.clawpatch"
clawpatch status --root "$REPO" --state-dir "$REPO/.clawpatch" --plain
clawpatch init --root "$REPO" --state-dir "$REPO/.clawpatch"
clawpatch map --root "$REPO" --state-dir "$REPO/.clawpatch"
```

For discovery, use `review` for normal AFK review and `ci` when the user wants
CI-shaped discovery:

```sh
clawpatch review --root "$REPO" --state-dir "$REPO/.clawpatch" --limit "$LIMIT" --jobs "$JOBS"
clawpatch ci --root "$REPO" --state-dir "$REPO/.clawpatch" --limit "$LIMIT" --jobs "$JOBS" --output "$REPORT"
```

When the user explicitly selects a ClawPatch provider/model override, add only
the selected flags:

```sh
clawpatch review --root "$REPO" --state-dir "$REPO/.clawpatch" --provider "$PROVIDER" --limit "$LIMIT" --jobs "$JOBS"
clawpatch review --root "$REPO" --state-dir "$REPO/.clawpatch" --provider "$PROVIDER" --model "$MODEL" --limit "$LIMIT" --jobs "$JOBS"
```

Use `--include-dirty` only when the user wants current uncommitted work included
in discovery. If omitted, say dirty work was excluded or left to ClawPatch
defaults.

For report and ledger inspection, use `clawpatch report` after `review` or `ci`
has produced finding state. It renders the current findings ledger. With
`--output <path>` it writes Markdown to that path. With global `--json` it
emits machine-readable JSON to stdout; do not pair `--json` with `--output
<json-file>` expecting JSON to be written there, because `--output` is the
Markdown report file.

```sh
# Write a durable Markdown report and print a short completion summary.
clawpatch report --root "$REPO" --state-dir "$REPO/.clawpatch" --output "$REPORT" --plain

# Emit the Markdown report to stdout when no file is needed.
clawpatch report --root "$REPO" --state-dir "$REPO/.clawpatch"

# Save machine-readable JSON by redirecting stdout.
clawpatch report --root "$REPO" --state-dir "$REPO/.clawpatch" --json > "$REPORT_JSON"

# Narrow the report when triaging a queue.
clawpatch report --root "$REPO" --state-dir "$REPO/.clawpatch" --status open --severity high --plain

clawpatch next --root "$REPO" --state-dir "$REPO/.clawpatch" --plain
clawpatch show --root "$REPO" --state-dir "$REPO/.clawpatch" --finding "$FINDING_ID" --plain
clawpatch status --root "$REPO" --state-dir "$REPO/.clawpatch" --plain
```

Triage commands are allowed for discovery classification when no source mutation
is performed:

```sh
clawpatch triage --root "$REPO" --state-dir "$REPO/.clawpatch" --finding "$FINDING_ID" --status "$STATUS"
clawpatch revalidate --root "$REPO" --state-dir "$REPO/.clawpatch" --finding "$FINDING_ID" --plain
```

Discovery classification should reflect what was learned from static review:
branch relevance, runtime-debugging need, false-positive candidacy, resolution
candidacy, deferral, or blockers. Use ClawPatch statuses only where they match
the tool's supported values. Do not claim runtime truth from ClawPatch alone.

## Scoring And Routing

Before recommending the next action, rank every important finding with a `0-10`
score, higher first. Use the score to explain priority, not to imply runtime
proof.

Include this rationale for each scored finding:

- severity and confidence from ClawPatch, if available
- whether `clawpatch next` selected or deprioritized it
- branch relevance to the current checkout, diff, release, PR, or user goal
- evidence freshness: current report, stale ledger, revalidated, or user-provided
- current user pain: active runtime symptom, broken workflow, CI failure, or none
- evidence type: static-only, runtime-suspected, or runtime-proven by external
  evidence
- recommended route: `$bug-resolution-phase`, `$debugging-phase`, docs/debt
  handling, false-positive triage/revalidation, or stop

Suggested policy:

- `8-10`: branch-relevant, high severity/confidence, fresh evidence, or matches
  current user pain. Route to `$bug-resolution-phase` if the fix target is clear;
  route to `$debugging-phase` if runtime proof is missing but needed.
- `5-7`: plausible and relevant, but confidence, freshness, or impact is mixed.
  Inspect more, revalidate, or defer to docs/debt handling when it is not a bug
  to fix now.
- `0-4`: stale, low-confidence, not branch-relevant, duplicate, or likely false
  positive. Triage/revalidate if useful; otherwise stop.

## No-Mutation Boundary

Never run these by default in `bug-discovery-phase`:

```sh
clawpatch fix --finding "$FINDING_ID"
clawpatch open-pr --patch "$PATCH_ATTEMPT_ID"
```

If the user asks for fixing, stop discovery and enter `$bug-resolution-phase`.
If a finding needs runtime reproduction, enter `$debugging-phase`. If a selected
finding becomes tech debt, route repo docs through `$docs-ingest-phase`; broad
discovery itself does not create tech-debt docs.

## Output Checklist

The final report must include:

- report path, usually `.clawpatch/reports/<run>.md`; if JSON was requested,
  include the redirected JSON artifact path separately
- durable ledger/state path, usually `.clawpatch/`
- provider/model default or explicit override, scope, `--limit`, `--jobs`,
  report path, and dirty posture
- command list and whether each command completed
- relevant finding IDs, status, severity if available, and why they matter
- score/rationale for each important finding before the recommended next action
- explicit statement: ClawPatch findings are static-review candidates, not
  proven runtime root causes
- next recommended phase for each important finding:
  `$bug-resolution-phase`, `$debugging-phase`, `$docs-ingest-phase`, or none

Keep the summary concise. Preserve report and state paths so later resolution
goals can resume from the durable ClawPatch ledger.
