# GitLab CI/CD Reference

## Audit semantics
- Normal fork MR pipelines run in fork with fork config/resources/variables.
- A parent-project member may run fork code in parent project with parent settings/resources/variables/runners and their permissions.
- Protected resources and protected branches/tags gate higher-trust writes.
- `CI_JOB_TOKEN` is job-scoped and controlled by allowlist; verify it is not overprivileged.
- Shell and privileged/shared runners can increase blast radius for untrusted merge input.
- Component-based includes should be pin to a commit SHA and provenance-verified.
- Shared worktree/cache behavior can leak object state between jobs.
- Protected environments require approvals for production-style promotions.

## Remote settings to verify
- Fork MR pipeline policy and resource usage rules.
- Protected variables and protected environment approval requirements.
- CI job token restrictions and allowlist scope.
- Runner type (shared/privileged) and shared-worktree/cache settings.
- Runner and component allowlist policy.
- Deployment approval settings and bypass rules.

## Official sources (verified 2026-07-30)
- https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/
- https://docs.gitlab.com/ci/variables/
- https://docs.gitlab.com/ci/jobs/ci_job_token/
- https://docs.gitlab.com/runner/security/
- https://docs.gitlab.com/ci/components/
- https://docs.gitlab.com/ci/environments/deployment_approvals/
