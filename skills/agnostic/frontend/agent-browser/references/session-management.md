# Session Management

Multiple isolated browser sessions with state persistence and concurrent browsing.

**Related**: [authentication.md](authentication.md) for login patterns, [SKILL.md](../SKILL.md) for quick start.

Choose a fresh name for each task; repeat the engine and session on every call. Chrome examples below are explicit branches for saved-state replay or screenshots. Session names alone do not persist login across restarts.

## Contents

- [Named Sessions](#named-sessions)
- [Session Isolation Properties](#session-isolation-properties)
- [Session State Persistence](#session-state-persistence)
- [Common Patterns](#common-patterns)
- [Default Session](#default-session)
- [Session Cleanup](#session-cleanup)
- [Best Practices](#best-practices)

## Named Sessions

Use `--session` flag to isolate browser contexts:

```bash
# Session 1: Authentication flow
agent-browser --engine lightpanda --session auth open https://app.example.com/login

# Session 2: Public browsing (separate cookies, storage)
agent-browser --engine lightpanda --session public open https://example.com

# Commands are isolated by session
agent-browser --engine lightpanda --session auth fill @e1 "user@example.com"
agent-browser --engine lightpanda --session public get text body
```

## Session Isolation Properties

Each session has independent:
- Cookies
- LocalStorage / SessionStorage
- IndexedDB
- Cache
- Browsing history
- Open tabs

## Session State Persistence

### Save Session State

```bash
# Save cookies, storage, and auth state
agent-browser --engine chrome --session task-chrome-123 state save /path/to/auth-state.json
```

### Load Session State

```bash
# Restore saved state
agent-browser --engine chrome --session task-chrome-123 state load /path/to/auth-state.json

# Continue with authenticated session
agent-browser --engine chrome --session task-chrome-123 open https://app.example.com/dashboard
```

### State File Contents

```json
{
  "cookies": [...],
  "localStorage": {...},
  "sessionStorage": {...},
  "origins": [...]
}
```

## Common Patterns

### Authenticated Session Reuse

```bash
#!/bin/bash
# Save login state once, reuse many times

STATE_FILE="/tmp/auth-state.json"

# Check if we have saved state
if [[ -f "$STATE_FILE" ]]; then
    agent-browser --engine chrome --session task-chrome-123 state load "$STATE_FILE"
    agent-browser --engine chrome --session task-chrome-123 open https://app.example.com/dashboard
else
    # Perform login
    agent-browser --engine chrome --session task-chrome-123 open https://app.example.com/login
    agent-browser --engine chrome --session task-chrome-123 snapshot -i
    agent-browser --engine chrome --session task-chrome-123 fill @e1 "$USERNAME"
    agent-browser --engine chrome --session task-chrome-123 fill @e2 "$PASSWORD"
    agent-browser --engine chrome --session task-chrome-123 click @e3
    agent-browser --engine chrome --session task-chrome-123 wait --load networkidle

    # Save for future use
    agent-browser --engine chrome --session task-chrome-123 state save "$STATE_FILE"
fi
```

### Concurrent Scraping

```bash
#!/bin/bash
# Scrape multiple sites concurrently

# Start all sessions
agent-browser --engine lightpanda --session site1 open https://site1.com &
agent-browser --engine lightpanda --session site2 open https://site2.com &
agent-browser --engine lightpanda --session site3 open https://site3.com &
wait

# Extract from each
agent-browser --engine lightpanda --session site1 get text body > site1.txt
agent-browser --engine lightpanda --session site2 get text body > site2.txt
agent-browser --engine lightpanda --session site3 get text body > site3.txt

# Cleanup
agent-browser --engine lightpanda --session site1 close
agent-browser --engine lightpanda --session site2 close
agent-browser --engine lightpanda --session site3 close
```

### A/B Testing Sessions

```bash
# Test different user experiences
agent-browser --engine chrome --session variant-a open "https://app.com?variant=a"
agent-browser --engine chrome --session variant-b open "https://app.com?variant=b"

# Compare
agent-browser --engine chrome --session variant-a screenshot /tmp/variant-a.png
agent-browser --engine chrome --session variant-b screenshot /tmp/variant-b.png
```

## Avoid the Default Session

When `--session` is omitted, commands use the shared default session. This skill always selects a fresh named session:

```bash
# These use the same task-specific session
agent-browser --engine lightpanda --session task-lp-123 open https://example.com
agent-browser --engine lightpanda --session task-lp-123 snapshot -i
agent-browser --engine lightpanda --session task-lp-123 close  # Closes this task session
```

## Session Cleanup

```bash
# Close specific session
agent-browser --engine lightpanda --session auth close

# List active sessions
agent-browser --engine lightpanda --session task-lp-123 session list
```

## Best Practices

### 1. Name Sessions Semantically

```bash
# GOOD: Clear purpose
agent-browser --engine lightpanda --session github-auth open https://github.com
agent-browser --engine lightpanda --session docs-scrape open https://docs.example.com

# AVOID: Generic names
agent-browser --engine lightpanda --session s1 open https://github.com
```

### 2. Always Clean Up

```bash
# Close sessions when done
agent-browser --engine lightpanda --session auth close
agent-browser --engine lightpanda --session scrape close
```

### 3. Handle State Files Securely

```bash
# Don't commit state files (contain auth tokens!)
echo "*.auth-state.json" >> .gitignore

# Delete after use
rm /tmp/auth-state.json
```

### 4. Timeout Long Sessions

```bash
# Set timeout for automated scripts
timeout 60 agent-browser --engine lightpanda --session long-task get text body
```
