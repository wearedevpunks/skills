---
name: docs-maintenance
description: Maintain repo documentation as durable, human-facing records of implemented reality. Use when Codex adds, edits, moves, or removes files in `docs/`, when code changes alter architecture, setup, contracts, operator workflow, or non-obvious behavior, or when a task should update `docs/README.md`, a domain doc, a runbook, or an ADR instead of leaving the knowledge implicit in code.
---

# Docs Maintenance

## Overview

Treat `docs/` as the repo's durable knowledge base for humans. Capture implemented behavior, non-obvious boundaries, and operator reality. Keep planning and agent workflow out of the docs themselves.

## Workflow

1. Read `docs/README.md` and the nearest affected section README before editing docs.
2. Inspect the changed code, tests, scripts, env vars, and existing docs before deciding what to update.
3. Decide whether the task changes current truth.
   Update docs when architecture, setup, contracts, decisions, maintainer workflow, or non-obvious behavior changed.
4. Route the update by ownership, not by whichever folder changed.
5. Prefer editing an existing leaf doc.
   Create a new doc only when no existing leaf can capture the non-obvious implementation intel cleanly.
6. Keep docs human-facing.
   Put agent workflow rules in `AGENTS.md` / `CLAUDE.md`, not in `docs/` pages.
7. Update indexes in the same task.
   When a doc is added, removed, renamed, or repurposed, update `docs/README.md` and the nearest section README.
8. Record repo-wide behavior changes in `docs/architecture/decisions/`.

## Never Do

- Create `docs/prd`, `docs/dev`, roadmap, sprint, or backlog-mirror folders.
- Document speculative or future-state features as if they exist.
- Write docs that just mirror the repo tree or restate facts a quick code search would show.
- Leave deep docs orphaned from `docs/README.md` after adding or renaming them.
- Put agent task instructions inside human-facing docs.

## Folder Map

- `docs/architecture/`: cross-cutting boundaries, non-obvious system shape, ADR-style decisions
- `docs/reference/`: domain-driven implementation intel
- `docs/runbooks/`: executable maintainer workflows, setup, troubleshooting
- `docs/standards/`: human-facing documentation standards and repo conventions

## Section Rules

- Keep `docs/architecture/README.md` as a section intro that links to major docs only.
- Use `docs/architecture/decisions/` for ADR-style records.
  Prefer: initial situation, issue, decision, consequences.
- Keep `docs/reference/` domain-driven, not directory-driven.
- Keep `docs/runbooks/` for workflows the repo actually supports.
- Keep `docs/standards/` human-facing. Do not turn it into an agent prompt dump.
- Keep `docs/**/README.md` as human-facing index pages, not maintenance instructions.

## Coverage Routing

Route doc changes by owned behavior:

- Backend/runtime surface:
  `apps/server`, `packages/api`, `packages/db`, `packages/env`, transport boundaries, Effect layering, tRPC contracts, DB/runtime behavior, and build-time env validation usually belong in `docs/reference/domains/backend-effect-sql.md`.
  Put setup and operator steps in `docs/runbooks/`.
- Auth/user-management surface:
  `packages/auth`, `packages/api/src/features/auth`, `packages/api/src/features/user-management`, and related `apps/web` auth flows usually belong in `docs/reference/domains/user-management.md`.
- Frontend/application-structure surface:
  `apps/web`, `packages/ui`, app/features/modules boundaries, shared frontend data flow, auth/form/query infrastructure, and reusable UI boundaries usually belong in `docs/reference/domains/frontend-application-structure.md`.
- AI workflow infrastructure:
  `.agents/`, `.claude/`, `.codex/`, agent generation, hooks, manifests, and sync workflow usually belong in `docs/runbooks/subagent-templates.md` or `docs/runbooks/claude-code-hooks.md`.

## Writing Rules

- Write for future maintainers.
- State current truth first.
- Prefer progressive disclosure: short README/index entries, deeper leaf docs.
- Keep docs grounded in shipped code, tests, scripts, and env behavior, not broader Linear scope.
- Use real repo paths, package names, commands, scripts, and env vars when they explain a non-obvious behavior.
- Omit emptiness unless the absence itself matters.
- Link related docs by path so future sessions can navigate quickly.

## New Leaf Decision

Create a new leaf doc only when all are true:

1. No current doc owns the behavior cleanly.
2. The behavior is non-obvious enough to be worth preserving.
3. The new doc can be named by domain or workflow, not by an arbitrary folder mirror.

When creating one, keep it as small as possible, add it to `docs/README.md`, and add it to the nearest section README in the same task.
