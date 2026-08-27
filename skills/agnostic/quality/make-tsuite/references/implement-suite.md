# Implement the suite

Read [the TDD skill](../../tdd/SKILL.md) and its high-signal test guidance before changing tests. Apply its public-seam, vertical-slice, and honest-evidence rules. This skill's immutable-production boundary replaces TDD's production GREEN step.

## Place proof

Choose the lowest execution tier that observes the invariant without simulating its boundary:

- **Unit:** deterministic behavior owned by one module or component.
- **Integration:** collaboration across real adapters, persistence, filesystem, transport, configuration, or lifecycle seams.
- **Static/contract:** compatibility at an exported, generated, schema, or compile boundary; label whether proof is runtime or static.
- **Support:** test infrastructure behavior whose owner is the harness or fixture system.
- **System end-to-end:** distinct public intent crossing real applications, processes, devices, command interfaces, or network boundaries.

Purpose and technique are separate from tier. Apply property/fuzz, performance, security, resilience, visual, mutation, or hardware-in-loop testing at the honest tier when the protected risk requires it. Use repository-owned placement and naming conventions. Fixture setup may establish prerequisites; it must preserve the behavior under test as real.

Placement is complete when every changed test names its owner, invariant, tier, and why a lower tier cannot observe the boundary honestly.

## Execute one vertical slice

For each accepted invariant:

1. Confirm the target is selected by the intended execution mechanism and required delivery gate when one exists.
2. Capture the semantic fingerprint of every existing case affected.
3. Add or transform one slice through the owned public seam.
4. Choose the honest evidence state:
   - already-correct behavior: capture a passing characterization and demonstrate sensitivity through an observed historical or pre-fix failure, a mutation in a disposable copy, or controlled perturbation of external input, fixture, or test double that keeps owned behavior real; label static reasoning `unverified`;
   - established regression: capture genuine RED for the expected product reason and hand back production work;
   - broken test infrastructure: reach GREEN using only test-scoped changes.
5. Run the focused test through its execution mechanism when available, then broader owning gates proportional to the boundary changed.

A product RED preserves an existing failure. A newly captured RED selected by a required delivery gate remains blocked and cannot be landed as completed work. Landing it requires explicit authorization plus an established non-required quarantine or disabled-test convention; otherwise hand back the production requirement.

A slice is complete when selection, observed result, sensitivity evidence, semantic equivalence, product-RED disposition, and production-boundary status are recorded before the next slice begins.

## Finish

Inspect the complete diff. Validate that every changed region and dependency is mechanically isolated to test compilation or execution and every changed case preserves or explicitly replaces its fingerprint. Record the execution invocation or mechanism, exact command when available, and observed result; distinguish absent gates, unrun gates, and environmental blockers.

Implementation is complete when all authorized dispositions are applied, affected required gates have observed outcomes when present, every changed case passes semantic lock, product RED has a valid disposition, and the diff contains no production-reachable changes.
