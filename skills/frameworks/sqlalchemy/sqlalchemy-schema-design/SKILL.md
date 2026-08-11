---
name: sqlalchemy-schema-design
description: Design SQLAlchemy 2.x models and Alembic migrations. Use for persisted type selection, enums versus extensible strings, JSON columns, constraints, relationships, indexes, or online schema evolution.
---

# SQLAlchemy schema design

Make database invariants explicit in both SQLAlchemy metadata and the database.
Choose each persisted type from who owns its vocabulary and how it may evolve,
then shape migrations around the target dialect, table size, traffic, and lock
budget.

## Persisted types

| Field behavior | Persisted shape |
| --- | --- |
| Closed, code-owned state or protocol vocabulary | Python enum mapped with `sqlalchemy.Enum` |
| Extension-, provider-, tenant-, or user-defined identifier | String with a documented format and boundary validation |
| Free-form human text | `Text`, with length validation at the application boundary when needed |
| Stable JSON object with known fields | Named application model plus `JSON`/`JSONB`; use a `TypeDecorator` when values should validate on bind and reconstruct on load |
| Intentionally arbitrary JSON | Named recursive JSON value/object aliases rather than `dict[str, Any]` |
| Values that need joins, foreign keys, independent updates, or relational filtering | Normalized rows and relationships |
| Exact quantities such as money | `Numeric` mapped to `Decimal`, with explicit precision and scale |
| Instants in time | Time-zone-aware timestamp with an explicit UTC convention |

Observed values are evidence, not ownership. A column with two current values is
an enum only when the application owns the complete vocabulary. Keep open
identifiers as strings even when their current set is small.

### Enums

Map code-owned choices to the enum type at entity, constructor, query, and
service boundaries. When persisted values should be the Python members'
`.value`, declare that choice explicitly:

```python
import enum

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column


class JobState(str, enum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"


job_state_type = sa.Enum(
    JobState,
    name="job_state",
    values_callable=lambda members: [member.value for member in members],
    native_enum=False,
    create_constraint=True,
)


class Job(Base):
    __tablename__ = "job"

    state: Mapped[JobState] = mapped_column(job_state_type, nullable=False)
```

Choose the storage strategy deliberately:

- `native_enum=False` gives portable string storage with a named check
  constraint. It keeps type evolution in ordinary table DDL.
- PostgreSQL native enums give a shared database type and strong database
  semantics, but adding, renaming, reordering, or removing values has a
  dialect-specific migration lifecycle.
- Persist member values or member names by contract. Preserve those stored
  strings across Python symbol renames; migrate data before changing them.
- When adopting an enum on an existing string column, match its physical type
  and length explicitly so metadata does not introduce an incidental rewrite.

Validate open vocabularies against their current source of truth instead of
centralizing them in a code enum.

### JSON

Use JSON for document-shaped data, not as an escape from schema design.

- Give known shapes a named model at the application boundary. A
  `TypeDecorator` may validate and serialize on bind, then validate and
  reconstruct on result.
- Give genuinely generic JSON a recursive `JsonValue` contract. Use narrower
  semantic aliases for guarantees such as redacted or UI-safe content.
- Use `JSONB` only where the dialect and query operators justify it; otherwise
  use SQLAlchemy's portable `JSON` type.
- Track in-place ORM mutation with `MutableDict`/`MutableList`, or replace the
  whole value so the unit of work sees the change.
- Index the operators actually used. PostgreSQL containment, key lookup, and
  path expressions can require different GIN or expression indexes.

## Columns and constraints

- Declare nullability from domain meaning. `Optional` Python types and database
  `NULL` behavior must agree.
- Put invariants that must survive every writer in primary keys, foreign keys,
  unique constraints, check constraints, and exclusion constraints.
- Name constraints and indexes deterministically, preferably through a metadata
  naming convention, so Alembic can address them across dialects.
- Distinguish Python defaults from `server_default`. Use a server default when
  inserts outside the ORM must receive the same value.
