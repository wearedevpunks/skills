# Autoreview Reference

This skill vendors OpenClaw `agent-skills/skills/autoreview` as the Devpunks
structured review closeout workflow.

Upstream source:

- `https://github.com/openclaw/agent-skills/blob/main/skills/autoreview/SKILL.md`
- `https://github.com/openclaw/agent-skills/tree/main/skills/autoreview/scripts`

## Detailed Contract

- Treat review output as advisory. Never blindly apply it.
- Verify every finding by reading the real code path and adjacent files.
- Read dependency docs/source/types when the finding depends on external behavior.
- Reject unrealistic edge cases, speculative risks, broad rewrites, and fixes
  that over-complicate the codebase.
- Prefer small fixes at the right ownership boundary; no refactor unless it
  clearly improves the bug class.
- Keep going until structured review returns no accepted/actionable findings.
- If a review-triggered fix changes code, rerun focused tests and rerun the
  structured review helper.
- Never switch or override the requested review engine/model. If review hits
  model capacity, retry the same command a few times with the same engine/model.
- Treat heartbeat lines like
  `review still running: ... elapsed=... pid=...` as healthy progress.
- Do not kill a review just because it has been quiet for 2-5 minutes, or
  because it is still running under the 30-minute window.
- Tools are useful in review mode. The helper allows read-only inspection tools
  and web search by default where the selected CLI supports them.
- Security perspective is always included, but findings must be concrete and
  actionable.
- Keep regression provenance roles separate: blamed code author, blamed PR
  author, PR merger/committer, current PR author, and PR/date.
- Do not invoke built-in `codex review`, nested reviewers, or reviewer panels
  from inside the review.
- Stop as soon as the helper exits 0 with no accepted/actionable findings.
- Treat successful helper exit plus absence of actionable findings as the clean
  review result, even if the underlying CLI output is terse.
- Multi-reviewer panels are opt-in only.
- If rejecting a finding as intentional/not worth fixing, add an inline code
  comment only when it explains a real invariant future reviewers need.
- If `gh` or Gitcrawl reports cache corruption, run `gitcrawl doctor --json`
  once before retrying.

## Helper Commands

Open help:

```bash
.agents/skills/autoreview/scripts/autoreview --help
```

Run a branch review with the current PR base when available:

```bash
base=$(gh pr view --json baseRefName --jq .baseRefName)
.agents/skills/autoreview/scripts/autoreview --mode branch --base "origin/$base"
```

Run an opt-in panel:

```bash
.agents/skills/autoreview/scripts/autoreview --reviewers codex,claude
```

Set explicit reviewer models and thinking:

```bash
.agents/skills/autoreview/scripts/autoreview \
  --reviewers codex:gpt-5.1:high,claude:sonnet:max
```

## Helper Capabilities

- chooses dirty local changes first in auto mode
- otherwise uses current PR base if `gh pr view` works
- otherwise uses `origin/main` for non-main branches
- supports `--engine codex`, `claude`, `droid`, and `copilot`
- defaults to `AUTOREVIEW_ENGINE` or `codex`
- supports `--mode local`, `branch`, `commit`, and `auto`
- writes only to stdout unless `--output`, `--json-output`, or live streamed
  engine stderr is set
- supports `--dry-run`, `--parallel-tests`, `--prompt`, `--prompt-file`,
  `--dataset`, `--no-tools`, `--no-web-search`, and commit refs
- supports `--stream-engine-output` or `AUTOREVIEW_STREAM_ENGINE_OUTPUT=1`
- supports opt-in panels with `--panel` or `--reviewers`
- allows read-only tools and web search by default where the selected CLI
  supports them
- prints long-running heartbeat lines while waiting for the selected review
  engine
- prints `autoreview clean: no accepted/actionable findings reported` when the
  selected review command exits 0
- exits nonzero when accepted/actionable findings are present

## Calibration

Use the vendored harness only when changing the autoreview helper itself:

```bash
.agents/skills/autoreview/scripts/test-review-harness --fixture malicious --engine codex
.agents/skills/autoreview/scripts/test-review-harness --fixture benign --engine codex
```
