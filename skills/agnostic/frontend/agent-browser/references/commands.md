# Command reference

Use `agent-browser skills get core --full` or `agent-browser <command> --help` for the installed version's command syntax. Adapt examples to [SKILL.md](../SKILL.md): every browser invocation selects its engine and the same fresh task session.

## Lightpanda DOM workflow

```bash
agent-browser --engine lightpanda --session task-lp-123 open https://example.com
agent-browser --engine lightpanda --session task-lp-123 session info --json
agent-browser --engine lightpanda --session task-lp-123 snapshot -i
agent-browser --engine lightpanda --session task-lp-123 snapshot -c -d 3
agent-browser --engine lightpanda --session task-lp-123 snapshot -s "main"
# Use refs discovered in the current snapshot:
agent-browser --engine lightpanda --session task-lp-123 click @e1
agent-browser --engine lightpanda --session task-lp-123 fill @e2 "text"
agent-browser --engine lightpanda --session task-lp-123 get text body
agent-browser --engine lightpanda --session task-lp-123 get url
agent-browser --engine lightpanda --session task-lp-123 wait --text "Success"
agent-browser --engine lightpanda --session task-lp-123 eval "document.title"
agent-browser --engine lightpanda --session task-lp-123 close
```

For multiline JavaScript, pass stdin to avoid shell interpolation:

```bash
agent-browser --engine lightpanda --session task-lp-123 eval --stdin <<'JS'
Array.from(document.querySelectorAll('a')).map(a => a.href)
JS
```

## Chrome capability branches

Use a separate Chrome session for rendered screenshots/PDF, video, layout and coordinates, headed login, profiles/extensions, or `--state` replay. Reopen the page and refresh refs in that session. See [authentication](authentication.md) and [video recording](video-recording.md) for those workflows.

```bash
agent-browser --engine chrome --session task-visual-123 open https://example.com
agent-browser --engine chrome --session task-visual-123 screenshot --full page.png
agent-browser --engine chrome --session task-visual-123 pdf page.pdf
agent-browser --engine chrome --session task-visual-123 close
```

To attach to an existing authorized Chrome session, keep its CDP option on every call:

```bash
agent-browser --engine chrome --session task-attached-123 --cdp 9222 snapshot -i
agent-browser --engine chrome --session task-attached-123 --cdp 9222 get url
agent-browser --engine chrome --session task-attached-123 --cdp 9222 close
```

`AGENT_BROWSER_ENGINE=lightpanda` is supported, but explicit flags keep a new shell or inherited config from changing this skill's engine. `--session` isolates running state; saved state is an explicit persistence operation. See [Lightpanda diagnostics](lightpanda.md) when a command fails instead of switching engines silently.
