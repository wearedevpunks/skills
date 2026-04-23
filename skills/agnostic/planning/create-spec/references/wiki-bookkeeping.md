# Wiki Bookkeeping

Use this reference after writing `SPEC.md`.

## Required updates

1. Add a row to the **Specs** table in `apps/wiki/index.md`:

```md
| <domain> | [[specs/<domain>/<folder-name>/SPEC]] | Draft |
```

2. Add an entry to `apps/wiki/specs/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary

3. Append to `apps/wiki/log.md`:

```md
## [YYYY-MM-DD] spec | <spec title>
- Created spec: [[specs/<domain>/<folder-name>/SPEC]]
- Domain: <domain>
- Status: Draft
```

Do not skip this step.
