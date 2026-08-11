import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const skillPath = new URL(
  "../skills/frameworks/sqlalchemy/sqlalchemy-schema-design/SKILL.md",
  import.meta.url
);
const skill = readFileSync(skillPath, "utf8");
const metadata = readFileSync(
  new URL(
    "../skills/frameworks/sqlalchemy/sqlalchemy-schema-design/agents/openai.yaml",
    import.meta.url
  ),
  "utf8"
);

test("sqlalchemy schema design is a model-invoked stateless reference", () => {
  assert.match(skill, /^---\nname: sqlalchemy-schema-design\n/);
  assert.match(skill, /description: .*SQLAlchemy 2\.x models and Alembic migrations/);
  assert.doesNotMatch(skill, /disable-model-invocation:\s*true/);
  assert.doesNotMatch(skill, /\breview(?:ed|ing|s)?\b/i);
  assert.doesNotMatch(skill, /\bfinding(?:s)?\b/i);
  assert.doesNotMatch(skill, /requested tables/i);
  assert.match(metadata, /display_name: "SQLAlchemy Schema Design"/);
  assert.match(metadata, /default_prompt: "Use \$sqlalchemy-schema-design/);
});

test("sqlalchemy schema design carries the persisted-type contract", () => {
  assert.match(skill, /Closed, code-owned state or protocol vocabulary/);
  assert.match(skill, /Extension-, provider-, tenant-, or user-defined identifier/);
  assert.match(skill, /values_callable=lambda members: \[member\.value for member in members\]/);
  assert.match(skill, /native_enum=False/);
  assert.match(skill, /TypeDecorator/);
  assert.match(skill, /MutableDict.*MutableList/);
});

test("sqlalchemy schema design makes online DDL conditional", () => {
  assert.match(skill, /table size, traffic, and lock\s+budget/);
  assert.match(skill, /Small, empty,\s+or maintenance-window tables may favor simpler transactional DDL/);
  assert.match(skill, /postgresql_concurrently=True/);
  assert.match(skill, /NOT VALID/);
  assert.match(skill, /A fixed maximum column count is not a design rule/);
  assert.match(skill, /Treat autogenerate output as a draft/);
});
