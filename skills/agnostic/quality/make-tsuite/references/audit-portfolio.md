# Audit the portfolio

## Inventory test packages

A **test package** is the smallest cohesive cluster of cases that provides one body of evidence for a protected capability or invariant. It may be one case, one file, or several files. Group by cohesive evidence rather than directory names; record its seam, fixtures, selection path, and delivery gate where each exists.

For every package in scope, map:

- member cases and claimed behavior or invariant;
- public or owned seam;
- execution tier and boundary crossed;
- purpose or technique where material, such as example-based, property/fuzz, performance, security, resilience, visual, mutation, or hardware-in-loop;
- behavior owner and current location;
- execution mechanism, discovery or selection path, focused invocation when available, and required delivery gate when present;
- overlapping proof at the same or stricter tier;
- runtime cost, nondeterministic dependencies, and fixture ownership.

Read assertions and fixtures. Use listing or discovery output when static inspection cannot establish selection. Skipped cases, setup success, and importability are not executable product proof.

Inventory is complete when every package names its members and at least one claimed invariant, and every material invariant in scope has its strongest existing proof path identified.

## Judge signal

Give each package one disposition: `retain`, `strengthen`, `move`, `merge`, or `remove`.

Judge:

1. **Sensitivity:** a plausible regression fails for the intended reason.
2. **Observability:** assertions reach a durable result, failure, authority boundary, side effect, or compatibility contract.
3. **Uniqueness:** the required gate lacks cheaper equivalent proof.
4. **Fidelity:** owned behavior remains real across the seam under test.
5. **Durability:** implementation details can change without invalidating the protected behavior.
6. **Cost:** runtime and maintenance are proportionate to unique risk covered.

Static or indirect tests remain useful when they own an architecture boundary, source parity rule, migration invariant, or public compatibility contract. Name that ownership directly.

Classification is complete when every package has one disposition supported by observed evidence across all six criteria.

Valid sensitivity evidence leaves production unchanged: an observed historical or pre-fix failure; a mutation in a disposable copy; or a controlled perturbation of external input, fixture, or test double that preserves owned behavior as real. Label static sensitivity reasoning `unverified`.

## Removal proof

Choose `remove` only when the package has no observable invariant, or retained proof covers every material element in its semantic fingerprint. A failing test that exposes a product regression is repair or production-fix evidence.

For an authorized deletion, map each removed fingerprint element to retained proof selected by the same or stricter required gate when gates exist. A higher tier replaces lower-tier proof only when actor, authority, capability, outcome, side effect, and isolation remain covered.

Removal proof is complete when every deleted invariant maps to retained proof, or is explicitly classified `no observable invariant`, and the relevant execution mechanism selects the retained proof.
