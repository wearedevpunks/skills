import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const canonicalPath = "skills/languages/python/python-backend-structure/SKILL.md";
const shimPath = "skills/languages/python/python-project-structure/SKILL.md";

test("python backend structure is the canonical model-invoked skill", () => {
  const skill = read(canonicalPath);
  const metadata = read("skills/languages/python/python-backend-structure/agents/openai.yaml");

  assert.match(skill, /^name: python-backend-structure$/m);
  assert.doesNotMatch(skill, /disable-model-invocation/);
  assert.match(
    skill,
    /description:[\s\S]{0,500}Python backend[\s\S]{0,500}(?:domain|package) architecture/i,
  );
  assert.match(skill, /\$backend-domain-structure/);
  assert.match(
    skill,
    /Python overlay[^.]*overrides[^.]*platform placement[^.]*application wiring/i,
  );
  assert.match(skill, /backend\/composition\.py[^.]*parent-owned application composition module/i);
  assert.match(
    skill,
    /platform\/[^.]*retains runtime and transport assembly[^.]*accepts injected entrypoints/i,
  );
  assert.match(metadata, /display_name:\s*"Python Backend Structure"/);
  assert.match(metadata, /default_prompt:[^\n]*\$python-backend-structure/);
});

test("python package dependencies are acyclic and composition-owned", () => {
  const skill = read(canonicalPath);

  assert.match(skill, /sibling packages at the same parent never import one another/i);
  assert.match(skill, /same law covers sibling implementation branches[^.]*modules or packages/i);
  assert.match(skill, /This includes[^.]*actions[^.]*services[^.]*repositories[^.]*adapters/i);
  assert.match(skill, /parent composition may import child implementations/i);
  assert.match(
    skill,
    /parent-owned composition modules import immediate child implementation branches/i,
  );
  assert.match(skill, /children never import parent composition/i);
  assert.match(skill, /child modules import parent-owned leaf `contracts\.py` and `models\.py`/i);
  assert.match(skill, /never import (?:the )?parent `?__init__`?/i);
  assert.match(skill, /nearest honest common parent|lower contract or event owned honestly/i);
  assert.match(skill, /top-level imports[^.]*acyclic/i);
  assert.match(skill, /lazy imports?[^.]*not[^.]*conceal cycles/i);
  assert.match(skill, /public `?__init__\.py`?[^.]*deliberately narrow/i);
  assert.match(skill, /`__all__`[^.]*public package roots[^.]*not every module/i);
  assert.match(skill, /backend\/[\s\S]{0,120}composition\.py/);
  assert.match(skill, /commerce\/[\s\S]{0,160}composition\.py/);
  assert.match(skill, /contracts\.py/);
  assert.match(skill, /models\.py/);
  assert.match(
    skill,
    /checkout\/[\s\S]{0,320}composition\.py[\s\S]{0,160}contracts\.py[\s\S]{0,160}models\.py/,
  );
  assert.doesNotMatch(skill, /composition\//);
  assert.doesNotMatch(skill, /platform\/[^.]*owns[^.]*application composition/i);
  assert.match(
    skill,
    /root composition[^.]*injects composed feature entrypoints into platform and transport/i,
  );
  assert.match(skill, /Integration adapters[^.]*structurally satisfy feature-owned Protocols/i);
  assert.match(skill, /without importing feature implementation packages/i);
  assert.match(skill, /rule is recursive at every package depth/i);
  assert.match(
    skill,
    /checkout\/composition\.py[^.]*parent-owned relative to[^.]*implementation branches/i,
  );
  assert.match(
    skill,
    /commerce\/composition\.py[^.]*imports only[^.]*checkout[^.]*composed entrypoint[^.]*fulfillment[^.]*equivalent/i,
  );
  assert.match(
    skill,
    /implementation branch imports checkout-owned leaf[^.]*contracts\.py[^.]*models\.py[^.]*never imports its siblings/i,
  );
});

test("python domains distinguish actions, services, repositories, and adapters", () => {
  const skill = read(canonicalPath);

  for (const branch of ["platform/", "integrations/", "features/"]) {
    assert.match(skill, new RegExp(branch.replace("/", "\\/")));
  }
  assert.match(skill, /domain parent owns[^.]*contract[^.]*model[^.]*composition/i);
  assert.match(skill, /child[^.]*actions[^.]*services[^.]*repositories[^.]*adapters/i);
  assert.match(skill, /Actions own use-case policy/i);
  assert.match(skill, /Services[^.]*reusable capability mechanics/i);
  assert.match(skill, /Repositories[^.]*persistence only/i);
  assert.match(skill, /external systems[^.]*integrations?[^.]*adapters?/i);
});

test("python services are explicit capability seams without Effect APIs", () => {
  const skill = read(canonicalPath);

  assert.match(skill, /service-versus-value deletion test/i);
  assert.match(skill, /authority or capability seam/i);
  assert.match(skill, /contract owner/i);
  assert.match(skill, /concrete adapter/i);
  assert.match(skill, /production (?:construction|composition) owner/i);
  assert.match(skill, /constructor or setup injection/i);
  assert.match(skill, /service locator/i);
  assert.match(skill, /parent or root composition module/i);
  assert.doesNotMatch(skill, /platform composition root/i);
  assert.doesNotMatch(skill, /Context\.Service|Layer\.|Effect\.|yield\*/);
});

test("python structure guidance stays descriptive and technology-neutral", () => {
  const skill = read(canonicalPath);

  assert.match(skill, /do not require projects to create architecture or import-boundary tests/i);
  assert.doesNotMatch(
    skill,
    /(?:create|add|write|maintain|record) (?:an? )?(?:architecture|import-boundary) (?:test|suite|ledger|report|artifact)/i,
  );
  assert.doesNotMatch(
    skill,
    /Collective|FastAPI|SQLAlchemy|Alembic|Pydantic|Celery|Dramatiq|Dishka|Redis|PostgreSQL|Amazon S3|\bS3\b/,
  );
});

test("old project-structure ID is only a compatibility shim", () => {
  const shim = read(shimPath);

  assert.match(shim, /^name: python-project-structure$/m);
  assert.match(shim, /^disable-model-invocation: true$/m);
  assert.match(shim, /deprecated/i);
  assert.match(shim, /\$python-backend-structure/);
  assert.ok(shim.length < 700, "compatibility shim should stay tiny");
  assert.doesNotMatch(shim, /## (?:Boundary|Layout|Actions|Services|Repositories)/);
  assert.equal(
    existsSync(
      new URL("../skills/languages/python/python-project-structure/agents", import.meta.url),
    ),
    false,
  );
  assert.equal(
    existsSync(
      new URL("../skills/languages/python/python-project-structure/references", import.meta.url),
    ),
    false,
  );
});

test("python design patterns defers topology and keeps repositories persistence-only", () => {
  const design = read("skills/languages/python/python-design-patterns/SKILL.md");
  const pattern2 = design.match(/### Pattern 2:[\s\S]*?(?=### Pattern 3:)/)?.[0];
  const pattern7 = design.match(/### Pattern 7:[\s\S]*?(?=### Pattern 8:)/)?.[0];
  assert.ok(pattern2, "Pattern 2 section should exist");
  assert.ok(pattern7, "Pattern 7 section should exist");

  assert.match(design, /\[python-backend-structure\]\(\.\.\/python-backend-structure\/SKILL\.md\)/);
  assert.doesNotMatch(design, /python-project-setup/);
  assert.match(design, /runtime call flow[^.]*Python import topology/i);
  assert.match(design, /peer packages at the same parent never import one another/i);
  assert.match(design, /parent-owned contracts and models/i);
  assert.match(design, /composition[^.]*wires[^.]*implementations/i);
  assert.match(design, /class UserRepository\(Protocol\)/);
  assert.match(design, /class GetUser\(Protocol\)/);
  assert.match(design, /class UserHandler:[\s\S]{0,300}get_user: GetUser/);
  assert.doesNotMatch(design, /Each layer depends only on layers below it/i);
  assert.doesNotMatch(design, /API → Service → Repository/);
  assert.match(pattern2, /class UserRepository\(Protocol\)/);
  assert.match(pattern2, /class CreateUser\(Protocol\)/);
  assert.match(pattern2, /class CreateUserAction:/);
  assert.match(pattern2, /class UserHandler:[\s\S]{0,300}create_user: CreateUser/);
  assert.match(pattern2, /contracts describe dependencies[^.]*packages own implementations/i);
  assert.doesNotMatch(pattern2, /class UserService:/);
  assert.match(pattern7, /parent-owned (?:capability )?contracts/i);
  assert.match(pattern7, /class UserRepository\(Protocol\)/);
  assert.match(pattern7, /class UserCache\(Protocol\)/);
  assert.match(pattern7, /class GetUser\(Protocol\)/);
  assert.match(pattern7, /class GetUserAction:/);
  assert.match(pattern7, /Parent composition[^.]*selects implementations/i);
  assert.doesNotMatch(design, /class UserService:/);
  assert.doesNotMatch(
    design,
    /Repository (?:Layer|adapter)[\s\S]{0,240}(?:External API calls|Cache operations)/,
  );
  assert.match(design, /Repository (?:Layer|adapter)[\s\S]{0,240}persistence/i);
});
