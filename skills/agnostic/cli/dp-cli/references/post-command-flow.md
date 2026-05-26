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
- Reconcile any scaffolded wiki root with the real repo layout before writing durable docs.
- Create sibling `CLAUDE.md` symlink mirrors for those neutral prompt files.
- Keep `.agents/AGENTS.md` as the shared global prompt source.
- Keep `.agents/skills/` as the main skill directory; only `.claude/skills` mirrors it.
- Reconcile `.agents/subagents/manifest.mjs` with both `.agents/subagents/manifest.prompt.md` and `.devpunks/specs/subagents/manifest-spec.json`.
- Use lint specs to produce or update the repo's real lint config when requested.
- Ask before replacing existing lint/format tooling with Oxlint/Oxfmt. If approved, update scripts, CI/task pipelines, hooks, and docs together.
- Ask which detected core libraries to inspect when source context is broad; then use `opensrc path <package>` or `opensrc path owner/repo` for only the chosen set.

Do not stop after saying the files exist.

After `dp scaffold init`:

- Run `requirements-grill` before `write-backlog`.
- Treat the seeded wiki root as provisional until it matches the repo layout.
- Use `dp scaffold setup` only after the repo is ready for repo-aware setup.

After `dp report`:

- Confirm the command created a GitHub issue URL before saying the report was submitted.
- Include the issue URL, labels, affected command, affected skill pack, and remaining blocker if creation failed.
- Do not duplicate project product backlog into Harness reports unless maintainers explicitly promote it.

After `dp upgrade`:

- Report whether the CLI upgraded, was already current, could not detect the install manager, or failed while running the package-manager command.
- Include the package manager and command used when available.
- If upgrade failed because registry lookup or install-manager detection failed, give the manual reinstall command for Bun, pnpm, npm, or Yarn rather than treating the repo as broken.

## Reporting

Final reports should say:

- what artifacts were consumed
- what final files were authored or reconciled
- report issue URL or upgrade command/result, when relevant
- what validation ran
- what remains unresolved, if anything
