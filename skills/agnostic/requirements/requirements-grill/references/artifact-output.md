# Artifact Output

Use this reference for the durable grill artifacts. The gates in `../phases/`
write them; this file defines their location and fields.

## Durable Artifacts

The grill keeps two files:

- `<wiki-root>/content/docs/project/grilling/<topic>-grill-log.md`
- `<wiki-root>/content/docs/project/grilling/<topic>-grill-status.md`

It reads, and never writes, the Brainstorm Brief at
`<wiki-root>/content/docs/project/grilling/<topic>-brainstorm-brief.md`.

Resolve `<wiki-root>` the same way as `docs-ingest-phase`:

- monorepo: `apps/wiki`
- single-repo: `wiki`

Before writing, read `<wiki-root>/AGENTS.md`. The grilling artifacts live in the routed project wiki because `/docs/project` owns useful grill context and maintenance/project records.

If a legacy `docs/<topic>-grill-log.md` or `docs/<topic>-grill-status.md` exists, treat it as input to move or merge into the routed grilling section. Do not keep updating both locations.

The log is the durable decision record. The status file is the branch
dashboard, round and frontier state, required-call evidence, gate outcomes, and
active grill glossary. `$domain-modeling` uses that glossary as its working
persistence until explicit closure.

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
- <Q ids and exact fact/source prerequisites, or `none`>

Altitude: L1 | L2 | L3

Source: user | Brainstorm Brief | auto-pinned default

Question:
<question asked>

Accepted answer:
- <locked answer>

Rejected alternatives:
- <alternative and reason, when recorded>
```

Omit `Source:` for a user answer and `Rejected alternatives:` when none is
recorded.

For a technical question, preserve the grounding and accepted scope beside the decision:

```md
Evidence anchor:
- <caller and existing/proposed paths; exact primitive module/symbol and source version/identity>

Observed constraint:
- <library/runtime guarantee and limitation; application-owned remainder>

Question:
<requirements contract or tradeoff>

Code consequence:
- <owner and module/capability/adapter/helper/value choice; dependency direction, composition, resource owner>
- <small sketch or durable reference; material ordering, lifetime, transaction and failure result>

Accepted scope:
- <accepted boundary, contract or invariant; selected primitive, protocol and ordering guarantee>
- <at L3: the decided module names, interfaces, primitives, seam placement, and file layout>
```

Use the same question id, Altitude, exact prerequisite dependencies, and
accepted-answer fields. Omit inapplicable detail. Label current facts,
proposals, accepted target design, and unproved runtime behavior separately.

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

On explicit closure, add a `## Closure` section with the quoted
shared-understanding confirmation, the quoted closure, and the handoff.

## Status File Contract

### Branch Dashboard

```md
## Branch Dashboard

| Branch | Completion | Target altitude | Settled altitude | Locked direction | Open items | Parked |
| --- | --- | --- | --- | --- | --- | --- |
| <branch> | 60% | L3 | L1 (anchors: <Brief, Fog, log, or code anchors>) | <direction> | Q12, Q14 | — |
| <branch> | parked | L1 | none | <direction> | — | at L1: <user's reason> |
```

