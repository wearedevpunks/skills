# Upstream provenance

Adapted from [`mattpocock/skills`](https://github.com/mattpocock/skills/tree/62f43a18177be6ec82da242e59ffbc490a4c22ea/skills/engineering/tdd) at snapshot commit:

```text
62f43a18177be6ec82da242e59ffbc490a4c22ea
```

The adjacent `LICENSE` is the upstream MIT license retained with this skill.

Devpunks keeps the upstream vertical red-green loop and co-located testing references, then adds the hard RED gate, high-signal assertion guidance, and durable RED/GREEN evidence fields.

## Local adaptations

- `properties.md`: Property Patterns, slice order, generator rules, Pinned Replay, run policy, stateful properties, and the Form values.
- `sensitivity.md`: the Sensitivity Proof procedure; a test that never failed is not evidence.
- The Tautological anti-pattern in `high-signal-tests.md`, adapted from upstream `59db609` (`skills/engineering/tdd/SKILL.md`).
- The Refactor workflow step and its refactor-candidates reference are removed, following upstream `59db609`: "Refactoring is not part of the loop." Refactoring belongs to the per-task `$simplify` step and to review.

The rest of the skill stays on the `62f43a1` snapshot; full adoption of later upstream changes is a separate delivery.
