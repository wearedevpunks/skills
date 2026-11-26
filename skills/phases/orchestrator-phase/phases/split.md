# Split

## Entry Guard

Enter only when the router selected this gate: the run has a Charter and no
Track rows.

## Inputs

- the routed scopes from Intake and the Charter
- each scope's specs, plans, issues and open PRs

## Actor-Like Gate Boundary

Split owns the Track graph: which Tracks exist, what each depends on, and
whether an Integration branch is used.

## Bounded Action

1. **Tracks.** One Track per scope, each with a short name, its repository and
   project, its phase route from Intake, and its scope boundaries.
2. **Dependencies.** For each Track, record the Tracks whose PRs or releases
   it needs first, and the branch it starts from.
3. **Integration branch.** Use one only when the final PR would exceed about
   1.5 million changed lines; above that size, diffs and PR guides fail, so
   implementation and review split into individual PRs. Record the branch
   name and reason in the Charter, or "none".
4. **Write.** Add each Track as `proposed`.

## Invariants

- Every Track has exactly one scope and one owning repository.
- The dependency graph has no cycle.

## Completion Evidence

- Track rows with scope, repository, route, depends-on and start branch
- the Charter Integration branch entry

## Declared Exits

- `complete` `tracks_split`: every scope is a `proposed` Track.
- `blocked` `dependency_cycle`: the scopes depend on each other in a cycle;
  the Ledger names the cycle and Intake re-routes the scopes.

## Durable Handoff

Write the Track rows and one Events line through
[the Track Ledger contract](../references/ledger.md).

## Stop Or Router Re-entry

Re-enter [the router](router.md).
