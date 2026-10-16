import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));
const sha256 = (path) => createHash("sha256").update(read(path)).digest("hex");

const emilPin = "2d228630ba1446365f614a108cb8252f1feda202";
const emilLicenseSha256 = "4ff5bdb7887ec1435c9cab0e8d1a7caee704d894d65c2a008ccc68b1cc2f260b";

const emilSkills = [
  "skills/agnostic/frontend/animate",
  "skills/agnostic/frontend/break-ui",
  "skills/agnostic/frontend/emil-design-eng",
  "skills/agnostic/frontend/find-animation-opportunities",
  "skills/agnostic/frontend/mobile-native",
  "skills/agnostic/frontend/prototype-variants",
  "skills/agnostic/frontend/review-animations",
  "skills/frameworks/expo/animate-expo",
];

const otherVendoredSkills = [
  {
    directory: "skills/agnostic/frontend/brandkit",
    repository: /github\.com\/Leonxlnx\/taste-skill/,
    pin: "f624f37a8c650b9cc550253104925efe4c8de246",
  },
  {
    directory: "skills/agnostic/frontend/full-output-enforcement",
    repository: /github\.com\/Leonxlnx\/taste-skill/,
    pin: "f624f37a8c650b9cc550253104925efe4c8de246",
  },
  {
    directory: "skills/agnostic/frontend/redesign-existing-projects",
    repository: /github\.com\/Leonxlnx\/taste-skill/,
    pin: "f624f37a8c650b9cc550253104925efe4c8de246",
  },
  {
    directory: "skills/agnostic/frontend/shadcn",
    repository: /github\.com\/shadcn-ui\/ui/,
    pin: "af983e842ab31ed26da30ba4d9a418772150dff0",
  },
];

const frontmatterName = (skill) => skill.match(/^---\n[\s\S]*?^name: (.+)$/m)?.[1];

test("vendored Emil Kowalski skills name the shared pin, keep the license, and record local edits", () => {
  for (const directory of emilSkills) {
    const provenance = read(`${directory}/UPSTREAM.md`);
    assert.match(provenance, /github\.com\/emilkowalski\/skills/, directory);
    assert.ok(provenance.includes(emilPin), `${directory}/UPSTREAM.md must name ${emilPin}`);
    assert.match(provenance, /^## Local edits$/m, directory);
    assert.match(provenance, /`## Initial Response`/, directory);

    assert.equal(sha256(`${directory}/LICENSE`), emilLicenseSha256, `${directory}/LICENSE`);
    assert.doesNotMatch(read(`${directory}/SKILL.md`), /Initial Response/, `${directory}/SKILL.md`);
  }
});

test("prototype-variants builds variants on the real route behind a dev-only switch", () => {
  const directory = "skills/agnostic/frontend/prototype-variants";
  const skill = read(`${directory}/SKILL.md`);
  const picker = read(`${directory}/PICKER.md`);
  const provenance = read(`${directory}/UPSTREAM.md`);

  assert.equal(frontmatterName(skill), "prototype-variants");
  assert.match(skill, /real route, on the working branch, behind a dev-only `\?variant=` switch/);
  assert.doesNotMatch(skill, /isolated route or page \(`\/prototypes\/<slug>`/);
  assert.doesNotMatch(skill, /single self-contained HTML file/);
  assert.doesNotMatch(skill, /delete the prototype surface/);
  assert.match(skill, /remove the `\?variant=` switch and the losing variants/);
  assert.match(skill, /Default \*\*3 variants\*\*; up to 5/);
  for (const verdict of ["riff", "combine", "keep", "reject"]) {
    assert.match(skill, new RegExp(`^\\| \`${verdict}\\b`, "m"), verdict);
  }

  assert.match(picker, /searchParams\.set\('variant'/);
  assert.doesNotMatch(picker, /searchParams\.(?:set|get)\('v'/);

  for (const edit of ["name: prototype-variants", "Hard Rule 1", "Phase 4", "Phase 6", "`combine`", "`reject`", "`PICKER.md`"]) {
    assert.ok(provenance.includes(edit), `UPSTREAM.md must record ${edit}`);
  }
});

test("break-ui points at the vendored prototype-variants skill", () => {
  const directory = "skills/agnostic/frontend/break-ui";
  assert.ok(exists(`${directory}/CATALOG.md`));
  assert.match(read(`${directory}/SKILL.md`), /that's `prototype-variants`/);
  assert.match(read(`${directory}/UPSTREAM.md`), /`prototype-variants`/);
});

test("taste-skill and shadcn imports name their pinned source and keep the license", () => {
  for (const { directory, repository, pin } of otherVendoredSkills) {
    const provenance = read(`${directory}/UPSTREAM.md`);
    assert.match(provenance, repository, directory);
    assert.ok(provenance.includes(pin), `${directory}/UPSTREAM.md must name ${pin}`);
    assert.match(provenance, /^## Local edits$/m, directory);
    assert.ok(exists(`${directory}/LICENSE`), `${directory}/LICENSE`);
  }

  assert.equal(frontmatterName(read("skills/agnostic/frontend/full-output-enforcement/SKILL.md")), "full-output-enforcement");
  for (const file of ["rules", "design-system.md", "design-system-page.md", "scripts"]) {
    assert.ok(exists(`skills/agnostic/frontend/shadcn/${file}`), `shadcn/${file}`);
  }
});

test("retired frontend skills stay removed", () => {
  for (const directory of ["skills/agnostic/frontend/gpt-taste", "skills/agnostic/frontend/improve-mobile-frontend"]) {
    assert.equal(exists(directory), false, directory);
  }
});
