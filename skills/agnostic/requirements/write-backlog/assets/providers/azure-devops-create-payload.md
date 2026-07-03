# Azure DevOps Create Payload

Official source:

- Work items create API: [learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.1](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.1)

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
- module -> area/iteration or team-specific planning container
- grilling -> module/milestone-scoped work item with `Custom.DevpunksKind = grilling`
- research -> module/milestone-scoped work item with `Custom.DevpunksKind = research`
- prototype -> module/milestone-scoped work item with `Custom.DevpunksKind = prototype`
- epic -> work item type chosen by your process, often `Epic` or `Feature`, with `Custom.DevpunksKind = epic`
- story -> child work item chosen by your process, often `User Story`, `Product Backlog Item`, or `Task`, with `Custom.DevpunksKind = story`

## Notes

- Azure DevOps create requests are process-dependent. The exact work item type names available in `{type}` depend on the project template and process.
- This asset documents the raw create payload shape, not a universal field catalog for every process.
- If `Custom.DevpunksKind` does not exist, create a project/process custom picklist field before backlog sync or record the provider setup blocker.
- Parent/child and dependency relations may require additional relation operations or follow-up requests depending on your process conventions. Keep those separate from the minimal create-only contract documented here.
