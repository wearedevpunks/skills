# Known Gaps

Behavior that surprises operators even though the skills agree on it, plus the few seams still open. Check the installed files first: a later Baseline may have changed them.

## Expected but surprising

- Entry phases (`$requirements-phase`, `$delivery-phase`, `$design-phase`, `$review-phase`, the Finder wrappers, `$resolve-debt-phase`, the bug phases) are explicit-only. A skill that reaches one hands the human the command and a brief, then stops; it never starts the phase.
- `$review-phase` loads no other review skill: `scripts/review.mjs` runs the vendored `autoreview` engine once per Axis Run, and architecture, security and skill guidance are items of the Standards axis guidance, not separate skill runs. Deeper redesign is its own `$improve-codebase-architecture` or `$resolve-debt-phase` run.
- `$design-phase` (grill gate) and `$docs-onboarding` run `$requirements-grill` directly for their own decisions. Per-flow architecture and spec compilation still goes through `$requirements-phase`. `$design-phase` installs with the `frontend` Pack, not `planning`.
- `$prototype-phase` returns its verdict to the `$finder-phase` prototype gate. Outside Finder, `$requirements-grill` uses the lean `$prototype` skill on its Wayfinder route. `$design-phase` uses neither: it builds `$prototype-variants` rounds on the real route and promotes the kept variant to Design-Owned UI Code, which `$delivery-phase` takes as accepted input.

## Still open

- The HI CLI copies invocation flags verbatim and never reads them; each harness enforces them, and Claude and Codex keep separate flag files per skill.
- Pack catalog prompt-surface metadata is published, but the prompt builders read only `workspace-prompt-spec`.
