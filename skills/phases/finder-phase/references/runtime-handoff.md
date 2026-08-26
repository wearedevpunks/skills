# Runtime Handoff

Store the current record at
`.devpunks/finder-phase/handoffs/<durable-wiki-fog-id>.md`. Before provider
creation, allocate that durable wiki identity once and use it for every retry.
After exact provider readback, add the stable provider Fog identity without
replacing the wiki identity.

```text
Phase:
Status: complete | blocked | skipped | checkpoint | human_steering_required
Scope:
Artifacts:
Validation:
Finder state:
UI Evidence:
Next suggested route:
Blockers:
Resume identity:

Finder target depth:
Durable wiki Fog identity:
Provider Fog identity:
Provider snapshot identity:
Selected gate or outcome:
Stage child identities:
Immutable resolution pointers:
Intended projection:
Exact readback identities:
Support evidence:
Checkpoint or blocker:
Last verified at:
```

Discover by exact durable wiki or provider Fog identity. Conflicting valid
records for one identity are `human_steering_required`. `Suggested route` is
advisory; the router always recomputes from fresh evidence.

`Finder state` is the workflow-specific domain-state field. `UI Evidence` is
optional and records any retained `$show-me` artifact. `Next suggested route`
is advisory.

Each gate updates only fields it proves. Preserve prior exact identities and
immutable pointers. Record checkpoint, blocked, skip, target-return, and
`human_steering_required` outcomes before stopping.
