---
name: brainstorm
description: Brainstorm a bounded system from the operating agent’s perspective. Use when asked to brainstorm a system or another skill invokes `$brainstorm`.
---

# Brainstorm

1. Bound the system, operator, accepted constraints, and available evidence.
   Mark every unsupported premise unknown.
2. Put yourself in the operating agent's seat. Ask: "What would most enable me
   to understand the situation accurately and control it optimally, producing
   the best and most accurate results with the least expenditure of resources?"
   Conceptualize the project as one synthetic SYSTEM: maximally coherent,
   cohesive, modular, interconnected; a tower of linked abstractions maximally
   legible to an agent. Trace intake, state, control, feedback, recovery, and
   handoff through that tower. Account for each applicable surface with
   evidence, or record why it does not apply.
   For software flows, apply Flow failure lenses below. Account for each lens
   with grounded findings, an explicit unknown, or a reason it does not apply.
   Surface material gaps as candidate decisions within the accepted scope.
3. Derive the smallest changes that make the system agent-intuitive (clear
   meaning), agent-ergonomic (efficient control), and agent-accretive (reusable
   verified knowledge benefiting later runs). For each candidate, state
   evidence, consequence, and unresolved tradeoff, including required
   design-document and plan changes. Apply document or plan edits only when
   authorized by the caller; otherwise propose them. Completion requires
   reconciling every affected design document and plan when edits are
   authorized, and reporting unresolved inconsistencies across abstractions.
4. Return evidence-grounded observations and unresolved decisions. Completion
   requires every observation to trace to evidence or an explicit unknown.
   Observations remain candidates until the caller accepts them.

### Flow failure lenses

Approach the problem through an end-to-end control-flow, state-consistency and failure-recovery lens. Examine:

1. Entry points and path convergence: where can this behavior start? Do equivalent actions reach the same rules, or take divergent/bypass paths?
2. Critical execution paths: what must happen, in which order? Where does execution branch, wait, delegate or continue asynchronously?
3. State ownership and authority: what state changes, who owns it, who may change it, and which representation is authoritative?
4. Transaction and side-effect boundaries: what commits together? Which effects occur outside that boundary? What intermediate states can become visible?
5. Concurrency and stale state: what if two actors run this simultaneously, or state changes between validation and execution?
6. Idempotency and retries: what happens when a request is repeated, execution resumes, or an acknowledgement is lost after success?
7. Partial failure and recovery: what remains after failure at each boundary? Can we safely retry, reconcile, compensate or roll back?
8. Execution lifetime and durability: what survives a disconnect, cancellation or process crash? Who owns unfinished work?
9. Lifecycle and dependency transitions: what happens during creation, update, replacement and removal? What still depends on the old state?
10. Completion and observability: what proves the requested outcome occurred? Can an operator distinguish accepted, applied, running, failed and partially complete?

Use these lenses to surface missing architectural decisions before treating the flow as understood. Ground concerns in the actual system; propose mechanisms only for supported risks.

Completion: each applicable lens is covered by evidence or an explicit unknown; non-applicable lenses have a reason. Each material gap is recorded as a candidate decision, with its evidence or unknown and the guarantee at stake.
