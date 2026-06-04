---
name: stack
description: Use the local squash-safe `stack` CLI for stacked PR inspection, sync, merge, and undo workflows when backlog-dependent work is represented by open parent PRs.
---

# Stack

Use the local `stack` CLI for squash-safe stacked PR workflows. It is for repos
where dependent PRs may be open at the same time and GitHub squash-merges parent
PRs.

Keep ordinary editing and commits on plain `git`. Use `stack` only for stack
intent, stack inspection, sync, merge, and undo workflows.

## Mental Model

```text
main
└─ parent-branch  #101
   └─ child-branch  #102
```

The GitHub PR base is the source of truth for ordinary stack inference. A child
PR should use its parent PR branch as its base. Independent PRs stay based on
trunk and do not need fake stack tracking.

## Core Commands

- `stack status`: inspect the current tracked or inferred stack.
- `stack sync --dry-run`: required inspection gate before stack mutation.
- `stack sync`: approved mutation gate after the dry-run preview is correct.
- `stack merge --auto`: merge the current stack root with GitHub auto-merge,
  wait for it to land, and repair descendants.
- `stack undo --apply`: restore the previous applied stack mutation when a
  repair or merge needs to be rolled back.

## Harness Workflow Rules

- Missing `stack` blocks stack-dependent workflows only. It does not block
  independent trunk-based work.
- `create-spec` records stack intent through `Dependency Readiness` and
  `Branch/Base Intent`; it does not mutate git state.
- `create-plan` preserves and validates those sections; it does not decide stack
  topology.
- `implement-spec` executes recorded branch/base intent before coding and runs
  stack sync only after PR base metadata exists.
- `delivery-phase` owns stack mutation and cleanliness.
- `review-phase` stays readonly and reports stack evidence.

## Normal Stacked PR Flow

```bash
git checkout -b team/name/child team/name/parent
# implement, commit, push
gh pr create --base team/name/parent --head team/name/child
stack sync --dry-run
stack sync
```

Use `stack track <branch> --onto <parent>` only when GitHub PR bases cannot
encode the stack clearly. Prefer PR bases over hand-maintained metadata.

## Delivery Closeout

When a PR exists, run:

```bash
stack status
stack sync --dry-run
```

If the PR is stack-dependent and the dry-run reports pending changes, run:

```bash
stack sync
```

Then rerun `stack status` if the final report needs evidence.

## Recovery

For the most recent applied stack mutation:

```bash
stack undo
stack undo --apply
```

Run the dry-run form first unless the user explicitly asks for immediate restore.
