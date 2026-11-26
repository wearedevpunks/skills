# Orchestrator Router

Load this file on every invocation, event and re-entry. Recompute one route
from current evidence; transcript continuity and a recorded route suggestion
are never required. The router reads and selects; it writes nothing.

## Run Discovery

Read `.orchestrator/` in the home project. The run is the one whose Ledger
names this thread as its Orchestrator. Several matching runs with no run
named by the event are blocked `run_unclear`. No run means Intake.

Load [the Track Ledger contract](../references/ledger.md) and
[the Charter contract](../references/charter.md) before route precedence.

## Inputs And Authority

Inspect, in authority order:

1. the current event: a human message, a Track line, a PR event, or a Worker
   result;
2. `ledger.md` and `charter.md` of the run, and the PR, CI and deploy state
   they point at;
3. the latest Ledger Events line;
4. any suggested route.

Evidence is eligible only when it is in scope (this run and its Tracks), fresh
(a PR or deploy state read in this turn; a Track line judged by its send time,
never by its arrival order), and valid (threads, PRs and commits resolve).
Higher authority wins. At the same authority, the newest send time wins; any
other conflict is blocked `ledger_conflict`.

## Route Precedence

Evaluate top to bottom and return the first matching row.

| Priority | Current evidence | Output |
| --- | --- | --- |
| 1 | Every live Track waits on an open access item that current evidence does not supply | terminal `human_steering_required` |
| 2 | Several runs match and the event names none | blocked `run_unclear` |
| 3 | Same-authority evidence conflicts and send time does not resolve it | blocked `ledger_conflict` |
| 4 | No run exists, or the event is a new human request for work | [`intake.md`](intake.md) |
| 5 | The run is `solo` and current evidence shows the work now needs orchestration | [`reopen.md`](reopen.md) |
| 6 | The run is `solo` or `closed` and the event holds no new request | terminal `run_not_orchestrating` |
| 7 | The Ledger records a `go_solo` decision not yet carried out | [`solo.md`](solo.md) |
| 8 | The run has no Charter, or the event changes a Charter rule | [`charter.md`](charter.md) |
| 9 | The run has a Charter and no Track rows | [`split.md`](split.md) |
| 10 | A Track is `proposed`, or an adopt is pending | [`spawn.md`](spawn.md) |
| 11 | The event is a Track line, a PR event, a Worker result, or a human reply not yet in the Ledger Events | [`listen.md`](listen.md) |
| 12 | A Track is `ready` at a recorded commit, or an integration sync, rebase or release is due | [`merge.md`](merge.md) |
| 13 | A Track is `landed` and a Charter target still needs its release or deploy | [`ship.md`](ship.md) |
| 14 | A Track is `shipped` without verification evidence for that landing | [`verify.md`](verify.md) |
| 15 | A Track is `verified`, or the last live Track settled and the go-solo check is due | [`settle.md`](settle.md) |
| 16 | Nothing is due | checkpoint `listening` |

Return `checkpoint` `listening` as the end of the turn: the next event
re-enters this router.

## Router Outputs

- terminal: `human_steering_required` restates each open access item;
  `run_not_orchestrating` names the run state and the phase the thread runs.
- blocked: `run_unclear` lists the candidate runs; `ledger_conflict` names
  the conflicting evidence.
- checkpoint: `listening` ends the turn.
- gate: load exactly that flat phase file.
