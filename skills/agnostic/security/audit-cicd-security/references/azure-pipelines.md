# Azure Pipelines Reference

## Audit semantics
- Fork PR pipelines and toggles can widen secret exposure; confirm repository-level and branch-level protection alignment before trust transfer.
- Review job token scope and identity permissions for service connections, hosted agents, and task execution context.
- Host repo access/security checks can rely on pipeline checks outside YAML and must be validated.
- Hosted agents use fresh VM execution, while self-hosted agents depend on isolation and workspace cleanup policy.
- Marketplace and custom tasks are supply-chain inputs; verify allowed sources and task versions.
- Templates only enforce when checks are explicitly enabled and correctly imported.

## Remote settings to verify
- Fork PR permissions and approval requirements.
- Access-token scope for pipelines and service connections.
- Repository protection and branch mapping controls.
- Runner/agent isolation policy and ephemeral assumptions.
- Checkpoint and approval settings for environment/protected resources.
- Marketplace/custom task source and pinning policy.
- Template enforcement and template location controls.

## Official sources (verified 2026-07-30)
- https://learn.microsoft.com/en-us/azure/devops/pipelines/security/secure-access-to-repos?view=azure-devops
- https://learn.microsoft.com/en-us/azure/devops/pipelines/process/access-tokens?view=azure-devops
- https://learn.microsoft.com/en-us/azure/devops/pipelines/security/overview?view=azure-devops
- https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops
- https://learn.microsoft.com/en-us/azure/devops/pipelines/process/tasks?view=azure-devops
- https://learn.microsoft.com/en-us/azure/devops/pipelines/security/resources?view=azure-devops
- https://learn.microsoft.com/en-us/azure/devops/pipelines/security/templates?view=azure-devops
