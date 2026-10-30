---
name: frontend-domain-structure
description: |
  Place frontend code in the fixed entities layer model and review domain granularity, imports,
  and React component splitting. Use when creating or refactoring frontend code, placing providers,
  shells, page templates, entities or data sources, deciding whether a feature, entity or module
  deserves its own domain, replacing flat technical buckets, reviewing React component boundaries,
  or fixing `frontend-layers` lint errors.
---

# Frontend Domain Structure

Use this skill to give each frontend behavior one owner in the fixed layer model: Composition on top,
then Features, Entities, Modules and Integrations.

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

The [agnostic reference](references/structure.md) is the single source of truth for the layers, domain
classification, placement, and dependency rules, including the Lint Rules. Read it for every frontend
structure decision.

For React scopes, also read the [React addendum](references/react/structure.md). It owns the React
placement of providers, shells and page templates, and component, hook, context, JSX, and behavior-test
guidance.

When the scope still has `modules/<domain>` with product terms, `composition/<surface>/` folders or
`mock*` folders, read [the migration map](references/migration.md) before you move code.

## Workflow

1. Inspect nearby structure, imports, and project conventions. Find the layer root and list the files in
   scope: the files that the invoking implementation creates or changes, or the code under review.
   Apply the layer model only to the scope of the implementation that invoked this skill; code outside
   that scope keeps its structure until a later implementation touches it.
2. Read the agnostic reference and place each changed responsibility in its layer and domain with the
   invariant-owner classifier.
3. Scan sibling domains and apply the domain-worthiness classifier before creating or splitting one.
4. Trace affected public entrypoints and dependency direction recursively.
5. In React scopes, read the React addendum and review component boundaries at responsibility and test seams.
6. Run the `frontend-layers` lint rules with the project's lint command on the files in scope. Test and
   story files follow the same rules, with the two exemptions the agnostic reference names. When the
   project does not install these rules, check each import in scope against the Lint Rules table of
   the agnostic reference.
7. Complete in the requested mode.
   - For a review or diagnostic request, return findings and a recommended target structure without editing files.
   - Only change files when the user explicitly asks to create, refactor, or implement; then make the smallest coherent move and validate with focused behavior tests, a new run of the `frontend-layers` lint rules, and the narrowest relevant static checks. Move each touched behavior out of a flat technical bucket, such as `lib/`, `utils/` or `helpers/`, to its invariant owner, and create its entrypoint before you update consumers.

## Completion

- Review mode finishes when every responsibility and boundary in scope is classified, findings cite the
  current evidence and each lint error in scope, and the recommended target structure resolves each
  finding.
- Implementation mode finishes when every changed responsibility has an honest owner, every new boundary
  passes its applicable classifier, the `frontend-layers` lint rules report no error in the files in
  scope, and focused validation proves the changed behavior.
