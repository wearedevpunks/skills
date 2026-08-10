# Review Phase

Use this phase after implementation or when delivery resumes with an unreviewed
diff, branch, PR, or implementation artifact.

## Delegate

Mandatory step: after this phase is selected, load and call `review-phase`
before routing or closing delivery. Preserve its findings-first, readonly
posture even when tests pass.

## Rules

- Review is mandatory even when tests pass.
- Review remains findings-first and readonly unless the called review skill says otherwise.
- Classify findings before routing:
  - No blocking findings: route to docs ingest or closeout.
  - In-scope non-runtime blockers: route back to implement.
  - Runtime evidence: route to debug.
  - Broad scope or architecture debt: capture follow-up debt instead of expanding delivery.

## Completion State

Write or verify:

- review command or process used
- findings and severity
- accepted no-op reason if no findings
- next route decision and why

Then stop or re-enter `delivery-phase` for routing.
