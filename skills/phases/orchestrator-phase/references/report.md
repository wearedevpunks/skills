# Report Contract

Every message the human reads from the Orchestrator has three parts, in this
order, written through `$wait-what`: items by their names, codes only in
brackets or links.

1. **Needs you.** Every open Needs-you item, one line each, led by its id:
   `N3 — Merge the chat release PR (new functionality): reply "go N3".`
   Write "nothing" when the list is empty.
2. **Changed since last report.** State changes only: Tracks that moved,
   merges, releases, deploys, verifications, Autonomous Decisions taken.
3. **Running.** Each live Track and Worker with its state, in one line each.

The first report of a run also shows the Charter in short form.
