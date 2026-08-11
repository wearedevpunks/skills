---
name: frontend-domain-structure
description: |
  Review frontend domain boundaries, domain granularity, imports, and React component splitting.
  Use when creating or refactoring frontend code, deciding whether a feature or module deserves its
  own domain, replacing flat technical buckets, reviewing React component boundaries, or changing
  framework composition and cross-domain dependencies.
---

# Frontend Domain Structure

Use this skill to give frontend behavior one clear domain owner and deliberate boundaries.

The [agnostic reference](references/structure.md) is the single source of truth for domain
classification, layer placement, and dependency rules. Read it for every frontend structure decision.

For React scopes, also read the [React addendum](references/react/structure.md). It owns component,
hook, context, provider, JSX, and behavior-test guidance.

## Workflow

1. Inspect nearby structure, imports, and project conventions.
2. Read the agnostic reference and identify each changed behavior's invariant owner.
3. Scan sibling domains and apply the domain-worthiness classifier before creating or splitting one.
4. Trace affected public entrypoints and dependency direction recursively.
5. In React scopes, read the React addendum and review component boundaries at responsibility and test seams.
6. Complete in the requested mode.
   - For a review or diagnostic request, return findings and a recommended target structure without editing files.
   - Only change files when the user explicitly asks to create, refactor, or implement; then make the smallest coherent move and validate with focused behavior tests and the narrowest relevant static checks.

## Completion

- Review mode finishes when every affected responsibility and boundary is classified, findings cite the
  current evidence, and the recommended target structure resolves each finding.
- Implementation mode finishes when every changed responsibility has an honest owner, every new boundary
  passes its applicable classifier, affected imports remain deliberate, and focused validation proves the
  changed behavior.
