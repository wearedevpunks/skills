# Lightpanda installation and diagnostics

Read when activating the skill on a new machine or diagnosing a Lightpanda failure.

## Install the required binaries

Use an agent-browser release that exposes `--engine lightpanda` in `--help`. Install or update through the environment's package manager when needed:

```bash
npm install -g agent-browser
agent-browser --version
agent-browser --help
```

`agent-browser install` installs Chrome; it does not install Lightpanda. Install Lightpanda separately using the [official installation guide](https://lightpanda.io/docs/open-source/installation). The official stable 1.0 command is:

```bash
curl -fsSL https://pkg.lightpanda.io/install.sh | bash -s "1.0.0"
lightpanda version
```

For a binary outside `PATH`, repeat its path on every browser call:

```bash
agent-browser --engine lightpanda --executable-path /path/to/lightpanda --session task-lp-123 open https://example.com
agent-browser --engine lightpanda --executable-path /path/to/lightpanda --session task-lp-123 session info --json
agent-browser --engine lightpanda --executable-path /path/to/lightpanda --session task-lp-123 snapshot -i
agent-browser --engine lightpanda --executable-path /path/to/lightpanda --session task-lp-123 close
```

## Diagnose before continuing

- **Binary missing:** resolve the installation or executable path, then retry a fresh Lightpanda session.
- **Wrong engine:** inspect `session info --json` for `data.runtime.engine`; choose an unused session name and repeat the explicit engine flag.
- **Startup failure:** retain the exact error and installed versions. Check binary execution and launch options; do not hide it with a Chrome retry.
- **Unsupported capability:** route rendering, headed mode, profiles, extensions, or `--state` replay through the explicit Chrome branch in [SKILL.md](../SKILL.md). Close the owned Lightpanda session first if it is no longer needed.
- **Cross-origin JavaScript failure:** Lightpanda 1.0 enforces CORS by default. Keep CORS enabled and diagnose the application's origins/server response. Top-level CDP navigation and page JavaScript `fetch()` have different CORS behavior.

Lightpanda has no graphical rendering pipeline. Confirm behavior with DOM/semantic evidence and use Chrome for visual evidence. See the [Lightpanda 1.0 announcement](https://lightpanda.io/blog/posts/lightpanda-1-0) and [agent-browser integration docs](https://agent-browser.dev/engines/lightpanda). The [linked batch/multi-session example](https://x.com/ctatedev/status/2106041101006012650) is quoted in the announcement.
