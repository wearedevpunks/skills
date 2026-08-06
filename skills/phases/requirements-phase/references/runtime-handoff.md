# Requirements Runtime Handoff

Each gate writes `<planning-surface>/REQUIREMENTS-HANDOFF.md` before every declared exit. The active planning surface is the directory containing the retained requirements artifacts for the bounded goal. That exact path is the only applicable runtime handoff for the surface.

## Authority

Reconstruct routing from current direct evidence, then fresh valid workflow-native artifacts. Use corroborated handoff fields next. Treat `Next suggested route` as advisory and lowest authority. Replace stale fields with current validation results; preserve valid evidence owned by completed gates.

## Schema

```text
# Requirements Handoff

Current or last gate:
Phase status: active | completed | skipped | checkpoint | blocked | finder-required | requirements-complete
Scope:

Grill pointers:
- Status:
- Log:
- Shared-understanding confirmation:

Retained spec SHA:
Verified spec URL:

Projection evidence:
- Provider:
- Item identifiers and URLs:
- Matching spec identity:

Validation:
- Check:
- Result:

Requirements state:
Blockers:
Next suggested route:

Resume identity:
- Revision or dependency identity that direct artifacts cannot reconstruct:
```

Use `None` for an applicable empty field. Omit the optional resume-identity entry when current artifacts reconstruct it reliably.

## Exit Rules

- `requirements-grill` records completion, human checkpoint, `finder-required`, and blocked exits.
- `create-spec` records completion, `finder-required`, and blocked exits.
- `write-backlog` records completion, skip/no-op, and blocked exits.
- `requirements-complete` requires current validation of the retained spec and its exact matching projection; a suggested terminal route is insufficient.
