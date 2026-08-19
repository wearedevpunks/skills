import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const root = "skills/agnostic/frontend/improve-mobile-frontend";

test("improve-mobile-frontend retains the mobile interaction and evidence contract", () => {
  const skill = read(`${root}/SKILL.md`);
  const provenance = read(`${root}/UPSTREAM.md`);

  assert.match(skill, /^name: improve-mobile-frontend$/m);
  assert.doesNotMatch(skill, /disable-model-invocation/);
  assert.match(skill, /description:[^\n]*(?:mobile-web|mobile web)[^\n]*real-device validation/i);

  for (const contract of [
    /@media \(hover: hover\) and \(pointer: fine\)/,
    /-webkit-tap-highlight-color/,
    /100dvh[\s\S]{0,240}100svh/,
    /font size of at least `16px`/i,
    /pointer down[\s\S]{0,180}`touch-action: manipulation`/i,
    /overscroll-behavior: none/,
    /viewport-fit=cover[\s\S]{0,180}safe-area-inset/i,
    /`user-select: none`/,
    /touch-action: pan-y/,
    /theme-color[\s\S]{0,400}prefers-color-scheme: dark/i,
    /real iOS and Android hardware/i,
  ]) {
    assert.match(skill, contract);
  }

  assert.match(skill, /keep focus and active feedback outside that query/i);
  assert.match(skill, /only when the component supplies an equally visible pressed state/i);
  assert.match(skill, /appropriate only for an app-like experience that deliberately owns the root gesture/i);
  assert.match(skill, /text, editable content, code, identifiers[^.]*retain selection/i);
  assert.match(skill, /verify keyboard focus[^.]*text selection[^.]*pinch zoom/i);
  assert.match(skill, /emulation is useful preflight, never final proof/i);

  assert.match(provenance, /Emil Kowalski/);
  assert.match(provenance, /image supplied by the user on 2026-08-19/);
  assert.match(provenance, /No canonical publication URL or source repository was supplied/);
  assert.match(provenance, /not represented as a byte-identical upstream work/);
});
