# Upstream provenance

Copied from [`shadcn-ui/ui`](https://github.com/shadcn-ui/ui/tree/af983e842ab31ed26da30ba4d9a418772150dff0/skills/shadcn) (path `skills/shadcn`) at commit:

```text
af983e842ab31ed26da30ba4d9a418772150dff0
```

The adjacent `LICENSE` is the byte-identical upstream MIT license (repository root `LICENSE.md`) retained for this skill.

## Local edits

- Changed the `## Current Project Context` dynamic context command from `` !`npx shadcn@latest info --json` `` to `` !`npx shadcn@latest info --json || true` ``. Claude Code runs the command from the session working directory when it loads the skill, including the `skills:` preload of a subagent. At a monorepo root, `shadcn info` exits 1 with a `monorepo_root` JSON error, and Claude Code then aborts the skill load or the subagent spawn. With `|| true`, the skill loads, and the agent reads the error JSON, which lists the workspace targets for `-c <workspace>`.
