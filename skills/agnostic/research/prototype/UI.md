# UI Prototype

Use this branch when the question is what a page, component, or flow should look like.

Generate several radically different UI variations on one route, switchable from a floating bottom bar. The user flips between variants, picks one, or combines pieces, then the losing variants are deleted.

## Prefer Existing Routes

Prefer sub-shape A.

- **Sub-shape A, existing page:** keep the existing route, data fetching, params, and auth. Swap only the rendered subtree by `?variant=`.
- **Sub-shape B, new page:** create a throwaway route only when there is no sensible existing host page. Follow the project's routing conventions and name it clearly as a prototype.

## Process

1. State the question and variant count. Default to three variants and cap at five.
2. Generate radically different variants. They should differ in layout, information hierarchy, and primary affordance, not only color or copy.
3. Wire variants through a single route switcher keyed by `?variant=`.
4. Build a floating bottom-center switcher with previous and next arrows, current variant label, URL updates, and left/right keyboard shortcuts.
5. Hide the switcher from production builds.
6. Share the URL and variant keys with the user.
7. Capture the winning direction, then delete losing variants and the switcher or promote the winner into real code.

## Anti-Patterns

- Variants that differ only in color or copy.
- Sharing so much layout code that variants cannot disagree structurally.
- Wiring variants to real mutations.
- Promoting prototype code directly to production without rewriting it properly.
