# Track Ledger Contract

`.orchestrator/<run>/ledger.md` is the run's durable state. The router reads
it on every turn; every gate exit writes it. Write the Ledger before the
action it records, so a repeated event finds the new state and changes
nothing.

## Sections

### Run

- Run: `<slug>-<yyyy-mm-dd>`
- Orchestrator: thread link
- Home project: path
- State: `open` | `solo` | `closed`

### Exit Criteria

A checklist of what must be true to close the run. The Orchestrator updates
it when the human changes scope; it is the run's only goal.

### Tracks

| Track | Thread | Project | Scope | Phase | State | Depends on | PRs and ready commit | Last line |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

States, in order: `proposed`, `spawned`, `shaping`, `shaped`, `delivering`,
`in_review`, `ready`, `gated`, `landed`, `shipped`, `verified`, `settled`.
Side states: `stalled` (no start or no line), `parked` (human hold),
`blocked_access`, `superseded`.

### Needs You

| Id | Kind | Line | Track | Opened |
| --- | --- | --- | --- | --- |

- Id: `N1`, `N2`, …; never reused.
- Kind: `gate` | `access` | `out-of-bounds`.
- Line: one quotable sentence that names the item and the answer expected.

An answered item moves to Decisions with the human's words.

### Decisions

One entry per Autonomous Decision or human answer: time, question, answer,
evidence, `in-bounds` or `out-of-bounds`, Track.

### Events

Append-only, one line per gate exit:

`<time> <gate> <exit> — <Track or scope>; send time <time>; next: <route>`

The `next` route is advisory; the router recomputes it.