`Target altitude` and `Settled altitude` follow the
[Altitude Ladder](../phases/router.md#altitude-ladder). A Settled Altitude
reached through precision inputs names its evidence anchors.

### Precision Inputs

```md
## Precision Inputs

- Brief import: <brief path> sha256 <hash> R<N> | none
- Fog: <Fog identity> | not supplied
- Altitude upgrade: R<N> | not needed
- Auto-pin: authorized R<N> | not authorized
- Conservative closure: requested R<N> | not requested
- Compile gaps: <gap summary> -> Q<N> | none
```

`R<N>` is the latest round id at the time of the record; `R0` precedes the
first round.

### Current Round

```md
## Current Round

- Round: R<N>
- Altitude: L1 | L2 | L3
- Current frontier: Q<N>, Q<N+1> | empty
- Shared-understanding confirmation: not-ready | pending | confirmed
- Closure: open | closed R<N> | reopened R<N>

| Question id | Branch | Altitude | Prerequisites | Question | State |
| --- | --- | --- | --- | --- | --- |
| Q<N> | <branch> | L2 | none | <decision question> | unanswered |
| Q<N+1> | <branch> | L3 | Q<N-2>; Unknown: <precise unknown> | <decision question> | unanswered |
```

The table lists every open question across all branches and Altitudes, plus
this round's questions in any state; it is the stable mapping between the live
round and durable question ids. `Current frontier` names only the questions
this round asks, all at `Altitude`. `State` is `unanswered`, `answered`,
`parked`, or `deferred`. A fact prerequisite reads `fact: <request>
requested | reported`.

### Required Calls

```md
## Required Calls

### R<N>

- grilling: R<N> run — <frontier ids>
- wait-what: R<N> run
- show-me: R<N> run — <view> via <html_render | html file | markdown>
- domain-modeling: R<N> run — <glossary change | no change>
- flow-lenses: R<N> run — <candidate gaps -> Q ids | none>
- expand: R<N> run — <new Q ids at the round Altitude | none>
- level derivation: R<N> run — <branch L<N+1> Q ids> | not due

### Close

- domain-modeling: run
- show-me: run — <view> via <html_render | html file | markdown>
- wiki synthesis: run — <pages> | not yet closed
```

`round` writes the `grilling`, `wait-what`, `show-me`, and optional
`wayfinder` lines; `checkpoint` writes the `domain-modeling`, `flow-lenses`,
`expand`, and `level derivation` lines. A call that could not run reads
`<call>: R<N> missing — <reason>`. A round's record is complete when every
line is `run` or `not due`.

### Technical Grounding

```md
## Technical Grounding

| Branch | Evidence anchors | Applicable dimensions | Open technical decisions | Grounding |
| --- | --- | --- | --- | --- |
| <branch> | `<path>:<symbol>` | <topology, persistence, ...> | <Q ids or `none`> | <unknown or grounded> |
```

`unknown` means required evidence is missing or invalid for an applicable technical dimension. `grounded` means current evidence anchors support every applicable dimension; decisions may still be open. Record supported and not-applicable dimensions with evidence, and missing facts with the exact question ids they block. Only those dependent questions wait; independent ready questions remain available. Evidence readiness and decision closure are separate: closure requires each technical decision to be answered, parked, or explicitly deferred. Parked or deferred branches stay visible but outside the active closure calculation.

### Gate Outcomes

Each gate exit replaces that gate's entry:

```md
## Gate Outcomes

### <ground | round | checkpoint | close>

- Phase: <gate>
- Status: complete | checkpoint | blocked | human_steering_required
- Exit: <declared exit>
- Scope: R<N>; <branches touched>
- Artifacts: <status and log sections written; wiki pages>
- Validation: <completion evidence checked>
- Grill state: <Target and Settled Altitude changes, frontier, confirmation>
- Next suggested route: <advisory only>
- Blockers: none | <missing evidence or required decision>
- Resume identity: <only what the status and log cannot reconstruct> | none
```

UI evidence does not apply. The router treats `Next suggested route` as its
lowest authority. A `human_steering_required` entry names the blocker, the
evidence, the proposed action, and the decision the user must make.

### Completion

Completion percentages are working signals:

- `0-50%`: branch discovered but unsettled
- `50-85%`: major direction set, important questions remain
- `85-99%`: mostly closed; final decisions, a level below the Target
  Altitude, or shared-understanding confirmation remain
- `100%`: the branch is settled at its Target Altitude, no question is
  open, shared understanding is explicitly confirmed, and a code-bearing
  branch is grounded with no open technical decision
- `parked`: preserved for later at a named Altitude, out of current scope

Keep a branch below `100%` while any `100%` condition fails.

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

Use `$domain-modeling` for glossary acceptance criteria. Prefer status-file updates for the current glossary and log entries for its decision trail.

## Legacy Status

An open grill whose status file has no `Target altitude` column is in the
legacy format. `ground` upgrades it once:

- add `Target altitude` (L3 for a code-bearing branch, else L1) and
  `Settled altitude: none` to each branch;
- add the `Altitude` and `Closure: open` lines to Current Round and the
  `Branch` and `Altitude` columns to its table;
- add the Precision Inputs, Required Calls, and Gate Outcomes sections;
- record `Altitude upgrade: R<N>`.

Existing log entries stay unchanged; new entries carry `Altitude:`. In the
same pass, `ground` records each level that the status, log, and code
evidence already settle, so each branch starts at its next level. A closed
grill is never upgraded.
