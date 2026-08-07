# Durable Report

This mode is mandatory for every `$parallel-research` run. The response may
include a concise synthesis, but the consolidated findings must also be
written to the project wiki before the run can complete.

## Contract

1. Create `research/<slug>` from the accepted base.
2. Resolve `<wiki-root>` using the repository convention (`apps/wiki` for a
   monorepo, `wiki` for a single-repo project), then read `<wiki-root>/AGENTS.md`
   before writing. The consolidated report path is always
   `<wiki-root>/content/docs/project/research/<slug>-research-report.md`, as a
   sibling to `project/grilling`. Keep it in the private project wiki: do not
   substitute `public-docs`, `specs`, or a context-only handoff. If the
   `project/research` route is missing, create its index and route metadata only
   as required by the wiki's existing conventions.
3. Run 2-4 readonly lanes. Lanes never write the report.
4. After synthesis, the coordinator or one designated consolidator writes one
   bounded Markdown synthesis at the resolved wiki path. There is exactly one writer and
   one consolidated report. Include only:
   - short context
   - trusted claims, with a primary source for every retained factual claim
   - uncertainty and conflicts
   - selected next route
   The response points to this report and does not duplicate its synthesis.
5. Commit the report and any required route metadata in one commit, then push
   or explicitly retain `research/<slug>` through a durable repository-approved
   mechanism.
6. Verify the retained ref contains the report commit before returning the
   immutable commit SHA and path.

The report may close factual uncertainty. It must not silently choose product
direction or impersonate a human decision-maker. A later `docs-ingest-phase`
run may project reusable knowledge from this report, but that optional curation
step does not replace the report or block research completion.
