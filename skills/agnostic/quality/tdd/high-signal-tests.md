# High-Signal Tests

Use this when choosing test seams and assertions.

## Choose the Seam

High-signal tests verify durable behavior through the nearest public seam:

- CLI command output or exit status
- HTTP route response
- user-critical interaction and visible outcome
- exported API result
- persisted product outcome or generated artifact consumed as a feature

Move the test one semantic level above the change. If you changed a helper, test the capability that uses it. If you changed formatting, test the stable contract that formatting serves.

Prefer observable outcomes over helper calls, private state, call order, intermediate shapes, and internal module boundaries.

## Cull Low-Signal Tests

Keep a test only when its failure proves an owned product or capability behavior broke. Cull tests that only prove:

- a feature, module, route, or command exists or registers; execute the public capability and assert its meaningful outcome instead
- code has a valid type or shape already enforced by typechecking
- a third-party provider behaves as documented, including mocks or fixtures that reproduce its response shape; the provider owns that contract
- an object, schema, generated file, or wire shape matches a contract without proving a feature behavior
- UI wiring, rendering trivia, or cosmetic UX details; retain only user-critical workflows, accessibility behavior, and failure recovery
- a command is discoverable or registered without proving what running it does
- a past change cannot be reverted; retain a regression only when it names and protects an enduring capability invariant

Owned compatibility is the boundary. Keep exact protocol or artifact assertions only when this repository owns that public compatibility and a consumer-visible capability depends on it. For provider integrations, test the behavior our adapter owns—mapping our inputs, handling our failures, and producing our public outcome—without recreating or asserting the provider's contract.

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

Ask: would this test still protect a named product capability after the implementation is completely rewritten? If not, cull it.
