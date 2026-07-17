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
The status file is the current branch dashboard, round/frontier state, and current glossary snapshot.

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

Keep each question's `Q<N>` id stable across rounds, partial responses, and superseding decisions. Never reuse or renumber an id.

Record accepted decisions as:

```md
### Q<N>

Prerequisites:
- <Q ids or `none`>

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

## Round Persistence Contract

Before yielding each round, persist a `Current Round` section in the status file:

```md
## Current Round

- Round: R<N>
- Current frontier: Q<N>, Q<N+1> | empty
- Shared-understanding confirmation: not-ready | pending | confirmed

| Question id | Prerequisites | Question | State |
| --- | --- | --- | --- |
| Q<N> | none | <decision question> | unanswered |
| Q<N+1> | Q<N-2> | <decision question> | unanswered |
```

The table is the stable mapping between the live round and durable question ids. `State` is `unanswered`, `answered`, `parked`, or `deferred`.

After each response set:

1. Process every supplied answer separately against its stable question id.
2. Add answered decisions to the log and mark those ids `answered` in status.
3. Leave omitted questions `unanswered`; do not infer an answer or drop them from status.
4. Persist the updated status, including the frontier and branch dashboard, before continuing.
5. When the frontier is empty, set confirmation to `pending`; set it to `confirmed` only after the user explicitly confirms shared understanding.

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
- `100%`: no unanswered items remain, the frontier is empty, and shared understanding is explicitly confirmed; remaining work is implementation/tuning
- `parked`: preserved for later, out of current scope

Keep a branch below `100%` while it has unanswered items or while shared-understanding confirmation is pending.

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
2. Update the status file percentage, open items, round/frontier state, glossary snapshot, axioms, and ambiguities.
3. Confirm no unanswered item or pending shared-understanding confirmation is represented as `100%`.
4. If the branch changes durable domain/product knowledge, run the wiki-output workflow.
5. Say exactly what changed, which routed artifacts were updated, and whether `meta.json` or wiki log bookkeeping changed.
