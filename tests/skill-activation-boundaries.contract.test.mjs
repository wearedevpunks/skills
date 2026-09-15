import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const description = (skill) => {
  const match = skill.match(/^description:\s*(.+)$/mu);
  assert.ok(match, "skill has a one-line description");
  return match[1];
};

const assertChangedScopeUsesConfiguredUpstream = (path) => {
  const guidance = read(path);

  assert.match(
    guidance,
    /git rev-parse --abbrev-ref --symbolic-full-name '@\{upstream\}'/u,
  );
  assert.match(guidance, /no configured upstream/u);

  const changedScopeCommands = [
    ...guidance.matchAll(
      /^npx react-doctor@latest --verbose --scope changed.*$/gmu,
    ),
  ].map(([command]) => command);

  assert.ok(changedScopeCommands.length > 0, `${path} has a changed-scope scan`);
  for (const command of changedScopeCommands) {
    assert.match(command, /--base "\$base"/u);
  }
};

const assertCommandSectionBindsChangedScopeBase = (path) => {
  const guidance = read(path);
  const [, section] = guidance.match(/^## Command\s*$([\s\S]*?)^## /mu) ?? [];

  assert.ok(section, `${path} has a Command section`);
  assert.match(
    section,
    /base="\$\(git rev-parse --abbrev-ref --symbolic-full-name '@\{upstream\}'\)" \|\| \{[\s\S]*?no configured upstream[\s\S]*?exit 1[\s\S]*?\}/u,
  );
  assert.match(
    section,
    /npx react-doctor@latest --verbose --scope changed --base "\$base"/u,
  );
};

test("React Doctor activates only for explicit requests or React runtime production overlap", () => {
  const skill = read("skills/frameworks/react/react-doctor/SKILL.md");
  const pointer = description(skill);

  assert.match(pointer, /explicitly requests React Doctor/u);
  assert.match(pointer, /production changes overlap React runtime APIs/u);
  assert.doesNotMatch(pointer, /feature|bug|commit|scan|triage|clean up|diagnostic/iu);
});

test("React Doctor changed scans use the checked-out branch upstream explicitly", () => {
  assertChangedScopeUsesConfiguredUpstream(
    "skills/frameworks/react/react-doctor/SKILL.md",
  );
  assertCommandSectionBindsChangedScopeBase(
    "skills/frameworks/react/react-doctor/SKILL.md",
  );
  assertChangedScopeUsesConfiguredUpstream(
    "skills/frameworks/react/react-doctor/references/explain.md",
  );
});

test("TDD activates only for explicit test-first intent or unresolved behavior design", () => {
  const skill = read("skills/agnostic/quality/tdd/SKILL.md");
  const pointer = description(skill);

  assert.match(pointer, /explicitly requests TDD/u);
  assert.match(pointer, /test-first/u);
  assert.match(pointer, /RED\/GREEN/u);
  assert.match(pointer, /behavior design remains unresolved/u);
  assert.doesNotMatch(pointer, /feature|bugfix|regression|integration-style/iu);
});
