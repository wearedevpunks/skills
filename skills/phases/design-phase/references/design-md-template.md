# DESIGN.md Template

`design-system` fills this template and writes it as `DESIGN.md` in the
target app root. The format is Google Stitch DESIGN.md
(`google-labs-code/design.md`, version `alpha`): YAML front matter holds the
normative tokens; `##` sections hold the rules for applying them. Sections
1 to 8 keep the Stitch order. Sections 9 to 11 follow them; Stitch consumers
preserve unknown sections, and shadcn `design-system.md` Step 3 reads the
front matter, Do's and Don'ts, Iteration Guide, and Known Gaps in full.

## Fill Rules

- Take every value from the Brand Kit or intake evidence. When a value is
  inferred, record it in Known Gaps with its reason.
- Write colors as hex when the source gives hex.
- Name a licensed brand font and its open substitute; shadcn installs the
  substitute.
- Use the component keys below; shadcn Step 5 maps them to `cva` variants.
  Express states (hover, active, pressed, disabled, focused) as separate
  component entries with a related key.
- Write every hard rule as a "Do" or "Don't" line; shadcn turns each "Don't"
  into a check.
- Replace every `<...>` placeholder. Delete a token line only when the brand
  has no such value, and say so in Known Gaps.

## Template

````markdown
---
version: alpha
name: <brand or product name>
description: <one line: what the product is and how it should feel>
colors:
  canvas: "<hex>"          # page floor
  surface: "<hex>"         # card and container fill
  ink: "<hex>"             # headline and body text
  ink-muted: "<hex>"       # secondary and descriptive text
  primary: "<hex>"         # primary action fill
  on-primary: "<hex>"      # text on primary
  primary-active: "<hex>"  # pressed or active primary
  secondary: "<hex>"
  on-secondary: "<hex>"
  hairline: "<hex or rgba>"
  focus: "<hex>"
  error: "<hex>"
  accent-1: "<hex>"        # illustration and chart accents
typography:
  display-lg:
    fontFamily: <display family>
    fontSize: <rem or clamp source size>
    fontWeight: <number>
    lineHeight: <number>
    letterSpacing: <em>
  heading-md:
    fontFamily: <family>
    fontSize: <rem>
    fontWeight: <number>
    lineHeight: <number>
  body-md:
    fontFamily: <body family>
    fontSize: <rem>
    fontWeight: <number>
    lineHeight: <number>
  label-sm:
    fontFamily: <family>
    fontSize: <rem>
    fontWeight: <number>
    letterSpacing: <em>
  mono-sm:
    fontFamily: <mono family>
    fontSize: <rem>
rounded:
  xs: <px>
  sm: <px>
  md: <px>
  lg: <px>
  xl: <px>
  pill: 9999px
spacing:
  xs: <px>
  sm: <px>
  md: <px>
  lg: <px>
  xl: <px>
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    height: <px>
    padding: <px>
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.md}"
  button-ghost:
    textColor: "{colors.ink}"
  badge-pill:
    rounded: "{rounded.pill}"
    typography: "{typography.label-sm}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: <px>
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: <px>
  text-input-focused:
    backgroundColor: "{colors.canvas}"
  category-tab:
    typography: "{typography.label-sm}"
---

## Overview

<Brand personality, audience, and the atmosphere of the interface, from the
Brand Kit's brand essence board. Name the density and how much motion the
product wants.>

## Colors

<One line per color token: name (hex) — its role and where it appears.
Name the single accent rule and every banned color.>

## Typography

<Display, body, and mono families with their substitutes; the scale; tracking
and weight rules (for example, "display never bold").>

## Layout

<Grid, max content width, section spacing, and density, with the spacing
tokens they use.>

## Elevation & Depth

<Each shadow tier, verbatim, and where it applies; or "hairline only".>

## Shapes

<The radius scale and what each step applies to.>

## Components

<For each component token: its recipe, its states, and its control height.
Control heights of buttons and fields move together.>

## Do's and Don'ts

- Do: <rule>
- Don't: <rule>

## Responsive

<Behavior at 375px and 1280px: column collapse, touch targets, type scaling,
navigation.>

## Iteration Guide

<How later changes extend this system: which tokens may change, which stay
fixed.>

## Known Gaps

<Every inferred, missing, or derived value with its reason, for example a
derived dark mode or a substituted font.>
````
