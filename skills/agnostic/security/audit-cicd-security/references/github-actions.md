# GitHub Actions Reference

## Audit semantics

- `pull_request_target` and `workflow_run` execute in privileged repository contexts and should be treated as elevated-trigger paths.
- Fork PRs can restore base-branch caches; PR-created caches are scoped to the merge ref, and broad restore keys are evidence to investigate rather than confirmed overwrite vulnerabilities.
- Pin all third-party actions to full commit SHA; tag-based references remain mutable and expand supply-chain risk.
- `GITHUB_TOKEN` and workflow secrets differ for forks by default and are governed by default token permissions.
- Distinguish hosted ephemeral runners from self-hosted runners; self-hosted may retain workspace/caching state across runs.
- Environment secrets are exposed only after protection rules and reviewers satisfy the gate path.

## Remote settings to verify

- Fork PR trust settings and required checks.
- Default token permissions and whether workflow permissions are minimized.
- Action allowlist or full-SHA enforcement policy.
- Runner group isolation and self-hosted runner tagging.
- Environment protection rules, reviewers, and bypass controls.
- Cache and artifact retention/provenance settings.

## Official sources (verified 2026-07-30)

- https://docs.github.com/en/actions/reference/security/secure-use
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository
- https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching
- https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
- https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
