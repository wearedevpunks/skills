# Human Backlog

Use this branch after the step 9 Core Backlog readback. It projects recorded
Core Backlog evidence onto the Business Request that a Fog links in the Human
Backlog (Azure DevOps), and it keeps the Fog ↔ Business Request links. It
reaches the Human Backlog only through the helper
`.agents/skills/human-backlog-ado/scripts/ado.py`; its `--help` lists exact
arguments.

## 1. Gate

The branch runs when `.devpunks/settings.json` has `humanBacklog` and the Fog
carries a Business Request link. A run with no `humanBacklog`, no Business
Request link, or no Fog makes zero Human Backlog writes, reports no failure,
and continues at step 10.

When `humanBacklog` is set and `.agents/skills/human-backlog-ado/scripts/ado.py`
is absent, return setup guidance: select the `ci-solutions` Pack, run
`hi update`, then run `setup-human-backlog`. Make zero Human Backlog writes;
the Core Backlog writes complete as usual.

Completion: the gate result is recorded as `run`, `skipped` with its reason,
or `setup guidance`.

## 2. Derive the owed Human State

Read the Fog status, its accepted resulting scope (every Story and Task
identity, as in [delivery status](delivery-status.md) Fog Completion), and
all recorded evidence for each identity. The owed Human State is the highest
state that all recorded evidence for the Fog scope supports. Check the rows in
order; the first row whose evidence holds gives the owed state:

| Owed state | Evidence that must hold |
| --- | --- |
| no write | Fog becomes Superseded; move both links (step 4) |
| Withdrawn | Fog becomes Cancelled and has no production evidence |
| Live | Fog completes: production evidence covers its whole scope |
| On staging | staging evidence for every Story and Task in the Fog scope |
| In progress | first work-started fact in the Fog scope |
| nothing owed | no row above holds |

Derive the state from all evidence, never from the latest fact alone: a later
fact for an earlier state never lowers the owed state. Each fact stays
distinct: merge is never staging evidence, and staging evidence is never
production evidence. Today no delivery step records staging or production
evidence, so On staging and Live wait for that evidence.

Completion: one owed state from the table, with the evidence identities that
support it.

## 3. Write the Human State

Take the Business Request ID from the last path segment of its URL
(`…/_workitems/edit/<id>`). Read its current state and language with
`ado.py get <id>`, then write the owed state:

```bash
python3 .agents/skills/human-backlog-ado/scripts/ado.py set-state <id> "<Human State>" --comment "<comment>"
```

The `--comment` is the one comment per Human State change. Write plain
business text in the Business Request's language: what changed, the date, and
the release name when known. Keep technical detail in the Core Backlog: the
comment carries no pull request, commit, Linear or GitHub URL.

| Helper result | Record |
| --- | --- |
| exit 0, `status` `written` or `unchanged` | success; read back with `ado.py get <id>` |
| exit 1, `error` names a final state, a backward move, or a state that is not a Human State | refusal: the request already has a later or final state; record it and do not retry |
| any other failure | add the owed write to the residual delta (step 5) |

Completion: `ado.py get <id>` shows the owed state, or the result is a
recorded refusal or residual-delta entry.

## 4. Keep the Fog ↔ Business Request links

Write the links at Fog intake when the caller supplies a Business Request URL,
or later on an explicit link instruction. Keep one Business Request per Fog and
one active Fog per Business Request: before a link write, read the Fog links,
search the Core Backlog for an open Fog with the same URL, and read the
Business Request side with `ado.py get <id>`. Any other match, including a
Hyperlink to another open Fog on the Business Request side, stops with
steering and zero link writes.

| Side | Representation |
| --- | --- |
| Fog, Linear | attachment link on the Fog to the Business Request URL |
| Fog, GitHub | Fog body line `Business Request: <url>` |
| Business Request | back link: `python3 .agents/skills/human-backlog-ado/scripts/ado.py hyperlink <id> <fog-url> --comment "Fog"`; readback: `ado.py get <id>`, whose `hyperlinks` contains the Fog URL |

Write the Fog side through the selected provider adapter and read it back.
The back link is a Hyperlink relation, and a repeated write is `unchanged`, so
retry is safe.

When this run records a Fog as Superseded, move both links to the successor
Fog in the same run: remove the link from the superseded Fog, add it to the
successor Fog, remove the back link to the superseded Fog with
`ado.py unhyperlink <id> <superseded-fog-url>`, add one for the successor Fog
with `hyperlink`, and read back both sides.

Completion: every link write is read back or is in the residual delta.

## 5. Return

Add to the step 10 return envelope: gate result, owed state, helper result,
readback, link writes, and the back-link readback (the `hyperlinks` entry).
Put each failed Human Backlog write (state or back link) in the residual delta
with its owed value.
The Core Backlog writes of the run stay applied. The next delivery event
retries the residual delta through this branch; forward-only `set-state`
makes the retry safe.

Completion: every owed Human Backlog write is read back, recorded as a
refusal, or listed in the residual delta.
