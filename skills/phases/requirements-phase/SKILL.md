---
name: requirements-phase
description: Close bounded product decisions, project the accepted delivery backlog, and retain its execution plan.
disable-model-invocation: true
---

# Requirements Phase

Requirements Phase is independently invocable. It is the only orchestration
route for `requirements-grill -> create-architecture -> create-spec -> write-backlog -> create-plan`.
After grill closure it runs that chain as parallel **lanes** that meet at
**joins**: each join waits only for the identity it binds.

## Inputs

- Direct bounded requirements input, including any narrower caller-supplied
  provider projection boundary. This route creates no Fog or Finder
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
   this step when every material branch is settled at its Target Altitude or
   explicitly parked.
4. **Compile wave.** When the user confirms shared understanding and the
   remaining branches are closed or explicitly parked, start three lanes at
   once from the same grill status and log. The architecture lane is the
   critical path and runs in this agent; the other two run in subagents.
   - **Architecture lane:** invoke `create-architecture`. Require its
     artifact contract in the installed `create-architecture` skill's
     `references/artifact-contract.md`:
     sibling `ARCHITECTURE.md`, `status: compiled`, `readiness: agent-ready`, exact
     source identities and accepted details, and verified retained blob URL.
     Architecture compilation requires no spec input.
   - **Spec lane** (subagent): invoke `create-spec` in draft mode: its steps
     1 to 4 from the confirmed sources, with the candidate written outside the
     planning surface. The draft waits for no architecture.
   - **Discovery lane** (subagent): run `planning-discovery` for
     `create-plan`; when a backlog provider is configured, also run step 1 of `write-backlog` to
     prove the destination. Both are readonly.

   Complete this step when every lane returns. An `architecture-not-ready`
   result discards the spec draft and returns each exact gap to its upstream
   owner; unresolved decisions return to `requirements-grill`. A missing
   backlog destination returns its exact `hi ensure` guidance now.
   With no subagents, run the spec and discovery lanes inline after the
   architecture lane; the joins stay.
5. **Spec join.** After `architecture-written`, invoke `create-spec` with that
   exact retained architecture, the spec lane's draft, and the same confirmed
   sources. Create Spec checks the draft against the architecture, assigns
   real outcome and criterion codes, completes the architecture's canonical Spec traceability
   mapping, and retains the enriched architecture before binding its final
   immutable identity in the spec. This metadata amendment accepts no new design.
   The compiler preserves source question anchors and unchanged codes/selectors.
   This order applies to every delivery, including existing, resumed and local
   work; reuse only current, matching retained artifacts with complete mapping.
6. Require `create-spec` to verify both retained artifact URLs and the spec's
   reference to the enriched architecture, then push or explicitly retain the
   spec commit before `write-backlog` can run. Pending or unresolved mappings and
   local-only artifacts return the compiler's atomic `spec-not-ready` result.
7. **Projection wave.** After `spec-written`, start both lanes at once:
   - **Backlog lane** (subagent): honor the caller's accepted provider
     projection boundary; missing authority returns a blocked backlog delta
     while retaining the compiled pair. Pass the verified stable blob URL and
     current provider evidence to `write-backlog`. Write Backlog derives the
     Stories, Tasks, and blocker graph supported by the accepted result. With
     no prior Finder projection, it may reuse, enrich, or create the
     accepted placement through Product Area, Initiative, and Epic before
     placing those delivery items.
     Each Story is a shippable product outcome.
     Each Task is atomic, independently
     ownable, and understandable from its Story and stable specification.
     With no backlog provider configured, this lane does not start.
   - **Plan lane** (this agent, since `create-plan` may grill the user): invoke
     `create-plan` with the retained pair and the discovery lane's report. It
     runs every step before its task graph while the backlog lane runs.
8. **Plan join.** Route on the Write Backlog result. A written result resumes
   `create-plan` at its task graph with that result. With no backlog provider,
   `create-plan` continues at once with `task_identity_mode: planning-only`.
   A blocked result (a configured provider failed or authority is missing)
   stops this phase with no plan and returns the exact blocked delta.
   Require `create-plan` to commit and push or explicitly retain `PLAN.md`,
   then verify its immutable blob URL resolves bytes matching the plan. Complete
   this step when the retained plan is verified or the blocked result returns.
9. Return one stable Requirements result naming the retained architecture,
   specification and plan, their exact identities and verified stable blob URLs,
   plus the Write Backlog result and exact residual delta. The result is ready
   for `delivery-phase`.

Write every message the user reads in this phase, including relayed subagent
reports, through `$wait-what`.

## Boundary

Requirements Phase owns decision closure, compilation order, lane scheduling,
and authorization
of delivery-depth projection. `write-backlog` owns hierarchy derivation,
provider mechanics, mutation approval, and readback. `create-plan` owns the
task graph and `PLAN.md` retention. Finder remains optional
context and owns no part of this workflow.

Grilling-child, specification, Story, and Task cardinality are outputs of the
accepted requirements and current evidence, never invocation prerequisites.
