---
name: delivery-phase
description: Goal-compatible workhorse wrapper for scoped execution from specification through delivery closeout. Use when a user asks to deliver a scoped goal end to end, especially when work should flow through create-spec, create-plan, implement-spec, review, optional debugging, and docs-ingest-phase.
---

# Delivery Phase

`delivery-phase` owns scoped execution until the goal is either done or honestly
blocked. It preserves the workflow chain instead of compressing implementation
into a single coding pass.

## Use When

- The user asks to deliver, execute, finish, close, or carry a scoped goal end to end.
- A goal needs spec, plan, implementation, review, validation, and docs handling in one wrapper.
- Existing `SPEC.md` or `PLAN.md` artifacts may be reused, but delivery still needs closeout.
- The user chooses `parallel: true` or `parallel: false` for implementation mode.

## Do Not Use When

- The request is only requirements discovery, planning, review, debugging, or docs ingest.
- The scope is too vague to name a goal, issue, spec folder, or bounded change.
- The user explicitly asks not to code or wants a plan/spec only.
- Runtime evidence points to a broad bug outside the active delivery scope; create a separate debugging or debt goal.

## Contract

- **Role:** public scoped-delivery orchestrator
- **Wraps:** `$create-spec` -> `$create-plan` -> `$implement-spec` -> `$review-phase` -> optional `$debugging-phase` -> `$docs-ingest-phase`
- **Owns:** goal bounds, mode choice, validation, review follow-through, docs ingest outcome, debt capture, blocker reporting
- **Stop condition:** implemented, reviewed, validated, docs ingest handled, debt captured, or concrete blocker reported

## Workflow

1. **Frame the delivery goal.**
   - Identify the bounded goal, issue, spec folder, branch, and ownership constraints.
   - State assumptions, known artifacts, and the validation surface.
   - If scope is ambiguous, ask before entering the chain.
2. **Create or reuse the spec.**
   - If no reviewed `SPEC.md` exists, run `$create-spec`.
   - If a spec exists, verify it matches the requested scope before continuing.
3. **Create or reuse the plan.**
   - If no execution-ready `PLAN.md` exists, run `$create-plan`.
   - If a plan exists, verify dependencies, validation gates, assigned skills, and review mode.
4. **Implement the plan.**
   - Run `$implement-spec` with the selected `parallel: true|false` mode.
   - Keep implementation inside the delivery scope and update required notes/debt artifacts.
5. **Review every coding run.**
   - Run `$review-phase` after `implement-spec` even when tests pass.
   - Fix in-scope blocking findings before final closeout.
6. **Debug only runtime-evidence failures.**
   - Run `$debugging-phase` only when validation or review produces runtime evidence of a bug.
   - Patch only inside delivery scope.
   - If the bug is broader, capture tech debt or open a separate debugging/debt goal.
7. **Run docs ingest.**
   - Run `$docs-ingest-phase` when implementation changed product behavior, architecture, setup, operator workflow, docs contracts, or spec domain knowledge.
   - If docs ingest is not needed, record the explicit no-op reason in the final report or delivery notes.
8. **Close out.**
   - Report implementation, review result, validation, docs ingest outcome, debt captured, and remaining blockers.

## Mode And Parallel Rules

- Preserve `parallel: true|false` through `$implement-spec`.
- If the user chose a mode, honor it.
- If not, choose the smallest safe mode:
  - `parallel: false` for tightly coupled work, unclear ownership, or small changes.
  - `parallel: true` only when the plan has independent waves and disjoint write scopes.
- Do not let parallel workers expand the delivery scope.
- Optional `$debugging-phase` may use parallel readonly hypothesis research, but speculative parallel fixes are not allowed.

## Output Contract

Return a concise delivery report with:

- **Goal:** scoped outcome delivered or blocker encountered
- **Mode:** `parallel: true|false` and why
- **Artifacts:** spec, plan, implementation notes, debt, docs, or tracker links touched
- **Review:** mandatory `$review-phase` result and remaining findings
- **Debugging:** skipped with reason, or `$debugging-phase` evidence and result
- **Validation:** commands, browser checks, smoke tests, or manual scenarios run
- **Docs ingest:** `$docs-ingest-phase` run, or explicit no-op reason
- **Exit:** done, blocked, or split into follow-up debt/debugging goal
