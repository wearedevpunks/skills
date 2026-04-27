# GitHub Issues Create Payload

Official source:

- REST issues API: [docs.github.com/en/rest/issues/issues](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28)

## Transport

- endpoint: `POST https://api.github.com/repos/{owner}/{repo}/issues`
- headers:
  - `Accept: application/vnd.github+json`
  - `Authorization: Bearer <TOKEN>`
  - `X-GitHub-Api-Version: 2022-11-28`

## Raw request body

```json
{
  "title": "Lead manages unassigned submissions",
  "body": "## Outcome\n\n...\n\n## Acceptance signals\n\n- [ ] ...",
  "assignees": ["octocat"],
  "milestone": 1,
  "labels": ["workflow", "review"]
}
```

## Required fields

- `title`

## Common optional fields

- `body`
- `assignees`
- `milestone`
- `labels`

## Repo mapping

- module -> repository milestone
- epic -> GitHub issue
- story -> GitHub issue

## Notes

- GitHub’s create-issue payload does not natively express parent/sub-issue or blocker relations in the same create body documented here.
- If you use GitHub as the provider, treat hierarchy and dependency setup as follow-up work outside this create-only asset.
- Because of that limitation, keep the canonical module -> epic -> story model explicit in your own backlog logic instead of silently flattening it.
