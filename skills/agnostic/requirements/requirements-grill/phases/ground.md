# Ground

## Entry Guard

Enter only when the router selected this gate (route row 4): the grill
artifacts are missing, an open grill's status lacks the altitude fields, a
Brainstorm Brief has no matching Brief import record, a compile gap or other
precision input is unrecorded, precision inputs settle a level the Branch
Dashboard does not record, or a recorded fact request is not yet dispatched.

## Inputs

- the topic and `<wiki-root>`, resolved by
  [Durable Artifacts](../references/artifact-output.md#durable-artifacts)
- the grill status file and log, when present
- the Brainstorm Brief, the Fog graph when the caller supplies Finder
  context, and a compile gap returned by `create-architecture` with its
  Altitude
- code evidence, relevant routed learning artifacts, and the status
  Technical Grounding table
- the [Altitude Ladder](router.md#altitude-ladder)

## Actor-Like Gate Boundary

Ground owns the grill artifacts' existence, precision-input import, branch
Altitude setup, technical grounding evidence, and fact-request dispatch. It
finds facts through subagents and reconciles each report into the status file.
Ground never asks the user anything: every decision it finds becomes an
`unanswered` question for `round`.

## Bounded Action

Do every applicable step; skip a step only when its condition is false.

1. **Artifacts.** Create or reuse the status file and log under the
   [artifact contract](../references/artifact-output.md#durable-artifacts).
2. **Legacy upgrade.** For an open grill whose status lacks the altitude
   fields, apply [Legacy Status](../references/artifact-output.md#legacy-status).
3. **Brief import.** When no Brief import record exists, or its sha256 differs
   from the current Brief:
   - user-stated preferences and the accepted shape become `answered` log
     entries with `Source: Brainstorm Brief` and their Altitude;
   - rejected shapes become rejected alternatives on the owning question;
   - open forks become `unanswered` questions at their Altitude, with the
     Brief's proposed default as the recommendation.
   On a changed sha256, import only the delta: a new item gets a new question
   id; a changed preference or shape gets a superseding log entry; an
   unchanged item is never written twice. A preference the Brief records is
   recorded `answered` and never re-asked. Write the Brief import record.
4. **Compile gap.** Record a gap that `create-architecture` returns as an
   `unanswered` question at its stated Altitude under the owning branch, and
   set shared-understanding confirmation to `not-ready`. On a closed grill,
   set `Closure` to `reopened R<N>`.
5. **Branch Altitude.** Give every active branch a Target Altitude and a
   Settled Altitude by the [Altitude Ladder](router.md#altitude-ladder). A
   level is settled by evidence when the Fog graph, the Brief, the log, or
   code evidence already answers every question that level asks for the
   branch; record that Settled Altitude with its evidence anchors. The branch
   starts at the next level.
6. **Domain model.** Before the first round, give `$domain-modeling` the
   status glossary as its working persistence. A terminology decision it
   raises becomes an `unanswered` Glossary question.
7. **Learnings.** Read the routed learning artifacts that bear on known
   behavior, prior bugs, project conventions, or domain facts of an active
   branch; record their anchors.
8. **Technical grounding.** For each technical decision of a code-bearing
   branch's working level, through subagents:
   1. locate the behavior: trace the caller through the smallest slice of
      code, tests, schemas, contracts, configuration, and runtime paths;
      record `path:symbol`, schema, contract operation, configuration key, or
      runtime-flow anchors, labelled existing or proposed;
   2. identify the owner: existing module, new capability, adapter, private
      helper, or plain value; dependency direction; where dependencies are
      supplied; who acquires and releases resources. Apply the stack skill
      that applies (for Effect, `$effect-service-design`);
   3. inspect the primitive: through the stack skills and the project source
      guide or `opensrc`, read the exact module, symbol, and source version;
      record its guarantees, limitations, and the remainder the application
      owns. Keep installed-version facts, proposed design, and unproved
      runtime behavior apart.
   Reuse evidence while its source identity and assumptions hold; after a
   changed decision or an anchor that no longer resolves, refresh only the
   evidence it invalidates.
9. **Facts.** Dispatch each undispatched fact request to a subagent and mark
   it `requested`. Record a missing fact or a source and version mismatch as
   an exact prerequisite of the question ids it affects; only those questions
   wait. Record each subagent report as a fact and clear the prerequisites it
   satisfies.

Required calls: subagent fact finding for steps 8 and 9, the applicable stack
skills and `opensrc` for step 8, and `$domain-modeling` for step 6. Their
evidence is the anchors and fact records in the Technical Grounding table.

## Invariants

- No user question; no answer recorded except from the Brief with
  `Source: Brainstorm Brief`.
- Question ids stay stable and are never reused.
- A closed grill is never upgraded; a Brief imports into open grills only.
- No planning item from the [Altitude Ladder](router.md#altitude-ladder)
  exclusions enters a question.

## Completion Evidence

- status file and log exist with the altitude fields
- the Brief import record matches the current Brief sha256, when a Brief
  exists
- every active branch has a Target Altitude and a Settled Altitude, with
  anchors for each level settled by evidence
- each code-bearing branch has a Technical Grounding row with anchors or
  exact missing-fact prerequisites
- each fact request is `requested` or reported

## Declared Exits

- `complete` `grounded`: every applicable step is done.
- `complete` `facts_requested`: subagents run; independent questions stay
  ready.
- `blocked` `precision_input_unreadable`: the Brief, Fog graph, or compile
  gap cannot be read or names another topic; the record names it.
- `human_steering_required`: a precision input requests work beyond the grill,
  such as implementation, a plan, or a code edit; the record names the
  decision needed.

## Durable Handoff

Write the `ground` entry under
[Gate Outcomes](../references/artifact-output.md#gate-outcomes).

## Stop Or Router Re-entry

After a `complete` exit, re-enter [`router.md`](router.md). On a blocked or
steering exit, stop.
