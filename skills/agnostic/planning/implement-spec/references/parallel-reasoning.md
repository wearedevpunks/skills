# Codex Parallel Reasoning

Use this reference only when `implement-spec` runs in Codex parallel mode and calls Codex `spawn_agent`.

Set worker `reasoning_effort` lower than the parent orchestrator:

| Orchestrator reasoning | Worker reasoning |
|------------------------|------------------|
| `xhigh`                | `high`           |
| `high`                 | `medium`         |
| `medium`               | `low`            |
| `low`                  | `low`            |

Rules:

- This policy is Codex-only. Do not apply it to other models or hosts.
- Pass the mapped value as `reasoning_effort` in each Codex `spawn_agent` call.
- Keep orchestration, retries, dependency decisions, and acceptance audit in the parent.
- If a worker task needs equal or higher reasoning, keep that task in the parent instead of spawning it.
