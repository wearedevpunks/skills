# Explaining And Configuring Rules

Explain React Doctor rules and edit `doctor.config.*` safely. Use this when a user wants to understand a rule or change which rules run. Use the main `react-doctor` skill and `/doctor` workflow for fixing diagnostics.

Triggers: "why did this rule fire", "I disagree with this rule", "turn this rule off", "stop flagging X", "too noisy", "disable design rules".

## Workflow

1. Identify the rule key from the diagnostic, such as `react-doctor/no-array-index-as-key`.
2. Explain it before changing anything:

```bash
npx react-doctor@latest rules explain react-doctor/no-array-index-as-key
```

3. Pick the narrowest control that matches the user's intent.
4. Apply it with a `rules` subcommand. The command edits `doctor.config.*` or `package.json#reactDoctor` in place, preserving other fields and formatting.
5. Validate the change did what the user wanted:

```bash
npx react-doctor@latest --verbose --scope changed
```

## Commands

```bash
npx react-doctor@latest rules list
npx react-doctor@latest rules list --configured
npx react-doctor@latest rules list --category Performance
npx react-doctor@latest rules explain <rule>
npx react-doctor@latest rules disable <rule>
npx react-doctor@latest rules enable <rule>
npx react-doctor@latest rules set <rule> warn
npx react-doctor@latest rules category "React Native" off
npx react-doctor@latest rules ignore-tag design
npx react-doctor@latest rules unignore-tag design
```

Rule references accept the full key (`react-doctor/no-danger`), the bare id (`no-danger`), or a legacy key (`react/no-danger`).

## Decision Guide

Prefer the narrowest control:

- User disagrees with one rule or treats it as a false positive: `rules disable <rule>`.
- Rule is fine but wrong severity: `rules set <rule> warn` or `rules set <rule> error`.
- Disabled-by-default rule should run: `rules enable <rule>`.
- Whole area is unwanted: `rules category "<Category>" off`.
- Behavioral family is noisy: `rules ignore-tag <tag>`.
- Keep it locally but hide from PR comment, score, or CI gate only: do not disable. Edit `surfaces` in config, such as `surfaces.prComment.excludeRules`, `surfaces.score.excludeTags`, or `surfaces.ciFailure.excludeCategories`.

Layering: `ignore.tags` disables every rule carrying that tag before linting, so a tagged rule stays off even if `rules` or `categories` set it to `warn` or `error`. For rules that are not tag-disabled, `rules` overrides `categories`, and `categories` overrides the rule default. `surfaces` is visibility-only and never changes whether a rule runs.

## Config Shape

Config lives in `doctor.config.ts`, `.js`, `.mjs`, `.cjs`, `.json`, `.jsonc`, or the `reactDoctor` key in `package.json`. The `rules` commands edit whichever exists, and create `doctor.config.json` when none does.

```ts
// doctor.config.ts
export default {
  rules: { "react-doctor/no-array-index-as-key": "off" },
  categories: { "React Native": "warn" },
  ignore: { tags: ["design"] },
};
```

## Educating The User

When explaining a rule, lead with the "Why it matters" guidance from `rules explain` and, when the user wants depth, the per-rule recipe at `https://www.react.doctor/prompts/rules/<plugin>/<rule>.md`.

Only after the user understands it should you offer to disable it. Many noisy rules catch real issues.
