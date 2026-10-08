import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(
    new URL(`../skills/phases/docs-ingest-phase/${path}`, import.meta.url),
    "utf8",
  );

const description = (skill) => {
  const match = skill.match(/^description:\s*(.+)$/mu);
  assert.ok(match, "skill has a one-line description");
  return match[1];
};

test("docs ingest is reachable for wiki setup, source capture and health", () => {
  const pointer = description(read("SKILL.md"));

  assert.match(pointer, /wiki setup\/adoption/u);
  assert.match(pointer, /supplies a raw source/u);
  assert.match(pointer, /wiki health/u);
});

test("router resolves the wiki contract before it selects any branch", () => {
  const router = read("phases/router.md");
  const contract = router.indexOf("../references/wiki-contract.md");

  assert.ok(contract >= 0, "router links the wiki contract reference");
  for (const branch of [
    "../references/source-capture.md",
    "../references/health.md",
    "private-internal.md",
    "public-docs.md",
  ]) {
    const index = router.indexOf(branch);
    assert.ok(index > contract, `${branch} is selected after the contract resolves`);
  }
  assert.match(router, /\*\*Setup\/adoption\*\*/u);
  assert.match(router, /\*\*Capture\*\*/u);
  assert.match(router, /\*\*Health\*\*/u);
  assert.match(router, /\*\*Gap\*\*[\s\S]*#gap-report/u);
});

test("router delegates the contract fields to the contract reference", () => {
  const router = read("phases/router.md");

  assert.doesNotMatch(
    router,
    /raw home|canonical article tree|discovery entrypoints|source owners|validation commands/iu,
  );
});

test("wiki contract names every required field", () => {
  const contract = read("references/wiki-contract.md");

  for (const field of [
    "Wiki location",
    "Raw home",
    "Canonical article tree",
    "Discovery entrypoints",
    "Source owners",
    "Validation commands",
  ]) {
    assert.match(contract, new RegExp(`\\*\\*${field}\\*\\*`, "u"));
  }
  assert.match(contract, /wiki-root `AGENTS\.md`/u);
});

test("adoption keeps one canonical tree and its existing ownership", () => {
  const contract = read("references/wiki-contract.md");
  const [, adopt] = contract.match(/^## Adopt\s*$([\s\S]*?)^## /mu) ?? [];

  assert.ok(adopt, "contract has an Adopt section");
  assert.match(adopt, /one canonical article tree/iu);
  for (const owned of ["routes", "authored content", "visibility", "canonical-versus-generated"]) {
    assert.match(adopt, new RegExp(owned, "iu"));
  }
});

test("authorized setup creates a project-owned destination without installer ownership", () => {
  const contract = read("references/wiki-contract.md");
  const [, setup] = contract.match(/^## Set up\s*$([\s\S]*?)^## /mu) ?? [];

  assert.ok(setup, "contract has a Set up section");
  assert.match(setup, /setup authority/iu);
  assert.match(setup, /project-owned/iu);
  assert.match(setup, /installer[\s\S]*unchanged/iu);
});

test("an unresolved destination yields an exact gap and no canonical write", () => {
  const contract = read("references/wiki-contract.md");
  const [, gap] = contract.match(/^## Gap report\s*$([\s\S]*?)^## /mu) ?? [];

  assert.ok(gap, "contract has a Gap report section");
  assert.match(gap, /exact/iu);
  assert.match(gap, /no canonical content/iu);
  assert.match(gap, /setup incomplete/iu);
});

test("readiness reports storage, knowledge/navigation and rendering separately", () => {
  const contract = read("references/wiki-contract.md");
  const [, readiness] = contract.match(/^## Readiness\s*$([\s\S]*?)^## /mu) ?? [];

  assert.ok(readiness, "contract has a Readiness section");
  assert.match(readiness, /\*\*Source storage\*\*/u);
  assert.match(readiness, /\*\*Knowledge\/navigation\*\*/u);
  assert.match(readiness, /\*\*Rendering\*\*/u);
  assert.match(readiness, /`unavailable`/u);
  assert.match(readiness, /separate/iu);
});

test("capture needs only source-storage readiness", () => {
  const contract = read("references/wiki-contract.md");
  const [, handoff] = contract.match(/^## Hand-off\s*$([\s\S]*)/mu) ?? [];

  assert.ok(handoff, "contract has a Hand-off section");
  assert.match(
    handoff,
    /Capture[\s\S]*source storage is `ready`[\s\S]*docs onboarding[\s\S]*backlog reconstruction[\s\S]*running app[\s\S]*deployment/u,
  );
});

test("wiki setup keeps the Project Verifier boundary", () => {
  const contract = read("references/wiki-contract.md");

  assert.match(contract, /\.\.\/SKILL\.md#project-verifier-boundary/u);
});
