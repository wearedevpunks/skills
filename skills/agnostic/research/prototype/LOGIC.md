# Logic Prototype

Use this branch when the question is about business logic, state transitions, or data shape.

## Process

1. State the question in the prototype location. Name the state model and the question being tested.
2. Use the host project's language and tooling. Do not add a new runtime just for the prototype.
3. Isolate the logic behind a small pure interface that could be lifted into real code later.
4. Build the smallest terminal UI that exposes current state and available actions.
5. Re-render the full state after every action. Keep the frame small enough to fit on one screen.
6. Add one existing task-runner command to start it.
7. Hand the command to the user so they can drive it.
8. Capture the answer before deleting or absorbing the prototype.

## Portable Logic Shapes

- Pure reducer: `(state, action) => state`.
- State machine: explicit states and transitions.
- Pure functions over plain data.
- Small class or module with a clear method surface when the logic owns internal state.

Keep terminal code outside the portable logic.

## Anti-Patterns

- Adding tests.
- Wiring to the real database unless persistence is the question.
- Generalizing for future cases.
- Mixing prompts, terminal escape codes, or `console.log` control flow into the portable logic.
- Shipping the terminal shell into production.
