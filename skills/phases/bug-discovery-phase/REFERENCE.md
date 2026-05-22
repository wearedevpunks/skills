# Bug Discovery Phase Reference

## Preflight Record

Before running ClawPatch, write down the run contract in the conversation, goal
handoff, or local run notes:

```text
repo root: <absolute path>
scope: <whole repo | path | feature/project selector>
provider: <codex|acpx|grok|opencode|pi|mock|mock-fail>
model: <model name or unset>
limit: <number or unset>
jobs: <number or unset>
state dir: <repo>/.clawpatch/
report path: <repo>/.clawpatch/reports/<name>.md
dirty posture: include dirty changes? <yes|no>
output format: markdown file | markdown stdout | json stdout redirected to file
```

This record is part of the phase contract. Do it before launching any long AFK
review so the user can understand cost, scope, state, and replay boundaries.

## Provider Warnings

Warn, but do not block, when any of these are true:

- provider is `pi`
- provider is `acpx` and the model or ACP config resolves to Claude
- provider, model, config, or environment mentions `claude`, `anthropic`, or an
  Anthropic model family such as `claude-3`, `claude-3.5`, `claude-3-7`,
  `claude-sonnet`, `claude-opus`, or `claude-haiku`
- `ANTHROPIC_API_KEY` is set

Use wording like:

```text
Provider warning: this run appears to use Claude/Anthropic or another metered
route. That is allowed, but confirm the provider/model/cost boundary before
leaving it AFK. I will make the provider explicit in every generated command.
```

Do not imply Anthropic routes are banned. The operator chooses the route.

## Command Rules

Use explicit provider flags in generated ClawPatch commands. Add `--model` when
the model is known. Keep `--root`, `--state-dir`, `--limit`, `--jobs`, and
`--output` visible when they matter.

Prefer repo-local state:

```sh
clawpatch doctor --root "$REPO" --state-dir "$REPO/.clawpatch" --provider "$PROVIDER" --model "$MODEL"
clawpatch status --root "$REPO" --state-dir "$REPO/.clawpatch" --plain
clawpatch init --root "$REPO" --state-dir "$REPO/.clawpatch"
clawpatch map --root "$REPO" --state-dir "$REPO/.clawpatch" --provider "$PROVIDER" --model "$MODEL"
```

For discovery, use `review` for normal AFK review and `ci` when the user wants
CI-shaped discovery:

```sh
clawpatch review --root "$REPO" --state-dir "$REPO/.clawpatch" --provider "$PROVIDER" --model "$MODEL" --limit "$LIMIT" --jobs "$JOBS"
clawpatch ci --root "$REPO" --state-dir "$REPO/.clawpatch" --provider "$PROVIDER" --model "$MODEL" --limit "$LIMIT" --jobs "$JOBS" --output "$REPORT"
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
clawpatch revalidate --root "$REPO" --state-dir "$REPO/.clawpatch" --provider "$PROVIDER" --model "$MODEL" --finding "$FINDING_ID" --plain
```

Discovery classification should reflect what was learned from static review:
branch relevance, runtime-debugging need, false-positive candidacy, resolution
candidacy, deferral, or blockers. Use ClawPatch statuses only where they match
the tool's supported values. Do not claim runtime truth from ClawPatch alone.

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
- provider, model, scope, `--limit`, `--jobs`, report path, and dirty posture
- command list and whether each command completed
- relevant finding IDs, status, severity if available, and why they matter
- explicit statement: ClawPatch findings are static-review candidates, not
  proven runtime root causes
- next recommended phase for each important finding:
  `$bug-resolution-phase`, `$debugging-phase`, `$docs-ingest-phase`, or none

Keep the summary concise. Preserve report and state paths so later resolution
goals can resume from the durable ClawPatch ledger.
