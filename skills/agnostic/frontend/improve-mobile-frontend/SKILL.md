---
name: improve-mobile-frontend
description: Improve mobile-web frontend behavior across touch interactions, viewport sizing, safe areas, gesture ownership, browser chrome, and real-device validation. Use when building or reviewing phone-focused web UI, fixing behavior that works in desktop emulation but fails on a phone, or auditing hover, tap, input zoom, pull-to-refresh, carousel, notch, or theme-color defects.
---

# Improve Mobile Frontend

Treat mobile behavior as an interaction contract, not a smaller desktop layout. Inspect the existing viewport metadata, global CSS, interactive controls, and gesture surfaces before changing code. Apply the narrowest rule that fixes the observed behavior and preserves keyboard focus, text selection, scrolling, zoom, and assistive technology.

## Improvement loop

1. Reproduce each defect on its actual interaction path: touch, scroll, focus, rotation, installed-app mode, or browser chrome transition. Record which browser and device state exposes it.
2. Map the defect to the rules below. Check existing global and component rules first so the fix extends the current system.
3. Implement the smallest scoped change. Global viewport or overscroll rules require a product-level reason; component behavior stays with the component.
4. Verify keyboard focus, visible focus indicators, text selection where users need to copy or edit, pinch zoom, screen-reader semantics, vertical scrolling, and reduced-motion behavior remain intact.
5. Test the affected path on real iOS and Android hardware when available. Emulation is useful preflight, never final proof. Report the exact devices and browsers tested; name missing hardware proof as a validation gap.

Completion means every observed defect has a scoped rule, its accessibility counterchecks pass, and real-device evidence or an explicit evidence gap is recorded.

## Interaction rules

### Hover belongs to hover-capable pointers

Touch browsers can synthesize `:hover` after a tap and leave the visual state stuck. Gate hover-only decoration and motion:

```css
@media (hover: hover) and (pointer: fine) {
  .control:hover {
    /* hover-only feedback */
  }
}
```

Keep focus and active feedback outside that query. A keyboard user still needs `:focus-visible`; a touch user still needs immediate pressed feedback.

### Tap feedback should be deliberate

Provide feedback on pointer down through `:active`, component state, or an equivalent immediate response. `touch-action: manipulation` suits ordinary buttons and links when double-tap gesture handling is unnecessary:

```css
.control {
  touch-action: manipulation;
}
```

Remove `-webkit-tap-highlight-color` only when the component supplies an equally visible pressed state. Prefer a scoped transparent highlight on those controls; a blanket reset can erase the only tap acknowledgement.

### Viewport height expresses intent

Use `100dvh` for app shells that must track the currently visible viewport as browser chrome expands and collapses. Use `100svh` for hero or landing sections that must fit without being hidden when browser chrome is fully visible. Prefer `min-height` over fixed `height` when content may grow, and retain a compatible fallback when the supported browser matrix requires it.

### Inputs remain readable

Text inputs, textareas, and selects use a computed font size of at least `16px` on small screens to prevent focus zoom in iOS Safari. Do not disable user zoom to hide this symptom. Preserve labels, focus visibility, error association, and adequate touch targets.

### Scroll ownership is explicit

Choose pull-to-refresh and scroll chaining behavior per surface. `overscroll-behavior: none` on `html, body` is appropriate only for an app-like experience that deliberately owns the root gesture and provides any needed refresh affordance. Prefer `contain` or a scoped scroll container when only a modal, sheet, map, or feed must stop chaining. Content sites normally retain native page scrolling and refresh.

For a horizontal carousel or swipe surface, declare vertical-page ownership explicitly:

```css
.carousel-gesture-surface {
  touch-action: pan-y;
}
```

The gesture implementation then owns horizontal movement while the browser keeps vertical scrolling. Apply the rule only to the actual gesture surface, and keep controls inside it operable by keyboard and assistive technology.

### Selection stays available where meaningful

`user-select: none` may prevent accidental long-press selection on button-like controls or drag handles. Scope it to those controls. Text, editable content, code, identifiers, and other copyable information retain selection; native semantic controls are preferred over making arbitrary text behave like a button.

## Device integration

### Safe areas

Use `viewport-fit=cover` only with safe-area compensation. Apply `env(safe-area-inset-top)`, `-right`, `-bottom`, and `-left` to the edge-owning shell or fixed chrome, usually in addition to its normal spacing:

```css
.app-shell {
  padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom));
}
```

Do not add safe-area padding indiscriminately to every nested container. Verify portrait, landscape, keyboard-open, and installed-app states so content neither collides with a cutout nor receives doubled spacing.

### Browser chrome color

Provide `theme-color` for each supported color scheme so browser chrome matches the page:

```html
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b0b0b" media="(prefers-color-scheme: dark)">
```

Keep these values aligned with the actual surface colors and any framework metadata API. Verify browsers that ignore `media` still receive a sensible default.

## Delivery evidence

Report:

- defects fixed and the scope chosen for each rule;
- preserved focus, zoom, selection, and scroll behavior;
- viewport, orientation, and browser-chrome states exercised;
- real device, OS, and browser versions tested;
- remaining device or browser coverage gaps.

See [UPSTREAM.md](UPSTREAM.md) for source attribution.
