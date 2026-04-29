# React Domain Structure Addendum

Use this after the agnostic frontend structure reference when the current frontend scope is React, Next.js, Remix, TanStack Router, Expo web, tRPC-backed React, or another React-based stack.

The agnostic frontend skill owns the shared layer model:

- framework composition
- `features/*`
- `modules/*`
- shared libraries and packages

This reference owns React-specific placement for hooks, context, providers, components, route modules, and Next.js route files.

## Framework Composition

React framework entrypoints should stay thin.

Common composition folders:

- `app/` in Next.js App Router
- `pages/` in Next.js Pages Router or Remix-style route modules
- `routes/` in TanStack Router, Remix, or file-route setups
- `src/app/` in app-shell conventions

Good fits:

- `page.tsx`
- `layout.tsx`
- route modules
- route-level `loading`, `error`, and `not-found`
- route metadata
- tiny route composition wrappers

Bad fits:

- long client components
- data orchestration that belongs to a feature
- reusable product sections
- provider setup repeated across routes
- low-level hooks imported directly by routes when a feature entrypoint should own them

Route files should import feature entrypoints instead of several low-level hooks, helpers, and components.

## React Domain Internals

Inside `features/*`, `modules/*`, and shared package domains, React-specific technical folders are allowed when they are local to the domain.

Common local folders:

- `components/`
- `hooks/`
- `context/`
- `providers/`
- `state/` or `store/`
- `queries/`
- `mutations/`
- `actions/`
- `forms/`
- `lib/`
- `utils/`

Keep these folders under a domain. Avoid root-level `components/`, `hooks/`, `context/`, or `providers/` unless they are temporary migration debt or genuinely global app shell code.

## Placement Examples

Prefer:

- `features/auth/components/LoginForm.tsx`
- `features/auth/hooks/useLoginForm.ts`
- `features/settings/context/SettingsDraftContext.tsx`
- `features/dashboard/queries/useDashboardSummary.ts`
- `modules/auth/providers/AuthProvider.tsx`
- `modules/auth/hooks/useCurrentUser.ts`
- `modules/api/lib/httpClient.ts`
- `modules/ui/components/Button.tsx`
- `<shared-ui-root>/src/primitives/button.tsx`
- `<shared-ui-root>/src/brand/components/Logo.tsx`

Avoid:

- `src/components/LoginForm.tsx`
- `src/hooks/useCurrentUser.ts`
- `src/context/SettingsDraftContext.tsx`
- `src/providers/AuthProvider.tsx`
- `src/lib/httpClient.ts`

## React Boundary Rules

- Route components may import feature entrypoints and app-local modules.
- Feature components may import hooks, context, providers, and helpers from the same feature, modules, or shared libraries.
- Module hooks and providers must not import feature components.
- Shared UI packages must not import app-local modules or features.
- Context providers should live where their scope lives: feature-scoped context in `features/*`, app-wide reusable providers in `modules/*`, cross-app providers in shared packages.
- Hooks follow the same ownership rule as the state or side effect they wrap.

## React Review Checklist

- Is the route file mostly composition?
- Are React hooks under the domain that owns their state or side effect?
- Is context scoped to the smallest domain that needs it?
- Are providers app-local modules unless they are feature-specific or shared across apps?
- Are root-level React technical folders avoided unless the project has an explicit app-shell convention?
