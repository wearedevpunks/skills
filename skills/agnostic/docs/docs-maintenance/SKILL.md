---
name: docs-maintenance
description: Ingest a spec folder into the wiki domain layer by extracting and writing flow pages first, then concept pages, then syncing ingest metadata. Secondary: update docs/ when code changes alter architecture, setup, contracts, or operator workflow. Use when a spec is ready to be captured as domain knowledge after review or implementation, or when a code task changes non-obvious behavior that docs/ should reflect.
---

# Docs Maintenance

## Contract

- **Role:** higher-order ingest and repo-docs orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** reviewed or implemented spec folder, or code changes that may require `docs/` updates
- **Delegates to:** internal flow-writing phase, then internal concept-writing phase
- **Downstream:** synced wiki indexes, ingest metadata, wiki log, and any required `docs/` updates
- **Entry conditions:** resolved spec folder for ingest work, or a concrete docs-affecting code change
- **Stop conditions:** ingest bookkeeping complete, required docs updates complete, failures reported honestly

## Overview

**Primary purpose:** synthesize `<wiki-root>/specs/<domain>/<spec>/SPEC.md` (and optionally `IMPLEMENTATION-NOTES.md`) into the wiki domain knowledge layer. Write flow pages first, then concept pages, then sync ingest bookkeeping.

**Secondary purpose:** keep `docs/` accurate when code changes alter architecture, setup, contracts, decisions, or operator-facing behavior.

Read `<wiki-root>/AGENTS.md` before touching any wiki content.

`<wiki-root>` is repo-shape dependent:
- monorepo: `apps/wiki`
- single-repo: `wiki`

---

## Primary: Wiki Ingest Orchestration

### Pipeline

```
docs-maintenance (orchestrator)
  └─ 1. flow-writing phase    — writes flows/, updates domain index
  └─ 2. concept-writing phase — reads flows/ for cross-linking, writes concepts/, updates domain index
```

**Why this order is required:** concept writing reads existing flow pages to cross-link concepts. Flow pages must exist before concept pages are written.

### Inputs

Accept any of:
- A spec folder path: `<wiki-root>/specs/<domain>/<spec>/`
- A domain name + spec name
- An explicit `SPEC.md` path

Resolve all inputs to a full spec folder path before continuing. If the target is still ambiguous, ask only for the missing folder.

### Step 1: Guard

Check `SPEC.md` frontmatter for `ingested: true`. If set, exit with a clear no-op message.

Verify the spec has `domain:` in frontmatter. Error if absent.

### Step 2: Read the source

Read in order:
1. `SPEC.md` — mandatory. If missing, stop and report.
2. `IMPLEMENTATION-NOTES.md` — optional. If present, flows and concepts become `status: implemented`. If absent, status is `proposed`.
   - Check its frontmatter. If it lacks frontmatter (no YAML block), add it now before continuing:
     ```yaml
     ---
     domain: <domain from SPEC.md>
     type: implementation-notes
     spec: <spec id from SPEC.md>
     links:
       - "[[specs/<domain>/<spec>/SPEC]]"
     ingested: false
     last_ingested: null
     created: <today>
     updated: <today>
     ---
     ```

Verify `<wiki-root>/domains/<domain>/` exists with a `<domain>.md` index file. If the domain is missing, stop and scaffold the wiki/domain structure first.

### Step 3: Extract flows

A flow exists when the spec describes a **sequence of user or system actions with a defined start, steps, and end outcome**.

Look for flows in:
- Multi-step acceptance criteria (e.g. "On save, the system runs duplicate detection → blocks if exact match → redirects operator on success")
- Explicit user journeys or process descriptions in the Context section
- "When X, then Y" conditional chains across multiple acceptance criteria
- Any section titled Flow, Process, Journey, or similar

For each flow found:
- Assign a descriptive `flow_name` (e.g., "Create Patient", "Document Upload", "Duplicate Check")
- Extract `flow_content`: triggering event, actors involved, ordered steps with decision points, terminal outcome
- When `IMPLEMENTATION-NOTES.md` is present: note deviations, surprises, or blocked steps inline

