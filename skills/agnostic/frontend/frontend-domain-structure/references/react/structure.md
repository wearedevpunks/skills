# React Domain Structure Addendum

Read this after the agnostic structure reference when the current scope uses React or a React-based
framework. The agnostic reference owns domain granularity and dependency direction. This addendum owns
React component, hook, context, provider, and JSX decisions.

## Framework Composition

Keep route and screen components as thin orchestration shells. They translate framework inputs, invoke
feature entrypoints, and compose the result. Put reusable UI, state orchestration, query behavior, and
product workflows with their owning feature or module.

Framework folders vary: `app/`, `pages/`, `routes/`, and screen registries can all be composition layers.
Follow the framework convention without letting that convention become the product domain model.

## Component-Splitting Classifier

Split by **responsibility and test seam**, not by line count or JSX size. Extract a child when it owns a
cohesive responsibility with its own behavior, meaningful inputs, repeated use, or focused test seam.
The parent should become a thin orchestration shell that coordinates named responsibilities.

Choose the extraction by what it owns:

- A display component receives display-ready props and owns rendering or interaction for one coherent
  part of the interface. Shape raw transport data before it reaches this boundary.
- A custom hook owns cohesive state, query, mutation, or workflow logic whose lifecycle belongs
  together. Keep its returned contract smaller than its implementation mechanics.
- A model owns pure state transitions, policy, or derived data that does not need React lifecycle.
- Pure utilities own stateless transformations with no component or hook identity.

Keep tiny, private, related JSX local when its only meaning comes from the parent and it has no distinct
behavior or test seam. Co-locate tiny related render helpers. Give one a separate file only when it
develops an independent responsibility that makes the boundary useful.

## Domain Placement

Place extracted components, hooks, models, and utilities under their invariant owner. Technical folders
such as `components/`, `hooks/`, `context/`, `providers/`, `queries/`, `mutations/`, `models/`, and
`utils/` are useful only as secondary grouping inside a worthy domain.

Context and providers follow scope:

- feature-scoped context stays in that feature;
- app-wide reusable providers stay in an app-local module;
- cross-app providers belong in a shared package only when they have real cross-app consumers.

Hooks follow the owner of the state, side effect, query, mutation, or workflow they wrap. Display
components depend on owner-provided contracts rather than reaching through another domain's internals.

## Public React Boundaries

Route components import feature or module entrypoints. A feature entrypoint may expose its top-level
component, public hook, workflow operation, and deliberate types. Consumers stay independent of its
private component tree, query keys, mutation details, and context implementation.

Apply the agnostic dependency law unchanged: use public entrypoints for cross-domain imports, keep edges
one-way and acyclic, and use the narrow peer-feature exception only when justified.

## Behavior Tests and Validation

Add focused behavior tests at the owning component, hook, model, or feature seam affected by the change:

- component tests cover visible output and user interaction;
- hook tests cover cohesive lifecycle or state transitions when the hook is the public behavior seam;
- model tests cover pure rules and transformations;
- feature tests cover a workflow when coordination across the pieces is the behavior under change.

Choose the narrowest validation that proves the changed responsibility, then run the relevant type,
lint, or build check for moved exports and imports. Existing architecture checks may supplement this
proof; this skill does not mandate architecture tests or file-count thresholds. The behavior and its
dependency boundary determine the split.

The React review is complete when each extracted unit owns a coherent responsibility, orchestration
shells stay thin, props cross display-ready boundaries, and focused tests prove the changed behavior at
its owning seam.
