---
name: dp-cli
description: Operates the DevPunks `dp` CLI and follows its scaffold, stage, update, and post-command handoff artifacts through to completion. Use when a repo contains `.devpunks/` output, when the user mentions `dp scaffold`, `dp update`, DevPunks CLI setup, or asks what to do after running a `dp` command.
metadata: {"devpunks":{"entrypoint":true}}
---

# DP CLI

The `dp` CLI scaffolds DevPunks agent assets and writes follow-up instructions for the next agent.

## Quick Start

```bash
dp scaffold setup
dp scaffold stage init
dp scaffold stage backlog
dp update --check
dp update --write
```

After any command, read the command output and generated artifacts before acting.

## Core Rule

`.devpunks/` is an active work queue.

Do not summarize the generated files and stop. Read the handoff, execute the specs, reconcile generated assets, and report only remaining unresolved items.

## Command Workflows

See [references/commands.md](references/commands.md) for command intent and when to use each command.

See [references/post-command-flow.md](references/post-command-flow.md) for the required agent flow after `dp scaffold` or `dp update`.

## Scaffold Setup

After `dp scaffold setup`, expect artifacts such as:

- `.devpunks/AGENT-SYSTEM-PROMPT.md`
- `.devpunks/AGENT-HANDOFF.md`
- `.devpunks/scaffold-manifest.json`
- `.devpunks/required-tools.json`
- `.devpunks/specs/prompts/**/*.md`
- `.devpunks/specs/lint/*`
- `.devpunks/specs/subagents/manifest-spec.json`

Read `.devpunks/AGENT-SYSTEM-PROMPT.md` first when present.

Then author or reconcile the final repo files requested by the specs, including prompt files, harness mirrors, lint configuration, and subagent manifests.

## Update

After `dp update`, inspect `.devpunks/scaffold-manifest.json` and the update summary.

- `--check` reports managed-file drift without writing.
- `--write` refreshes scaffold-managed assets.
- pack drift is a setup decision point, not a silent auto-fix.

## Completion Checklist

- `.devpunks/AGENT-SYSTEM-PROMPT.md` was followed or consciously superseded.
- `.devpunks/specs/**` items were implemented or listed as unresolved.
- required tools were checked when `.devpunks/required-tools.json` exists.
- final prompt files and harness mirrors match the handoff contract.
- subagent manifests were reconciled when specs exist.
