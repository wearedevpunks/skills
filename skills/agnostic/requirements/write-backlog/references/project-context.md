# Project Context

Read this reference for every mutation.

## Authority Order

1. A persisted explicit human decision resolves a genuine semantic conflict.
2. The project wiki owns durable product meaning: Product brief, objectives,
   users, boundaries, Product Map, constraints and non-goals, operating rules,
   owner, repository, wiki, and `V*` milestone context.
3. `.devpunks/settings.json` selects the provider and Product/Backlog Root. It
   does not define product meaning.
4. Fresh provider reads prove operational objects, identities, relations,
   metadata, views, milestones, and statuses.
5. Repository remotes and provider links prove repository identity. Immutable
   accepted evidence uses a verified commit/blob URL, not a local path or mutable
   branch URL.

Read routed `apps/wiki/` product artifacts before composing the delta. A valid
Requirements Phase result may have no Finder or Fog provenance; immutable
specification authority plus accepted placement is sufficient to reuse, enrich,
or create the needed hierarchy.

## Destination and Identity

Keep the settings key `backlogProjectUrl`; it identifies the
Product/Backlog Root. Verify the actual provider workspace, Root, repository,
and wiki. Connector or MCP aliases are routing hints, never workspace proof.
Several independent Roots may exist in one workspace.

Every intended object needs a durable wiki identity. Every known provider object
needs its stable provider identity. Apply the create/reuse/enrich/stop decision
table in `issue-reconciliation.md`. Titles, similar descriptions, and nearby
placement are discovery signals only.

A legacy destination, wrong workspace, unsupported representation, ambiguous
identity, or incomplete search returns exact setup guidance and zero provider
mutations. Historical staged tickets remain unchanged and excluded from
automatic Normalization.

## Conflict Handling

- Provider state defeats cached state for operational facts.
- Wiki authority defeats provider prose copied from a superseded decision.
- A real wiki/provider semantic conflict requires a new explicit decision and
  durable source update before mutation.
- Preserve accepted user wording. Use `$wait-what` to re-pitch unclear language
  in canonical project terms without changing meaning.
