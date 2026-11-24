# Upstream provenance

Adapted from [`mattpocock/skills`](https://github.com/mattpocock/skills/tree/e484a8095543718ced436b9b49a8160ed4554000/skills/engineering/pr) at commit:

```text
e484a8095543718ced436b9b49a8160ed4554000
```

The adjacent `LICENSE` is the upstream MIT license retained with this skill.

Devpunks keeps the upstream Summary, Evidence and Merge Danger sections, the
Door and Blast Radius calls, and "skip preambles, keep prose brief". Local
adaptations:

- Summary resolves `$show-me` instead of carrying its own view catalog; both
  descend from the same HumanLayer `show-me` text.
- Merge Danger adds **How to revert** and **Risk** (Low / Medium / High), from
  Anthropic's code-review practice (PR template asks how the change was tested
  and how to undo it; risk tiers set by the change).
- The Door call reads the project's One-Way Door Rule when one exists.
- Authority and Review sections carry delivery links and the Pass Report.
- The body is a marker-delimited Managed Region, so rewrites keep bot and
  human content outside it.
