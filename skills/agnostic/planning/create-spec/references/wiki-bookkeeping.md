# Planning Surface Bookkeeping

Use this reference after writing `SPEC.md`.

## Required updates by surface

### Routed project wiki

When using `apps/wiki/content/docs/project/specs`:

1. Create or update `<resolved-specs-root>/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary
2. Update `meta.json` files only when needed for the new spec to appear in the routed tree.
3. Update any existing project specs index page that already tracks specs.

### Legacy source wiki

When using `apps/wiki/specs`:

1. Add a row to the **Specs** table in `apps/wiki/index.md`:

```md
| <domain> | [[specs/<domain>/<folder-name>/SPEC]] | Draft |
```

2. Create or update `apps/wiki/specs/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary
3. Append to `apps/wiki/log.md` when it exists:

```md
## [YYYY-MM-DD] spec | <spec title>
- Created spec: [[specs/<domain>/<folder-name>/SPEC]]
- Domain: <domain>
- Status: Draft
```

### Docs fallback

When using `docs/specs`:

1. Create or update `docs/specs/index.md` with:
   - the domain
   - the spec path
   - status `Draft`
2. Create or update `docs/specs/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary
3. Do not invent wiki logs or routed metadata for a repo that has not bootstrapped them.
