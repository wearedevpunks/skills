# Worker-Wave Execution

Every `implement-spec` run executes through plan-derived worker waves.

## Contract

- **Worker policy:** spawn multiple workers only for currently unblocked independent work with disjoint write scopes
- **Execution board:** completed, in progress, unblocked next, blocked, current wave
- **Parent policy:** parse, dispatch, review, validate, update shared artifacts, and advance the graph

A wave may contain one worker when dependencies or owned paths leave one task
unblocked. Keep the wave boundary and parent validation.

## Required evidence

- plan-derived wave selection from dependencies, owned paths, validation gates, and wave boundaries
- explicit worker briefs per task
- post-wave review of worker outputs
- acceptance-criteria coverage plus RED -> GREEN evidence, or explicit non-testable verification
- task completion only after validation and plan/log updates
- unchanged guidance forwarding and exactly one verified skill-application
  evidence record per guidance entry
- clear reporting of retries, issues, or blockers

## Loop rule

Keep iterating wave by wave until:

- all reachable tasks are complete, validated, and logged
- or a real blocker remains and is reported honestly

Retry failed work or report the exact blocker before advancing.
