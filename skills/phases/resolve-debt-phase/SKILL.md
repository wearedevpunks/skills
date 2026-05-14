---
name: resolve-debt-phase
description: Resolves one candidate or accepted tech debt item through validation, resolution spec creation, delivery, and closeout. Use when the user asks to resolve a tech debt entry, process a debt candidate, or continue from a canonical `docs/reference/tech-debt/<domain>/<spec>/<debt-slug>.md` artifact.
---

# Resolve Debt Phase

## Contract

- **Role:** public lifecycle entrypoint for one tech debt phase item
- **Scope:** one candidate or accepted debt item, never generic debt management
- **Canonical input:** `docs/reference/tech-debt/<domain>/<spec>/<debt-slug>.md`
- **Source of truth:** debt file; backlog mirrors are secondary and may be stale
- **Delegates to:** `$parallel-research` for independent readonly checks; `$create-spec` or equivalent spec workflow for accepted debt; `$delivery-phase` for implementation
- **Stop conditions:** draft decision requested, accepted item handed to delivery, resolved item no-oped, or completed item marked resolved with links

## Use When

- The user provides or points to one tech debt artifact under `docs/reference/tech-debt/`.
- The user asks to validate, accept, delete, or resolve one debt candidate.
- The user asks to continue an accepted tech debt item into implementation.

## Do Not Use When

- Creating a broad debt register, backlog cleanup, or multi-item debt campaign.
- Resolving normal feature work with no canonical debt file.
- The backlog issue is the only artifact and no debt file can be found or created by the owning workflow.

## Workflow

1. Locate the debt file at `docs/reference/tech-debt/<domain>/<spec>/<debt-slug>.md`; stop if multiple items are implied.
2. Read the debt file first and extract status, domain, originating spec, linked backlog mirror, evidence, and proposed resolution.
3. Treat the debt file as canonical. Use backlog mirrors only to sync status or discover context.
4. Branch by status: `draft`, `accepted`, or `resolved`. If missing or ambiguous, inspect context and ask before changing state.

## Status Handling

### `draft`

Run readonly validation before asking for a lifecycle decision.

1. Inspect the debt file.
2. Inspect original `SPEC.md`, `PLAN.md`, `IMPLEMENTATION-NOTES.md`, review notes, and related docs.
3. Inspect current code, tests, runtime logs, docs, and external evidence needed to prove whether the debt is real, stale, already fixed, or underspecified.
4. Use `$parallel-research` when checks can run independently across code, docs, tests, runtime evidence, or external sources.
5. Synthesize evidence with citations to local files, commands, logs, or sources.
6. Ask the user to choose exactly one: accept, delete, or authorize more research.

Do not create a resolution spec from a `draft` item until the user accepts it.

### `accepted`

Move the one accepted item toward delivery.

1. Create or update a debt-resolution spec tied to the original domain/spec and debt slug.
2. The resolution spec must state the initial debt, why it matters, the bounded fix, non-goals, acceptance checks, and closeout requirements.
3. Run `$delivery-phase` against that resolution spec.
4. Keep implementation work scoped to resolving the accepted item, not adjacent cleanup.

### `resolved`

No-op by default.

- Report that the item is already resolved.
- Include the resolution spec and implementation notes links if present.
- Inspect history only when the user explicitly asks.

## After Delivery

When delivery finishes:

1. Update the debt file status to `resolved`.
2. Link the resolution spec.
3. Link implementation notes or final delivery evidence.
4. Record validation commands and outcomes.
5. Sync the backlog mirror when available, without treating it as source of truth.
6. Report any residual follow-up as new debt only if it is distinct from the resolved item.

## Output Contract

Always report:

- debt file path and status before/after
- evidence inspected or validation performed
- decision requested for `draft`, handoff/result for `accepted`, or no-op reason for `resolved`
- resolution spec and implementation notes links when present
- backlog mirror sync outcome when available
