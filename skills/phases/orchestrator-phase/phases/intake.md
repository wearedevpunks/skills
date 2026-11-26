# Intake

## Entry Guard

Enter only when the router selected this gate: no run exists, or the event is
a new human request for work.

## Inputs

- the human request and every thread, issue, spec or plan it names
- the open run's Charter and Ledger, when a run exists
- [the Host binding](../references/hosts.md)

## Actor-Like Gate Boundary

Intake owns one decision per request: orchestrate, go solo, add to the open
run, or hand to a Worker. It writes no code and starts no thread.

## Bounded Action

1. **Capability check.** When the Host binding cannot spawn or send, record a
   `go_solo` decision and exit.
2. **Orchestrate or solo.** Name the scopes the request touches, their
   cross-dependencies and their size. Weigh only these:
   - many cross-dependent scopes of big size: orchestrate;
   - several PRs into one integration branch, each with its own deploys:
     orchestrate;
   - many small scopes, or one big scope: go solo.

   Size is the expected change, never whether the work fits one thread's
   context. Record the choice as an Autonomous Decision with its evidence.
3. **Route each scope.**

   | Scope | Route |
   | --- | --- |
   | Unclear requirement or product decision | Track: `$requirements-phase`, then `$delivery-phase` in the same thread |
   | Accepted spec or plan, or a clear bug | Track: `$delivery-phase` |
   | Runtime failure | Track: `$debugging-phase`, or a Worker when read-only |
   | Smaller than one PR, no decision, read-only | Worker |
   | Smaller than one PR, changes code | small Track in the owning repository |
   | Existing thread the human names | Adopt |

4. **Write.** With no run, create `.orchestrator/<run>/ledger.md` with its Run
   section (state `open`) and the request's exit criteria. Add each routed
   scope as a `proposed` Track row or a pending adopt. A request that a live
   Track already covers adds nothing; a human hold ("we do this later") marks
   its Track `parked`.

## Invariants

- One decision per request, recorded with its evidence.
- Intake never asks the human to choose a route.

## Completion Evidence

- a Ledger Decisions entry for orchestrate or go solo
- a Track row, adopt entry, Worker entry, or `already_tracked` note per scope

## Declared Exits

- `complete` `orchestrate`: scopes are routed into the open run.
- `complete` `go_solo`: the `go_solo` decision is recorded.
- `no-op` `already_tracked`: live Tracks already cover the request.

## Durable Handoff

Write the Ledger rows and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
