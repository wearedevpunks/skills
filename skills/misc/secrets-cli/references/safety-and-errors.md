# Safety, Selectors, and Errors

## Selector and Inference Rules

- Project selectors accept ID or slug.
- When project is omitted, inference uses `--project` override first, then the default Git remote repository name, then the current directory basename.
- Environment selectors accept ID or slug within the selected project.
- File IDs work without `--env` and are sent directly.
- File names and paths require `--env`. Within that environment, resolution prefers exact ID, then exact path, then a unique exact name.
- Ambiguous file names fail. Use an exact path or file ID.
- Never rely on project inference when the Git remote or working directory does not unambiguously match the target project.

## Stdin and Redaction

- Prefer `--stdin` so values do not enter shell history or process arguments.
- Single-value stdin removes one terminal `\n` or `\r\n`; other bytes remain part of the value.
- Bulk stdin is newline-delimited `KEY=value`. Every line must contain a non-empty key before the first `=`.
- Do not combine positional values with `--stdin`.
- Lists, mutation summaries, bulk reads, and pull plans show key names, not values.
- `values get` prints the raw value. Redirect or capture it; never reproduce it in agent messages, logs, screenshots, diffs, or handoffs.
- Do not inspect pulled dotenv contents unless the user explicitly requires it and the output can remain secret-safe.

## Pull and Overwrite Safety

Pulls write every returned payload to its configured path relative to the current directory. Existing files are overwritten; missing parent directories are created. There is no merge.

Interactive terminals show a plan and default to Yes. `n`, Right, or Tab can decline; Ctrl-C interrupts. Non-interactive execution auto-approves. Do not run a pull non-interactively until paths and overwrite impact are known.

A cancelled pull writes nothing. A write failure can occur after earlier files in a multi-file pull were written, so verify every planned path after failure.

## Errors and Exit Codes

- `0`: command completed successfully. Empty list or no changed keys can still be successful; inspect the message against the requested outcome.
- `1`: invalid syntax/input, missing selector, expired authentication/backend failure, forbidden access, conflict, validation failure, rate limit, unavailable backend, or other command failure.
- `130`: interactive pull interrupted with Ctrl-C.

A locally missing login currently prints `Authentication required` without necessarily returning a nonzero code because no RPC is attempted. A declined pull also exits successfully without writing. Treat both as incomplete regardless of exit code.

Common recovery:

- `Authentication required` or expired/unauthorized: run `secrets login`, then `secrets whoami`.
- `Project not found`: pass the correct project ID/slug with `--project`; check inference.
- `Environment not found`: list environments in the selected project and retry with ID/slug.
- `File not found`: supply `--env` for name/path selection, or use the file ID.
- `Multiple files have that name`: use exact path or file ID.
- `No account exists for that email`: the target user must sign in once, then membership addition can be retried.
- `Forbidden`: confirm identity, role, project membership, and target scope; do not retry unchanged.
- `conflicts with current backend state`: relist the scope before retrying.
- `Too many requests`: wait, then retry once.
- backend unavailable: preserve inputs and retry later.
- missing or conflicting value source: provide exactly one positional value source or `--stdin`.
- invalid bulk input: use one `KEY=value` per argument or line.

Never paste secret-bearing command arguments or backend payloads into an error report. Report the command shape with placeholders, safe error text, and exit code.
