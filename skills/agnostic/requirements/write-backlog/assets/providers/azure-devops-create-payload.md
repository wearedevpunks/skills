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

## Raw request body

Azure DevOps creates work items with a JSON Patch document.

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

## Kind storage

Canonical `kind` storage is a custom picklist field such as `Custom.DevpunksKind`.

Allowed values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

Use Work Item Type for provider structure, not canonical Harness kind. Tags may mirror kind for search compatibility, but `Custom.DevpunksKind` is the source when it exists.

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

1. Create selected concrete non-fog work items and parent/child hierarchy without an execution iteration.
2. Add each blocker as a Predecessor relation on the blocked item using `System.LinkTypes.Dependency-Reverse`.
3. Stop on a missing blocker target or dependency cycle.
4. Assign blocker-free work items to `M1`.
5. Assign every other work item to `M(1 + max(iteration number of each predecessor))`.
6. Create or resolve the matching iteration nodes and patch `/fields/System.IterationPath` on every selected milestone-eligible work item.
7. Verify every predecessor is in a strictly earlier iteration.

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
- If `Custom.DevpunksKind` does not exist, create a project/process custom picklist field before backlog sync or record the provider setup blocker.
- Parent/child and dependency relations require relation operations or follow-up requests. Keep those separate from the minimal create-only body, then derive Iteration Path only after the dependency graph is complete.
