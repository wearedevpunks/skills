# Variant Round

## Entry Guard

Enter only when the router selected this gate: the open round has an unbuilt
or failing variant or is stale, or no round is open and a new round is due.

## Inputs

- the Design Target section: surface, scope unit, real route, working
  branch, existing-UI intent
- accepted Compositions, DESIGN.md, accepted constraints
- Motion Plan entries in state `accepted`
- the handoff's Round State: round counter, open round, last Verdict, and
  quality failures
- the visual change request or Verdict that made this round due

## Actor-Like Gate Boundary

Variant-round owns the round's variant code on the working branch and the
round record. It delegates building to `prototype-variants` and the craft
skills below, and keeps the width checks, Motion Plan `built` state, and the
handoff write.

## Bounded Action

1. Select the mode from the Round State:
   - repair: the open round has failing variants. Rebuild only those, in the
     same round, against their recorded failures.
   - continue: the open round has unbuilt variants. Build those.
   - new round: no round is open, or the open round is stale. Record a stale
     open round as superseded. Set N to the round counter plus one and write
     "Round N started" with its source (first round, Verdict, or change
     request) before any code edit.
2. For a new round, list the variants: 3 by default; up to 5 when the user
   asks; never more than 5. Give each a name and a divergence axis (layout,
   density, personality, motion, or interaction model); no two variants
   share an axis position. A `riff` diverges around the named variant's
   direction; a `combine` joins the named parts of the named variants.
3. Activate `prototype-variants` with a concrete target: scope unit, real
   route, working branch, the variant list, and the variant id for each
   value of the dev-only `?variant=` switch. Every variant is code on that
   route; the route without `?variant=` renders its current committed UI.
4. Build every variant mostly from the shadcn components at the paths in
   `components.json`, adding missing ones through the `shadcn` skill. Activate
   each craft skill with a concrete target (route, variant id, files, inputs);
   child skills run autonomously and act on the target at once:
   - `design-taste-frontend`, always;
   - `image-to-code`, with the accepted Compositions as its design images;
   - `emil-design-eng`, as the craft bar;
   - `animate` on web, or `animate-expo` on Expo, for every `accepted` Motion
     Plan entry;
   - `mobile-native`, mandatory for responsive web;
   - `redesign-existing-projects`, only when intake recorded existing-UI
     intent `improve-existing`.
5. Check every built variant at 375px and 1280px: it renders, its
   interactions respond, the console is clean, and nothing overflows
   horizontally. Screenshot both widths and get durable links through
   `repo-asset-management`.
6. Record the round: each variant's id, name, axis, `?variant=` URL, build
   identity (commit or diff hash), and screenshot links. Set each `accepted`
   Motion Plan entry it implements to `built` with round N and the variant
   ids.

## Invariants

- Every variant lives in the real app, on the real route, on the working
  branch, behind the dev-only `?variant=` switch; production builds ignore
  the switch.
- The round counter increases only when a new round starts.
- A round holds 3 to 5 variants unless a recorded steering decision dropped
  one.

## Completion Evidence

- the round record with every variant built for its current mode
- width-check results and screenshot links for both widths
- Motion Plan entries set to `built`

## Declared Exits

- `complete` `round_built`: every variant of the open round is built and
  passes step 5.
- `blocked` `round_build_failed`: a variant cannot build or render; the
  record names the variant, the error, and the attempted fixes.
- `human_steering_required`: a repair cannot make a failing check pass; the
  record names the variant, the check, and the decision needed (drop the
  variant, narrow the round, or change constraints).

## Durable Handoff

Write the Round State, Motion Plan changes, Artifact Index rows, and one gate
outcome through [the design handoff contract](../references/design-handoff.md).
Write "Round N started" before the first code edit of a new round.

## Stop Or Router Re-entry

After `round_built`, re-enter [`router.md`](router.md). On a blocked or
steering exit, stop.
