import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const normalization = () =>
  readFileSync(
    path.join(
      root,
      "skills/agnostic/requirements/write-backlog/references/normalization.md",
    ),
    "utf-8",
  );

test("Normalization inventories every accepted drift class from durable and live authority", () => {
  const guidance = normalization();

  assert.match(guidance, /read[\s\S]*wiki[\s\S]*provider[\s\S]*identit/iu);
  assert.match(guidance, /invalid Fog child placement/iu);
  assert.match(guidance, /missing or conflicting Fog provenance or support relation/iu);
  assert.match(guidance, /duplicate or ambiguous structures/iu);
  assert.match(guidance, /stale links or status/iu);
  assert.match(guidance, /hierarchy drift/iu);
  assert.match(guidance, /roadmap or milestone drift/iu);
  assert.match(guidance, /wiki(?:\/provider| and provider) disagreement/iu);
});

test("Normalization repairs only exact stale mappings and gates every structural change", () => {
  const guidance = normalization();

  assert.match(
    guidance,
    /automatically repair[\s\S]*unambiguous[\s\S]*(?:additive|missing)[\s\S]*stale/iu,
  );
  assert.match(guidance, /preflight[\s\S]*exact readback/iu);
  assert.match(
    guidance,
    /duplicate closure[\s\S]*merge[\s\S]*split[\s\S]*boundary[\s\S]*goal[\s\S]*reparent[\s\S]*milestone movement[\s\S]*reorganization/iu,
  );
  assert.match(guidance, /structural[\s\S]*before[\s\S]*after[\s\S]*explicit approval/iu);
  assert.match(guidance, /zero provider\s+mutations[\s\S]*approval/iu);
  assert.match(guidance, /ambiguous[\s\S]*conflicting[\s\S]*zero (?:writes|provider mutations)/iu);
});

test("Normalization preserves historical staged shapes without making them current gates", () => {
  const guidance = normalization();

  assert.match(
    guidance,
    /Fog[\s\S]*direct children[\s\S]*grilling[\s\S]*Research[\s\S]*Prototype/iu,
  );
  assert.match(guidance, /Historical Business/iu);
  assert.match(guidance, /Technical staged tickets/iu);
  assert.match(guidance, /compatibility\s+evidence only/iu);
  assert.doesNotMatch(guidance, /automatically migrate[\s\S]*historical/iu);
  assert.match(guidance, /provider-specific mechanics[\s\S]*adapter/iu);
  assert.match(guidance, /Invocation cadence[\s\S]*caller/iu);
  assert.doesNotMatch(guidance, /daily|weekly|cron|schedule Normalization|run every/iu);
});
