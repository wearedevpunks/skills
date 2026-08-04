# Durable Report

Use this optional mode when research must remain reusable beyond the response.
Ordinary audits remain response-only.

## Contract

1. Create `research/<slug>` from the accepted base.
2. Discover the repository's research-report convention. If none exists, use
   the narrowest fitting project-docs path and state it.
3. Run 2-4 readonly lanes. Lanes never write the report.
4. After synthesis, the coordinator or one designated consolidator writes one
   Markdown report. There is exactly one writer and one consolidated report.
5. Cite the primary source for every retained factual claim. Separate facts,
   inferences, conflicts, and unresolved product decisions.
6. Commit the report, then push or explicitly retain `research/<slug>` through a durable repository-approved mechanism.
7. Verify the retained ref contains the report commit before returning the immutable commit SHA and path.

The report may close factual uncertainty. It must not silently choose product
direction or impersonate a human decision-maker.
