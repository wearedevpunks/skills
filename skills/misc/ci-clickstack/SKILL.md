---
name: ci-clickstack
description: Telemetry of a Collective Intelligence (CI) environment through its ClickStack (HyperDX) MCP server `clickstack-<environment>`. Use when investigating CI runtime errors, latency, background jobs or LLM cost, when tracing a solution's calls into CI, or when the user mentions ClickStack or HyperDX.
---

# ci-clickstack

The operator registers each environment's server at user scope as `clickstack-<environment>` (for example `clickstack-staging`), so its tools appear as `mcp__clickstack-<environment>__*`. The ClickStack README is the source of truth. Read it to register a server, to change a shared dashboard, or for a question this skill leaves open:

```bash
gh api repos/collective-intelligence-platform/ci-deployment-definitions/contents/charts/kubernetes/platform/clickstack/README.md -H 'Accept: application/vnd.github.raw'
```

## 1. Select the environment

Pick the environment that runs the CI installation under investigation. Only CI installations and the environment's platform services send telemetry. A solution (demo) app sends none, so you find its calls as spans of the CI backend it calls. Every record names its installation in `ci.installation.id`.

The environment is selected when its `clickstack-<environment>` tools are in your tool list. Otherwise, stop on the matching branch:

- **No ClickStack in the environment** (`capabilities.clickstack` is off in its `environment.yaml`): report that the environment has no telemetry to read.
- **Server missing:** tell the user to register `clickstack-<environment>` as the README section "Agent access" describes, then start a new session.
- **401 answer:** the agent started without a valid key (missing, expired or revoked). Tell the user to load the current team key from the vault, then start a new session.

The key belongs to the operator. Registration lives at user scope on their machine, so the repository and the chat carry neither the key nor a server entry.

## 2. Query

1. Start from the provisioned dashboards: list them, then query the tiles that match the question.
2. Narrow with search and SQL tools on a bounded time range. The batch query tools stop after 60 seconds, so split a long range instead of widening it.
3. Follow each finding to its trace and its logs.

Report cost per currency; amounts in different currencies never add up.

The query is done when every claim in your answer cites a dashboard tile, query or trace ID, with its time range.

## 3. Stay read-only, read the least content

The API key has every right of a team member, so treat the session as read-only. Write only what the task asks for:

- **Shared dashboards** are code in `ci-deployment-definitions`. HyperDX rewrites them every minute, so change one through the README section "Dashboards".
- **Environment-only dashboards, saved searches, alerts and webhooks** go through the MCP tools.

LLM message content (`otel_traces_llm`) and audit records (`otel_logs_audit`) are the least-content exception: open them only when the task needs them, and quote only what the answer needs. For cost and volume, `otel_traces` and the provisioned LLM dashboard are enough.

## Report

Give the environment, time range, the tiles, queries and traces you used, the findings, and what stays unknown.
