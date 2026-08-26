# Project Context

Read this reference for every mutation.

## Authority

1. A new explicit human decision resolves a genuine semantic conflict after it
   is persisted in the durable source that owns that meaning.
2. The project wiki owns durable product meaning: Product brief, business
   objectives, target users, product boundaries, existing Product Map,
   constraints and non-goals, operating rules, owner, repository link, wiki
   link, and current and future `V*` milestone context.
3. `.devpunks/settings.json` selects the provider and Product/Backlog Root. It
   does not define product meaning.
4. Fresh provider reads prove current objects, identities, relations, metadata,
   views, milestones, and statuses.
5. Repository remotes and provider links prove repository identity. Immutable
   accepted evidence uses stable commit/blob links, not mutable branch URLs.

Read `apps/wiki/` and its routed product docs before composing the intended
delta. Pin the verified repository link and wiki link on the Product/Backlog
Root when the provider supports them. Keep the richer context in the wiki when
the provider cannot represent a field.

## Identity

Verify the actual provider workspace, root identity, repository identity, and
wiki identity. Connector or MCP aliases are routing hints, not workspace proof.
Several independent Product/Backlog Roots may exist in one workspace.

Durable wiki identity is required for every intended object; stable provider
identity is required after provider readback and on every later update. Apply
the create/enrich/stop decision table in `issue-reconciliation.md`. Titles,
similar descriptions, and nearby placement are discovery signals only.

## Conflict Handling

- Provider state defeats stale cached state for operational facts.
- Wiki meaning defeats provider prose copied from an older decision.
- A real wiki/provider semantic conflict requires a new explicit decision and
  durable source update before mutation.
- Preserve user ticket wording unless an accepted decision changes its meaning.
  Use `$wait-what` to re-pitch unclear language in canonical project terms.
