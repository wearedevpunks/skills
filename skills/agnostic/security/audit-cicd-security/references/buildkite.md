# Buildkite Reference

## Audit semantics
- PR trigger mode and checkout mode are controlled in Buildkite settings, not only YAML.
- Branch filters do not prevent PR builds; review UI and webhook gate configuration.
- Secrets are cluster-scoped and available based on agent policy; a shared agent can receive broader credentials than expected.
- Plugins execute hooks and can extend command surface.
- External templates/hooks/policies may enforce policy outside pipeline YAML and must be included in audit scope.
- `block` gates must be on every critical dependency path to prevent bypass.
- `allowed_teams` limits who can unblock gated steps.

## Remote settings to verify
- SCM integration and PR/branch gating model.
- Trigger settings, checkout mode, and branch/PR controls.
- Cluster/agent allowlist, policy, and isolation.
- Secret policy and where cluster-scoped secrets are exposed.
- Plugin install/source controls and hook execution scope.
- Artifact visibility and retention configuration.
- Deploy/publish job gating and team unblock restrictions.

## Official sources (verified 2026-07-30)
- https://buildkite.com/docs/pipelines/source-control/github
- https://buildkite.com/docs/pipelines/security/secrets/buildkite-secrets
- https://buildkite.com/docs/pipelines/best-practices/plugin-management
- https://buildkite.com/docs/pipelines/best-practices/security-controls
- https://buildkite.com/docs/pipelines/deployments
