import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const linear = readFileSync(
  path.join(
    root,
    "skills/agnostic/requirements/write-backlog/references/providers/linear.md",
  ),
  "utf-8",
);
const normalizedLinear = linear.replace(/\s+/gu, " ");

test("Linear fails closed until the exact workspace and native representation are proven", () => {
  assert.match(linear, /actual Linear workspace[\s\S]*workspace ID[\s\S]*workspace URL/iu);
  assert.match(linear, /connector alias[\s\S]*(?:routing hint|not identity evidence)/iu);
  assert.match(linear, /read before write/iu);
  assert.match(linear, /stable provider ID[\s\S]*durable wiki identity/iu);
  assert.match(linear, /title-only[\s\S]*zero writes/iu);
  assert.match(linear, /ambiguous[\s\S]*zero writes/iu);
  assert.match(linear, /missing representation[\s\S]*zero writes/iu);
});

test("Linear resolves backlogProjectUrl to the top-level Initiative in the exact workspace", () => {
  assert.ok(
    normalizedLinear.includes(
      "Resolve `backlogProjectUrl` as the top-level Linear Initiative by stable provider ID",
    ),
  );
  assert.ok(
    normalizedLinear.includes(
      "Root Initiative, including its workspace ID and workspace URL, and match both to the workspace encoded by the configured Root URL",
    ),
  );
  assert.match(
    normalizedLinear,
    /Linear Project URL or any non-Initiative URL.{0,180}`hi ensure`.{0,80}zero writes/iu,
  );
});

test("Linear is a native adapter for the provider-neutral product topology", () => {
  assert.match(
    linear,
    /Product\/Backlog Root[\s\S]*top-level Linear Initiative[\s\S]*Product Area[\s\S]*Linear Initiative[\s\S]*Initiative[\s\S]*nested Linear Initiative[\s\S]*Epic[\s\S]*Linear Project[\s\S]*Story[\s\S]*Linear Issue[\s\S]*Task[\s\S]*sub-issue/iu,
  );
  assert.match(linear, /multiple initiative parents[\s\S]*exactly one Product Area parent/iu);
  assert.match(linear, /Epic[\s\S]*exactly one owning Initiative/iu);
  assert.match(linear, /Task[\s\S]*parentId[\s\S]*Story/iu);
  assert.match(linear, /Product Area and Initiative[\s\S]*not labels or[\s\S]*milestones/iu);
});

test("Linear initialization preserves complete metadata and the four semantic views", () => {
  for (const field of [
    "Product brief",
    "business objectives",
    "target users",
    "product boundaries",
    "Product Map",
    "constraints and non-goals",
    "operating rules",
    "owner",
    "repository link",
    "wiki link",
    "current and future `V*`",
  ]) {
    assert.ok(linear.includes(field), field);
  }

  assert.match(linear, /Product Map[\s\S]*Roadmap[\s\S]*Fogs[\s\S]*Current Delivery/u);
  assert.match(linear, /equivalent existing view/iu);
  assert.match(linear, /Kind[\s\S]*Grilling Stage/iu);
  assert.match(linear, /field or view[\s\S]*preview[\s\S]*explicit approval/iu);
  assert.match(linear, /view.*API[\s\S]*(?:unavailable|unsupported)[\s\S]*zero writes/isu);
});

test("Linear uses existing-first project-scoped V-star milestones", () => {
  assert.match(linear, /fitting existing `V\*` milestone[\s\S]*before[\s\S]*propos/iu);
  assert.match(linear, /project-scoped[\s\S]*Epic's Linear\s+Project/iu);
  assert.match(linear, /Every Story[\s\S]*exactly one[\s\S]*Every Task[\s\S]*same/iu);
  assert.match(
    linear,
    /Version name[\s\S]*One-sentence product goal[\s\S]*Included product outcomes or capability changes/iu,
  );
  assert.match(linear, /metadata.*unsupported[\s\S]*name-only/isu);
  assert.match(linear, /moving[\s\S]*milestone[\s\S]*explicit approval/iu);
  assert.doesNotMatch(linear, /\bsprints?\b|provider Cycles|\bM1\b|\bM2\b|\bM3\b/iu);
});

test("Linear keeps Fog lateral and preserves native delivery relations", () => {
  assert.match(linear, /Fog[\s\S]*lateral/iu);
  assert.match(linear, /relatedTo[\s\S]*Story[\s\S]*Task/iu);
  assert.match(linear, /Fog body[\s\S]*Product Area[\s\S]*Initiative[\s\S]*Epic/iu);
  assert.match(linear, /source link[\s\S]*(?:description|body)/iu);
  assert.match(linear, /blockedBy[\s\S]*blocks/iu);
  assert.match(linear, /missing targets[\s\S]*future-iteration[\s\S]*self-edges[\s\S]*cycles/iu);
});

test("Linear provisions structurally only after approval and proves exact readback", () => {
  assert.match(linear, /structural[\s\S]*preview[\s\S]*explicit approval/iu);
  assert.match(linear, /write only[\s\S]*stable IDs/iu);
  assert.match(linear, /exact readback[\s\S]*workspace[\s\S]*hierarchy[\s\S]*membership[\s\S]*milestone/iu);
  assert.match(linear, /semantic fields and all four views/iu);
  assert.match(linear, /Fog provenance[\s\S]*source links/iu);
  assert.match(linear, /every native[\s\S]*`blockedBy`[\s\S]*`blocks` relation/iu);
  assert.match(linear, /partial[\s\S]*observed writes[\s\S]*unresolved delta/iu);
  assert.match(linear, /RAC-2/iu);
  assert.doesNotMatch(linear, /CI\/CD|release branch|automatic schedul/iu);
});
