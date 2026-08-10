# monday.com Create Payload

Connector source:

- monday.com MCP tools exposed through `@monday-com`
- Dependency column API: [developer.monday.com/api-reference/reference/dependency](https://developer.monday.com/api-reference/reference/dependency)

## Preflight before creation

Before creating any item, build the complete in-memory projection. Resolve every dependency target, reject missing targets, self-edges, and cycles, derive and verify every milestone, and prove the configured hierarchy, classification, and dependency representation is representable in monday.com. A failed preflight writes nothing.

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

## Update existing decision tickets

Use `@monday-com.change_item_column_values` for claim, release, and resolve after reading the item's configured people/status columns and rejecting a conflicting claim. Resolution sets the configured terminal status and writes the immutable resolution pointer to the configured long-text/update surface. Return the updated item id and board URL to Finder.

## Required bootstrap

Resolve the target board before creating backlog items.

Before creating or updating items on a board, inspect board metadata with the connector's board info tool so column IDs, column types, status labels, subitem support, and dependency columns are known. Do not invent column IDs.

Expected board shape, subject to explicit board configuration:

- optional configured Status or Dropdown classification column, which may be named `Kind`
- one board group per capability module
- parent items for epics/capabilities
- subitems for stories
- dedicated Status or Dropdown column named `Execution milestone` with `M1`, `M2`, and later derived values
- dependency column wherever selected work has blockers

If the target group for a capability module is missing, create it before creating concrete items.

## Provider classification

Classification examples assume explicit configuration.

Inspect configured provider metadata before choosing a representation. An adapter-specific Status or Dropdown column named `Kind` may represent the direct backlog concepts.

Only when explicitly configured to use that column, resolve its id and matching label. If it is absent, record a setup blocker; do not create classification columns or labels by default.

Allowed values:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

Keep workflow state in a separate Status column. Do not overload status labels such as `Working` or `Done` as kind.

Fallback order:

1. configured Status or Dropdown column
2. existing native category/tag column that exactly preserves the direct concept
3. stable title prefix such as `[story]`

If board policy permits none of these, fail preflight. Do not create columns or labels implicitly.

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

When classification is explicitly configured, use its actual column ID from board metadata in place of `kind`; otherwise use the fallback above.

## Create grilling, research, or prototype items

Create each learning item as a first-class parent item in the matching capability group.

When Finder supplies a source fog parent, preserve an immutable evidence link
in the learning item. Keep the item in its capability group; do not turn it into
a fog subitem because that would lose capability placement.

When configured, set the classification column to `grilling`, `research`, or `prototype`.

Closure notes record the answer or verdict, evidence, observations, open decisions, and resolution pointer for Wayfinder. They do not authorize delivery.

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

1. Inspect both parent-item and subitem board metadata.
2. In memory, resolve the complete selected graph and reject missing targets, self-edges, or cycles.
3. Prove every edge is representable by monday.com's same-board dependency constraint. If an edge crosses unsupported storage, stop before creation.
4. Derive dependency-free items as `M1`; derive every other item as `M(1 + max(milestone number of each dependency))`.
5. Verify every dependency points to a strictly earlier milestone and that all required configured columns exist.
6. Only after preflight passes, create items, map planned keys to provider ids, populate dependencies, and set exactly one verified milestone value per eligible item.

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
    "columnValues": "{\"long_text\":\"Outcome: ...\\n\\nScope: ...\\n\\nCross-story constraints: ...\\n\\nImmutable spec: <blob-url>\",\"kind\":{\"label\":\"epic\"}}"
  }
}
```

Epic body ownership:

- outcome
- scope
- cross-story constraints
- child story list
- immutable spec link
- accepted artifact links when relevant

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
    "columnValues": "{\"long_text\":\"Outcome: ...\\n\\nSource stories: US-001\\n\\nAcceptance criteria: AC-001\\n\\nDemonstration: ...\\n\\nAccepted artifacts: ...\",\"kind\":{\"label\":\"story\"}}"
  }
}
```

Story body ownership:

- outcome
- source `US-###`
- covered `AC-###`
- demonstration
- non-goals
- immutable spec link
- accepted artifact links

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

1. Resolve board ID and inspect board metadata.
2. Resolve only explicitly configured classification plus required capability, hierarchy, milestone, and dependency representations.
3. Complete the in-memory hierarchy, graph, milestone, and representability preflight.
4. Only after preflight passes, create required groups, items, and subitems.
5. Set only explicitly configured classification metadata.
6. Map planned keys to provider ids, add dependency values, and set already-derived milestones.

## Notes

- monday.com column IDs and label names are board-specific. Always inspect the board before emitting final create payloads.
- Groups are the primary capability-module container. The separate `Execution milestone` column stores chronology.
- A configured `Kind` column may represent fog, grilling, research, prototype, epic, and story for this board; it is not a shared cross-provider requirement. Keep workflow state separate.
- Keep product backlog content in item/subitem bodies. Do not put plan tasks, file paths, validation commands, or implementation handoffs in monday.com backlog records.
