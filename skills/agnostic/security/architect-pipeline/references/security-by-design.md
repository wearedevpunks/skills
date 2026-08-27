# Security by design

Apply this baseline while architecting or implementing a pipeline. It is a proportionate design check, not a formal audit; route an explicit systematic review to `$audit-cicd-security`.

## Establish trust

For every trigger and job, identify who controls the revision and inputs, the runner boundary, permissions and secrets, and artifacts, caches, workspaces, or generated files crossing into later jobs. Treat proposed changes, fork content, metadata, and derived transfer objects as low trust until producer identity, provenance, and integrity are established.

Keep low-trust validation separate from privileged publication and deployment. A privileged job must not execute contributor-controlled code with trusted credentials. Use persistent or self-hosted execution for untrusted work only after an explicit risk decision with a verified isolation story.

## Minimize authority

- Give each job only the permissions and secret access it needs.
- Prefer short-lived, narrowly scoped identity where the execution system supports it.
- Introduce credentials in the smallest trusted step and keep them out of logs, arguments, caches, artifacts, workspaces, images, and generated files.
- Pin or constrain external actions, plugins, images, reusable workflows, and components to immutable verified revisions or digests where possible.
- Separate cache namespaces and restore paths by trust level; verify producer, provenance, and integrity before a privileged consumer executes or publishes transferred content.
- Protect publication and deployment with trusted references, environment gates, approvals, and concurrency controls appropriate to impact.

## Verify the boundary

Review changed configuration for unsafe event contexts, excessive permissions, secret reachability, credential persistence, mutable dependencies, runner exposure, and missing artifact or deployment gates. Use syntax and static checks where possible. Do not exploit a suspected weakness, expose credentials, or treat an unobservable remote setting as verified.
