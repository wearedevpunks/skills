# CircleCI Reference

## Audit semantics

- public projects with fork builds enabled cannot use self-hosted runners.
- Contexts gate variable exposure, but by default contexts can be broadly readable by org/project members unless restricted.
- Approval gates plus restricted contexts are used for deploy boundaries.
- container runner creates an ephemeral pod per job.
- production registry orb releases are immutable SemVer releases; development tags are mutable/expire; URL orbs are governed by allowlists.
- Caches are project/global and cross-branch; workspaces move data downstream, so validate provenance before trust.
- Artifacts persist and require cleanup boundaries.

## Remote settings to verify

- Fork build/PR secret settings and project-level toggles.
- Context restrictions and allowed-user/group memberships.
- Runner/executor policy and isolation controls.
- Orb version policy and mutability controls.
- Cache and workspace retention scope.
- Deployment contexts and protected jobs.

## Official sources (verified 2026-07-30)

- https://circleci.com/docs/guides/integration/oss/
- https://circleci.com/docs/guides/security/contexts/
- https://circleci.com/docs/guides/execution-runner/runner-concepts/
- https://circleci.com/docs/orbs/use/orb-concepts/
- https://circleci.com/docs/guides/optimize/persist-data/
