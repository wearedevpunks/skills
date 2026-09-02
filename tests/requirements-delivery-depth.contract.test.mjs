import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const requirements = read("skills/phases/requirements-phase/SKILL.md");
const designBacklog = read("skills/phases/design-phase/phases/backlog.md");
const deliveryRouter = read("skills/phases/delivery-phase/phases/router.md");

test("direct bounded input reaches the sole delivery-depth route without Finder artifacts", () => {
  assert.match(requirements, /independently invocable/iu);
  assert.match(
    requirements,
    /direct bounded requirements input[\s\S]*creates no (?:Fog|Finder artifact)[\s\S]*no (?:Grilling )?provider item/iu,
  );

  const grill = requirements.indexOf("`requirements-grill`");
  const spec = requirements.indexOf("`create-spec`", grill);
  const backlog = requirements.indexOf("`write-backlog`", spec);
  assert.ok(grill >= 0 && spec > grill && backlog > spec);
  assert.match(requirements, /only\s+orchestration\s+route/iu);
});

test("supplied Finder context resolves only the exact owning Fog graph", () => {
  for (const handle of [
    "Fog",
    "Finder child",
    "Research child",
    "Prototype child",
    "durable Finder handoff",
  ]) {
    assert.match(requirements, new RegExp(handle, "iu"));
  }

  assert.match(requirements, /only when (?:the )?caller supplies/iu);
  assert.match(
    requirements,
    /exact\s+identity and (?:its )?owning Fog graph/iu,
  );
  assert.match(
    requirements,
    /does not[\s\S]{0,40}(?:load|take ownership of) sibling work/iu,
  );
});

test("Requirements result names retained spec and derived backlog projection", () => {
  assert.match(requirements, /Requirements result/iu);
  assert.match(requirements, /verified stable blob URL/iu);
  assert.match(requirements, /Write Backlog result/iu);
  assert.match(
    requirements,
    /derive[\s\S]{0,180}(?:Product Area|accepted placement)[\s\S]{0,180}Initiative[\s\S]{0,180}Epic/iu,
  );
  assert.match(requirements, /no prior Finder\s+projection/iu);
  assert.match(requirements, /Story is a shippable product outcome/iu);
  assert.match(
    requirements,
    /Task is atomic, independently\s+ownable, and understandable from its Story and stable specification/iu,
  );

  assert.doesNotMatch(requirements, /exact existing Story/iu);
  assert.doesNotMatch(requirements, /fixed (?:Grilling|specification|Story|Task) count/iu);
});

test("scope-changing design evidence returns through Requirements Phase", () => {
  assert.match(designBacklog, /return[\s\S]{0,160}Requirements Phase/iu);
  assert.match(designBacklog, /new Stories or Tasks/iu);
  assert.doesNotMatch(designBacklog, /Technical Finder|technical-projection/iu);

  assert.match(deliveryRouter, /route[\s\S]{0,120}Requirements Phase/iu);
  assert.doesNotMatch(deliveryRouter, /Technical Finder invocation/iu);
});
