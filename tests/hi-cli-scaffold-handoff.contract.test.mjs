import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const flow = readFileSync(
  new URL(
    "../skills/agnostic/cli/hi-cli/references/post-command-flow.md",
    import.meta.url,
  ),
  "utf8",
);

const scaffold = flow.match(/### Scaffold[\s\S]*?(?=### Check)/)?.[0];

test("hi-cli routes scaffold follow-through through the scoped prompt contract", () => {
  assert.ok(scaffold, "Scaffold branch should exist");
  assert.match(scaffold, /specs\/prompts\/\*\*[^.]*complete prompt-authoring contract/i);
  assert.match(
    scaffold,
    /structure, placement, dependencies, and boundaries first[^.]*coding conventions second/i,
  );
  assert.match(
    scaffold,
    /enforced constraints outrank the nearest stable module-family pattern/i,
  );
});

test("hi-cli keeps scoped prompt knowledge progressively disclosed", () => {
  assert.ok(scaffold, "Scaffold branch should exist");
  assert.match(scaffold, /exact-trigger pointers to co-authored reference content/i);
  assert.match(scaffold, /references disclose content and never create deeper prompt scopes/i);
});

test("hi-cli preserves scoped skill and source-guide handoff requirements", () => {
  assert.ok(scaffold, "Scaffold branch should exist");
  assert.match(scaffold, /every selected non-phase skill/i);
  assert.match(scaffold, /Skill \| What \/ when/);
  assert.match(scaffold, /derived from its complete `SKILL\.md`/i);
  assert.match(scaffold, /always link `opensrc\/README\.md`/i);
  assert.match(scaffold, /when work depends on third-party library behavior/i);
});
