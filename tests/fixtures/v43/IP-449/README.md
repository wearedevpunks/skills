# Native context and reconciliation fixture

Use these prompts with the installed Codex CLI and its current model/reasoning.
The supplemental Node contract test checks source shape; this fixture exercises
actual agent reads, Task Results and parent writes through the public brief.

1. Create one run-owned scratch directory. Record the canonical source root in
   `source-root.txt`. Seed `authority.md` with the content in the full-copy case,
   copy `cases.json`, and create parent-owned `PLAN.md` and
   `IMPLEMENTATION-NOTES.md` with pending sentinel text. Create `unrelated.md`
   with a unique canary; it is outside every selected Context Pointer.
2. Retain source digests, scratch path and canonical-file hashes outside scratch.
   Run `codex exec --ephemeral --skip-git-repo-check -C <scratch> --json -`
   with `worker-prompt.md` on stdin. Retain JSONL events and the resulting
   `worker-results.json`. Compare canonical-file hashes after the worker exits.
3. Replace only the run-owned notes sentinel with an empty directory at the same
   path to induce an actual summary-write failure. Run the same CLI command with
   `parent-prompt.md`; retain events, `parent-events.json` and both canonical files.
4. Reset the run-owned canonical sentinels and empty-directory collision. Run
   `dispatch-prompt.md` through the same CLI. Retain `dispatch-events.json` and
   `dependent-result.json`: an actual subprocess must finish while summaries
   remain blocked, before parent recovery writes and checkpoint eligibility.
5. Check actual source selections and results: current attributed context works;
   missing/unsourced authority blocks; changed input, mismatched excerpt and full
   copy require source refresh before readiness. Worker history contains no
   canonical writes and never reads the unrelated canary. Parent history shows
   safe dependent release while summaries lag, actual failed write, blocked
   cumulative gate, stale-summary recovery and reconciliation before checkpoint
   eligibility. Verification/final acceptance and Code Review stay distinct.
6. Record observed action/result/falsifier, source and runtime identities, process
   exit codes and deviations. A fixture assertion fails if these observations do
   not occur. Remove only that scratch directory after retaining evidence.

A source identity change during a run invalidates that run as admission evidence;
retain its trace as superseded and repeat against the settled candidate.
