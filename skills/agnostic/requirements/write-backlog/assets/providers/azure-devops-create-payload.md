# Azure DevOps Create Payload

Official source:

- Work items create API: [learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.1](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.1)
- Area and iteration paths: [learn.microsoft.com/en-us/azure/devops/boards/queries/query-by-area-iteration-path?view=azure-devops](https://learn.microsoft.com/en-us/azure/devops/boards/queries/query-by-area-iteration-path?view=azure-devops)
- Work item relation types: [learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-item-relation-types/list?view=azure-devops-rest-7.1](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-item-relation-types/list?view=azure-devops-rest-7.1)

## Transport

- endpoint: `POST https://dev.azure.com/{organization}/{project}/_apis/wit/workitems/${type}?api-version=7.1`
- headers:
  - `Content-Type: application/json-patch+json`
  - `Authorization: Bearer <TOKEN>`

## Preflight before creation

Before creating any item, build the complete in-memory projection. Resolve every dependency target, reject missing targets, self-edges, and cycles, derive and verify every milestone, and prove the configured hierarchy, classification, and dependency representation is representable in Azure DevOps. A failed preflight writes nothing.

## Raw request body

Azure DevOps creates work items with a JSON Patch document.

## Update existing decision tickets

Use a JSON Patch update against the existing work-item URL for claim, release, and resolve after reading its revision, assignee, and state and rejecting a conflicting claim. Include a revision `test` operation when supported. Resolution sets the configured terminal state and records the immutable resolution pointer in history or description. Return the updated work-item id and URL to Finder.

The example includes `Custom.DevpunksKind` only to show an explicitly configured adapter field. Omit that operation when the project configuration does not name such a field.

```json
[
  {
    "op": "add",
    "path": "/fields/System.Title",
    "value": "Lead manages unassigned submissions"
  },
  {
    "op": "add",
    "path": "/fields/System.Description",
    "value": "<h2>Outcome</h2><p>...</p><h2>Acceptance signals</h2><ul><li>...</li></ul>"
  },
  {
    "op": "add",
    "path": "/fields/System.Tags",
    "value": "workflow;review;kind:story"
  },
  {
    "op": "add",
    "path": "/fields/Custom.DevpunksKind",
    "value": "story"
  },
  {
    "op": "add",
    "path": "/fields/System.AreaPath",
    "value": "Product\\Submission lifecycle"
  }
]
```

## Required path inputs

- `{organization}`
- `{project}`
- `${type}`
- `api-version=7.1`

## Common field operations

- `/fields/System.Title`
- `/fields/System.Description`
- `/fields/System.Tags`
- `/fields/System.AreaPath`
- `/fields/System.IterationPath`
- `/fields/Custom.DevpunksKind`

## Provider classification

Classification examples assume explicit configuration.

Inspect configured provider metadata before choosing a representation. An adapter-specific custom picklist field such as `Custom.DevpunksKind` may represent the direct backlog concepts.

Only when explicitly configured to use that field, include it in JSON Patch payloads. If it is absent, record a setup blocker; do not create custom fields by default.

Allowed values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

Use Work Item Type for provider structure. A configured custom field or tags may represent classification for this adapter; neither is required by the shared model.

Fallback order:

1. configured custom field
2. existing Work Item Type or tag that exactly preserves the direct concept
3. stable title prefix such as `[story]`

If process policy permits none of these, fail preflight. Do not create custom fields or tags implicitly.

## Delivery body contracts

Epic body ownership:

- outcome
- scope and cross-story constraints
- child story list
- immutable spec link
- accepted artifact links when relevant

Story body ownership:

- outcome
- source `US-###`
- covered `AC-###`
- demonstration
- non-goals and dependencies
- immutable spec link
- accepted artifact links

Render these sections in `System.Description`; do not substitute a mutable local spec path.

## Repo mapping

- fog -> root-level work item with `Custom.DevpunksKind = fog`
- capability module -> `System.AreaPath`
- execution milestone -> chronological `System.IterationPath` derived from native Predecessor links
- grilling -> capability-module-scoped work item with `Custom.DevpunksKind = grilling`
- research -> capability-module-scoped work item with `Custom.DevpunksKind = research`
- prototype -> capability-module-scoped work item with `Custom.DevpunksKind = prototype`
- epic -> work item type chosen by your process, often `Epic` or `Feature`, with `Custom.DevpunksKind = epic`
- story -> child work item chosen by your process, often `User Story`, `Product Backlog Item`, or `Task`, with `Custom.DevpunksKind = story`

## Capability grouping

Use `/fields/System.AreaPath` for durable capability-module membership. Area paths organize work by product or feature area and stay independent from delivery chronology. Fog remains at the backlog/root area until sharpening chooses a capability module.

Do not encode execution waves in Area Path. One area can span multiple iterations, and one iteration can contain work from multiple areas.

## Chronological execution milestones

Use `/fields/System.IterationPath` for chronological `M1`, `M2`, and later execution waves only when the project has matching iteration nodes. Derive assignments from native Predecessor links:

1. In memory, resolve the complete selected graph and reject missing targets, self-edges, or cycles.
2. Derive blocker-free work items as `M1`; derive every other item as `M(1 + max(iteration number of each predecessor))`.
3. Verify every predecessor is in a strictly earlier iteration and that Azure DevOps can represent the complete hierarchy and graph.
4. Only after preflight passes, create work items, map planned keys to provider ids, and add each blocker with `System.LinkTypes.Dependency-Reverse`.
5. Create or resolve the verified iteration nodes and patch `/fields/System.IterationPath` on every selected milestone-eligible item.

Capability Area Path, parent/child hierarchy, and current Iteration Path never create dependency edges. Recompute iteration assignment whenever Predecessor relations change.

Apply the derived iteration with a follow-up JSON Patch operation:

```json
[
  {
    "op": "add",
    "path": "/fields/System.IterationPath",
    "value": "Product\\M2"
  }
]
```

## Notes

- Azure DevOps create requests are process-dependent. The exact work item type names available in `{type}` depend on the project template and process.
- This asset documents the raw create payload shape, not a universal field catalog for every process.
- If an explicitly configured custom field does not exist, record the provider setup blocker. Do not create it by default.
- Parent/child and dependency relations require relation operations or follow-up requests. Keep those separate from the minimal create-only body, then derive Iteration Path only after the dependency graph is complete.
