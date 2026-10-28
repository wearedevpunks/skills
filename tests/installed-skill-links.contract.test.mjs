import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { owningSkill, repoRoot, resolveInstalled, sourceFiles } from "./helpers/installed-layout.mjs";

test("every cross-skill relative link resolves in the installed flat skill layout", () => {
  const broken = [];
  for (const file of sourceFiles().filter((name) => name.endsWith(".md"))) {
    const skill = owningSkill(file);
    if (skill === undefined) continue;
    for (const [, target] of readFileSync(file, "utf8").matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/gu)) {
      if (/^[a-z][a-z0-9+.-]*:/iu.test(target) || target.startsWith("/")) continue;
      if (path.resolve(path.dirname(file), target).startsWith(`${skill}${path.sep}`)) continue;
      if (resolveInstalled(file, target) === undefined) {
        broken.push(`${path.relative(repoRoot, file)} -> ${target}`);
      }
    }
  }
  assert.deepEqual(broken, []);
});
