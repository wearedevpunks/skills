# Inline HTML

The T3 Code inline renderer shows one self-contained HTML page in the thread,
above the reply. When the host is T3 Code, it is the surface for every
`show-me` view.

## Load the Tools

- The tools are `html_preview` and `html_render` on the `t3-code` MCP server.
  The harness sets the prefix: `mcp__t3-code__html_render` in Claude Code,
  `mcp__t3_code__html_render` in Codex.
- Claude Code defers MCP tools: the name is listed, the schema is not. Load
  both before the first call with ToolSearch
  `select:mcp__t3-code__html_preview,mcp__t3-code__html_render`.
- A tool absent from the first tool list still counts as available until one
  load attempt fails. Only then fall back to the next surface in
  [Rendered HTML](../SKILL.md#rendered-html).

## Build the Page

- One complete document with inline `<style>` and `<script>`.
- Take every color, font, and radius from the injected theme variables:
  `--foreground`, `--muted-foreground`, `--border`, `--card`, `--accent`,
  `--accent-surface`, `--success`, `--warning`, `--destructive`,
  `--chart-1` to `--chart-6`, `--radius`, `--font-sans`, `--font-mono`.
- The page is part of the reply: `html`, `body`, and the outermost element
  keep the thread background, a fluid width, and no horizontal padding. A
  panel that needs its own background gets at least 16px padding and
  `var(--radius)` corners. Start with the content; the reply text carries the
  heading.
- Content sets the height. Give charts fixed pixel heights; use no `vh`-family
  units and no `height: 100%` on `html` or `body`.
- Translate the chosen view shape:
  - mapping: an HTML table;
  - call tree, file tree, module tree, pseudocode, interface sketch: `<pre>`
    in `--font-mono`, with existing and proposed parts marked by color and a
    legend;
  - flow, sequence, dependency, or state view: boxes and arrows in CSS grid or
    inline SVG;
  - diff: `<pre>` lines tinted with `--success` and `--destructive`.
- Use the authority's exact labels: question ids, paths, symbols, status.

## Check and Render

1. Call `html_preview` at the default 728px width. Fix every console error,
   clipped label, and horizontal overflow. For a view with columns, preview
   again at 390px.
2. Call `html_render` with the preview's `contentHeight` and a short title.
3. Write the reply below it. The reply adds what the page leaves out: the
   textual conclusion, the questions, and the next step.

Completion: `html_render` returned success, and the reply carries the textual
conclusion.
