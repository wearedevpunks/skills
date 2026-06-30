# Post-Command Flow

## Read Order

When `.devpunks/` exists, read in this order:

1. `.devpunks/AGENT-SYSTEM-PROMPT.md`
2. `.devpunks/AGENT-HANDOFF.md`
3. `.devpunks/scaffold-manifest.json`
4. `.devpunks/required-tools.json`
5. `.devpunks/settings.json`
6. `.devpunks/specs/**`

If a file is missing, continue with the next available artifact and say what was missing.

## Artifact Meaning

- `.devpunks/AGENT-SYSTEM-PROMPT.md`: paste-ready instructions for the next agent.
- `.devpunks/AGENT-HANDOFF.md`: human-readable scaffold summary and required follow-up.
- `.devpunks/scaffold-manifest.json`: source of truth for managed files and update behavior.
- `.devpunks/required-tools.json`: tools implied by selected skills.
- `.devpunks/specs/prompts/**`: instructions for final prompt files, not final prompt bodies.
- `.devpunks/specs/lint/**`: lint asset selection and starter config guidance.
- `.devpunks/specs/subagents/**`: desired subagent manifest shape.

- `.devpunks/settings.json`: project-local `cliVersion` and `baselineVersion` pins from last accepted scaffold-writing command.

## Required Follow-Through

After `dp scaffold setup`:

- Generate final root/docs/workspace `AGENTS.md` files from prompt specs.
- Reconcile any scaffolded wiki root with the real repo layout before writing durable docs.
- Reconcile pre-existing skills yourself; commands do not detect overlap. Inspect `.agents/skills`, `.claude/skills`, `.codex/skills`, `.cursor/skills`, and `.opencode/skills`.
- Exact canonical directory id/name overlap keeps the HI baseline skill active. Archive local evidence under `.devpunks/replaced-skills/<skill-id>/...`, then remove active local copies or mirrors.
- Preserve non-overlapping local skills and expose them through harness mirrors or symlinks. Use `dp report` when archived local knowledge should be proposed for HI baseline integration; semantic overlap belongs there.
- Create sibling `CLAUDE.md` symlink mirrors for those neutral prompt files.
- Keep `.agents/AGENTS.md` as the shared global prompt source.
- Keep `.agents/skills/` as the main skill directory; only `.claude/skills` mirrors it.
- Reconcile `.agents/subagents/manifest.mjs` with both `.agents/subagents/manifest.prompt.md` and `.devpunks/specs/subagents/manifest-spec.json`.
- Use lint specs to produce or update the repo's real lint config when requested.
- Ask before replacing existing lint/format tooling with Oxlint/Oxfmt. If approved, update scripts, CI/task pipelines, hooks, and docs together.
- Ask which detected core libraries to inspect when source context is broad; then use `opensrc path <package>` or `opensrc path owner/repo` for only the chosen set.

Do not stop after saying the files exist.

After `dp update --check` or `dp update`:

- Inspect `.devpunks/scaffold-manifest.json` and `.devpunks/settings.json`.
- For write modes, confirm `cliVersion` and `baselineVersion` reflect accepted project authority after writes.
- Verify refreshed files still fit repo shape; handle pack drift intentionally.
- Apply the same pre-existing skill reconciliation policy as scaffold setup. `dp update` does not detect overlaps; the agent checks the skill homes, keeps HI baseline active for exact name/id overlaps, preserves non-overlaps through mirrors, and uses `dp report` for semantic overlap or baseline integration proposals.

After `dp scaffold init`:

- Do not start requirements discovery by default.
- Inspect the generated skills and seeded wiki root.
- Reconcile pre-existing skills yourself using `.agents/skills`, `.claude/skills`, `.codex/skills`, `.cursor/skills`, and `.opencode/skills`; the command did not detect overlap.
- Treat the seeded wiki root as provisional until it matches the repo layout.
- Move, rename, or refactor generated init output when needed so it matches the actual repository.
- Run `requirements-grill` before `write-backlog` only when the user actually asks for requirements or backlog generation.
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
