# Properties

Use this when a rule comes from a spec, when an example test generalises to a rule, or when a Counterexample needs a replay.

A **Property** is a rule that must hold for every generated input of a declared shape. A **Generator** produces the inputs. When the rule fails, **Shrinking** reduces the failing input to the smallest input that still fails: the **Counterexample**. A Property protects only the rule it states; a wrong rule stays wrong.

## Form

Form names the test that covers one rule. It is the single vocabulary for `test_form` in plans and for spec invariants:

`example | property | stateful-property | model | type`

- `example`: one fixed input and its expected result.
- `property`: one rule over generated inputs.
- `stateful-property`: one rule over generated command sequences.
- `model`: a Model invariant checked over every reachable state.
- `type`: a rule the type checker enforces.

## Property Patterns

Pick the pattern from the spec signal. The typical Mutant is the fault its [Sensitivity Proof](sensitivity.md) applies first.

| Pattern | Rule | Spec signal | Typical Mutant |
| --- | --- | --- | --- |
| security gate | The operation succeeds only when every gate condition holds; otherwise it refuses with no side effect | "only if", "never unless" | drop one condition from the gate |
| equivalence | Two paths to one outcome leave equal observable state | "same as", "equivalent to" (update old→new ≡ fresh install of new) | skip one step on one path |
| round-trip | Decoding an encoded value returns the original value | parse, serialize, encode, codec | lose precision in the encoder |
| idempotence | Running the operation twice leaves the state of one run | retry, reconcile, re-run, replay | make the second run write again |
| membership/monotonic | A granted member stays visible; adding never removes access | member, grant, access, role | return an empty set of grants |
| oracle | The fast path returns what a simple reference implementation returns | cache, index, optimized path | make the fast path diverge on one input class |
| preservation | A transition changes only the fields it owns | status, owner or identity across a transition | overwrite the field the step must keep |
| no defects | Every schema-valid input ends in success or a typed error | any public operation with schema-typed input | throw an untyped error or defect on one input |
| stateful command sequence | After every command, the system state equals the in-memory model state | two or more writers on shared state; a background job or retry on client-written state; recovery or resync | reorder or drop one command's effect |

A regression test uses the regression Mutant: reapply the historical bug (revert the fix).

An oracle must be independent of the code under test; see the Tautological anti-pattern in [high-signal-tests.md](high-signal-tests.md).

## Slice Order

1. Example tracer bullet: RED → GREEN.
2. Property as a generalisation step: RED → GREEN.

A pure total function may start with the property. A property that passes on its first run needs a [Sensitivity Proof](sensitivity.md) instead of a faked RED.

## Generator Rules

- Generate the full declared input shape. Generator Narrowing (excluding generated inputs so a property passes) needs recorded human approval; without it, fix the code or return the rule to a human.
- Draw ids from small pools so collisions happen.
- Treat generated values as read-only; copy a value before you change it.

## Pinned Replay

Every found Counterexample becomes a Pinned Replay: an example test named after the rule, with the shrunk input as an explicit input literal. The Replay Token goes into evidence only, because it reproduces the failure only from the same implementation.

## Run Policy

- CI runs every property.
- Pure properties run at the default run count.
- DB-backed properties run at a reduced count.
- Deep, high-run searches run locally at RED/GREEN time.

## Stateful Properties

For the stateful command sequence pattern:

1. Generate a sequence of commands.
2. Run each sequence against a fresh fixture per evaluation.
3. After each command, compare the system with a small in-memory model.

Shrinking yields the shortest failing sequence.

## Model Trace → Pinned Replay

A Model Counterexample is a trace of actions. Map each action to one command of the stateful property, run that sequence as an example test, and keep it as a Pinned Replay. A Model proves the design; only its Pinned Replays reach the code. When installed, `$model-checking` owns how to write, check and replay a Model.
