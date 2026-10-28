# Router Phase

Choose one next phase from current durable authority.

1. Apply [context continuity](../references/context-continuity.md): select
   trigger-specific instructions, validate required pointers and warm/cold mode.
   A failed resolution emits the common Phase Result and blocks its action.
2. Preserve terminal `human_steering_required` until current user direction
   resolves the required decision. New boundary evidence selects
   [human-steering.md](human-steering.md).
3. Before any dependent dispatch, require the
   [Architecture/SPEC Pair Complete gate](../references/artifact-state.md#architecturespec-pair-complete)
   for every delivery, including existing, resumed and local work. Missing,
   stale or conflicting architecture/spec proof routes the exact gap to
   Requirements Phase / `requirements-grill` before review, repair, debug,
   implementation or closeout can resume. Preserve committed Pass Reports.
4. For failed tasks or repair evidence, apply
   [failure continuity](../references/failure-continuity.md). Independent eligible
   work continues through the implementation owner's gates.
5. Read `pass_count` from the [review-phase](../../review-phase/SKILL.md)
   `scripts/review.mjs status --goal <goal_dir>` and durable active repair state
   separately from current evidence freshness. Review due, an active review run,
   an unrouted Pass Report, or a budget decision selects [review.md](review.md),
   the sole delivery review-transition authority. It validates bounds before the
   pass budget.
   Resume `debug_active` through [debug.md](debug.md), `repair_active` through
   [implement.md](implement.md), and debt capture through [review.md](review.md).
   Route legacy `focused_validation` to its recorded implementation/debugging
   owner and `clean_handoff` to remaining docs or closeout after checking proof.
   Reuse recorded run IDs and debt keys; a resume cannot consume them twice.
6. Before planning, require the pair's agent-ready `SPEC.md` with verified remote
   retention and its current Write Backlog result through the
   [Backlog Projection Complete gate](../references/artifact-state.md#backlog-projection-complete).
   Missing, stale or contradictory required proof selects [spec.md](spec.md),
   which routes the exact gap to Requirements Phase before planning. It owns Requirements Grill, Create Architecture,
   Create Spec, Write Backlog and Create Plan. Valid current proof proceeds without a new approval gate;
   optional Finder context is passed only when supplied, never manufactured.
7. Require the retained execution plan through the
   [Plan Complete gate](../references/artifact-state.md#plan-complete). A
   missing or stale plan selects [spec.md](spec.md), which routes it to
   Requirements Phase; delivery creates no plan. Incomplete plan work or
   invalidated implementation evidence selects [implement.md](implement.md).
8. Every completed implementation selects [review.md](review.md) until a valid
   Pass Report covers this delivery. No delivery
   reaches docs ingest or closeout without one. `review-phase` starts every
   review engine; phases and workers reach Code Review only through it.
   Accepted repair follows that same transition authority's Focused Repair
   Validation and risk-triggered second-pass rules. Passing ordinary focused
   checks proceed without automatically reopening Code Review.
9. Remaining docs-affecting work selects [docs-ingest.md](docs-ingest.md), otherwise
   [closeout.md](closeout.md). A fresh completed closeout needs no repeated mutation.

**Ticket live state.** In `provider-task` mode, every phase records each
[Delivery Checkpoint](../../../agnostic/requirements/write-backlog/references/delivery-status.md#delivery-checkpoints)
it passes through `write-backlog`'s delivery-status branch, with exact
readback, before its exit. On every entry, the router reads back the linked
Tasks first; a stale ticket gets its missing fact recorded before any phase is
selected.

Read only the selected phase. Each exit emits the common Phase Result. Full
Delivery re-enters here; other modes stop at the requested boundary. An unclear
goal blocks with the exact missing authority rather than inferred scope.

Same-goal revision, resume, rebase, commit, retry and handoff keep the goal's
Pass Reports, so its pass count persists. Only an explicitly new delivery goal
with new accepted bounds starts a new `reviews/` folder and count.
