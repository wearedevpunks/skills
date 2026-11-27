# Known Gaps

Behavior that surprises operators even though the skills agree on it, plus the few seams still open. Check the installed files first: a later Baseline may have changed them.

## Expected but surprising

- Entry phases (`$requirements-phase`, `$delivery-phase`, `$design-phase`, `$review-phase`, the Finder wrappers, `$resolve-debt-phase`, the bug phases, `$orchestrator-phase`) are explicit-only, and the Skill tool refuses them. An agent still continues into one after a human yes to its named proposal, as an inner step of a Full Delivery the human started, or as the phase an open Orchestrator's brief names for its Track. [Confirm to continue](phase-graph.md#confirm-to-continue) holds the rule.
- `$review-phase` loads no other review skill: its one fresh reviewer subagent covers security, performance, contract drift, unrequested behaviour and costly Fowler smells. Acceptance-criteria coverage and skill-application evidence are `$implement-spec` gates, not review checks. Deeper redesign is its own `$improve-codebase-architecture` or `$resolve-debt-phase` run.
- `$design-phase` (grill gate) and `$docs-onboarding` run `$requirements-grill` directly for their own decisions. Per-flow architecture and spec compilation still goes through `$requirements-phase`. `$design-phase` installs with the `frontend` Pack, not `planning`.
- `$prototype-phase` returns its verdict to the `$finder-phase` prototype gate. Outside Finder, `$requirements-grill` uses the lean `$prototype` skill on its Wayfinder route. `$design-phase` uses neither: it builds `$prototype-variants` rounds on the real route and promotes the kept variant to Design-Owned UI Code, which `$delivery-phase` takes as accepted input.
- `$delivery-phase` never merges, yet Track PRs merge while `$orchestrator-phase` is open: the Track reports `ready <PR URL> @ <head commit>` and the Orchestrator merges exactly that commit after the repository's checks and review are clean. A new functional PR waits for the human's go; a fix merges at once.
- The Orchestrator never opens a question dialog, because an open dialog blocks every Track message until the human answers. The only live human step in an orchestrated run is the requirements grill inside a Track; everything else reaches the human as a Needs-you line.

## Still open

- The HI CLI copies invocation flags verbatim and never reads them; each harness enforces them, and Claude and Codex keep separate flag files per skill.
- Pack catalog prompt-surface metadata is published, but the prompt builders read only `workspace-prompt-spec`.
- Generated root prompts do not route to `$orchestrator-phase` yet: the workflow entrypoint list lives in the CLI prompt builder (`apps/cli/src/registry/builders/prompts.ts`), which changes only with a CLI release. Type `$orchestrator-phase` to start it.
