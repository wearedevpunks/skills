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

1. **Scope**: if docs goal bounds or source artifacts are unclear, stop and ask one concrete question.
2. **Contract**: resolve the wiki contract with [../references/wiki-contract.md](../references/wiki-contract.md#resolve). Done when you hold a resolved contract or its list of gaps.
3. **Branch**: select the first branch whose trigger matches.
   - **Setup/adoption**: the user asks to set up or adopt the wiki. Branch file: [../references/wiki-contract.md](../references/wiki-contract.md), sections Adopt or Set up.
   - **Capture**: the user supplies a raw source to keep. Branch file: [../references/source-capture.md](../references/source-capture.md).
   - **Health**: the user asks for a wiki health check or maintenance. Branch file: [../references/health.md](../references/health.md).
   - **Private/internal**: a spec, project/wiki page, root `docs/`, operator workflow, route metadata, or learning artifact needs ingest and is missing or stale. Branch file: [private-internal.md](private-internal.md).
   - **Public**: reader-facing public docs are requested or materially affected. Branch file: [public-docs.md](public-docs.md).
   - **No-op**: no docs-affecting change exists. Report the no-op with evidence and stop.

   When audience stays unclear after minimal inspection, ask whether the target reader is internal/project/operator or public/adopter/user. Done when one branch is selected.
4. **Gap**: when a contract gap covers a destination the selected branch writes, run setup/adoption if the task holds setup authority; otherwise write the [gap report](../references/wiki-contract.md#gap-report) and stop. Done when the selected branch file is loaded, or the gap report is written.

When several branches apply, run capture before ingest of that source, and private/internal before public unless the private/internal outcome is already fresh and names the public target plus writer artifact location. Each branch ends with its own outcome; re-enter this router for the next one.

## Resume Behavior

Assume either path may have been completed manually. Verify artifact freshness;
do not re-run a path only because `docs-ingest-phase` did not run it.

## Output

Report:

- selected path
- evidence that selected it
- wiki contract status: resolved, or each gap
- path file to load next
- blocker question if no path can be selected safely
