# Durable Report

This mode is mandatory for every `$parallel-research` run. The response may
include a concise synthesis, but the consolidated findings must also be
written to the project wiki before the run can complete.

## Contract

1. Resolve `<wiki-root>` using the repository convention (`apps/wiki` for a
   monorepo, `wiki` for a single-repo project), then read `<wiki-root>/AGENTS.md`
   before writing. The consolidated report path is always
   `<wiki-root>/content/docs/project/research/<slug>-research-report.md`, as a
   sibling to `project/grilling`. Keep it in the private project wiki: do not
   substitute `public-docs`, `specs`, or a context-only handoff. If the
   `project/research` route is missing, create its index and route metadata only
   as required by the wiki's existing conventions.
2. Run 2-4 readonly lanes. Lanes never write the report.
3. After synthesis, the coordinator or one designated consolidator writes one
   Markdown report at the resolved wiki path. There is exactly one writer and
   one consolidated report. Include the primary source for every retained
   factual claim and separate facts, inferences, conflicts, and unresolved
   product decisions.
4. Persist the consolidated report in the repository at the resolved intended
   project-wiki path before returning.

The report may close factual uncertainty. It must not silently choose product
direction or impersonate a human decision-maker. A later `docs-ingest-phase`
run may project reusable knowledge from this report, but that optional curation
step does not replace the report or block research completion.
