# Post-Command Flow

## Read Order

When `.devpunks/` exists, read in this order:

1. `.devpunks/AGENT-SYSTEM-PROMPT.md`
2. `.devpunks/AGENT-HANDOFF.md`
3. `.devpunks/scaffold-manifest.json`
4. `.devpunks/required-tools.json`
5. `.devpunks/specs/**`

If a file is missing, continue with the next available artifact and say what was missing.

## Artifact Meaning

- `.devpunks/AGENT-SYSTEM-PROMPT.md`: paste-ready instructions for the next agent.
- `.devpunks/AGENT-HANDOFF.md`: human-readable scaffold summary and required follow-up.
- `.devpunks/scaffold-manifest.json`: source of truth for managed files and update behavior.
- `.devpunks/required-tools.json`: tools implied by selected skills.
- `.devpunks/specs/prompts/**`: instructions for final prompt files, not final prompt bodies.
- `.devpunks/specs/lint/**`: lint asset selection and starter config guidance.
- `.devpunks/specs/subagents/**`: desired subagent manifest shape.

## Required Follow-Through

After `dp scaffold setup`:

- Generate final root/docs/workspace `AGENTS.md` files from prompt specs.
- Create sibling `CLAUDE.md` symlink mirrors for those neutral prompt files.
- Keep `.agents/AGENTS.md` as the shared global prompt source.
- Keep `.agents/skills/` as the main skill directory; only `.claude/skills` mirrors it.
- Reconcile `.agents/subagents/manifest.mjs` with both `.agents/subagents/manifest.prompt.md` and `.devpunks/specs/subagents/manifest-spec.json`.
- Use lint specs to produce or update the repo's real lint config when requested.
- Ask before replacing existing lint/format tooling with Oxlint/Oxfmt. If approved, update scripts, CI/task pipelines, hooks, and docs together.
- Ask which detected core libraries to inspect when source context is broad; then use `opensrc path <package>` or `opensrc path owner/repo` for only the chosen set.

Do not stop after saying the files exist.

## Reporting

Final reports should say:

- what artifacts were consumed
- what final files were authored or reconciled
- what validation ran
- what remains unresolved, if anything
