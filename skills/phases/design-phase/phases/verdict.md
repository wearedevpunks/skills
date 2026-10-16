# Verdict

## Entry Guard

Enter only when the router selected this gate: every variant of the open
round has a passing latest quality result and the round has no Verdict, or
current evidence holds the user's reply to the presented round.

## Inputs

- the open round record: variants, axes, `?variant=` URLs, screenshot links
  at both widths
- quality results and each variant's open "Decisions for you"
- the user's reply, when present

## Actor-Like Gate Boundary

Verdict owns the presentation of the round and the recorded Verdict. It
delegates nothing. The Verdict is the user's decision; this gate records it
exactly.

## Bounded Action

When the round has no presentation yet:

1. Present one row per passing variant: name, axis, when it is the right
   choice, its cost, its `?variant=` URL, and its screenshot links at both
   widths. List each variant's open "Decisions for you" so the user can close
   them in the same reply.
2. Ask for one Verdict: `riff <variant>` with a direction, `combine
   <variants>` with the parts to join, `keep <variant>`, or `reject` with a
   reason. HUMAN checkpoint: the user gives the Verdict. Stop.

When current evidence holds the user's reply:

3. Record exactly one Verdict from the user's explicit words, with any
   decisions they closed. A `keep` names exactly one variant. When the reply
   matches no Verdict or names more than one, restate the four options and
   stay at the checkpoint.

## Invariants

- `keep` is the approval. Approval comes only from a recorded `keep`; the
  existence of variants, screenshots, or passing results is never approval.
- One round holds at most one Verdict.

## Completion Evidence

- the presentation with links for every passing variant
- the user's Verdict words, quoted, and the recorded Verdict

## Declared Exits

- `checkpoint` `verdict_required`: the round is presented.
- `complete` `riff`: next route `variant-round`, which starts a new round
  around the named variant.
- `complete` `combine`: next route `variant-round`, which starts a new round
  joining the named parts.
- `complete` `keep`: next route `promote` for the one kept variant.
- `complete` `reject`: the round closes with its reason; next route is router
  re-derivation under its Re-entry Rule.
- `human_steering_required`: the reply asks for work beyond the accepted
  scope; the record names the decision needed.

## Durable Handoff

Write the Verdict into the Round State and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

Stop at the checkpoint or steering exit. After a recorded Verdict, re-enter
[`router.md`](router.md).
