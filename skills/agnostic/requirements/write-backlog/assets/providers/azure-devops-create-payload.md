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
    "value": "workflow;review"
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

## Repo mapping

- module -> area/iteration or team-specific planning container
- epic -> work item type chosen by your process, often `Epic` or `Feature`
- story -> work item type chosen by your process, often `User Story`, `Product Backlog Item`, or `Task`

## Notes

- Azure DevOps create requests are process-dependent. The exact work item type names available in `{type}` depend on the project template and process.
- This asset documents the raw create payload shape, not a universal field catalog for every process.
- Parent/child and dependency relations may require additional relation operations or follow-up requests depending on your process conventions. Keep those separate from the minimal create-only contract documented here.
