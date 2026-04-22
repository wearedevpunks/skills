---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview the user relentlessly about every aspect of the plan until shared understanding exists. Walk each branch of the design tree and resolve dependencies one by one. For every question, provide a recommended answer.

Ask one question at a time.

If the answer can be found in the codebase, inspect first instead of asking.

## During the session

### Challenge the glossary

If the user uses a term that conflicts with existing specs, docs, or code language, call it out immediately and force a precise choice.

### Sharpen vague language

When the user uses fuzzy or overloaded terms, propose a canonical term and make them choose the right one.

### Discuss concrete scenarios

Stress-test relationships and boundaries with specific scenarios, including edge cases that force precision.

### Cross-check with code

When the user states how the system works, verify it against the code. Surface contradictions instead of smoothing them over.
