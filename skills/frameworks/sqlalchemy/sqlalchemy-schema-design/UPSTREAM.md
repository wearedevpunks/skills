# Upstream provenance

Adapted from
[`wispbit-ai/skills`](https://github.com/wispbit-ai/skills/tree/8b2c7d0ceca0204634dd308970629c4cd4a5a05f/skills/sqlalchemy-alembic-expert-best-practices-code-review)
at commit:

```text
8b2c7d0ceca0204634dd308970629c4cd4a5a05f
```

The upstream skill declares the MIT license in its frontmatter but does not
provide a repository or adjacent license file at that revision.

Devpunks rewrites the source as a stateless schema-design reference, scopes
online DDL guidance to PostgreSQL conditions, removes arbitrary index-width and
unconditional concurrency rules, and adds persisted vocabulary, enum storage,
typed JSON, relational constraints, ORM relationship, and evidence guidance.

The persisted-type classification also incorporates the project-agnostic parts
of Collective Intelligence's `db-schema-review` skill. Collective
Intelligence-specific ownership, workflow, output, and validation instructions
are excluded.

Implementation details were checked against the official SQLAlchemy, Alembic,
and PostgreSQL documentation:

- <https://docs.sqlalchemy.org/en/20/core/type_basics.html#sqlalchemy.types.Enum>
- <https://docs.sqlalchemy.org/en/20/orm/cascades.html#using-foreign-key-on-delete-cascade-with-orm-relationships>
- <https://alembic.sqlalchemy.org/en/latest/api/runtime.html#alembic.runtime.migration.MigrationContext.autocommit_block>
- <https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY>
- <https://www.postgresql.org/docs/current/sql-altertable.html>
