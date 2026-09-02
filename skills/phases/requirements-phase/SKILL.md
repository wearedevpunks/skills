---
name: requirements-phase
description: Close bounded product decisions and project the accepted delivery backlog.
disable-model-invocation: true
---

# Requirements Phase

Requirements Phase is independently invocable. It is the only orchestration
route for `requirements-grill -> create-spec -> write-backlog`.

## Inputs

- Direct bounded requirements input. This route creates no Fog or Finder
  artifact and no Grilling provider item implicitly.
- Optional Finder context, only when the caller supplies a Fog, Finder child,
  Research child, Prototype child, or durable Finder handoff. Resolve the exact
  identity and its owning Fog graph. Load only that graph. Requirements Phase
  does not load or take ownership of sibling work.

The optional context loader is an input adapter to this phase, not a second
workflow or a Finder lifecycle owner.

## Workflow

1. Select the applicable input contract above. Complete entry when the direct
   scope is bounded or the supplied context graph resolves exactly.
2. Read the matching `requirements-grill` status before its log. Summarize
   accepted, rejected, superseded, parked, and unresolved branches. If no
   matching status exists, start the bounded Requirements Grill directly.
3. While material decisions remain open, use `requirements-grill` for the HITL
   interview. Research recommendations are evidence, not decisions. Complete
   this step when every material branch is accepted or explicitly parked.
4. When the user confirms shared understanding and the remaining branches are
   closed or explicitly parked, invoke `create-spec` immediately. Create Spec
   compiles the accepted outcomes without choosing provider Story or Task
   identities.
5. Require `create-spec` to push or explicitly retain the spec commit, verify
   the retained ref contains the spec commit, and construct and verify a stable
   blob URL before `write-backlog` can run. A local SHA plus path is
   insufficient; otherwise return the compiler's atomic `spec-not-ready`
   result.
6. After `spec-written`, pass the verified stable blob URL and current provider
   evidence to `write-backlog`. Write Backlog derives the Stories, Tasks, and
   blocker graph supported by the accepted result. With no prior Finder
   projection, it may reuse, enrich, or create the accepted placement through
   Product Area, Initiative, and Epic before placing those delivery items. Each
   Story is a shippable product outcome. Each Task is atomic, independently
   ownable, and understandable from its Story and stable specification.
7. Return one stable Requirements result naming the retained specification and
   its verified stable blob URL, plus the Write Backlog result and exact
   residual delta. The result is ready for `delivery-phase` and `create-plan`.

## Boundary

Requirements Phase owns decision closure, compilation order, and authorization
of delivery-depth projection. `write-backlog` owns hierarchy derivation,
provider mechanics, mutation approval, and readback. Finder remains optional
context and owns no part of this workflow.

Grilling-child, specification, Story, and Task cardinality are outputs of the
accepted requirements and current evidence, never invocation prerequisites.
