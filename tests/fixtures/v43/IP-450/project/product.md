# Fixture product authority

Commit stores the exact supplied payload in the local repository. Rejection of an
empty commit preserves the current HEAD and stored payload. Publish Integrity
verifies that the repository's committed payload matches its exported digest;
a corrupted copy must fail verification and remain distinguishable from the
unchanged committed original. This file owns expected product semantics.
