# Host Binding

The only file of this skill that names host tools. Each table maps a
Capability to the host's tool and its known failure modes. The Charter names
the host a run uses.

When a non-core Capability is missing (watch a PR, ask a secret), the
Orchestrator reads the PR state at each Listen event, or lists the secret as a
Needs-you access item. When spawn or send is missing, the host cannot
orchestrate: Intake records `go_solo`.

## T3 Code

| Capability | Tool | Notes and failure modes |
| --- | --- | --- |
| spawn a thread in a project with a brief | `t3_thread_launch` with `projectId`, `workspaceStrategy` (worktree, base ref), `modelSelection` and `message` | Starts with only its brief, no history. Returns `status: "preparing"`. Worktree provisioning can fail (for example a git credential error) with no signal to the sender; later sends queue and never run. The Start check catches it. `modelSelection` needs `instanceId`. |
| fork a thread | `t3_thread_transfer` with `action: "fork"` | The fork keeps the source's full history and project. |
| send a line to a thread | `t3_thread_send` with `mode: "auto"` | `steer` and `restart` fail on an idle thread. A Track's line reaches the Orchestrator as a user turn prefixed `[T3 Code: the agent in T3 thread "<id>" sent this message, not the user.]`. Top-level threads never wake their parent on completion; only these lines do. |
| read a thread | `t3_thread_read` | Page with `afterPosition`; `activity` view shows provisioning errors. |
| run a Worker that wakes the Orchestrator | `delegate_task` | Completion arrives as a "Delegated task … [completed]" user turn. From a home project that is not a git repository, it cannot open a worktree or run in another project ("A local task runs in this thread's project"; "Unable to resolve the parent checkout commit"): code Workers belong to the owning Track. |
| watch a PR | `watch_pull_request` | Updates arrive as "Update on pull request #N" user turns until merge; `unwatch_pull_request` before settling. |
| ask the human for a secret | `request_secret` | A private card; the value never enters the chat. |
| settle a thread | `t3_thread_organize` | Archives finished threads. |

Messages queue while the Orchestrator's turn runs and arrive after it ends; a
blocking question dialog holds them all.

Secret stores seen with this host: a Vaultwarden CLI vault, `$secrets-cli`
project envs, and the deploy platform's env manager. The Charter names the
run's own.
