# monday.com Create Payload

Connector source:

- monday.com MCP tools exposed through `@monday-com`
- Dependency column API: [developer.monday.com/api-reference/reference/dependency](https://developer.monday.com/api-reference/reference/dependency)

## Intent

Use monday.com boards, groups, items, subitems, and dependency columns together.

Canonical mapping:

- fog -> first-class root/backlog item
- capability module -> board group
- execution milestone -> dedicated Status or Dropdown column derived from dependency values
- grilling/research/prototype -> parent item in a capability group
- epic/capability -> parent item
- story -> subitem under the epic item
- item ordering -> dependency column when every required edge is representable

Do not flatten epics and stories into sibling items when subitems are available.

## Required bootstrap

Resolve the target board before creating backlog items.

Before creating or updating items on a board, inspect board metadata with the connector's board info tool so column IDs, column types, status labels, subitem support, and dependency columns are known. Do not invent column IDs.

Expected board shape:

- dedicated Status or Dropdown column named `Kind`
- `Kind` labels/options: `fog`, `grilling`, `research`, `prototype`, `epic`, `story`
- one board group per capability module
- parent items for epics/capabilities
- subitems for stories
- dedicated Status or Dropdown column named `Execution milestone` with `M1`, `M2`, and later derived values
- dependency column wherever selected work has blockers

If the target group for a capability module is missing, create it before creating concrete items.

## Kind storage

Canonical `kind` storage is a dedicated Status or Dropdown column named `Kind`.

Allowed values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

Keep workflow state in a separate Status column. Do not overload status labels such as `Working` or `Done` as kind.

## Create a fog item

Create fog as a first-class backlog item at the root/backlog group. Do not create child tickets under fog.

Tool:

```json
{
  "tool": "@monday-com.create_item",
  "arguments": {
    "boardId": 123456789,
    "groupId": "backlog",
    "name": "Clarify partner onboarding surface",
    "columnValues": "{\"long_text\":\"Frontier: ...\\n\\nWhy this is fog: ...\",\"kind\":{\"label\":\"fog\"}}"
  }
}
```

Use the actual `Kind` column ID from board metadata in place of `kind`.

## Create grilling, research, or prototype items

Create each learning item as a first-class parent item in the matching capability group.

Set the `Kind` column to `grilling`, `research`, or `prototype`.

Closure notes must name the answer, accepted direction, artifacts or evidence, and created or updated epics/stories.

## Capability grouping

Use one stable board group per durable capability module. A group answers which product capability owns the item; it does not answer when the item executes.

Fog stays in a root/backlog group until sharpening selects a capability module. Do not name capability groups `M1`, `M2`, or other chronological wave names. One capability group can contain items from multiple execution milestones.

## Create a capability-module group

Tool:

```json
{
  "tool": "@monday-com.create_group",
  "arguments": {
    "boardId": "123456789",
    "groupName": "Submission lifecycle"
  }
}
```

Required fields:

- `boardId`
- `groupName`

Use stable capability names. Do not create implementation-phase groups such as backend, frontend, or polish unless those are true product modules.

## Chronological execution milestones

Use a separate Status or Dropdown column named `Execution milestone` for `M1`, `M2`, and later dependency-derived waves. The exact column ID comes from board metadata.

1. Inspect both parent-item and subitem board metadata. Confirm the `Execution milestone` and dependency columns exist wherever selected work will live.
2. Before creating dependency values, prove every required blocker edge is representable by monday.com's same-board dependency constraint. If an edge crosses parent-item and subitem storage, stop with a provider setup blocker; do not replace it with prose or derive milestones from an incomplete graph.
3. Create selected concrete non-fog items/subitems in capability groups without an execution-milestone value.
4. Populate the dependency column so each blocked item references all prerequisite item IDs.
5. Stop on a missing dependency target or cycle; monday.com's API does not enforce cycle detection for clients.
6. Assign dependency-free items to `M1`.
7. Assign every other item to `M(1 + max(milestone number of each dependency))`.
8. Set exactly one `Execution milestone` value on every selected milestone-eligible item.
9. Verify every dependency points to an item in a strictly earlier milestone.

Items from different capability groups can share one execution milestone. Group membership, parent/subitem hierarchy, and current milestone value never create dependency edges. Recompute milestone values whenever the dependency column changes.

## Create an epic item

Create one parent item per epic/capability in the matching capability group.

Tool:

```json
{
  "tool": "@monday-com.create_item",
  "arguments": {
      "boardId": 123456789,
      "groupId": "topics",
      "name": "Submission lifecycle management",
      "columnValues": "{\"long_text\":\"Outcome: ...\\n\\nScope: ...\\n\\nCross-story constraints: ...\",\"kind\":{\"label\":\"epic\"}}"
  }
}
```

Epic body ownership:

- outcome
- scope
- cross-story constraints
- child story list
- links to source grill/status artifacts when relevant

Keep `columnValues` limited to known board columns from board metadata.

## Create story subitems

Create each story as a subitem under its epic item.

Tool:

```json
{
  "tool": "@monday-com.create_item",
  "arguments": {
      "boardId": 123456789,
      "parentItemId": 987654321,
      "name": "Lead reassigns ownership to another reviewer",
      "columnValues": "{\"long_text\":\"Outcome: ...\\n\\nAcceptance signals: ...\\n\\nNon-goals: ...\",\"kind\":{\"label\":\"story\"}}"
  }
}
```

Story body ownership:

- outcome
- acceptance signals
- non-goals
- links

If a board does not support subitems, stop and ask whether to add subitem support or use a different monday.com board. Do not silently degrade into flat story items.

## Add native blockers

Use the board's dependency column for every representable blocker. The exact column ID comes from board metadata.

Tool:

```json
{
  "tool": "@monday-com.change_item_column_values",
  "arguments": {
    "boardId": 123456789,
    "itemId": 1122334455,
    "columnValues": "{\"dependency\":{\"item_ids\":[5566778899]}}"
  }
}
```

`itemId` is the blocked item or subitem. The dependency value references prerequisite IDs from the same board. If the connector requires a board-relation workflow before linking items, follow that workflow first.

## Minimal creation order

1. Resolve board ID.
2. Inspect board metadata.
3. Resolve or create the `Kind` Status or Dropdown column and allowed values.
4. Resolve or create groups for capability modules.
5. Resolve or create the `Execution milestone` Status or Dropdown column.
6. Create root fog items when needed.
7. Create selected concrete non-fog parent items and story subitems in their capability groups without milestone values.
8. Set known board columns for kind/capability/epic metadata when available.
9. Add dependency-column values for real blockers.
10. Derive and set `Execution milestone` values from the complete dependency graph.

## Notes

- monday.com column IDs and label names are board-specific. Always inspect the board before emitting final create payloads.
- Groups are the primary capability-module container. The separate `Execution milestone` column stores chronology.
- The `Kind` column is canonical for fog, grilling, research, prototype, epic, and story. Labels or other columns may mirror it, but workflow state remains separate.
- Keep product backlog content in item/subitem bodies. Do not put plan tasks, file paths, validation commands, or implementation handoffs in monday.com backlog records.
