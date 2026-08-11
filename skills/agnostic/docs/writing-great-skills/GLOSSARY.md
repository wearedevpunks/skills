# Glossary - Writing Great Skills

## Predictability

The degree to which a skill makes the agent follow the same process on every run. The output may vary; the behavior should not.

## Model-Invoked

A skill with a `description`, visible to the agent for autonomous use. It pays context load.

## User-Invoked

A skill with `disable-model-invocation: true`. It is reached by the human, not by autonomous discovery. It pays cognitive load.

## Description

The model-facing trigger for a model-invoked skill. It should describe branches that should cause invocation.

## Context Load

The permanent attention and token cost a model-invoked skill imposes through its description.

## Cognitive Load

The cost the human pays to remember and invoke user-invoked skills.

## Branch

A distinct way a skill can be used.

## Information Hierarchy

The ordering of skill material by how immediately the agent needs it: steps, inline reference, disclosed reference.

## Steps

Ordered actions the agent performs. Each step needs a completion criterion.

## Completion Criterion

The checkable condition that says a step is done.

## Reference

Definitions, rules, caveats, and examples the agent consults while running a skill.

## Progressive Disclosure

Moving branch-specific reference out of `SKILL.md` behind a clear pointer.

## Leading Word

A compact, pretrained concept that anchors behavior and invocation.

## Single Source of Truth

One authoritative home for one behavior or meaning.

## Duplication

The same behavior or meaning repeated in multiple places.

## No-op

An instruction that does not change behavior versus the agent default.

## Sediment

Stale layers that remain because adding feels safer than removing.
