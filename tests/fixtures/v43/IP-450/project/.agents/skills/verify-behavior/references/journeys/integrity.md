# Publish Integrity Cross-App Journey

Select [Repository](../repository/README.md) with [Commit](../repository/features/commit.md),
then [Digest](../digest/README.md) with [Integrity](../digest/features/integrity.md).
Follow those references for Launch, Doctor, Drive, Evidence and Cleanup mechanics.
Exchange the committed payload bytes from Repository into Digest's run-owned
`payload.txt`; use the repository's normal read command to export them.
One observable result: the digest accepts committed bytes and rejects corruption
while the repository's committed original stays unchanged. Follow the selected
feature's positive proof and Scenario Falsifier; keep one journey result with
per-app observations. Repository owns cleanup of the shared run directory.
