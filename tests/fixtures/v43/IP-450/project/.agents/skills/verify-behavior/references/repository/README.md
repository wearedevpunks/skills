# Repository Surface Verification Reference

## Launch

Use a unique directory created with `mktemp -d` as RUN_SCRATCH; retain its exact
path as ownership evidence. Create `repo` under it. Run `git init` there and set
repository-local user.name `Fixture` and user.email `fixture@example.invalid`.
No network or existing repository is needed. Evidence is outside RUN_SCRATCH.

## Doctor

Run `git -C "$RUN_SCRATCH/repo" rev-parse --show-toplevel` and verify it identifies
this run's repository; verify local identity settings before Drive.

## Drive

Select [features/README.md](features/README.md) for the requested behavior.

## Evidence

Retain commands, exit codes, HEAD, stored payload, and failure stderr in the
caller-provided evidence directory outside RUN_SCRATCH.

## Cleanup

After retaining evidence, remove only the exact mktemp-created directory recorded
by this run. Verify its absence. Never remove the project or evidence directories.

## Feature Map

Use [features/README.md](features/README.md); Repository has no optional helpers.
