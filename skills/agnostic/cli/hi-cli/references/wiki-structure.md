# Existing Wiki Structure Check

Run after `hi init` and `hi scaffold`. After `hi update`, run when changed or flagged paths affect wiki guidance, routes, content schema, canonical source documents, or content synchronization. Limit update checks to those paths and their routed copies.

1. Resolve the existing wiki root from project guidance and the repository. If no wiki exists, report `not-applicable`; creating a wiki is separate project work.
2. Read the nearest `AGENTS.md`, matching Rule Registry entries, and the project's docs/wiki runbook. Use its current content configuration and sync script to resolve source ownership. These project standards define the expected structure; a baseline template does not.
3. Check the applicable standards:
   - routed pages belong to the project's accepted article tree and navigation metadata;
   - pages have schema-valid frontmatter and resolved links;
   - source specifications, raw inputs, and ingest bookkeeping use their declared locations;
   - canonical documentation and generated wiki copies have clear ownership and remain synchronized;
   - deliberate project/domain routes and authored content remain intact.
4. Run the project's documented checks for content, links, navigation, and source synchronization. Use a check or dry-run mode for sync scripts. Inspect the proposed diff for loss of durable pages before any separately authorized synchronization.
5. Report `pass`, `fail`, or `not-applicable`, the wiki root, standards consulted, commands and results, and each concrete mismatch with its path and required correction. If a required check cannot run, report the exact blocker; do not call the structure verified.

This handoff inspects project-owned wiki structure. Preserve its files, route decisions, and framework configuration unless the current task already authorizes a specific repair. CLI scaffold/update ownership does not extend to wiki creation, replacement, or cleanup.
