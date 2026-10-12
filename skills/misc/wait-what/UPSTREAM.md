# Upstream provenance

Imported from [`mattpocock/skills`](https://github.com/mattpocock/skills/tree/2ffb184ffbb752faa664c0b204f3c9241b1428e9/skills/productivity/wait-what) at v1.2.0 commit:

```text
2ffb184ffbb752faa664c0b204f3c9241b1428e9
```

The adjacent `LICENSE` is the upstream MIT license retained with this skill.

Devpunks preserves the upstream re-pitch instruction with these local adaptations:

- `description` becomes a model-invocation trigger for messages that do not land, grilling presentation, and plan language checks.
- `disable-model-invocation: true` is removed so composing skills can invoke `$wait-what`.
- The body adds a preamble that reads the canonical glossary in the routed `requirements-grill` status artifact and routes terminology changes through `requirements-grill`.
