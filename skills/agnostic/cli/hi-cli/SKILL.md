---
name: hi-cli
description: Operates the Harness Intelligence CLI (`hi`, alias `hint`) through init, scaffold, drift, settings, update, tool, report, upgrade, operator-skill, and post-command flows. Use when a user runs or asks about `hi`, `hint`, or generated `.devpunks/` work.
metadata: {"Harness Intelligence":{"entrypoint":true}}
---

# hi-cli

Use `hi` for the Harness Intelligence CLI; `hint` is an alias. The npm package remains `@punks/cli`.

## Commands

```bash
hi --help
hi init
hi scaffold
hi check
hi ensure
hi update
hi tools ensure
hi report --help
hi upgrade --help
hi operator status
```

Read [references/commands.md](references/commands.md) when choosing or explaining a command.

## Workflow

1. Run the bounded command requested by the user.
2. Classify its result as init, scaffold, check, ensure, update, tools ensure, report, upgrade, or operator.
3. Follow only that branch in [references/post-command-flow.md](references/post-command-flow.md).
4. Stop when that branch's completion criterion is verified or its exact blocker is reported.

Existing `.devpunks/` artifacts do not create work by themselves. The current command result and changed paths control follow-through.

An assigned execution worker runs its bounded command and reports the result. It does not delegate again.
