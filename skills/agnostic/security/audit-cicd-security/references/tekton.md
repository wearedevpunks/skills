# Tekton Reference

## Audit semantics

- Tekton Pipelines has no native fork semantics; security depends on Triggers, repository event filters, and webhook permissioning.
- Triggers EventListeners + Interceptors must verify payload, identity, and origin filters.
- Service accounts and RBAC govern access to git/registry secrets and can escalate to namespace-wide rights.
- Workspaces can be Secret, PVC, or ephemeral and can persist/share state.
- Trusted Resources VerificationPolicy can `enforce` or `warn`; cluster no-match settings determine behavior.
- CustomRuns follow the controller-installed custom-controller approval and can expand execution surface.

## Remote settings to verify

- Webhook/EventListener authentication, trigger filters, and interceptor policy.
- SA/RBAC mappings for pipeline tasks and workload identity assumptions.
- PVC/workspace retention/cleanup and sharing constraints.
- VerificationPolicy mode and no-match behavior.
- CustomRun controller-specific approval/safety controls.
- Artifact and registry access policies.

## Official sources (verified 2026-07-30)

- https://tekton.dev/docs/triggers/
- https://tekton.dev/docs/pipelines/auth/
- https://tekton.dev/docs/pipelines/workspaces/
- https://tekton.dev/docs/pipelines/trusted-resources/
- https://tekton.dev/docs/pipelines/customruns/
