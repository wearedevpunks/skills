# Runtime Handoff

Store the current record at
`.devpunks/finder-phase/handoffs/<durable-wiki-fog-id>.md`. Allocate the durable
wiki identity once before provider creation and retain it across retries.

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
Durable wiki Fog identity:
Provider Fog identity:
Provider snapshot identity:
Immutable original intake lens:
Selected gate or outcome:
Generic Grilling child identities:
Support child identities and supported-child relations:
Immutable evidence or verdict pointers:
Projection ceiling:
Intended optional projection:
Exact optional projection readback:
Unresolved decisions:
Last verified at:
```

Discover the handoff by exact durable wiki or provider Fog identity. Conflicting
valid records for one identity route to `human_steering_required`. Current
evidence may supersede `Next suggested route`.

Each gate updates only the fields it proves. Preserve prior exact identities,
the immutable original intake lens, and retained evidence pointers. Record every
blocked, skipped, checkpoint, bounded-return, and human-steering outcome before
stopping.
