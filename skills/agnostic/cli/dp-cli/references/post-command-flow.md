# Post-Command Flow

## Read Order

When `.Devpunks/` exists, read in this order:

1. `.Devpunks/AGENT-SYSTEM-PROMPT.md`
2. `.Devpunks/AGENT-HANDOFF.md`
3. `.Devpunks/scaffold-manifest.json`
4. `.Devpunks/required-tools.json`
5. `.Devpunks/specs/**`

If a file is missing, continue with the next available artifact and say what was missing.

## Artifact Meaning

- `.Devpunks/AGENT-SYSTEM-PROMPT.md`: paste-ready instructions for the next agent.
- `.Devpunks/AGENT-HANDOFF.md`: human-readable scaffold summary and required follow-up.
- `.Devpunks/scaffold-manifest.json`: source of truth for managed files and update behavior.
- `.Devpunks/required-tools.json`: tools implied by selected skills.
- `.Devpunks/specs/prompts/**`: instructions for final prompt files, not final prompt bodies.
- `.Devpunks/specs/lint/**`: lint asset selection and starter config guidance.
- `.Devpunks/specs/subagents/**`: desired subagent manifest shape.

## Required Follow-Through

After `dp scaffold setup`:

- Generate final root/docs/workspace `AGENTS.md` files from prompt specs.
- Create sibling `CLAUDE.md` symlink mirrors for those neutral prompt files.
- Keep `.agents/AGENTS.md` as the shared global prompt source.
- Keep `.agents/skills/` as the main skill directory; only `.claude/skills` mirrors it.
- Reconcile `.agents/subagents/manifest.mjs` with both `.agents/subagents/manifest.prompt.md` and `.Devpunks/specs/subagents/manifest-spec.json`.
- Use lint specs to produce or update the repo's real lint config when requested.

Do not stop after saying the files exist.

## Reporting

Final reports should say:

- what artifacts were consumed
- what final files were authored or reconciled
- what validation ran
- what remains unresolved, if anything
