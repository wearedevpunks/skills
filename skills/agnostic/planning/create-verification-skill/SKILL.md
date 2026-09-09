---
name: create-verification-skill
description: Create and prove the selected missing project app reference when implement-spec encounters an Uncovered Surface.
---

# Create Verification Skill

Create project-owned executable knowledge for the original selected scenario. The
single verification entrypoint remains `verify-behavior`; its Reference contract
owns the portable structure and safety rules. Read that contract before authoring.
[Upstream provenance](references/upstream.md) records the adaptation and source.

## Interview the repository

1. Retain the caller's original scenario, affected acceptance criteria, app scope,
   authority, code and runtime identities. Read scoped guidance and the existing
   Project Verifier index. Preserve existing app references, features, journeys and
   helpers; add only the missing surface coverage required by this scenario.
2. Read current code, entry points, manifests, startup scripts and existing harnesses,
   plus routed wiki specifications, behavior pages, flows and relevant domain
   knowledge. Answer from evidence: what the user touches; how it starts and becomes
   ready; how an agent drives it; which observations and side effects prove it;
   how concurrent instances, credentials and scratch state are isolated. Cite sources.
   Ask only for an unobservable prerequisite needed to continue.
3. Prefer the repository's supported command and existing browser, PTY, HTTP or native
   harness. Use stable selectors, commands or prompt strings. Missing build/runtime
   prerequisites require bounded authorized setup or an exact blocker. Product repair
   belongs to the invoking implementation/debugging workflow. Any diagnostic adapter
   must be marked setup-only and removed by Cleanup; it cannot replace a public action.

## Author the missing reference

Write only below `.agents/skills/verify-behavior/references/`, on the current delivery
branch and PR. Add a pointer to `<app>/README.md` in the project index, without copying
app mechanics there. The app README co-locates complete Launch, Doctor, Drive, Evidence,
Cleanup and helper invocation guidance. For a short-lived CLI, Launch prepares the
binary once and each Drive uses a fresh isolated session; servers use one owned
long-lived instance. Refuse ambiguous/shared instance ownership.

Create `features/README.md` and the selected feature files. Each feature links its
product/domain authority and states user entry, stable driver recipe, positive result,
Scenario Falsifier, applicable variants, side effects, prerequisites and gotchas.
Use the upstream four sections: Sub-features, How to get to it (user POV), Driving it
with the selected harness, Gotchas. Include a Relevant Negative Condition and actual
downstream result when important behavior warrants it. Broader map seeding waits for
selected scope or an explicit audit. Helpers, if needed, are executable, app-owned,
and have an explicit invocation condition and exact command. Finish with no unresolved
placeholders; retain existing bytes outside the selected coverage.

## Prove before readiness

Run the authored instructions, not an improvised substitute: Launch → Doctor → one
mapped public Drive → retain action/result/side-effect evidence → Cleanup → confirm
that retained evidence still exists outside cleanup targets. This is the Reference
Smoke Proof. Observe a claimed dry-run's actual effects rather than trusting its name.
After failure, retain evidence and clean owned residue on that iteration; restore known owned state,
then renew Doctor before another Drive. Protect secrets and user-owned state.

Return `ready` only with the complete Reference Smoke Proof, written paths, source
citations, original scenario/criteria, authority/code/runtime/scenario identities,
observed positive and falsifying conditions, evidence pointers and confirmed cleanup.
Otherwise return `blocked` with the exact attempted action, observed failure, attempted
recovery and missing prerequisite; the original scenario and affected criteria stay
blocked. A draft reference is never ready. Return control to `implement-spec`, which
owns acceptance and proof reuse; a smoke action alone may not satisfy the original
scenario. Point future Uncovered Behavior to `update-verification-skill`.
