# Router Phase

Choose one next phase from current durable authority.

1. Apply [context continuity](../references/context-continuity.md): select
   trigger-specific instructions, validate required pointers and warm/cold mode.
   A failed resolution emits the common Phase Result and blocks its action.
2. Preserve terminal `human_steering_required` until current user direction
   resolves the required decision. New boundary evidence selects
   [human-steering.md](human-steering.md).
3. For failed tasks or repair evidence, apply
   [failure continuity](../references/failure-continuity.md). Independent eligible
   work continues through the implementation owner's gates.
4. Recover review lineage, valid completed ordinals and durable active repair
   state separately from current evidence freshness. Review due, retention pending,
   unrouted findings, or budget decisions select [review.md](review.md), the sole
   delivery review-transition authority. It validates bounds and target before
   budget evaluation and distinguishes incomplete attempts from completed passes.
   Resume `debug_active` through [debug.md](debug.md), `repair_active` through
   [implement.md](implement.md), and debt capture through [review.md](review.md).
   Route legacy `focused_validation` to its recorded implementation/debugging
   owner and `clean_handoff` to remaining docs or closeout after checking proof.
   Reuse recorded run IDs and debt keys; a resume cannot consume them twice.
5. Before planning, require a matching agent-ready `SPEC.md` with verified remote
   retention and its current Write Backlog result through the
   [Spec Complete and Backlog Projection Complete gates](../references/artifact-state.md).
   Missing, stale or contradictory required proof routes the exact gap to
   Requirements Phase before planning. It owns Requirements Grill, Create Spec
   and Write Backlog. Valid current proof proceeds without a new approval gate;
   optional Finder context is passed only when supplied, never manufactured.
6. A missing or stale execution plan selects [plan.md](plan.md). Incomplete plan
   work, invalidated implementation evidence or an observed provider lifecycle
   fact lacking exact readback selects [implement.md](implement.md).
7. Completed implementation needing Code Review selects [review.md](review.md).
   Accepted repair follows that same transition authority's Focused Repair
   Validation and risk-triggered second-pass rules. Passing ordinary focused
   checks proceed without automatically reopening Code Review.
8. Remaining docs-affecting work selects [docs-ingest.md](docs-ingest.md), otherwise
   [closeout.md](closeout.md). A fresh completed closeout needs no repeated mutation.

Read only the selected phase. Each exit emits the common Phase Result. Full
Delivery re-enters here; other modes stop at the requested boundary. An unclear
goal blocks with the exact missing authority rather than inferred scope.

Same-goal revision, resume, rebase, commit, retry and handoff preserve review
lineage and historical counts. Only an explicitly new delivery goal with new
accepted bounds establishes a new lineage; read-time legacy normalization never
resets valid report identities or ordinals.
