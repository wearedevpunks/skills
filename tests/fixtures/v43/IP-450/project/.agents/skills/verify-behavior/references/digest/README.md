# Digest Surface Verification Reference

## Launch

For the Publish Integrity journey use the recorded run-owned RUN_SCRATCH shared
with Repository. Create `digest` beneath it; use installed `sha256sum` with no
network or credentials.

## Doctor

Confirm `command -v sha256sum` succeeds and the digest directory exists under the
recorded run-owned scratch before Drive.

## Drive

Read [features/README.md](features/README.md). When a scenario needs a digest export
or check, load the optional [helpers/check.md](helpers/check.md) command recipe.

## Evidence

Retain digest output, check status and original/corrupt bytes outside scratch.

## Cleanup

The journey's Repository cleanup owns shared RUN_SCRATCH removal after both apps
retain evidence. Digest removes no other resources.

## Feature Map

[features/README.md](features/README.md) selects behavior-specific proof.
