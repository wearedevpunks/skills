# Draft Pull Request Body

Every AI-written body for the plan's draft pull request follows this contract.
It is written on draft PR create and on every later update, per
[lifecycle.md](lifecycle.md#draft-pull-request-visibility). The skeleton is
[../assets/PR-BODY-TEMPLATE.md](../assets/PR-BODY-TEMPLATE.md).

## Required structure

Use these exact headings, in this order:

1. `## Summary`: optional. One to three sentences of intent and scope.
2. `## Testing`: required.
3. `## Risk`: required.
4. `## How to revert`: required.

Do not rename, drop, or reorder the required headings. Do not add a PR template
of a different shape on top of them.

Every required section has concrete content. `TBD`, `N/A` without a reason, and
bare placeholders do not satisfy this contract.

## Testing

- List each command actually run with its observed result.
- Label each run: focused (the changed behavior), CI (fresh run, linked), or
  local broad (only what CI does not cover). Never report a local run as a CI
  result.
- Name every check not yet run, with the reason. A pending check is replaced
  with its result on the next update.
- When user-visible UI changed, add a `### UI Evidence` subsection under
  `Testing`. It carries the same durable before/after links as
  `IMPLEMENTATION-NOTES.md` `## UI Evidence Links`, per
  [ui-screenshot-evidence.md](ui-screenshot-evidence.md). Omit the subsection
  when no UI changed.

## Risk

- Tier: `low`, `medium`, or `high`, derived from the change's blast radius, not
  from who or what wrote it.
- Rationale: one to three sentences naming what can break, who is affected, and
  which runtime or data surfaces are touched.

| Tier | Blast radius |
|------|--------------|
| `low` | Docs, skill or prompt text, comments, test-only changes, or behavior behind unchanged defaults with no shared runtime path. |
| `medium` | A bounded runtime path, CLI behavior, or internal interface whose failure is contained and reversible without data repair. |
| `high` | Auth or permissions, payments, data migrations or persisted-state formats, shared infrastructure, public contracts, or failures that are hard to observe or undo. |

The tier is a reviewer signal. It does not set review-phase policy or add a
review cycle.

## How to revert

Write one concrete path the operator can run:

- Code or docs change: `git revert <commit>` for the merge or squash commit
  once it exists. Before merge, name the PR's commit range.
- Behind a flag: the flag name and the value that disables the path.
- Persisted state changed: the non-revertible part and its repair step, or
  `Data: none`.

## Review responsibility

Claude or the AI agent drafts the `Testing`, `Risk`, and `How to revert`
answers. The human operator of the agent reviews them and corrects the body
before merge readiness.

## Sources

- Addy Osmani, "How the Claude Code team does code review":
  https://x.com/addyosmani/status/2114604912520921136. PR template gets
  Testing, Risk, and How to revert; the author reviews AI answers; blast radius
  sets the review bar.
- Seth (@seth_codes_): https://x.com/seth_codes_/status/2114810243444256964.
  Risk and How to revert belong in the template; classify PRs by blast radius
  and risk.
