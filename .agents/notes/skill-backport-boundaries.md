Internal skill iterations often blend two kinds of change:

- portable orchestration contracts
- product-specific workflow glue

The product-specific glue is the trap. `cicilca-doc-portal/.agents/skills` now carries wiki ingest and spec-folder assumptions that do not belong in the public skills repo. When backporting:

1. port the reusable behavior:
   - decision ledgers
   - self-contained plan artifacts
   - explicit TDD targets
   - wave-based orchestration contracts
   - honest stop conditions
2. strip app paths, host assumptions, and repo-specific docs/wiki pipelines
3. map internal wrapper names to public names:
   - `create-plan` -> `domain-plan` or `prd-to-plan`
   - `implement-spec` -> `domain-execute`

Why: copying internal paths verbatim makes public skills unusable outside the source repo and hides the real reusable improvement under product terminology.
