---
name: requirements-phase
description: Orchestrates the human-centric requirements phase from ambiguity through requirements-grill artifacts into backlog shape. Use when the user asks to run a requirements phase, move from discovery to backlog, close requirement branches, decide whether backlog writing is ready, or coordinate requirements-grill with write-backlog.
---

# Requirements Phase

Human-centric discovery wrapper for `requirements-grill -> write-backlog`.

Normally do not create or update a formal agent goal. This phase is an interview and decision-closure loop, not execution delivery.

## Use when

- The user asks for a requirements phase, requirements discovery, or backlog readiness.
- Ambiguity needs to become grill branches, glossary, axioms, parked scope, and closure decisions.
- Existing `*-grill-status.md` / `*-grill-log.md` artifacts need to drive backlog/module/epic/story shape.
- The user wants to know whether to keep grilling, park scope, or write/sync backlog.

## Do not use when

- The user asks to write `SPEC.md`, `PLAN.md`, implementation notes, code, tests, PRs, or delivery execution.
- The next step is already an approved spec/plan/implementation task. Use delivery-phase or the specific delivery skill instead.
- The user wants only a tactical backlog formatting pass from already-closed requirements. Use `write-backlog` directly.

## Workflow

1. Establish phase state.
   - Identify the topic, source artifacts, current backlog target/provider, and any explicit scope boundary.
   - If grill artifacts exist, read status first, then log.
   - State assumptions and known unresolved branches tersely.

2. Route to `requirements-grill` while decisions are open.
   - Let `requirements-grill` own HITL interviewing.
   - Ask one question at a time with a recommended answer and why.
   - Turn ambiguity into named branches, branch percentages, accepted decisions, rejected/superseded decisions, glossary entries, axioms, and parked scope.
   - Do not write backlog while major branches remain open unless the user explicitly parks them.

3. Decide backlog readiness.
   - Backlog-ready means active branches are closed enough for module/epic/story shaping, and unresolved branches are either non-blocking, explicitly parked, or recorded as follow-up scope.
   - If not ready, continue grilling or report the exact blocker branches.
   - If ready, hand off to `write-backlog`.

4. Run `write-backlog` only after readiness.
   - Derive modules first, then epics/capabilities, then stories.
   - Use accepted decisions and locked direction only.
   - Preserve parked scope and unresolved items as deferred notes, not silent backlog content.
   - Sync or draft provider payloads only when the user requested backlog write/sync.

5. Stop at the requirements boundary.
   - Do not create specs, plans, implementation tasks, or code changes from this phase.
   - Recommend delivery-phase only after backlog state is clear.

## Output contract

End with one of these states:

- `backlog-ready`: branches closed or parked enough; backlog can be written next.
- `backlog-written`: backlog hierarchy/payloads were produced or synced.
- `parked`: requirements are intentionally unresolved; parked scope and resume trigger are explicit.
- `blocked`: named branches still need human decisions before backlog writing.

Include:

- active, closed, parked, and unresolved branches
- glossary and axiom changes, if any
- backlog module/epic/story implications, if known
- next recommended action: continue grill, write/sync backlog, park, or move to delivery-phase
