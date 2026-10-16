# Image Generation

Used by `brand` (Brand Kit boards) and `compose` (Compositions). Every image
comes from Codex, or the gate blocks visibly. A gate accepts only images this
ladder produced; there is no fallback to code or HTML.

## Output Contract

Before the first step, pick one output directory per gate, scope unit, and
attempt, and record it in the Artifact Index. Illustrative path:
`<repo-root>/.devpunks/design-phase/<folder-name>/<gate>/<scope-unit>/<attempt>/`.

End every brief with this instruction, filled in:

```text
Write each image as a PNG file in <absolute output directory>.
Write no other files.
Reply with one line per image: <absolute path> | <what the image shows>.
```

## Ladder

Take the first step whose condition holds. When an available step fails
(error, no result, missing or unreadable files), record the failure and take
the next step.

1. **The agent is Codex.** Generate each image with your own image
   generation tool and save it to the output directory.
2. **Inside T3.** The `delegate_task` tool is available and
   `orchestrator_capabilities` lists provider `codex` with
   `canRunCrossProviderChildTask: true`. Call:

   ```text
   delegate_task({
     title: "design-phase <gate> images: <scope unit>",
     role: "design",
     task: "<complete brief, including the skill to apply, its installed
            SKILL.md path, and the output contract>",
     target: { providerInstanceId: "codex",
               model: "<a model id from the codex entry of orchestrator_capabilities>" },
     mode: "wait",
     timeoutMs: 900000,
     isolation: "shared",
     clientRequestId: "design-phase:<folder-name>:<gate>:<scope-unit>:<attempt>"
   })
   ```

   - The child receives only the task text, so the brief is complete on its
     own: name the skill to apply (`brandkit`, `imagegen-frontend-web`, or
     `imagegen-frontend-mobile`) and its installed `SKILL.md` path.
   - `isolation: "shared"` makes the child write into this checkout, so the
     returned paths resolve here.
   - Use the model the user names; otherwise pick one listed for `codex`.
   - Keep `clientRequestId` stable across retries of one attempt; a new
     attempt (changed brief or regeneration) increases `<attempt>`.
   - Record the returned `taskId` and the `clientRequestId` in the gate
     outcome's Resume identity. When the call returns `waitTimedOut`, exit
     `blocked` `image_generation_pending`. On re-entry, read the task with
     `task_status` by that `taskId` before calling again.
3. **`codex` CLI installed** (`command -v codex` succeeds). Run from the
   repository root:

   ```bash
   codex exec -C <repo-root> --sandbox workspace-write \
     -o <output directory>/codex-last-message.txt "<complete brief>"
   ```

   A non-zero exit code is a failed step.
4. **None of the above.** Exit `blocked` `image_generation_unavailable`.
   Record each step, its condition, and why it did not produce images.

## Verify Returned Images

Before recording or presenting any image:

- every listed path exists inside the output directory;
- each file is image data (`file <path>` reports PNG, JPEG, or WebP);
- the count matches the brief;
- you have viewed each image and it shows what its reply line states.

A failed check makes the step a failed step.
