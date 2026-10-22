# React Domain Structure Addendum

Read this after the agnostic structure reference when the current scope uses React or a React-based
framework. The agnostic reference owns the layers, domains, dependency direction and Lint Rules. This
addendum owns the React placement of providers, shells and page templates, and the component, hook,
context, and JSX decisions.

## Composition Placement

- App-wide providers, such as query client, theme and session providers, live in
  `composition/providers/`. Its `index.tsx` exports one provider tree that the root layout or root route
  renders.
- Surface shells and page templates live in `composition/<surface>/`, as `shell/` and `pages/<page>/`.
- A page template exports its page component plus optional `generateMetadata` and loader functions. The
  route file only connects them:

```tsx
// app/admin/orders/page.tsx (Next.js App Router)
export { OrdersPage as default, generateMetadata } from "@/composition/admin";
```

```tsx
// routes/admin/orders.tsx (TanStack Router)
import { createFileRoute } from "@tanstack/react-router";
import { loadOrders, OrdersPage } from "@/composition/admin";

export const Route = createFileRoute("/admin/orders")({ loader: loadOrders, component: OrdersPage });
```

A layout or root route file connects a Surface shell in the same way. Keep the page component a thin
orchestration shell: it reads route inputs, calls Feature and Module entrypoints, and connects features.
A slot is a `ReactNode` prop and a callback is a function prop, for example
`<OrderList onSelect={setOrderId} detail={<OrderDetail orderId={orderId} />} />`.

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
such as `components/`, `hooks/`, `context/`, `queries/`, `mutations/`, `models/`, and `utils/` are
useful only as secondary grouping inside a worthy domain.

Context follows scope:

- feature-scoped context stays in that feature;
- a context that several features consume, such as a header slot or a toast channel, is a Module, and
  Composition mounts its provider;
- cross-app providers belong in a shared package only when they have real cross-app consumers.

Hooks follow the owner of the state, side effect, query, mutation, or workflow they wrap. Display
components depend on owner-provided contracts rather than reaching through another domain's internals.

## Public React Boundaries

A domain's `index.ts` or `index.tsx` may expose its top-level component, public hook, workflow
operation, and deliberate types. Consumers stay independent of its private component tree, query keys,
mutation details, and context implementation.

## Behavior Tests and Validation

Add focused behavior tests at the owning component, hook, model, or feature seam affected by the change:

- component tests cover visible output and user interaction;
- hook tests cover cohesive lifecycle or state transitions when the hook is the public behavior seam;
- model tests cover pure rules and transformations;
- feature tests cover a workflow when coordination across the pieces is the behavior under change.

Choose the narrowest validation that proves the changed responsibility, then run the relevant type,
lint, or build check for moved exports and imports.

The React review is complete when providers, shells and page templates sit in Composition, each
extracted unit owns a coherent responsibility, orchestration shells stay thin, props cross
display-ready boundaries, and focused tests prove the changed behavior at its owning seam.
