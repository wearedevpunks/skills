---
name: ci-clickstack
description: Reads the telemetry of a Collective Intelligence (CI) environment (logs, traces, metrics, LLM usage, dashboards) through its ClickStack (HyperDX) MCP server `clickstack-<environment>`. Use when investigating CI runtime errors, slow requests, background jobs or LLM cost, when tracing a solution's calls into CI, or when the user mentions ClickStack, HyperDX or CI dashboards.
---

# ci-clickstack

Each CI environment runs one self-hosted ClickStack: a gateway collector, ClickHouse, and HyperDX. People open HyperDX in a browser after an Entra ID sign-in. Agents use its MCP server at `https://hyperdx.<environment base domain>/api/mcp`. Each request to it authenticates with a HyperDX API key. The operator of the machine registers that server at user scope as `clickstack-<environment>`, for example `clickstack-staging`, so its tools appear as `mcp__clickstack-<environment>__*`.

The source of truth is the ClickStack README in `collective-intelligence-platform/ci-deployment-definitions`, at `charts/kubernetes/platform/clickstack/README.md`. Read its "Agent access" and "Dashboards" sections with `gh api` when this skill does not answer a question.

## 1. Select the environment

Use the environment that runs the CI installation under investigation. A solution (demo) app sends no telemetry to ClickStack. Only CI installations and the environment's platform services do. You find a solution's calls as spans of the CI backend that it calls, and each record names its installation in `ci.installation.id`.

The environment is selected when a `clickstack-<environment>` server for it is in your tool list.

When it is missing, stop and tell the user: "Register `clickstack-<environment>` as in the ClickStack README, section Agent access, then start a new session." The operator keeps the key in the team vault and registers the server on their own machine. Registration stays out of the repository and out of the chat: never ask for, print or write the key, and never add the server to `.mcp.json` or `.codex/config.toml`. A 401 answer means that the agent process started without the key: ask the user to fix the registration and start a new session.

## 2. Query

1. Start from the provisioned dashboards. Each environment has the same five:
   - **Service health**: requests, 5xx share, latency and errors by service and route, error log patterns, external application calls
   - **Background jobs**: compaction and propagation lag, retention, job spans, worker errors
   - **Data resources**: Knowledge, Document and Dataset routes and Knowledge query metrics
   - **LLM usage and cost**: cost by currency (never summed across currencies), calls, tokens, by organization and agent. Aggregates only, no message content.
   - **Telemetry health**: records by signal and service, last record per service, storage by table
2. Narrow with search and SQL tools on a bounded time range. The batch query tools stop after 60 seconds, so split a long range instead of widening it.
3. Follow a finding to its trace and its logs.

The query is done when each claim in your answer cites a dashboard tile, query or trace ID and its time range.

## 3. Keep to read-only, least content

The API key has every right of a team member. Use it read-only: change a dashboard, saved search, alert or webhook only when the task asks for that change.

- **Shared dashboards** are code in `ci-deployment-definitions` (`files/dashboards` of the ClickStack chart). HyperDX writes them again every minute, so an edit made in HyperDX is lost. Change one with the procedure in the README section "Dashboards".
- **Environment-only dashboards** can be made through MCP when the task asks for one.
- **LLM message content** (`otel_traces_llm`) and **audit records** (`otel_logs_audit`): read them only when the task needs them, and quote only the part that the answer needs. For cost and volume, `otel_traces` and the LLM usage dashboard are enough.

## Report

Give the environment, time range, dashboards and queries used, the findings with trace IDs, and what stays unknown.
