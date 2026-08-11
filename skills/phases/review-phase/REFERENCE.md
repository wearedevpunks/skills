# Review Phase Reference

Load [references/targets.md](references/targets.md) for target normalization,
identity, or resume. Load
[references/state-graph.md](references/state-graph.md) for delivery budget,
failure, retention, routing, repair, or final-fix behavior. Load
[references/durable-report.md](references/durable-report.md) before writing or
retaining a report.

## One All-Lens Run

Evaluate exactly one frozen bounded snapshot per completed invocation.

1. Run `autoreview` exactly once as advisory candidate generation. A ClawPatch
   helper, when present, stays inside that call and consumes no additional pass.
2. The parent verifies all advisory candidates against the frozen target and
   adjacent evidence. Only verified candidates become findings.
3. Dispatch independent lenses against the same snapshot in parallel:
   - Standards
   - skill adherence and scoped skills
   - architecture
   - simplify
   - Spec
4. Record an explicit outcome for every lens. Standards and skill adherence,
   architecture, simplify, then Spec controls presentation and triage order
   only. Parallel execution is unchanged. Standards and Spec stay distinct
   report sections without cross-axis merging or reranking.

The `review` skill supplies separate Standards and Spec checks. Apply
`improve-codebase-architecture`, `simplify`, the nearest `AGENTS.md`, and every
named scoped skill as their own bounded lenses.

## Skill-Adherence Lens

Treat `assigned_skills` as planning provenance. For every implementation task:

1. Match every implementation-applicable `assigned_skills` item to exactly one
   `implementation_skill_guidance` entry.
2. Match every guidance entry to exactly one `IMPLEMENTATION-NOTES.md` evidence
   record.
3. Check evidence cardinality and every record, including `not_applicable`,
   against frozen changed artifacts and the cited how/where location.
4. Report missing, extra, or contradicted claims as a skill-adherence finding.

When a requirements or design wrapper claims grilling behavior, verify its
named guidance, routed log/status artifacts, stable question mapping, carried
unanswered questions, and downstream synthesis evidence instead of accepting
the wrapper claim alone.

## Validation Boundary

Run the smallest safe readonly validation needed to verify candidates or
governing acceptance evidence. Broader checks run only when the accepted spec
or plan explicitly requires them. Missing required RED/GREEN evidence becomes
a reported and routed finding; review never creates that evidence.

Before every validation command, record the frozen-target hash. A command may
run against the reviewed checkout only when its no-write mode is proven. Run any
command that may write caches, generated files, snapshots, lockfiles, or other
state in a disposable checkout or snapshot rooted at the frozen revision.

Always recompute and compare the frozen-target hash after validation. A mismatch
invalidates the run and any local report, returns `review_due` with exact
mutation evidence, and consumes no pass. Record exact commands, isolation mode,
before/after hashes, sources, skipped checks, and residual risk. Keep this
validation bounded; isolation is a safety boundary, not permission to broaden
the test surface.

Use the executable before/after decision in
[`scripts/review-contract.mjs`](scripts/review-contract.mjs); mutation returns
`review_due` and consumes no pass.

## Finding And Route Output

Every stable finding records severity, location, impact, evidence, and action.
Determine route precedence from verified evidence:

1. runtime evidence: debugging
2. otherwise, an in-scope non-runtime blocker: implementation
3. otherwise, broad architecture debt: debt follow-up
4. otherwise: documentation ingest or closeout by documentation completeness

Broad architecture debt may accompany debugging or implementation as a
secondary follow-up. Review returns this routing output and stops. Delivery
owns route mutation and repairs.
