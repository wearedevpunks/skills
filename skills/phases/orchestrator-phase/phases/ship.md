# Ship

## Entry Guard

Enter only when the router selected this gate: a Track is `landed` and a
Charter target still needs its release or deploy.

## Inputs

- the `landed` Track rows
- the Charter: release and deploy targets, their deploy and guard commands,
  Human Gates, secret stores

## Actor-Like Gate Boundary

Ship owns releases and deploys of landed work. It delegates every wait to a
Worker and keeps the Ledger write.

## Bounded Action

1. **Gate.** A production deploy, infrastructure that costs money, and a
   production data deletion outside an approved merged migration become
   Needs-you items and wait. Package publishes and dev and staging deploys
   proceed.
2. **Guard.** Run the target's guard command from the Charter. Never start a
   deploy while another deploy to the same target runs; a deploy to another
   target does not block it.
3. **Release or deploy.** Start it, then hand the wait to a Worker that
   reports the live version.
4. **Secrets.** A secret the deploy needs is first looked up in the Charter's
   secret stores; a new secret the Orchestrator generates goes into the
   project's store; a secret only the human holds is asked through the ask
   secret Capability.
5. **Write.** Mark the Track `shipped` per target once the live version
   matches.

## Invariants

- No overlapping deploys to one target.
- No production deploy without approval.

## Completion Evidence

- per target: the release or deploy run and its live version
- the Needs-you id for each gated target

## Declared Exits

- `complete` `shipped`: each due target runs the landed version.
- `checkpoint` `gated`: a Needs-you item holds a target.
- `no-op` `deploy_busy`: a Worker waits for the target's guard to clear.
- `blocked` `deploy_failed`: the failure goes to the owning Track as a defect.
- `human_steering_required`: a deploy needs access no store holds and no
  other Track can move; the Ledger names the access.

## Durable Handoff

Write the Track rows, Needs-you items and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md) after a `complete`, `checkpoint`, `no-op` or
`blocked` exit. Stop after `human_steering_required`.
