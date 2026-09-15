---
name: react-doctor
description: Use when finishing a feature, fixing a bug, before committing React code, or when the user types `/doctor`, asks to scan, triage, or clean up React diagnostics. Covers lint, accessibility, bundle size, architecture. Includes a regression check and a full local-triage workflow that fetches the canonical playbook.
version: "1.2.0"
---

# React Doctor

Scans React codebases for security, performance, correctness, and architecture issues. Outputs a 0-100 health score.

## After Making React Code Changes

Run `npx react-doctor@latest --verbose --scope changed` and check the score did not regress.

If the score dropped, fix the regressions before committing.

## General Cleanup Or Code Improvement

Run `npx react-doctor@latest --verbose` (the default `--scope full`) to scan the full codebase. Fix issues by severity: errors first, then warnings.

## `/doctor` Full Local Triage Workflow

When the user types `/doctor`, says "run react doctor", or asks for a full triage or cleanup pass, fetch the canonical local-triage playbook and follow every step in it:

```bash
curl --fail --silent --show-error \
  --header 'Cache-Control: no-cache' \
  https://www.react.doctor/prompts/react-doctor-agent.md
```

The playbook is the single source of truth: scan, filter, triage, fix, and validate. It edits the working tree directly. Never commit, push, or open PRs from this workflow unless the user explicitly asks.

Pair it with the matching per-rule prompts at `https://www.react.doctor/prompts/rules/<plugin>/<rule>.md`, fetched on demand inside the playbook, so each fix uses the canonical recipe.

## Configuring Or Explaining Rules

When the user wants to understand a rule, disagrees with one, or wants to disable or tune which rules run, read [references/explain.md](references/explain.md) and follow it.

Start with:

```bash
npx react-doctor@latest rules explain <rule>
```

Then apply the narrowest control via `npx react-doctor@latest rules disable|set|category|ignore-tag ...`, which edits `doctor.config.*` or `package.json#reactDoctor`.

## Command

```bash
npx react-doctor@latest --verbose --scope changed
```

| Flag | Purpose |
| --- | --- |
| `.` | Scan current directory |
| `--verbose` | Show affected files and line numbers per rule |
| `--scope changed` | Only report issues introduced vs the base branch |
| `--scope lines` | Only report issues on the changed lines |
| `--score` | Output only the numeric score |

## Sources

- React Doctor skill: https://github.com/millionco/react-doctor/tree/main/skills/react-doctor
- React Doctor playbook: https://www.react.doctor/prompts/react-doctor-agent.md
