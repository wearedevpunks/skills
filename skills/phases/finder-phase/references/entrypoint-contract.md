# Direct-Composition Contract

## Inputs

- intake lens: exactly `Business` or `Functional`
- the invoking wrapper's audience and intake profile
- projection ceiling: `Initiative` for Business or `Epic` for Functional
- one product request
- optional exact provider or durable wiki Fog identity
- optional durable runtime-handoff locator

Invocation is explicit and human-selected. The wrapper stays in control while
loading the engine and supplies no lifecycle state or provider mechanics.

## Shared invariants

- One invocation creates or resumes exactly one Fog.
- A new Fog records its immutable original intake lens. Either wrapper may
  later resume that Fog while preserving the recorded lens unchanged; the lens
  is provenance, not maturity or a route gate.
- A Fog may own several generic `Kind/grilling` children plus direct Research
  and Prototype children that support a named Grilling child.
- Current evidence decides whether an obviously relevant support child is
  reused or separate useful work is created. Genuine ambiguity requests human
  steering with zero duplicate creation.
- Research and Prototype return durable evidence or verdicts. They cannot
  accept product direction or authorize provider projection independently.
- Optional structure stays within the invoking wrapper's projection ceiling.
- Historical staged records remain compatibility evidence, not a current gate.
- A bounded return gives control back without asserting that the Fog is
  resolved or complete.

## Return

Return exact Fog identity, immutable intake lens, generic support-child
identities and retained evidence, optional structure readback within the
ceiling, unresolved decisions, and the durable handoff locator.
