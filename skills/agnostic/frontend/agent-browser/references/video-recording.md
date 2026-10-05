# Video Recording

Capture browser automation as video for debugging, documentation, or verification.

**Related**: [commands.md](commands.md) for full command reference, [SKILL.md](../SKILL.md) for quick start.

Use a fresh task-specific Chrome session for the entire recording; repeat `--session` on every command. Chrome is required for rendered video. Close the owned session after saving the recording.

## Contents

- [Basic Recording](#basic-recording)
- [Recording Commands](#recording-commands)
- [Use Cases](#use-cases)
- [Best Practices](#best-practices)
- [Output Format](#output-format)
- [Limitations](#limitations)

## Basic Recording

```bash
# Start recording
agent-browser --engine chrome --session task-chrome-123 record start ./demo.webm

# Perform actions
agent-browser --engine chrome --session task-chrome-123 open https://example.com
agent-browser --engine chrome --session task-chrome-123 snapshot -i
agent-browser --engine chrome --session task-chrome-123 click @e1
agent-browser --engine chrome --session task-chrome-123 fill @e2 "test input"

# Stop and save
agent-browser --engine chrome --session task-chrome-123 record stop
```

## Recording Commands

```bash
# Start recording to file
agent-browser --engine chrome --session task-chrome-123 record start ./output.webm

# Stop current recording
agent-browser --engine chrome --session task-chrome-123 record stop

# Restart with new file (stops current + starts new)
agent-browser --engine chrome --session task-chrome-123 record restart ./take2.webm
```

## Use Cases

### Debugging Failed Automation

```bash
#!/bin/bash
# Record automation for debugging

agent-browser --engine chrome --session task-chrome-123 record start ./debug-$(date +%Y%m%d-%H%M%S).webm

# Run your automation
agent-browser --engine chrome --session task-chrome-123 open https://app.example.com
agent-browser --engine chrome --session task-chrome-123 snapshot -i
agent-browser --engine chrome --session task-chrome-123 click @e1 || {
    echo "Click failed - check recording"
    agent-browser --engine chrome --session task-chrome-123 record stop
    exit 1
}

agent-browser --engine chrome --session task-chrome-123 record stop
```

### Documentation Generation

```bash
#!/bin/bash
# Record workflow for documentation

agent-browser --engine chrome --session task-chrome-123 record start ./docs/how-to-login.webm

agent-browser --engine chrome --session task-chrome-123 open https://app.example.com/login
agent-browser --engine chrome --session task-chrome-123 wait 1000  # Pause for visibility

agent-browser --engine chrome --session task-chrome-123 snapshot -i
agent-browser --engine chrome --session task-chrome-123 fill @e1 "demo@example.com"
agent-browser --engine chrome --session task-chrome-123 wait 500

agent-browser --engine chrome --session task-chrome-123 fill @e2 "password"
agent-browser --engine chrome --session task-chrome-123 wait 500

agent-browser --engine chrome --session task-chrome-123 click @e3
agent-browser --engine chrome --session task-chrome-123 wait --load networkidle
agent-browser --engine chrome --session task-chrome-123 wait 1000  # Show result

agent-browser --engine chrome --session task-chrome-123 record stop
```

### CI/CD Test Evidence

```bash
#!/bin/bash
# Record E2E test runs for CI artifacts

TEST_NAME="${1:-e2e-test}"
RECORDING_DIR="./test-recordings"
mkdir -p "$RECORDING_DIR"

agent-browser --engine chrome --session task-chrome-123 record start "$RECORDING_DIR/$TEST_NAME-$(date +%s).webm"

# Run test
if run_e2e_test; then
    echo "Test passed"
else
    echo "Test failed - recording saved"
fi

agent-browser --engine chrome --session task-chrome-123 record stop
```

## Best Practices

### 1. Add Pauses for Clarity

```bash
# Slow down for human viewing
agent-browser --engine chrome --session task-chrome-123 click @e1
agent-browser --engine chrome --session task-chrome-123 wait 500  # Let viewer see result
```

### 2. Use Descriptive Filenames

```bash
# Include context in filename
agent-browser --engine chrome --session task-chrome-123 record start ./recordings/login-flow-2024-01-15.webm
agent-browser --engine chrome --session task-chrome-123 record start ./recordings/checkout-test-run-42.webm
```

### 3. Handle Recording in Error Cases

```bash
#!/bin/bash
set -e

cleanup() {
    agent-browser --engine chrome --session task-chrome-123 record stop 2>/dev/null || true
    agent-browser --engine chrome --session task-chrome-123 close 2>/dev/null || true
}
trap cleanup EXIT

agent-browser --engine chrome --session task-chrome-123 record start ./automation.webm
# ... automation steps ...
```

### 4. Combine with Screenshots

```bash
# Record video AND capture key frames
agent-browser --engine chrome --session task-chrome-123 record start ./flow.webm

agent-browser --engine chrome --session task-chrome-123 open https://example.com
agent-browser --engine chrome --session task-chrome-123 screenshot ./screenshots/step1-homepage.png

agent-browser --engine chrome --session task-chrome-123 click @e1
agent-browser --engine chrome --session task-chrome-123 screenshot ./screenshots/step2-after-click.png

agent-browser --engine chrome --session task-chrome-123 record stop
```

## Output Format

- Default format: WebM (VP8/VP9 codec)
- Compatible with all modern browsers and video players
- Compressed but high quality

## Limitations

- Recording adds slight overhead to automation
- Large recordings can consume significant disk space
- Some headless environments may have codec limitations
