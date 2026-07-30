# Jenkins Reference

## Audit semantics
- Treat public PR/MR builds as untrusted and ensure controller-safe execution (prefer fresh, isolated agents over controller execution).
- Forked/tested changes can invoke Jenkinsfile and script steps that access unchanged bound credentials if not tightly scoped.
- `Jenkinsfile` and pipeline authority can call any command available to that job; validate credential binding boundaries.
- Shared libraries run arbitrary code from host repositories and must be immutable by trusted refs.
- Verify `archiveArtifacts` retention/fingerprint policy for sensitive outputs.
- `input` steps can be bypassed by admins; do not rely on submitter checks alone for non-admin threat modeling.

## Remote settings to verify
- Controller security and untrusted build matrix policy.
- Agent model and whether builds are prevented on controller.
- Credential domain restrictions and folder/job permission scoping.
- Shared-library source trust, tag/branch controls, and approval policy.
- Plugin update/install policy and trusted plugin source.
- Input-step submitter and admin override posture.
- Artifact retention and download permissions.

## Official sources (verified 2026-07-30)
- https://www.jenkins.io/doc/book/security/securing-builds/
- https://www.jenkins.io/doc/book/security/securing-org-folders-and-multibranch-pipelines/
- https://www.jenkins.io/doc/book/security/credentials/
- https://www.jenkins.io/doc/book/pipeline/shared-libraries/
- https://www.jenkins.io/doc/pipeline/steps/core/
- https://www.jenkins.io/doc/pipeline/steps/pipeline-input-step/
