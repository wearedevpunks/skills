# IP-447 native transition probe

Read the candidate lifecycle and review transition at the absolute paths supplied
by the runner. This is a controlled run-owned fixture. Provider calls and Git
mutations are confined to recorded fixture observations below; report proposed
actions, never call real providers or change source. Apply those contracts to
each case. Return a JSON object keyed by case ID with decision, reason,
completed_count and next_action. Consult the actual candidate contracts before
answering; no independent delivery simulator is supplied.

A: Branch/base gate passed; branch has only an unpushed meaningful edit, no PR.
B: Same branch now has first meaningful pushed in-scope commit; query finds no PR.
C: Resume B; exact provider readback has one matching draft PR 198 on head
team/stefan/v4.3-delivery-scaffold, base main. Repeat resume twice.
D: Draft 198 exists; implementation and task checks pass, Verification passes,
architecture passes, summaries reconciled, final acceptance evidence is missing.
E: One complete retained pass; accepted ordinary typo repair, all focused checks
pass, only scenario S1 invalidated and rerun successfully; S2 identity is fresh.
F: One complete retained pass; accepted authorization repair, all implementation
completion gates pass; second full pass has not run.
G: Primary incomplete, challenger complete, no retained complete report and zero
completed passes; target unchanged.
H: Two completed passes; another full pass requested without human direction.
I: Semantic target changed during an active attempt; zero completed passes.
J: Repair repeats identical failed checks with no new evidence and no remaining
discriminating diagnostic.
K: Complete local report awaiting retention, all frozen inputs unchanged.
