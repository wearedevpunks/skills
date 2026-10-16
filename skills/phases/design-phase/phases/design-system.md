# Design System

## Entry Guard

Enter only when the router selected this gate: DESIGN.md or the applied theme
is missing, or stale against the Brand Kit, intake brand artifacts, or
accepted constraints.

## Inputs

- the Brand Kit, or the fresh brand artifacts intake recorded
- the Design Target section: surface, target app root, `components.json`
  state, theme files, existing DESIGN.md
- accepted constraints
- [the DESIGN.md template](../references/design-md-template.md)

## Actor-Like Gate Boundary

Design-system owns DESIGN.md, the theme, component variants, and the design
system page in the existing app. Route and screen code belong to
`variant-round`. It delegates theme mapping to the `shadcn` skill and keeps
the browser check and the handoff write.

## Bounded Action

1. Fill [the DESIGN.md template](../references/design-md-template.md) from
   the Brand Kit and intake evidence, and write it as `DESIGN.md` in the
   target app root. When a DESIGN.md exists, update it in place and keep its
   still-valid rules.
2. Web surface: activate `shadcn` and read its `design-system.md`.
   - When `components.json` is absent, run `npx shadcn@latest init` in the
     existing app root, passing `--preset <style>` or `--base base` as its
     Step 1 requires, and never `--template`: the new-app path is out of
     scope.
   - Add each component that a DESIGN.md recipe targets and the app lacks.
   - Apply its Steps 3 to 7 inside the existing app: read the DESIGN.md, map
     tokens to the theme, map recipes to `cva` variants, build the design
     system page, verify.
3. Expo surface: write the NativeWind theme config from the DESIGN.md tokens
   (colors, fonts, radius, spacing, shadows), using `expo-tailwind-setup`
   when NativeWind is not yet set up. The Expo component library is parked;
   write the theme config only.
4. Browser check, fixing until every item passes: typecheck passes; no
   console errors; no horizontal overflow at 375px and 1280px
   (`document.documentElement.scrollWidth <= innerWidth`); dark mode toggled
   once. Expo: typecheck passes and the themed app renders once on its web
   target or a simulator without errors.
5. Show the result: screenshots with durable links from
   `repo-asset-management`, and the shadcn "Report back" summary of what maps
   where and every deliberate deviation. Continue without a stop.

## Invariants

- Edits stay inside DESIGN.md, the theme CSS or NativeWind config,
  installed component sources, and the design system page.
- Every DESIGN.md value traces to the Brand Kit, intake evidence, or an entry
  in its Known Gaps section.

## Completion Evidence

- DESIGN.md path and its source mapping
- changed theme and component files
- browser-check results for every item in step 4, with screenshot links

## Declared Exits

- `complete` `design_system_applied`: every step 4 check passes and the
  result is shown.
- `blocked` `design_system_check_failed`: a step 4 check still fails after
  fixes; the record names the check, the evidence, and the attempted fixes.
- `human_steering_required`: applying the DESIGN.md would overwrite design
  decisions outside the accepted scope; the record names the decision needed.

## Durable Handoff

Write the Artifact Index rows for DESIGN.md and screenshots and one gate
outcome through [the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After `design_system_applied`, re-enter [`router.md`](router.md). On a
blocked or steering exit, stop.
