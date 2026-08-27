# Route and API test design

Use this reference only when the suite exercises routes, APIs, messages, commands, protocols, or comparable public transport boundaries.

## Discover the seam

Inspect the public entrypoint, routing or dispatch composition, authentication and authorization, input/output contracts, owned services, persistence, execution configuration, fixtures, and existing harness.

Discovery is complete when every distinct response, authority branch, and durable side effect in scope has an owner and an executable public seam.

## Select scenarios

Select behavior by distinct risk: success, ownership or isolation, invalid input, missing resource, conflict, external-boundary failure, partial failure, and recovery. Include only branches that carry different public meaning. Use representative actors and minimal fixtures that prove both inclusion and exclusion.

Scenario selection is complete when each selected case names a unique public outcome, authority boundary, or side-effect invariant; equivalent permutations are mapped to one representative case.

## Assert meaning

Exercise the established transport harness and real owned behavior. Replace only external systems outside the product boundary. Assert the protocol result plus its strongest stable meaning: returned value, typed failure, durable effect, no-op on failure, isolation, or absence of sensitive data.

Validation is complete when each changed scenario records the public operation, setup actor, expected protocol result, meaningful outcome or side effect, semantic-lock result, execution invocation or mechanism, and observed result.
