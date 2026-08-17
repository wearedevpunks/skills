---
name: requirements-grill
description: Requirements grilling with durable branch artifacts, glossary/axiom decisions, and optional wiki synthesis. Use when the user wants product or architecture requirements discovery, a long design interview, branch-by-branch decision closure, canonical terminology, compaction-safe grill logs/status updates, or wiki synthesis from closed grill decisions.
---

# Requirements Grill

Use this skill to turn uncertain product, architecture, or implementation ideas into pinned requirements, canonical glossary, and domain axioms that `create-spec` can compile after closure.

This skill composes `$domain-modeling` and `$grilling` with durable artifacts. Invoke `$domain-modeling` before the first question, then use `$grilling` for live interview behavior. Use `requirements-grill` when the result must survive as routed grill log/status/wiki knowledge.

This skill has three scoped references:

- Live grilling behavior: use `$grilling`, then see [references/grilling-flow.md](references/grilling-flow.md) for requirements-specific pressure tests
- Durable grill artifacts: see [references/artifact-output.md](references/artifact-output.md)
- Wiki synthesis from closed grill branches: see [references/wiki-output.md](references/wiki-output.md)

## Quick Routing

Use active grilling when the user is still iterating on requirements, terminology, tradeoffs, branch closure, or status percentages. During a serious grilling session, load both `grilling-flow` and `artifact-output`; the interview and durable artifacts move together.

Use wiki synthesis when the user asks to turn closed grill decisions into high-level routed wiki flows/concepts, or sync domain knowledge from grill artifacts.

Both workflows can happen in one long session, but keep the responsibilities distinct:

- `<wiki-root>/content/docs/project/grilling/<topic>-grill-log.md` and `<topic>-grill-status.md` are the detailed requirements and glossary record
- while the grill is active, the status glossary is `$domain-modeling`'s working persistence; leave canonical domain publication until explicit closure
- other routed `<wiki-root>/content/docs/project/` pages are the synthesized project knowledge surface
- closed shared understanding routes to `create-spec`; backlog projection is later and outside this skill's scope

## Core Behavior

- Use `$wait-what` to present every grilling question and recommendation to the user. A round is complete only when every frontier item has been presented, answered, parked, or explicitly deferred, and the updated durable artifacts are persisted before continuing.
- Give `$domain-modeling` the active status glossary before the first question. Invoke it whenever a round changes terminology, relationships, or domain decisions, and persist its accepted results through `artifact-output` before continuing.
- Inspect relevant routed learning artifacts before grilling requirements that depend on known behavior, prior bugs, project conventions, or domain facts.
- Record whether the work has technical consequences. For code- or architecture-bearing work, close the applicable topology, dependency direction, seams, boundaries, persistence, and module shape from current code evidence. Persist accepted design in the grill artifacts; keep `GLOSSARY.md` glossary-only.
- Prefer conservative defaults once enough context exists.
- If the user authorizes auto-pinning defaults, record obvious remaining defaults without needless extra questions.
- Treat parked branches as preserved knowledge, not deleted scope.
- Apply the round persistence contract in `artifact-output` alongside `$grilling`.
- After `$grilling` completes and the durable artifacts are current, invoke
  `$show-me` to present the persisted shared understanding before requesting
  approval. The completion signal comes from `$grilling`; treat the presentation
  as a derived view and persist any correction
  through `artifact-output`, then present the corrected state again. Approval
  applies to the durable artifacts, not the presentation.

## Handoff

At the end, report branch percentages, parked branches, remaining non-design validation work, and the recommended next planning direction.

After `$grilling` completes with shared understanding and all branches closed or explicitly parked, invoke `$domain-modeling` for a final consistency pass. After the user explicitly closes the grill, run wiki synthesis so accepted terms land at `<wiki-root>/content/docs/project/domains/<context>-glossary.mdx`, then hand the durable grill artifacts to `create-spec`. If grilling remains incomplete, return to Wayfinder instead of implying backlog readiness.
