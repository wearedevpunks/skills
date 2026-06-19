---
name: improve-codebase-architecture
description: Improve codebase architecture by discovering module-deepening, seam, testability, and AI-navigability opportunities with codebase-design vocabulary. Use when the user wants architecture discovery, refactoring opportunities, shallow-module deepening, testability improvement, AI-navigability, or optional grilling of a candidate design.
---

# Improve Codebase Architecture

Explore a codebase like an AI would, surface architectural friction, and propose module-deepening refactors using `$codebase-design` vocabulary.

Use `$grilling` only when the user wants to stress-test a chosen candidate or when a recommendation depends on unresolved design choices.

## Process

### 1. Explore the codebase

Navigate the codebase naturally. Use readonly subagents when available and the work splits cleanly. Do not follow rigid heuristics; explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small files?
- Where are modules so shallow that the interface is nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called?
- Where do tightly-coupled modules create integration risk at seams?
- Which parts of the codebase are untested, or hard to test?

The friction you encounter is the signal.

### 2. Present candidates

Present a numbered list of deepening opportunities. For each candidate, show:

- **Cluster**: Which modules/concepts are involved
- **Why they're coupled**: Shared types, call patterns, co-ownership of a concept
- **Dependency category**: See `$codebase-design` and [REFERENCE.md](REFERENCE.md)
- **Test impact**: What existing tests would be replaced by boundary tests

Do not propose final interfaces yet. Ask the user which candidate to explore.

### 3. User picks a candidate

This step is complete when one candidate is selected, the user accepts your recommendation, or the user stops the exploration.

### 4. Frame the problem space

Before spawning sub-agents, write a user-facing explanation of the problem space for the chosen candidate:

- The constraints any new interface would need to satisfy
- The dependencies it would need to rely on
- A rough illustrative code sketch to make the constraints concrete — this is not a proposal, just a way to ground the constraints

Show this to the user, then immediately proceed to Step 5. The user reads and thinks about the problem while the sub-agents work in parallel.

### 5. Design multiple interfaces

Use `$codebase-design` and design multiple meaningfully different interfaces. Use parallel subagents when available and the candidate can be split safely. Each option should use the same vocabulary: module, interface, seam, adapter, depth, leverage, locality.

Prompt each sub-agent with a separate technical brief (file paths, coupling details, dependency category, what's being hidden). This brief is independent of the user-facing explanation in Step 4. Give each agent a different design constraint:

- Agent 1: "Minimize the interface — aim for 1-3 entry points max"
- Agent 2: "Maximize flexibility — support many use cases and extension"
- Agent 3: "Optimize for the most common caller — make the default case trivial"
- Agent 4 (if applicable): "Design around the ports & adapters pattern for cross-boundary dependencies"

Each sub-agent outputs:

1. Interface signature (types, methods, params)
2. Usage example showing how callers use it
3. What complexity it hides internally
4. Dependency strategy (how deps are handled — see [REFERENCE.md](REFERENCE.md))
5. Trade-offs

Present designs sequentially, then compare them in prose.

After comparing, give your own recommendation: which design you think is strongest and why. If elements from different designs would combine well, propose a hybrid. Be opinionated — the user wants a strong read, not just a menu.

### 6. User picks an interface (or accepts recommendation)

This step is complete when one interface direction is selected, a hybrid is explicitly accepted, or the user stops before handoff.

### 7. Create the handoff

Create a refactor RFC in the user's requested destination. If the user asked for a GitHub issue, use `gh issue create` and the template in [REFERENCE.md](REFERENCE.md). Otherwise, provide the RFC as the handoff artifact.
