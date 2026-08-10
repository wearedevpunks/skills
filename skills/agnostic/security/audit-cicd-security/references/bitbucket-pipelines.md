# Bitbucket Pipelines Reference

## Audit semantics

- Forked-repository PRs do not trigger Pipelines.
- PR pipelines can run destination-merged content in addition to branch pipelines, increasing execution surface.
- Secured variables are masked, but output variables and shared variables flow in clear text.
- Shared/output and child-pipeline input variables are logged plaintext and do not support secure variables.
- Cloud pipelines use separate container context per step; pipe execution can run external code and receive injected values.
- Repo runners and workspace runners differ by isolation and trust.
- Premium deployment permissions should gate production-like promotion.

## Remote settings to verify

- Start-condition and fork-PR toggles.
- Variable and secret scope (workspace, repo, deployment) and override ordering.
- Child pipeline/output variable usage and inheritance model.
- Runner type: cloud vs workspace runners and isolation.
- Pipe origin/source provenance for third-party components.
- Deployment permissions and environment access rules.
- Cache and artifact retention/visibility.

## Official sources (verified 2026-07-30)

- https://support.atlassian.com/bitbucket-cloud/docs/pipeline-start-conditions/
- https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/
- https://support.atlassian.com/bitbucket-cloud/docs/step-options/
- https://support.atlassian.com/bitbucket-cloud/docs/runners/
- https://support.atlassian.com/bitbucket-cloud/docs/set-custom-deployment-permissions-for-your-environments/
