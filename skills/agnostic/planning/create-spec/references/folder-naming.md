# Folder Naming

Use this reference after questioning and before writing the file.

## Domain resolution

- The spec path is `<resolved-specs-root>/<domain>/<folder-name>/SPEC.md`.
- Resolve `<resolved-specs-root>` during discovery:
  - `apps/wiki/content/docs/project/specs` for routed project wiki repos
  - `apps/wiki/specs` for legacy source-wiki repos
  - `docs/specs` when no wiki planning surface exists
- Use the exact existing domain directory name from `<resolved-specs-root>/` when one clearly applies.
- If no existing spec domain applies, create a concise kebab-case domain from the request or backlog area.
- If multiple domains are touched, choose the primary owner and describe the cross-domain aspect in the spec body.
- Do not create `apps/wiki/domains/` as part of spec authoring.

## Folder-name rules

- Base the name on the subject matter: `oauth-providers`, `invoice-export`
- If the user mentioned a ticket id, prepend it: `PROJ-123-oauth-providers`
- If the user specified an exact folder name, use that as-is
- Keep it short but recognizable
- Use kebab-case

## Collision rule

Each spec folder must be unique within its domain.

If the folder already exists:

- ask whether to update the existing spec or create a new one

Do not ask the user to confirm the folder name unless the correct name is genuinely ambiguous.
