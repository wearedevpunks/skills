# Upstream provenance

Adapted from [`emilkowalski/skills`](https://github.com/emilkowalski/skills/tree/2d228630ba1446365f614a108cb8252f1feda202/skills/prototype) (path `skills/prototype`) at commit:

```text
2d228630ba1446365f614a108cb8252f1feda202
```

The adjacent `LICENSE` is the byte-identical upstream MIT license (repository root `LICENSE`) retained for this skill.

## Local edits

- Removed the `## Initial Response` greeting section (heading, the "When this skill is first invoked" instruction, the quoted greeting, and the "Do not provide any other information" line). The skill runs autonomously when a phase activates it. The scope paragraph that followed the greeting is kept under the title.
- `SKILL.md` frontmatter: `name: prototype` changed to `name: prototype-variants`, because `skills/agnostic/research/prototype` already owns `prototype`. `disable-model-invocation: true` is kept: phases reach this skill by path.
- `SKILL.md` Hard Rule 1: replaced "Never touch production code during exploration" with "Variants live in the real app": every variant is on the real route, on the working branch, behind a dev-only `?variant=` switch; never a standalone HTML file, a `prototype/<slug>` branch, or an isolated `/prototypes/<slug>` route.
- `SKILL.md` Hard Rule 5 and Phase 6: "delete the prototype surface" changed to "remove the `?variant=` switch and the losing variants".
- `SKILL.md` Phase 2: the no-project fallback to the standalone branch changed to "stop and ask for the real app and route the variants will live in".
- `SKILL.md` Phase 4: the two branches (isolated `/prototypes/<slug>` route; self-contained HTML file) replaced with one real-route, dev-only `?variant=` switch instruction.
- `SKILL.md` Phase 5: "(URL or file path)" changed to "the route URL".
- `SKILL.md` Invocation Variants: added `combine` (merge named pieces of variants into a new round) and `reject` (end the round, no variant kept); `keep` rows now remove or keep the `?variant=` switch and the losing variants. Default 3 variants, cap 5, and `riff`/`keep` are unchanged.
- `PICKER.md`: the persisted URL param changed from `v` to `variant` (behavior contract and reference wiring), and "Verbatim for the standalone-HTML branch" changed to "Verbatim for a vanilla-JS page", so the picker is the `?variant=` switch.
