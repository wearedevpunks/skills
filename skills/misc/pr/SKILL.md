---
name: pr
description: Write or rewrite a pull request body as a Managed Region with Summary, before/after Evidence and Merge Danger. Use whenever an agent creates a pull request, edits its description, or delivery refreshes the PR body.
---

# PR

The reviewer already has the diff open. The body shows them, in order, the
shape of the change, proof that it works, and what a mistake would cost. Skip
preambles and keep prose brief. Use the project's glossary terms.

This format is the whole body contract: a repository
`.github/pull_request_template.md` is not read.

## Template

```markdown
<!-- hi:pr-body:start -->
## Summary

<smallest view + short text>

## Evidence

- **Before:** <screenshot / failing test / output>
  **After:** <screenshot / passing test / output>

## Merge Danger

**Door:** <one-way | two-way> — <one-line reason>
**Blast Radius:** <one word> <optional detail>
**How to revert:** <exact steps; for a one-way door, what a revert leaves behind>
**Risk:** <Low | Medium | High>

## Authority

<SPEC · ARCHITECTURE · PLAN links> · <backlog ids>

## Review

<Pass Report path> · route <route.primary> · open findings <n>

<attribution line>
<!-- hi:pr-body:end -->
```

## Steps

1. Gather the inputs: the diff against the base, the spec or ticket, the plan,
   and recorded evidence (Verification, Runtime Validation, UI Evidence Links,
   CI per check, Pass Report). The Door call needs the spec, not only the diff.
2. Fill each section by the rules below. When proof or a result does not exist
   yet, write `Pending:` and what will supply it.
3. Write the Managed Region into the body by the rewrite rules, through
   `--body-file`.
4. Read the body back.

Completion: the read-back body has exactly one Managed Region that opens at
`## Summary`; every section holds content, `Pending:` or `None`; the Door has
its reason; every byte outside the Managed Region matches the body before the
write; the Summary view alone tells what the PR changes.

## Sections

### Summary

Resolve `$show-me` and pick its smallest view that makes the change clear:
pseudocode, call tree, component tree, file tree, table, Mermaid or a shaped
diff. The PR body is the render surface, so write the view as Markdown or
Mermaid. Place each view beside the short text it supports; one view is the
usual count.

### Evidence

Show a before and an after for the claim the PR makes, taken from recorded
evidence:

1. Screenshots, when the change is visual: the durable UI Evidence Links.
2. Execution: the exact test that failed before and passes now, as pseudocode,
   or the console output that changed.

"Tests are green" alone is a claim, not a before and after. Report CI beside
the pair, per check.

### Merge Danger

- **Door:** a two-way door is a change a revert fully undoes. A one-way door
  leaves an effect outside the code that survives a revert: deleted or migrated
  data, a published version, a changed public contract, a sent message or
  webhook. When the project's Codebase Rule Registry has a One-Way Door Rule
  and a changed path or change kind matches it, the Door is one-way; cite the
  matched entry. Otherwise judge from the diff and the spec, and state the
  reason.
- **Blast Radius:** one word, then optional detail: what can break, such as
  layout, API consumers, mobile, CI or installs.
- **How to revert:** the exact steps. For a one-way door, also name what the
  revert leaves behind.
- **Risk:** `High` for every one-way door; `Low` for docs, copy, internal-only
  changes, or additive changes behind a flag; `Medium` otherwise. Risk is a
  label for the reviewer; review depth and approvals keep their own owners.

### Authority

Link the SPEC, ARCHITECTURE and PLAN (immutable URLs when retained) and the
backlog ids. Write `None` when the change has none.

### Review

The Pass Report path, its `route.primary` and the count of open findings.
Write `Pending` before review and `None` when no review runs.

## Managed Region

The skill owns only the bytes between `<!-- hi:pr-body:start -->` and
`<!-- hi:pr-body:end -->`. Bots and humans own the rest of the body.

- Rewrite: read the current body, replace the bytes between the markers, keep
  every byte outside them.
- No markers yet: put the Managed Region first and keep the old body below it.
- The attribution line is the last line inside the Managed Region.
