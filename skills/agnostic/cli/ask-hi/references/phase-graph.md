# Phase Graph

Phases are the lifecycle entrypoints. Each phase composes skills and ends by handing control to the human or to the next phase. Family references hold each skill's steps; this file holds the routes between them.

## Route a task to its entry

| Task | Entry | Mode |
| --- | --- | --- |
| Shape a vague business or functional idea into Fog and backlog | `$business-finder` or `$functional-finder` (they run the `$finder-phase` engine) | explicit-only |
| Close unclear requirements or product decisions; produce ARCHITECTURE.md + SPEC.md + backlog + PLAN.md | `$requirements-phase` | explicit-only |
| Answer one precise unknown with a throwaway build | `$prototype-phase` (inside Finder) or `$prototype` (lean) | model-invoked |
| Turn brand and product evidence into committed Design-Owned UI Code on the real route | `$design-phase` | explicit-only |
| Implement an accepted spec, issue or plan end to end | `$delivery-phase` | explicit-only |
| Run delivery unattended under one goal | `$goalify`, with goal text that asks for end-to-end `$delivery-phase` | model-invoked |
| Review a diff, branch, PR or artifact | `$review-phase` | explicit-only |
| Investigate a runtime failure, crash or broken flow | `$debugging-phase` | model-invoked |
| Hunt many bugs across a codebase (ClawPatch) | `$bug-discovery-phase`, then `$bug-resolution-phase` | explicit-only |
| Resolve one tech debt item | `$resolve-debt-phase` | explicit-only |
| Capture knowledge or update docs after a proven change | `$docs-ingest-phase` | model-invoked |
| Reconstruct wiki knowledge for an existing project | `$docs-onboarding` | model-invoked |
| Readonly investigation across independent surfaces | `$parallel-research` | model-invoked |

An explicit-only entry starts only when the human types it. When an agent finds one is next, it names the command and stops.

## Handoffs

```text
$business-finder | $functional-finder → $finder-phase ⇄ $prototype-phase
        └─ returns to human ─→ $requirements-phase
$brainstorm (proposal loop, one $show-me view per turn; no branch, commit, worktree or implementation agent) ─ Brainstorm Brief ─→ $requirements-grill
$requirements-phase → $requirements-grill → $create-architecture → $create-spec → $write-backlog → $create-plan
        └─ result ─→ $delivery-phase
$design-phase → (grill, brand, design system, compose, motion plan, variant rounds ⇄ quality gate, verdict, promote, backlog) ─ brief ─→ human → $delivery-phase
$resolve-debt-phase (accepted) → $create-spec ─ brief ─→ human → $delivery-phase
$delivery-phase (Plan Complete entry gate; missing or stale plan → $requirements-phase) → $implement-spec → $verify-behavior → $review-phase
        → repair | $debugging-phase | debt capture → $docs-ingest-phase → closeout ($write-backlog status)
$debugging-phase ⇄ $delivery-phase (entry on verify mismatch or review route; returns evidence)
$bug-discovery-phase ─ human ─→ $bug-resolution-phase → $debugging-phase | $docs-ingest-phase
$goalify → active goal → $delivery-phase (full delivery when the goal asks for it)
```

## What each phase composes

| Phase | Composes | Ends with |
| --- | --- | --- |
| `$finder-phase` | `$grilling`, `$parallel-research`, `$prototype-phase`, `$write-backlog`, `$wait-what`, `$show-me` | bounded result or `human_steering_required`; control to the human |
| `$requirements-phase` | `$requirements-grill` (Altitude-routed graph with `$grilling`, `$flow-lenses`, `$domain-modeling`, `$wait-what`, `$show-me`), `$create-architecture`, `$create-spec`, `$write-backlog`, `$create-plan` (with `$swarm-planner`, `$tdd`, `$codebase-design`) | retained architecture/spec pair, backlog IDs and retained `PLAN.md`, or a blocked result |
| `$prototype-phase` | `$prototype`, `$show-me` | committed `PROTOTYPE-VERDICT.md` returned to the Finder gate |
| `$design-phase` | `$requirements-grill`, `$brandkit`, `$shadcn`, `$expo-tailwind-setup`, `$imagegen-frontend-web`, `$imagegen-frontend-mobile`, `$find-animation-opportunities`, `$prototype-variants`, `$design-taste-frontend`, `$image-to-code`, `$emil-design-eng`, `$animate`, `$animate-expo`, `$mobile-native`, `$break-ui`, `$review-animations`, `$repo-asset-management` | delivery brief; the human invokes `$delivery-phase` |
| `$delivery-phase` | `$implement-spec` (with `$tdd`, `$simplify`, `$verify-behavior`, `$create-verification-skill`, `$update-verification-skill`), `$review-phase`, `$debugging-phase`, `$docs-ingest-phase`, `$write-backlog`, `$repo-asset-management` | closeout: commit, push, CI, backlog status readback |
| `$review-phase` | `scripts/review.mjs` (two Axis Runs with Engine Fallback), one Adjudicator subagent, `$show-me` | one committed Pass Report and one return route |
| `$debugging-phase` | `$verify-behavior` (reproduce), `$debug-agent`, `$show-me`, `$parallel-research` | cited cause and bounded fix, or evidence returned to delivery |
| `$bug-discovery-phase` | ClawPatch CLI | ranked findings; stops before mutation |
| `$bug-resolution-phase` | `$debugging-phase`, `$docs-ingest-phase` | resolved, triaged or blocked findings |
| `$resolve-debt-phase` | `$parallel-research`, `$create-spec` | decision request, delivery brief, or resolved debt file |
| `$docs-ingest-phase` | `$docs-onboarding`, `$writing-fragments` → `$writing-beats` → `$writing-shape`, `$show-me` | ingest outcome plus `log.md` entry |
| `$goalify` | none | one active goal |

## Standalone skills

Model-invoked skills that no phase must call, reached by their own trigger: `$brainstorm`, `$improve-codebase-architecture`, `$make-tsuite`, `$security-best-practices`, `$audit-cicd-security`, `$architect-pipeline`, `$handoff`, `$hi-cli`, `$wayfinder`, `$writing-for-agents`, `$write-graph-based-skills`, and the framework and language Pack skills. `$rule-authoring` runs only from `hi init` or `hi update` handoffs.

**Source:** `.agents/skills/<phase>/SKILL.md` and its `phases/router.md` when present.
