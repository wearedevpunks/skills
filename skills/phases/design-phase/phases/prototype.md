# Prototype Phase

Produce the user-requested artifact type.

## Delegation

Activate `$prototype` for prototype artifacts from this phase only.

## Steps

1. Confirm artifact intent first: image references or prototype artifacts.
2. Turn intake evidence and accepted constraints into design directions used directly by the artifact worker.
3. Delegate artifact production to a subagent; keep the parent thread for orchestration and validation.
4. For image intent, use image generation plus `imagegen-frontend-web` or `imagegen-frontend-mobile` when available.
5. If image generation is unavailable, fall back to `$prototype` and record the fallback.
6. For prototype intent, activate `$prototype`; do not fall back to images.
7. Use `repo-asset-management` for durable visual links before approval or backlog handoff when assets are generated.

## Rules

- Child-skill delegation is phase-local: `$prototype`, `design-taste-frontend`, `gpt-taste`, `image-to-code`, `imagegen-frontend-web`, and `imagegen-frontend-mobile` belong here only when needed.
- Generated directions are artifact input, not a separate phase.
- Preserve source evidence and constraints with every artifact.

## Output

- Artifact candidates: generated images, prototype URLs/files, screenshots, or inspectable local artifacts.
- Durable asset links or pending upload blockers.
- Evidence and constraints used.
- Phase handoff with next route: approval.