- Model delete behavior once. Align `ForeignKey(..., ondelete=...)`, ORM
  cascade, relationship optionality, and `passive_deletes`; database cascades
  can avoid loading large child collections.
- Use association tables for many-to-many relationships. Give them a composite
  key or unique constraint that prevents duplicate edges.
- Treat string length, collation, case sensitivity, numeric precision, and time
  zone behavior as database contracts rather than incidental Python details.

## Indexes follow queries

Derive indexes from concrete predicates, joins, ordering, and cardinality.

- Put equality columns before range or ordering columns when that matches the
  target database's planner behavior.
- Remember the left-prefix behavior of composite B-tree indexes. A composite
  index may cover a leading-column lookup, but the reverse ordering may not.
- Add indexes for foreign-key lookup and deletion paths when the database does
  not create them automatically. PostgreSQL does not automatically index the
  referencing columns.
- Use partial, expression, covering, GIN, or GiST indexes only when the query
  shape and dialect support them.
- Remove a single-column index only when an existing composite index truly
  covers its predicates and ordering. Distinct operator classes, sort order,
  predicates, and included columns make superficially similar indexes
  different.
- Let write cost, storage, selectivity, and measured plans bound index width and
  count. A fixed maximum column count is not a design rule.

Confirm important paths with representative data and the target database's
`EXPLAIN` facilities. SQLite test behavior is not evidence of a PostgreSQL or
MySQL query plan.

## Alembic migrations

Treat autogenerate output as a draft. Reconcile it with intended renames,
constraint names, server defaults, custom types, data transitions, and
dialect-specific operations.

Every migration must preserve a valid application/database contract at its
deployment boundary:

- Add a required column through expand and contract: add it nullable or with a
  safe server default, deploy compatible writes, backfill in bounded batches,
  enforce `NOT NULL`, then remove transitional behavior.
- Rename a table or column explicitly. Autogenerate commonly represents a
  rename as drop plus add.
- Change a type in place only when the target database, data volume, conversion,
  and lock budget make it safe. Otherwise add the new column, dual-write,
  backfill, move reads, stop old writes, and remove the old column later.
- Separate schema and data changes when batching, retries, observability, or
  deploy ordering require an application-controlled backfill.
- Clean or migrate unknown stored values before deploying readers that
  deserialize every row into a closed Python enum.
- State the conversion with `postgresql_using` or explicit SQL when PostgreSQL
  cannot infer it safely.
- Make downgrade behavior honest. Preserve data when practical; mark an
  irreversible destructive transition explicitly instead of pretending it can
  restore discarded values.

### PostgreSQL online DDL

Use online patterns for large or write-active PostgreSQL tables. Small, empty,
or maintenance-window tables may favor simpler transactional DDL.

- Create or drop production indexes with `postgresql_concurrently=True` inside
  `op.get_context().autocommit_block()`. Concurrent operations cannot run in a
  transaction block, take longer, have platform restrictions, and can leave an
  invalid index after failure; detect and clean up that state before retrying.
- Build a unique index concurrently, then attach a unique constraint with
  `USING INDEX` when adding uniqueness without a blocking index build.
- Add foreign-key and check constraints as `NOT VALID` when validating existing
  rows would exceed the lock budget, then run `VALIDATE CONSTRAINT` separately.
  New writes are still checked after the unvalidated constraint is installed.
- Account for the unconditional commit before an Alembic autocommit block. Use
  short, per-migration transactions when the migration environment contains
  such operations.
- Set intentional lock and statement timeouts for operational safety, and make
  retries aware of partially created database objects.

## Evidence

Prove the schema against the database engines it supports:

- upgrade a fresh database to head;
- upgrade a representative pre-change database to head;
- run metadata-versus-database drift detection;
- exercise constraints, defaults, enum round trips, JSON round trips, cascades,
  and relationship loading;
- inspect generated SQL for dialect-specific DDL;
- measure plans for material queries with representative data;
- test both the expand and contract application versions at their shared schema
  boundary when deployment is staged.

Account for every changed column, constraint, relationship, index, and migration
operation before the schema is complete.
