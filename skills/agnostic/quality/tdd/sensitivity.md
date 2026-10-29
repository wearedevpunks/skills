# Sensitivity Proof

A Sensitivity Proof shows that a test or Model invariant fails on one named Mutant. It holds the failing output, a diff that proves the Mutant landed, and a diff that proves the revert.

## When

Run one for:

- every test that passes on its first run
- every new property that passes on its first run
- every committed Model invariant

A genuine RED before implementation needs no Sensitivity Proof.

## Procedure

1. **Name** a Mutant that breaks the rule the test protects. Start from the typical Mutant of the test's pattern in [properties.md](properties.md). Done when the Mutant names one change in one file inside your Active Write Scope. When every candidate file is outside your Active Write Scope, record `sensitivity_evidence: parent_required` and stop here; the parent runs the proof.
2. **Apply** the Mutant. Stage your current work in that file first (`git add -- <file>`), so `git diff` shows only the Mutant. Done when `git diff -- <file>` contains the Mutant hunk.
3. **Run** the test. Done when it fails for the expected reason: the assertion for the protected rule, not a compile, setup or fixture error. When the test passes on the Mutant, it does not protect the rule: revert, strengthen the test, and start again at step 1.
4. **Revert** the Mutant. Done when `git diff --quiet -- <file>` exits 0.
5. **Record** the Mutant, the hunk, the failing output and the revert proof in `sensitivity_evidence`, never in `red_evidence`; `red_evidence` keeps meaning a genuine failure before implementation. Done when all four parts are in the Task Result.

## Guarantee

The parent Task Gate runs `git diff --quiet` on every recorded Mutant file and blocks the task while a Mutant remains. For `sensitivity_evidence: parent_required`, the parent runs this procedure itself.