If no multi-step sequence is discernible (e.g., a purely data-model spec), record the absence and skip flow delegation.

### Step 4: Write flow pages

Read [references/flow-pages.md](references/flow-pages.md) and apply that contract to every extracted flow.

Wait for all flow pages to complete before proceeding.

If any flow write fails, stop immediately. Do not proceed to concept writing. Report the failure so the run can be resumed cleanly.

### Step 5: Extract concepts

A concept exists when the spec **names a domain entity or term with defined attributes, invariants, or bounded scope**.

Look for concepts in:
- Fields listed in acceptance criteria (e.g., `first_name`, `email`, `acquisition_channel`, `nin`)
- Explicit data model or entity sections
- Nouns that recur across multiple acceptance criteria with their own distinct attributes or rules
- Enum sets representing a bounded domain state (e.g., `acquisition_channel` values)
- Entities referenced via `[[wikilinks]]` to other specs or domain pages

**Grouping rule:** collect related fields under one owning entity rather than creating a concept per field. All patient registry fields → one "Patient" concept. All acquisition channel variants → one "Acquisition Channel" concept.

If no distinct domain entity is identifiable, record the absence and skip concept delegation.

### Step 6: Write concept pages

Read [references/concept-pages.md](references/concept-pages.md) and apply that contract to every extracted concept.

Wait for all concept pages to complete.

### Step 7: Mark sources as ingested

Update `SPEC.md` frontmatter:
```yaml
ingested: true
last_ingested: YYYY-MM-DD
```

If `IMPLEMENTATION-NOTES.md` is present, update its frontmatter:
```yaml
ingested: true
last_ingested: YYYY-MM-DD
```

Also populate its `links` array with every flow and concept page written in Steps 4 and 6 (in addition to the SPEC link that was set in Step 2). This is the only moment where IMPLEMENTATION-NOTES links are updated — do not leave them pointing only at the SPEC.

### Step 8: Log entry

Append to `<wiki-root>/log.md` (cap at 50 entries; drop oldest when over):
```md
## [YYYY-MM-DD] ingest | <spec title>
- Source: [[specs/<domain>/<spec>/SPEC]]
- Flows written: <count>
- Concepts written: <count>
```

### Step 9: Update wiki index

If new pages were created, update the Concepts and Flows counts in the relevant Domains table row in `<wiki-root>/index.md`.

### Resumability

Output pages are the checkpoints. On re-invocation of the same source:

- Flow pages with `ingested: true` → skip Step 4 for those flows
- Any expected flow page missing → re-run Step 4 for it before Step 6
- Concept pages with `ingested: true` → skip Step 6 for those concepts

---

## Secondary: docs/ Maintenance

Update `docs/` when a code task changes **architecture, setup, contracts, decisions, or non-obvious operator-facing behavior**. Do not let docs/ work displace or delay wiki ingest.

1. Read `docs/README.md` and the nearest affected section README before editing.
2. Prefer editing an existing leaf doc over creating a new one.
3. When a doc is added, removed, or renamed: update `docs/README.md` and the nearest section README in the same task.
4. Record repo-wide behavior changes in `docs/architecture/decisions/`.

**Route by owned behavior:**
- Backend/runtime surface → `docs/reference/domains/backend-effect-sql.md` or `docs/runbooks/`
- Auth/user-management → `docs/reference/domains/user-management.md`
- Frontend/app structure → `docs/reference/domains/frontend-application-structure.md`
- AI workflow/agent infrastructure → `docs/runbooks/subagent-templates.md` or `docs/runbooks/claude-code-hooks.md`

---

## Never Do

- Ingest a spec with `ingested: true` — exit early instead
- Ingest an `IMPLEMENTATION-NOTES.md` with `ingested: true` — treat it as already reflected in domain pages
- Proceed to concept writing when a flow write has failed
- Create `docs/prd`, `docs/dev`, roadmap, sprint, or backlog-mirror folders
- Document speculative or future-state features as current truth
- Put agent task instructions inside human-facing docs pages
- Leave docs orphaned from `docs/README.md` after adding or renaming them
- Duplicate content between `<wiki-root>/domains/` (the "what") and `docs/reference/domains/` (the "how")
