# Phase Graph

Phases are the lifecycle entrypoints. Each phase composes skills and ends by handing control to the human or to the next phase. Family references hold each skill's steps; this file holds the routes between them.

## Route a task to its entry

| Task | Entry | Mode |
| --- | --- | --- |
| Shape a vague business or functional idea into Fog and backlog | `$business-finder` or `$functional-finder` (they run the `$finder-phase` engine) | explicit-only |
| Close unclear requirements or product decisions; produce ARCHITECTURE.md + SPEC.md + backlog + PLAN.md | `$requirements-phase` | explicit-only |
| Answer one precise unknown with a throwaway build | `$prototype-phase` (inside Finder) or `$prototype` (lean) | model-invoked |
| Turn brand and product evidence into committed Design-Owned UI Code on the real route | `$design-phase` | explicit-only |
| Implement an accepted spec, issue or plan end to end, AFK | `$delivery-phase` | explicit-only |
| Run delivery unattended under one goal | `$goalify`, with goal text that asks for end-to-end `$delivery-phase` | model-invoked |
| Run many cross-dependent scopes across threads and repositories AFK from one Orchestrator thread; it goes solo when the scopes are not cross-dependent and big | `$orchestrator-phase` | explicit-only |
| Review a diff, branch, PR or artifact | `$review-phase` | explicit-only |
| Investigate a runtime failure, crash or broken flow | `$debugging-phase` | model-invoked |
| Hunt many bugs across a codebase (ClawPatch) | `$bug-discovery-phase`, then `$bug-resolution-phase` | explicit-only |
| Resolve one tech debt item | `$resolve-debt-phase` | explicit-only |
| Capture knowledge or update docs after a proven change | `$docs-ingest-phase` | model-invoked |
| Reconstruct wiki knowledge for an existing project | `$docs-onboarding` | model-invoked |
| Readonly investigation across independent surfaces | `$parallel-research` | model-invoked |

## Confirm to continue

This is the one rule for how an explicit-only phase starts. Other skills link here instead of restating it.

A human starts an explicit-only phase in one of four ways:

