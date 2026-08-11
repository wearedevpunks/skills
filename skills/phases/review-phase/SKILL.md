---
name: review-phase
description: >-
  Explicit readonly review of one frozen delivery diff or standalone artifact
  bundle, ending with one retained all-lens report and routing output.
disable-model-invocation: true
---

# Review Phase

Review is explicit-only and readonly relative to its frozen target. It retains
one all-lens report and returns routing evidence; it never enters a repair.

## Bootstrap

1. Load [the review router](phases/router.md) on every invocation and resume.
2. Recompute the current route from durable evidence, including on cold resume.
3. Load exactly the one gate selected by the router, or return its single
   terminal, checkpoint, or blocked outcome.
4. After a gate writes its durable outcome, stop or re-enter this bootstrap.

The router is the sole runtime route authority. Gate files own executable work.
