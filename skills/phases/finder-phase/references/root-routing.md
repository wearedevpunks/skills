# Root Routing Boundary

Route into Finder only after a human explicitly invokes `business-finder` or
`functional-finder`. Neither model inference nor a historical Stage chooses a
wrapper. Both wrappers directly compose this engine.

Finder returns to its invoking wrapper at the bounded result. Requirements
Phase is independently invocable and owns any later requirements closure,
specification compilation, and delivery-depth backlog projection.

Review requests persist their target and return the exact explicit `$review-phase` invocation
to the human. Finder may preserve that context, but
it must never invoke, delegate to, or
model-select `review-phase`.
