# Copy Lens

The copy lens checks every visible string. `compose` appends its brief
paragraph to every Composition brief; `quality-gate` runs its check on every
variant.

## Sources

Read the sources at use time; this file points to them and copies none:

- `design-taste-frontend`, file `references/copy.md` (the Taste v2 copy
  rules).
- `imagegen-frontend-mobile`, section "Copy AI tells".
- `imagegen-frontend-web`, section "Content slop" under "Anti-AI-slop rules"
  (its copy tells list; this skill has no section named "Copy AI tells").

## Brief Paragraph

Append this paragraph to a brief, after the shadcn-Primitive Directive:

```text
Copy lens: write every visible string as real product copy for this product
and audience, following the copy rules of design-taste-frontend
references/copy.md. Use plausible names, numbers, and dates. Avoid every
phrase on the Copy AI tells and Content slop lists of the imagegen skills.
```

## Check

For each variant, list every visible string with its location. A string is a
hit when it breaks a rule in `references/copy.md` or matches an entry on
either tells list. Record each hit with the string, its location, and the
rule. The check passes with zero hits.
