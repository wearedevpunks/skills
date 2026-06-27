# High-Signal Tests

Use this when choosing test seams and assertions.

## Choose the Seam

High-signal tests verify durable behavior through the nearest public seam:

- CLI command output or exit status
- HTTP route response
- component interaction and visible outcome
- exported API result
- persisted contract or generated artifact

Move the test one semantic level above the change. If you changed a helper, test the capability that uses it. If you changed formatting, test the stable contract that formatting serves.

Prefer observable outcomes over helper calls, private state, call order, intermediate shapes, and internal module boundaries.

## Choose Assertions

Assert the strongest stable meaning, not the most convenient internal shape.

- Exact strings only when the string is a stable contract: user-facing copy, protocol output, CLI flags, error codes, fixture names, or documented text.
- For CLI/API/tool output, parse machine-readable output when available and assert fields by meaning.
- For collections, relax order only when order is not part of the contract.
- For objects, relax shape only when extra fields are irrelevant to the contract.
- Preserve duplicate semantics: do not collapse arrays/sets when duplicates matter.

Negative assertions must still prove behavior. Prefer "does not expose secret in rendered output" over "does not call `maskSecret`"; prefer "invalid input leaves stored value unchanged" over "database row was not updated" when storage is not the public contract.

## Regression Tests

Write regressions as product or capability invariants, not bug-scar tombstones.

- Name the enduring behavior: "stable baseline check ignores cache-only files".
- Keep the old failure mode only as setup or context when needed.
- Avoid asserting the accidental old shape unless that shape is now a contract.

Ask: would this test still be valuable after the implementation is completely rewritten? If yes, it is probably high signal.
