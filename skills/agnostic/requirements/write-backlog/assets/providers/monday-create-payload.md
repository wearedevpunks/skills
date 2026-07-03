# monday.com Create Payload

Connector source:

- monday.com MCP tools exposed through `@monday-com`

## Intent

Use monday.com boards, groups, items, subitems, and dependency columns together.

Canonical mapping:

- fog -> first-class root/backlog item
- module/milestone -> board group
- grilling/research/prototype -> parent item in a module group
- epic/capability -> parent item
- story -> subitem under the epic item
- story ordering -> dependency column when present

Do not flatten epics and stories into sibling items when subitems are available.

## Required bootstrap

Resolve the target board before creating backlog items.

Before creating or updating items on a board, inspect board metadata with the connector's board info tool so column IDs, column types, status labels, subitem support, and dependency columns are known. Do not invent column IDs.

Expected board shape:

- dedicated Status or Dropdown column named `Kind`
- `Kind` labels/options: `fog`, `grilling`, `research`, `prototype`, `epic`, `story`
- one group per module/milestone
- parent items for epics/capabilities
- subitems for stories
- optional `Module/Milestone` text/dropdown when groups alone are not enough
- optional dependency column for story blockers

If the target group for a module is missing, create it before creating epic items.

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

Create each learning item as a first-class parent item in the matching module group.

Set the `Kind` column to `grilling`, `research`, or `prototype`.

Closure notes must name the answer, accepted direction, artifacts or evidence, and created or updated epics/stories.

## Create a module group

Tool:

```json
{
  "tool": "@monday-com.create_group",
  "arguments": {
    "boardId": "123456789",
    "groupName": "M1 - Intake and Review"
  }
}
```

Required fields:

- `boardId`
- `groupName`

Use stable module names. Do not create implementation-phase groups such as backend, frontend, or polish unless those are true product modules.

## Create an epic item

Create one parent item per epic/capability in the matching module group.

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

## Add story blockers

Use the board's dependency column when present. The exact column ID comes from board metadata.

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

`itemId` is the blocked story subitem. The dependency value references prerequisite story subitem IDs. If the connector requires a board-relation workflow before linking items, follow that workflow first.

## Minimal creation order

1. Resolve board ID.
2. Inspect board metadata.
3. Resolve or create the `Kind` Status or Dropdown column and allowed values.
4. Resolve or create groups for modules/milestones.
5. Create root fog items when needed.
6. Create grilling, research, prototype, or epic parent items in the matching groups.
7. Create story subitems with `parentItemId`.
8. Set known board columns for kind/module/epic metadata when available.
9. Add dependency-column values for real story blockers.

## Notes

- monday.com column IDs and label names are board-specific. Always inspect the board before emitting final create payloads.
- Groups are the primary milestone/module container. Use extra module columns only when the board already needs cross-group reporting.
- The `Kind` column is canonical for fog, grilling, research, prototype, epic, and story. Labels or other columns may mirror it, but workflow state remains separate.
- Keep product backlog content in item/subitem bodies. Do not put plan tasks, file paths, validation commands, or implementation handoffs in monday.com backlog records.
