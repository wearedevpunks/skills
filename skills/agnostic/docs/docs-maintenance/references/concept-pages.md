# Concept Pages

Use this reference during Step 6 of `docs-maintenance`.

## Input expansion

For each extracted concept:

1. Read existing flow pages under `apps/wiki/domains/<domain>/flows/` for cross-linking.
2. Scan `apps/wiki/raw/` recursively and collect files where frontmatter `ingested: false` or `ingested` is absent.
3. Use relevant raw content only as supplementary material. Do not mark raw files as ingested here.

## Output contract

4. Synthesize concept content in this precedence order:
   - `IMPLEMENTATION-NOTES.md` deviations, surprises, and judgment calls
   - `SPEC.md` acceptance criteria, data model, and technical notes
   - relevant sections from flow pages
   - relevant raw file content
5. Determine status:
   - `proposed` when only `SPEC.md` is present
   - `implemented` when `IMPLEMENTATION-NOTES.md` is present
6. Derive the output path:
   - slugify the concept name to kebab-case
   - write to `apps/wiki/domains/<domain>/concepts/<concept-name>.md`
7. Write or merge the concept page:
   - preserve established facts
   - append new information under `## [Source: <origin>]`
   - flag contradictions inline: `> [!warning] CONTRADICTS [[source]]`
8. Every concept page must include:
   - frontmatter:
     ```yaml
     ---
     domain: <domain>
     type: concept
     status: proposed | implemented
     ingested: true
     last_ingested: YYYY-MM-DD
     links: []
     created: YYYY-MM-DD
     updated: YYYY-MM-DD
     ---
     ```
   - `Definition`
   - `Attributes` table
   - `Related flows`
   - `## [Source: <origin>]`
9. Update `apps/wiki/domains/<domain>/<domain>.md` to link the concept page if not already present
