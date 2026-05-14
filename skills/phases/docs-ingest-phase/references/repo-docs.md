# Repo Docs

Use this reference when code or workflow changes require root `docs/` maintenance.

## Scope

Update root `docs/` when a change alters:

- architecture
- setup
- contracts
- decisions
- runbooks
- non-obvious operator-facing behavior

Do not let repo-doc work displace required wiki ingest. If both apply, complete ingest bookkeeping and then update root docs.

## Workflow

1. Read `docs/README.md`.
2. Read the nearest affected section README before editing.
3. Prefer editing an existing leaf doc over creating a new one.
4. When a doc is added, removed, or renamed, update `docs/README.md` and the nearest section README in the same task.
5. Record repo-wide behavior changes in `docs/architecture/decisions/` when that directory exists.

## Route By Owned Behavior

- Backend/runtime surface -> `docs/reference/domains/backend-effect-sql.md` or `docs/runbooks/`
- Auth/user-management -> `docs/reference/domains/user-management.md`
- Frontend/app structure -> `docs/reference/domains/frontend-application-structure.md`
- AI workflow/agent infrastructure -> `docs/runbooks/subagent-templates.md` or the relevant harness runbook

## Rules

- Document implemented reality, not speculative future state.
- Keep human docs human-facing; do not paste agent task instructions into them.
- Keep indexes current when adding, removing, or renaming docs.
- Link to source artifacts instead of duplicating large specs, plans, or implementation notes.
