# Routing

`retain` derives the Pass Report `route` from the findings' `return_route`
values. `primary` is the highest present route in the order
`human_steering_required` > `debugging` > `implementation` >
`debt_follow_up` > `docs_ingest`; no findings give `closeout`.
`secondary_debt` is true when a `debt_follow_up` finding sits beside a primary
`debugging` or `implementation`. The route comes only from the Pass Report;
delivery state and caller preference leave it unchanged.

| `primary` | `secondary_debt` | Delivery transition |
| --- | --- | --- |
| `human_steering_required` | either | Stop. Return the blocking findings, their evidence and the exact decision needed. Delivery stays out of repair and resumes when current user direction resolves the decision. |
| `debugging` | `true` | Enter `debt_follow_up` first with `post_debt_route: debugging`, then open scoped debugging. |
| `debugging` | `false` | Open scoped debugging. |
| `implementation` | `true` | Enter `debt_follow_up` first with `post_debt_route: implementation`, then open the implementation repair. |
| `implementation` | `false` | Open the implementation repair. |
| `debt_follow_up` | `false` | Enter `debt_follow_up` with `post_debt_route: docs_ingest` when documentation remains, otherwise `closeout`. |
| `docs_ingest` | `false` | Enter docs ingest. |
| `closeout` | `false` | Enter closeout. |

Debt capture writes each debt finding to the goal's debt artifact exactly once,
keyed by Pass Report path and finding `id`, then follows `post_debt_route`.

Delivery opens a repair route in one handoff write of the active state, the
route, `pass_report` and `review_run_id`. A later write for the same
`review_run_id` is a resume of that transition, not a new repair.

Standalone review returns the route to the operator; no delivery transition
follows.
