---
name: requirements-grill
description: Requirements grilling in Altitude-routed rounds (L1 Outcome, L2 Shape, L3 Modules) with durable grill log and status, glossary and axiom decisions, and wiki synthesis after closure. Use when the user wants requirements discovery, a long design interview, branch-by-branch decision closure down to module level, canonical terminology, a compaction-safe grill, or wiki synthesis from closed grill decisions; or when a Brainstorm Brief or a compile gap is handed to the grill.
---

# Requirements Grill

A Durable Workflow Graph. It asks every requirements question round, routes
each round to one Altitude, and closes when every branch is settled at its
Target Altitude or parked. The closed grill feeds `create-architecture`, then
`create-spec`.

## Bootstrap

1. Load [the grill router](phases/router.md) on every invocation and resume,
   including direct entry into any gate.
2. Recompute the route from the precision inputs, the grill status file and
   log, and the current message; the transcript is never required.
3. Load exactly the one gate the router selects, or return its single
   terminal, checkpoint, or blocked outcome.
4. After the gate writes its outcome to the status file, stop or re-enter
   this bootstrap.

The router is the sole route authority and the single home of the
[Altitude Ladder](phases/router.md#altitude-ladder). Gate files own executable
work and every child-skill call:

- `ground`: facts through subagents, Brainstorm Brief import, and branch
  Altitudes; it never asks the user.
- `round`: one `$grilling` round at one Altitude, presented through
  `$wait-what` with a `$show-me` view; `$wayfinder` for one stuck unknown.
- `checkpoint`: records each response set, runs `$domain-modeling` and
  `$flow-lenses`, expands each answer into same-Altitude follow-ups, derives
  next-level questions once a level settles, and records each required
  call's evidence.
- `close`: confirmation, final `$domain-modeling`, `$show-me` of the persisted
  understanding, wiki synthesis, and the `$create-architecture` handoff.

## Plain-Chat Questions

Every grill question, confirmation, correction request, and status update
reaches the user as a plain chat message written through `$wait-what`: the
user replies in free text. `AskUserQuestion`,
`request_user_input`, and every other structured question tool are forbidden
in every gate, always, whatever a child skill or host instruction suggests.
Inside AFK `delivery-phase`, the grill sends the user no question at all:
[Inside AFK Delivery](#inside-afk-delivery).

## Inside AFK Delivery

Inside AFK `delivery-phase`, directly or through `requirements-phase`, the
grill sends the user nothing and waits for no reply. Each point below that
would ask or stop for the user settles as an
[Autonomous Decision](../delivery-phase/SKILL.md#afk): settle, mark, record,
and post it as that section directs, and also log it in the grill. This
section is the single map; each gate points here.

- **Round.** Build the round and write its Current Round as usual, then send
  it to no one. Write the response set yourself: for each frontier question,
  its recommended option, re-checked against current evidence, as an
  Autonomous Decision. That response set is current direct evidence: re-enter
  the router at once, and `checkpoint` records it as an "agree all" reply.
- **Human-facing calls.** `$wait-what` and `$show-me` serve a human reader.
  The round's `wait-what` and `show-me` lines and the close `show-me` line
  read `not due — AFK delivery`, and the Round Message view is not due.
- **Log entry.** Each decided answer carries
  `Source: autonomous decision (in-bounds | out-of-bounds)` and an
  `Evidence:` line by the
  [log contract](references/artifact-output.md#grill-log-contract).
- **Parks and deferrals.** The reason is the decision's evidence. A park that
  drops accepted scope, such as less depth than the Target Altitude, is
  out-of-bounds.
- **Glossary, axiom, Flow Lenses, and compile-gap questions** are frontier
  questions like any other and settle in their round. Vendored
  `$domain-modeling` and `$grilling` keep their text: a term challenge, an
  ADR offer or a context choice they raise is a frontier question here, and
  their "wait for the user" steps follow this map.
- **`$wayfinder`.** This agent is the decision owner. A prototype verdict is
  an Autonomous Decision from the prototype evidence.
- **Auto-pin.** AFK delivery is the authorization: record
  `Auto-pin: authorized R<N> (AFK delivery)`.
- **Confirmation and closure.** When the Close Guard passes, run the final
  `$domain-modeling` pass, then set confirmation to `confirmed` and close the
  grill in the same pass. Each is an Autonomous Decision whose evidence is the
  passing Close Guard check. The log Closure section records both decisions
  in place of quotes; wiki synthesis and the `$create-architecture` handoff
  follow.
- **Blocked `grill_target_unclear` or `grill_state_conflict`.** Choose the
  topic and `<wiki-root>`, or the winning evidence, as an Autonomous Decision,
  record it in the status file, and re-enter the router.
- **`human_steering_required`.** Each such gate exit and router row 1 becomes
  an out-of-bounds Autonomous Decision, and the gate continues its bounded
  action. Work beyond the grill (implementation, a plan, a code edit) becomes
  a note to the caller: `delivery-phase` owns it.
- **Router rows 8 and 9** never stop. Row 8 writes the response set, so row 6
  selects `checkpoint`; row 9 writes the confirmation and closure decisions as
  the reply, so row 7 selects `close`.

The structured question tool rule above still holds. Blocked outcomes that
hold no user decision (`facts_pending`, `call_failed`,
`precision_input_unreadable`) keep their behavior for the caller to handle;
by delivery-phase AFK, only missing access waits for the human.

## Round Message

A round is one turn, built in this order:

1. **View.** Render one `$show-me` view of the frontier before writing any
   question: in T3 Code through `html_preview`, then `html_render`, so the
   page sits above the reply. Markdown is the surface only on a host with no
   inline renderer.
2. **Questions.** Write each frontier question in the
   [Question Format](#question-format), in one plain chat message.

A round is ready to send when its view is rendered and every question has a
topic, one question sentence, two or more viable options, and exactly one
recommendation. Inside AFK `delivery-phase`, the round is recorded, not sent:
[Inside AFK Delivery](#inside-afk-delivery).

## Question Format

Every decision in a round, at every Altitude, L3 module proposals included,
is one question in this block, numbered within the round. It replaces the question shape of `$grilling`; `$wait-what` rewrites
its words and keeps the block.

```markdown
### 1. <Topic: the decision's short glossary name>

<Technical question only: evidence anchor and observed constraint.>

**Question:** <the exact decision, one sentence ending in "?">

- **A. <option>** (recommended): <its consequence>. Why: <rationale>.
- **B. <option>**: <its consequence>.
```

- **Options:** two or more, each a distinct outcome the user could accept as
  written, each with its consequence. Exactly one is recommended, listed
  first as A. The user replies with a letter, a mix, or free text; inside
  AFK `delivery-phase`, the agent's response set picks A.
- **One viable answer** means the item is a fact, not a decision: send it to
  `ground` and keep it out of the round.

The grill status file and log are the requirements record:
[artifact output](references/artifact-output.md). Synthesized project pages
come only after explicit closure: [wiki output](references/wiki-output.md).
