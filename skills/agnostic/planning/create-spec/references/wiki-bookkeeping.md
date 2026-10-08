# Planning Surface Bookkeeping

Use this reference after writing `SPEC.md`.

`<wiki-root>` comes from the resolved
[wiki contract](../../../../phases/docs-ingest-phase/references/wiki-contract.md)
(`docs-ingest-phase/references/wiki-contract.md`).

## Required updates by surface

### Routed project wiki

When using `<wiki-root>/content/docs/project/specs`:

1. Create or update `<resolved-specs-root>/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary
2. Update `meta.json` files only when needed for the new spec to appear in the routed tree.
3. Update any existing project specs index page that already tracks specs.
4. Append one `spec` entry with outcome `Compiled` to `<wiki-root>/log.md` by the
   [log rule](../../../../phases/docs-ingest-phase/references/wiki-ingest.md#log)
   (`docs-ingest-phase/references/wiki-ingest.md#log`).

### Legacy source wiki

When using `<wiki-root>/specs`:

1. Add a row to the **Specs** table in `<wiki-root>/index.md`:

```md
| <domain> | [[specs/<domain>/<folder-name>/SPEC]] | Compiled |
```

2. Create or update `<wiki-root>/specs/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary
3. Append one `spec` entry with outcome `Compiled` to `<wiki-root>/log.md` by the
   [log rule](../../../../phases/docs-ingest-phase/references/wiki-ingest.md#log)
   (`docs-ingest-phase/references/wiki-ingest.md#log`).

### Docs fallback

When using `docs/specs`:

1. Create or update `docs/specs/index.md` with:
   - the domain
   - the spec path
   - status `Compiled`
2. Create or update `docs/specs/<domain>/<domain>-specs.md` with:
   - the spec name
   - a one-line summary
3. Write only the two files above: this surface has no wiki log or routed metadata.
