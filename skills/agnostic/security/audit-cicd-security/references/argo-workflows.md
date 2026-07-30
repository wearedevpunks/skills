# Argo Workflows Reference

## Audit semantics
- Untrusted users must not be allowed to create workflows in the controller namespace or to bypass workflow restrictions.
- Workflow creation can spawn arbitrary pods via template execution.
- Validate declared/default service account and token exposure; avoid root execution defaults.
- Enforce Strict/Secure restrictions and confirm any override allowlist cannot be abused.
- Artifact repository override is via `artifactRepositoryRef`, not workflow inputs.
- Executor plugins are additional code paths; validate plugin provenance and sidecar behavior.
- Suspend/Resume gates depend on DAG dependencies and resume RBAC permissions.

## Remote settings to verify
- Controller restrictions mode (Secure/Strict) and namespace defaults.
- Workflow admission controls and who can create/submit workflows.
- SA/RBAC role mappings and pod security context defaults.
- Artifact repository endpoint, credentials, and retention rules.
- Plugin execution policy and namespace-level shadowing controls.
- Resume permissions (`argo resume`) and RBAC/approval gating.

## Official sources (verified 2026-07-30)
- https://argo-workflows.readthedocs.io/en/latest/security/
- https://argo-workflows.readthedocs.io/en/latest/workflow-restrictions/
- https://argo-workflows.readthedocs.io/en/latest/artifact-repository-ref/
- https://argo-workflows.readthedocs.io/en/latest/executor_plugins/
- https://argo-workflows.readthedocs.io/en/latest/walk-through/suspending/
