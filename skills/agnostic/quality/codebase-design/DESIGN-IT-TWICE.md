# Design It Twice

Use this pattern when the seam or interface is important enough to compare alternatives.

## 1. Frame The Candidate

Write a short problem frame:

- what behavior should move behind the interface
- current callers and coupling
- dependency categories from [DEEPENING.md](DEEPENING.md)
- constraints the interface must satisfy

## 2. Produce Alternatives

Create at least two meaningfully different interface options. Use parallel subagents when available and the work is read-only or explicitly delegated.

Useful constraints:

- minimize the interface to one to three entry points
- optimize for the most common caller
- optimize for extension
- design around ports and adapters for cross-seam dependencies

Each option should include:

- interface shape
- usage example
- what complexity it hides
- dependency strategy
- tradeoffs

## 3. Compare

Compare alternatives by:

- depth
- locality
- seam placement
- test surface
- migration cost

Recommend one option or a small hybrid. Be opinionated.
