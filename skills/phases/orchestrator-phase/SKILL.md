---
name: orchestrator-phase
description: Runs one long-lived AFK Orchestrator that splits cross-dependent work into Track threads, merges and ships their PRs, and reports to the human through a Needs-you list.
disable-model-invocation: true
---

# Orchestrator Phase

A Durable Workflow Graph. One long-lived **Orchestrator** thread routes work
that spans several cross-dependent scopes. Each scope runs in a **Track**: a
real thread that runs `$requirements-phase` then `$delivery-phase`, or one of
them, or `$debugging-phase`. **Workers** are short-lived subagents for one
check. When the work does not need orchestration, the Orchestrator **goes
solo** and becomes a **Solo Thread**.

## Bootstrap

1. Load [the orchestrator router](phases/router.md) on every invocation,
   event and resume.
2. Recompute the route from the run's Charter and Track Ledger and the
   current event; the transcript is never required.
3. Load exactly the one gate the router selects, or return its single
   terminal, checkpoint, or blocked outcome.
4. After the gate writes its Ledger outcome, stop or re-enter this bootstrap.

The router is the sole route authority. Gate files own executable work.

## Run State

Each run keeps two files in `.orchestrator/<run>/` of the Orchestrator's home
project; git is not required:

- `charter.md`: the run's rules and tool bindings,
  [the Charter contract](references/charter.md).
- `ledger.md`: every Track, Needs-you item, decision and event,
  [the Track Ledger contract](references/ledger.md).

Read both at the start of every turn. They outrank memory notes and the
transcript.

## AFK

The human starts the Orchestrator and is away. Every pending choice is an
**Autonomous Decision**: take the recommended answer from the Charter, the
Ledger and current evidence, act on it, and record it in the Ledger as
in-bounds or out-of-bounds. Only three things wait for the human, each as a
**Needs-you item** that holds only the work behind it while every other Track
moves:

- a [Human Gate](#human-gates);
- access only the human can give (a credential, a permission, a secret);
- an out-of-bounds decision the human may reverse.

Questions reach the human only as plain lines in a report. The Orchestrator
never calls `AskUserQuestion`, `request_user_input` or any other question
tool: an open question dialog blocks every Track message until the human
answers. This rule outranks every inner skill that asks.

## Human Gates

These actions wait for the human's approval:

- a production deploy;
- the merge of a new functional PR: new behavior a user or an API caller can
  see; when unclear, a PR counts as functional;
- infrastructure that costs money;
- deleting production data, unless an approved migration in a merged PR does
  it.

Everything else is autonomous, including merges of fixes, tests, tooling,
syncs and repairs to approved code; package publishes; dev and staging
deploys; messages to colleagues; and new secrets the Orchestrator generates,
stored in the project's secret store.

Approval is the human's own words: typed in the Orchestrator thread, or a
relayed "go" whose quoted words the Orchestrator finds in the human's own
messages in the source thread.

## Short Turns

Each turn handles one event: read the Charter and Ledger, route, act or
delegate, write the Ledger, end the turn. A free Orchestrator receives every
Track line at once.

- Workers do the waiting and the legwork: message triage, sweeps, smoke and
  end-to-end checks, deploy and CI waits.
- Orchestrator Workers stay read-only and outside-in. A code change goes to
  the Track that owns the repository, or to a new small Track.
- Tracks, PR watches and Workers wake the Orchestrator. It runs no recurring
  timer.

## Capabilities

The skill names thread operations as **Capabilities**: spawn a thread in a
project with a brief, fork a thread, send a line to a thread, read a thread,
run a Worker that wakes the Orchestrator when done, watch a PR, ask the human
for a secret. [The Host binding](references/hosts.md) maps each Capability to
the host's real tool and failure modes. A host that cannot spawn or send
cannot orchestrate: the Orchestrator goes solo.

## Reports

Every message the human reads follows [the report contract](references/report.md)
and goes through `$wait-what`.
