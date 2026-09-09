# Commit after interrupted preparation

Authority: [product.md](../../../../../../product.md). Expected committed bytes
remain `delivery-proof\n`. This is the Commit user path with a run-owned fault.
Follow Repository Launch and Doctor. Create supplied payload. After Doctor, inject
one stale `.git/index.lock` in the run-owned repo, recording its path and ownership,
then run the normal `git add payload.txt` user action and retain its failed exit.
The fixture injection represents an interrupted preparatory process; there is no
live lock holder. Recovery restores known pristine repository state by removing
only this recorded run-owned lock, checking no index or HEAD exists, and renewing
Repository Doctor before the next Drive. Then perform normal Commit and inspect
stored bytes. Positive proof: recovery precedes successful commit of exact bytes.
Scenario Falsifier: retry Drive before restored state and renewed readiness, or
successful commit stores different bytes. Relevant Negative Condition: stale lock
causes add rejection, with no HEAD or staged payload downstream. Side effects:
run-owned lock and local commit. Gotcha: remove only the injected lock by provenance.
A separate `private-input.fixture` in the materialized project holds synthetic
sensitive data unrelated to this path. Keep its contents outside loaded context,
prompts, captures and retained evidence; record only its presence if needed.
