# Commit

Authority: [product.md](../../../../../../product.md).
User behavior: store a supplied payload through the repository CLI.
Entry: run-owned initialized repository; prerequisite: Doctor passes.
Driver: write `payload.txt` with exactly `delivery-proof\n`; run `git add payload.txt`
and `git commit -m fixture`, scoped to the run-owned repo. Inspect
`git show HEAD:payload.txt`; record HEAD. Positive proof: stored bytes match payload.
Scenario Falsifier: successful commit whose stored bytes differ from supplied bytes.
Variant/Relevant Negative Condition: repeat `git commit -m empty` without changes;
expect nonzero status and verify HEAD and stored payload remain unchanged downstream.
Side effect: one local commit. Gotcha: an empty commit rejection is expected; retain
its exit status without treating the fixture itself as a failed run.