1. **Typed command.** The human types `$<phase>`, directly or in a `$goalify` goal text.
2. **Named proposal.** A phase ends and an explicit-only phase is next. The agent names that phase and its scope (goal, input artifacts, where it stops) and asks to continue. A human yes to that named proposal starts the phase. A bare yes to a vague or unnamed proposal starts nothing: the agent names the phase and scope, then asks again. Inside `$delivery-phase`, the stop report names the phase and scope and asks nothing; the human's later message that starts it counts as the yes.
3. **Full Delivery inner step.** A Full Delivery the human started already approves its own inner steps: `$review-phase` at `review_due`, and the return to `$requirements-phase` for a missing, stale or changed Architecture/SPEC pair, backlog projection or plan, including a scope change. The agent continues without asking again. Inside them every pending user question is an [Autonomous Decision](../../delivery-phase/SKILL.md#afk); a scope change is out-of-bounds and posted to the thread at once.
4. **Orchestrator brief.** An open `$orchestrator-phase` the human started approves the phases its Tracks run. The Orchestrator's brief or message that names the phase and scope starts it in the Track, including `$delivery-phase` after the Track reports `grill closed`.

After a start by 2, 3 or 4, the agent reads `.agents/skills/<phase>/SKILL.md` with a file read and follows it. The Skill tool refuses a skill with `disable-model-invocation: true`, so the file read is the way in. On Codex, `allow_implicit_invocation: false` stops only the agent choosing the skill from its description; it does not block this file read, so the rule is the same on both harnesses.

In every other case the agent ends its turn with the named proposal.

## Handoffs

```text
$business-finder | $functional-finder → $finder-phase ⇄ $prototype-phase
        └─ returns to human ─→ $requirements-phase
$brainstorm (proposal loop, one $show-me view per turn; no branch, commit, worktree or implementation agent) ─ Brainstorm Brief ─→ $requirements-grill
$requirements-phase → $requirements-grill → ($create-architecture ∥ $create-spec draft ∥ plan discovery)
        → $create-spec join → ($write-backlog ∥ $create-plan) → plan join
        └─ result ─→ $delivery-phase
$design-phase → (grill, brand, design system, optional compose, motion plan, variant rounds ⇄ quality gate, verdict, promote, backlog) ─ brief ─→ human → $delivery-phase
$resolve-debt-phase (accepted) → $create-spec ─ brief ─→ human → $delivery-phase
$delivery-phase (Plan Complete entry gate; missing or stale plan → $requirements-phase) → $implement-spec → $verify-behavior → $review-phase
        → repair | $debugging-phase | debt capture → $docs-ingest-phase → closeout ($write-backlog status)
$debugging-phase ⇄ $delivery-phase (entry on verify mismatch or review route; returns evidence)
$bug-discovery-phase ─ human ─→ $bug-resolution-phase → $debugging-phase | $docs-ingest-phase
$goalify → active goal → $delivery-phase (full delivery when the goal asks for it)
$orchestrator-phase → Tracks ($requirements-phase ─ grill closed ─→ $delivery-phase in the same thread | $delivery-phase | $debugging-phase) ─ ready ─→ Orchestrator merges, ships, verifies
        └─ go solo ─→ Solo Thread runs the routed phase itself; work grows ─→ reopen through a fork + $handoff
```

## What each phase composes

| Phase | Composes | Ends with |
| --- | --- | --- |
| `$finder-phase` | `$grilling`, `$parallel-research`, `$prototype-phase`, `$write-backlog`, `$wait-what`, `$show-me` | bounded result or `human_steering_required`; control to the human |
| `$requirements-phase` | `$requirements-grill` (Altitude-routed graph with `$grilling`, `$flow-lenses`, `$domain-modeling`, `$wait-what`, `$show-me`), `$create-architecture`, `$create-spec`, `$write-backlog`, `$create-plan` (with `$swarm-planner`, `$tdd`, `$codebase-design`) | retained architecture/spec pair, backlog IDs and retained `PLAN.md`, or a blocked result |
| `$prototype-phase` | `$prototype`, `$show-me` | committed `PROTOTYPE-VERDICT.md` returned to the Finder gate |
| `$design-phase` | `$requirements-grill`, `$brandkit`, `$shadcn`, `$expo-tailwind-setup`, `$imagegen-frontend-web`, `$imagegen-frontend-mobile`, `$find-animation-opportunities`, `$prototype-variants`, `$design-taste-frontend`, `$image-to-code`, `$emil-design-eng`, `$animate`, `$animate-expo`, `$mobile-native`, `$break-ui`, `$review-animations`, `$repo-asset-management` | delivery brief; the human invokes `$delivery-phase` |
| `$delivery-phase` | `$implement-spec` (with `$tdd`, `$simplify`, `$verify-behavior`, `$create-verification-skill`, `$update-verification-skill`), `$review-phase`, `$debugging-phase`, `$docs-ingest-phase`, `$write-backlog`, `$repo-asset-management` | closeout: commit, push, CI, backlog status readback |
| `$review-phase` | `scripts/review.mjs`, one fresh reviewer subagent, `$show-me` | one committed Pass Report and one return route |
| `$debugging-phase` | `$verify-behavior` (reproduce), `$debug-agent`, `$show-me`, `$parallel-research` | cited cause and bounded fix, or evidence returned to delivery |
| `$bug-discovery-phase` | ClawPatch CLI | ranked findings; stops before mutation |
| `$bug-resolution-phase` | `$debugging-phase`, `$docs-ingest-phase` | resolved, triaged or blocked findings |
| `$resolve-debt-phase` | `$parallel-research`, `$create-spec` | decision request, delivery brief, or resolved debt file |
| `$docs-ingest-phase` | `$docs-onboarding`, `$writing-fragments` → `$writing-beats` → `$writing-shape`, `$show-me` | ingest outcome plus `log.md` entry |
| `$goalify` | none | one active goal |
| `$orchestrator-phase` | Tracks running `$requirements-phase`, `$delivery-phase`, `$debugging-phase`; Workers; `$handoff`, `$secrets-cli`, `$agent-browser`, `$verify-behavior`, `$model-checking`, `$wait-what` | settled Tracks and a closed Ledger, or a Solo Thread |

## Standalone skills

Model-invoked skills that no phase must call, reached by their own trigger: `$brainstorm`, `$improve-codebase-architecture`, `$make-tsuite`, `$security-best-practices`, `$audit-cicd-security`, `$architect-pipeline`, `$handoff`, `$hi-cli`, `$wayfinder`, `$writing-for-agents`, `$write-graph-based-skills`, and the framework and language Pack skills. `$rule-authoring` runs only from `hi init` or `hi update` handoffs.

**Source:** `.agents/skills/<phase>/SKILL.md` and its `phases/router.md` when present.
