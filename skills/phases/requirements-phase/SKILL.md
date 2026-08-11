---
name: requirements-phase
description: Close bounded product decisions through requirements-grill, then compile confirmed outcomes into an agent-ready spec.
disable-model-invocation: true
---

# Requirements Phase

Human-centric decision closure: `requirements-grill -> create-spec`.

## Workflow

1. Read existing grill status before its log. Summarize accepted, rejected,
   superseded, parked, and unresolved branches.
2. While material decisions remain open, use `requirements-grill` for the HITL
   interview. Research and recommendations are evidence, not decisions.
3. When the user confirms shared understanding and remaining branches are
   closed or explicitly parked, invoke `create-spec` immediately.
4. Require `create-spec` to push or explicitly retain the spec commit, verify the retained ref contains the spec commit, and construct and verify a stable blob URL before `write-backlog` can run. A local SHA plus path is insufficient; otherwise return the compiler's atomic `spec-not-ready` result.

## Boundary

This phase does not create delivery backlog or implementation plans. After
`spec-written`, its verified stable blob URL must exist before `write-backlog`
may project the provider-neutral spec, followed by `delivery-phase` /
`create-plan`.
