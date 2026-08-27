# User journey test design

Use this reference only when the suite drives a real browser, mobile app, desktop client, terminal, or other interactive production entrypoint.

## Define the journey

Describe one plausible intent with its actor, systems crossed, visible result, persisted effect, and isolation rule. Prioritize authentication lifecycle, authority-specific states, meaningful domain transitions, persistence across reload or session changes, representative recovery, and exclusion of inaccessible data.

Journey selection is complete when each journey protects a distinct user intent or security boundary; every extra permutation has a separately named invariant.

## Preserve the real system

Reuse the repository's executable harness. Test-scoped orchestration may build artifacts, start isolated dependencies, wait for readiness, seed deterministic prerequisites through supported external seams, capture diagnostics, and clean up. Keep business rules and deployable wiring inside the real system.

Harness preparation is complete when startup, readiness, data setup, identities, diagnostic capture, and cleanup are deterministic and remain test-scoped.

## Drive public interaction

Use stable user-visible or accessibility-facing controls and states. Synchronize on specific visible state or public responses. Assert visible outcomes, authority controls, forbidden navigation, persistence, cross-session effects, and absence of inaccessible data as the protected invariant requires.

Validation is complete when each journey records actor, visible workflow, invariant, real runtime boundary, execution invocation or mechanism, observed result, artifacts, cleanup result, semantic-lock result, and production-immutability proof for every changed region.
