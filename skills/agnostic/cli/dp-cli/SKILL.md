---
name: dp-cli
description: Operates the Devpunks `dp` CLI and follows its scaffold, stage, update, and post-command handoff artifacts through to completion. Use when a repo contains `.Devpunks/` output, when the user mentions `dp scaffold`, `dp update`, Devpunks CLI setup, or asks what to do after running a `dp` command.
metadata: {"Devpunks":{"entrypoint":true}}
---

# DP CLI

The `dp` CLI scaffolds Devpunks agent assets and writes follow-up instructions for the next agent.

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

`.Devpunks/` is an active work queue.

Do not summarize the generated files and stop. Read the handoff, execute the specs, reconcile generated assets, and report only remaining unresolved items.

## Command Workflows

See [references/commands.md](references/commands.md) for command intent and when to use each command.

See [references/post-command-flow.md](references/post-command-flow.md) for the required agent flow after `dp scaffold` or `dp update`.

## Scaffold Setup

After `dp scaffold setup`, expect artifacts such as:

- `.Devpunks/AGENT-SYSTEM-PROMPT.md`
- `.Devpunks/AGENT-HANDOFF.md`
- `.Devpunks/scaffold-manifest.json`
- `.Devpunks/required-tools.json`
- `.Devpunks/specs/prompts/**/*.md`
- `.Devpunks/specs/lint/*`
- `.Devpunks/specs/subagents/manifest-spec.json`

Read `.Devpunks/AGENT-SYSTEM-PROMPT.md` first when present.

Then author or reconcile the final repo files requested by the specs, including prompt files, harness mirrors, lint configuration, and subagent manifests.

## Update

After `dp update`, inspect `.Devpunks/scaffold-manifest.json` and the update summary.

- `--check` reports managed-file drift without writing.
- `--write` refreshes scaffold-managed assets.
- pack drift is a setup decision point, not a silent auto-fix.

## Completion Checklist

- `.Devpunks/AGENT-SYSTEM-PROMPT.md` was followed or consciously superseded.
- `.Devpunks/specs/**` items were implemented or listed as unresolved.
- required tools were checked when `.Devpunks/required-tools.json` exists.
- final prompt files and harness mirrors match the handoff contract.
- subagent manifests were reconciled when specs exist.
