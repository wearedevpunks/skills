# Router Phase

Use this file to choose the next docs-ingest path. Do not read other path files
until this router selects one.

## Inputs To Inspect

- User request and explicit mode: private/internal, public docs, mixed, resume, or no-op check.
- Source spec folder, `SPEC.md`, implementation notes, review/debug output, diff, PR, issue, branch, or docs target named by the user.
- Existing private/project wiki pages, public docs pages, root `docs/`, `meta.json`, sidebars, ingest frontmatter, writer artifacts, and validation evidence.
- Relevant repo guidance only when needed to identify docs ownership, route policy, or validation surface.

## Audience Definitions

- **Private/internal:** specs, plans, implementation notes, project knowledge, operator runbooks, setup/architecture decisions, root `docs/`, route metadata, learning artifacts, and durable writer artifacts.
- **Public:** reader-facing product, usage, domain, command, onboarding, changelog, or scaffold-recipient docs.

Audience is the primary signal. Route topology and permission metadata are secondary signals.

## Routing Order

1. If docs goal bounds or source artifacts are unclear, stop and ask one concrete question.
2. If no docs-affecting change exists, report a no-op and stop.
3. If audience classification is unclear after minimal inspection, stop and ask whether the target reader is internal/project/operator or public/adopter/user.
4. If a spec, project/wiki page, root `docs/`, operator workflow, route metadata, or learning artifact needs ingest and is missing or stale, load [private-internal.md](private-internal.md).
5. If both private/internal and public docs are required, route private/internal first unless its ingest outcome is already fresh and names the public target plus writer artifact location.
6. If reader-facing public docs are requested or materially affected, load [public-docs.md](public-docs.md).
7. Otherwise report a no-op with evidence.

## Resume Behavior

Assume either path may have been completed manually. Verify artifact freshness;
do not re-run a path only because `docs-ingest-phase` did not run it.

## Output

Report:

- selected path
- evidence that selected it
- path file to load next
- blocker question if no path can be selected safely
