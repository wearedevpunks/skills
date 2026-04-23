# Wiki Bookkeeping

Use this reference after writing `SPEC.md`.

## Required updates

1. Add a row to the **Specs** table in `<wiki-root>/index.md`:

```md
| <domain> | [[specs/<domain>/<folder-name>/SPEC]] | Draft |
```

2. Add an entry to `<wiki-root>/specs/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary

3. Append to `<wiki-root>/log.md`:

```md
## [YYYY-MM-DD] spec | <spec title>
- Created spec: [[specs/<domain>/<folder-name>/SPEC]]
- Domain: <domain>
- Status: Draft
```

Do not skip this step.
