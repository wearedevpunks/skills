# Artifact Output

Use this reference to maintain the durable grill artifacts.

This workflow is always paired with [grilling-flow.md](grilling-flow.md) during a serious grilling session.

## Durable Artifacts

At the start of a serious grilling session, create or reuse:

- `<wiki-root>/content/docs/project/grilling/<topic>-grill-log.md`
- `<wiki-root>/content/docs/project/grilling/<topic>-grill-status.md`

Resolve `<wiki-root>` the same way as `docs-ingest-phase`:

- monorepo: `apps/wiki`
- single-repo: `wiki`

Before writing, read `<wiki-root>/AGENTS.md`. The grilling artifacts live in the routed project wiki because `/docs/project` owns useful grill context and maintenance/project records.

If a legacy `docs/<topic>-grill-log.md` or `docs/<topic>-grill-status.md` exists, treat it as input to move or merge into the routed grilling section. Do not keep updating both locations.

The log is the durable decision record.
The status file is the current branch dashboard plus the current glossary snapshot.

## Routed Wiki Contract

Grill artifacts are human-facing routed pages. Include frontmatter on new files:

```yaml
---
title: "<Topic> Grill Log"
surface: project
permission: project
---
```

Use `"<Topic> Grill Status"` for the status file title.

After adding or renaming a grill artifact:

- update `<wiki-root>/content/docs/project/grilling/meta.json`
- create `grilling/index.mdx` if the section is missing
- append a concise entry to `<wiki-root>/log.md` when the repo maintains one
- preserve existing frontmatter on existing files

## Grill Log Contract

The log is structured, not a raw transcript.

Record accepted decisions as:

```md
### Q<N>

Question:
<question asked>

Accepted answer:
- <locked answer>
```

Group related decisions under branch headings.

When the user changes an earlier decision, add a new entry that explicitly supersedes the old one.

Record glossary decisions in the log when terms or axioms are first pinned:

```md
### Glossary Q<N>

Question:
<terminology or axiom question>

Accepted answer:
- Canonical term: **<Term>** — <one-sentence definition>
- Avoid: <alias>, <alias>
- Relationship: **<Term>** <relationship> **<Other Term>**
- Axiom: <domain invariant that should not be re-debated>
```

Omit unused fields. If a later answer changes the glossary, add a superseding entry instead of rewriting history.

## Status File Contract

Maintain a compact branch dashboard with:

- branch name
- completion percentage
- locked direction
- still-open items
- parked branches
- glossary snapshot
- pinned axioms
- flagged ambiguities

Completion percentages are working signals:

- `0-50%`: branch discovered but unsettled
- `50-85%`: major direction set, important questions remain
- `85-99%`: mostly closed, only constants/schema/naming remain
- `100%`: design closed; remaining work is implementation/tuning
- `parked`: preserved for later, out of current scope

## Glossary Snapshot Contract

Keep the status file glossary compact and current:

```md
## Glossary

### Terms

- **<Term>**: <one-sentence definition>
  Avoid: <alias>, <alias>

### Relationships

- **<Term>** belongs to exactly one **<Other Term>**

### Axioms

- <Domain invariant accepted during the grill>

### Flagged Ambiguities

- "<ambiguous word>" was used to mean both **<Term A>** and **<Term B>**. Resolution: <decision>.
```

Rules:

- Be opinionated: pick one canonical term.
- Keep definitions to one sentence.
- Include only terms meaningful to product/domain experts in this grill.
- Prefer status-file updates for the current glossary; use log entries for the decision trail.
- Group terms under subheadings only when clusters are natural.
- Add a short example dialogue only when it clarifies a boundary that keeps recurring.

## Branch Closure

When a branch closes:

1. Update the grill log with final accepted decisions.
2. Update the status file percentage, open items, glossary snapshot, axioms, and ambiguities.
3. If the branch changes durable domain/product knowledge, run the wiki-output workflow.
4. Say exactly what changed, which routed artifacts were updated, and whether `meta.json` or wiki log bookkeeping changed.

## Final Handoff

At the end, report:

- branch percentages
- parked branches
- remaining non-design validation work
- recommended next planning direction

If all active branches are `100%`, say the requirements grill is done and the likely next direction is backlog/user-story creation.
