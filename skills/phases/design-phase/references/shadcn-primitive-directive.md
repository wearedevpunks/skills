# shadcn-Primitive Directive

`compose` appends the text below, unchanged, to every Composition image
brief, after the full DESIGN.md. It makes each region of a generated screen
map to an installed shadcn component and an accepted DESIGN.md token, so
`variant-round` can build the screen mostly from shadcn components.

```text
shadcn-Primitive Directive

Compose every screen from shadcn/ui primitives. Build every control and
container from these components, alone or composed:
Button, Input, Textarea, Label, Select, Combobox, Checkbox, Radio Group,
Switch, Slider, Toggle, Toggle Group, Tabs, Card, Badge, Avatar, Alert,
Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card, Dropdown Menu,
Context Menu, Command, Navigation Menu, Menubar, Breadcrumb, Pagination,
Table, Accordion, Collapsible, Separator, Skeleton, Progress, Scroll Area,
Sidebar, Toast (Sonner), Calendar, Carousel, Chart.

Style every primitive only with the tokens in the DESIGN.md above: its
colors, type scale, radius scale, spacing, and elevation. Render a primitive
in its named DESIGN.md recipe (button-primary, button-secondary,
button-ghost, card, text-input, badge-pill, category-tab) whenever one
exists.
```

Expo targets: the Expo component library is parked, so the primitive names
serve as layout vocabulary for NativeWind-styled views.
