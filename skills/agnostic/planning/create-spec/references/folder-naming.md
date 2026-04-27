# Folder Naming

Use this reference after questioning and before writing the file.

## Domain resolution

- The spec path is `apps/wiki/specs/<domain>/<folder-name>/SPEC.md`.
- Use the exact existing domain directory name from `apps/wiki/`.
- If multiple domains are touched, choose the primary owner and describe the cross-domain aspect in the spec body.

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
