# UI Screenshot Evidence

Use this reference only when implementation changes a user-visible UI, visual state, browser flow, layout, copy surface, or interaction surface. This applies to `browser` and `mixed` review tasks by default, and to `cli` tasks only when they still change rendered UI artifacts.

## Contract

For each changed UI surface:

1. Capture a **before** screenshot from the current baseline before edits, or from the closest reachable pre-change state if the exact surface does not exist yet.
2. Capture an **after** screenshot from the same route, viewport, fixture, and state after the change.
3. Store screenshots as durable provider assets through the repo manager or backlog provider in use when it supports attachments.
4. Link the before/after asset URLs in `IMPLEMENTATION-NOTES.md`.
5. Carry the same links into the PR body, PR comment, or PR-ready handoff snippet.

Do not link local temp files, ephemeral browser session URLs, or unpushed workspace paths as final evidence.

## Capture Rules

- Pair screenshots by surface and viewport: desktop before/after, mobile before/after, modal before/after, and so on.
- Use the same data fixture, account, flags, locale, route, query params, and viewport for both sides of a pair.
- Capture before screenshots before production edits whenever possible.
- If before capture was impossible, record why and capture the closest honest baseline, such as the old empty state, broken state, or parent page.
- If the after state requires a dev server, prefer the repo's stable local URL convention over raw `localhost:<port>` values when available.
- For responsive UI work, include the viewports needed to prove the change. Do not add extra screenshots that do not clarify review.

## Durable Asset Storage

Use the provider already active for the repo or backlog item:

- GitHub: upload screenshots as PR or issue assets, or attach them to a PR comment when the PR exists.
- GitLab or another git provider: use its native merge request, issue, or comment attachment flow.
- Linear or another backlog provider: use native issue/comment attachments when that is the durable review surface.

If no provider-native durable asset storage is available, commit or push the evidence to an intentional repo-owned evidence location and link those pushed paths. Do not create a new storage convention unless the repo already has no usable one and the implementation needs persistent visual proof.

## Provider CLI Workflows

Prefer the repository host that owns the PR. If backlog and repo providers differ, store evidence in the repo host and cross-link it from the backlog item only when needed.

### GitHub Cheatsheet

```bash
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
SHA="$(git rev-parse --short HEAD)"
BRANCH="$(git branch --show-current | tr '/[:upper:]' '-[:lower:]' | tr '/ ' '--')"
TAG="ui-evidence-${BRANCH}-${SHA}-$(date -u +%Y%m%d%H%M%S)"
EVIDENCE_DIR="${TMPDIR:-/tmp}/ui-evidence-${TAG}"

mkdir -p "$EVIDENCE_DIR"
cp before.png "$EVIDENCE_DIR/before.png"
cp after.png "$EVIDENCE_DIR/after.png"

gh release create "$TAG" "$EVIDENCE_DIR"/*.png \
  --repo "$REPO" \
  --target "$(git rev-parse HEAD)" \
  --title "UI evidence ${BRANCH} ${SHA}" \
  --notes "Before/after UI evidence." \
  --prerelease \
  --latest=false

gh api "repos/${REPO}/releases/tags/${TAG}" \
  --jq '.assets[] | "- [" + .name + "](" + .browser_download_url + ")"'

gh pr comment "$PR_NUMBER_OR_BRANCH" --body-file /tmp/ui-evidence.md
```

- `gh` cannot upload PR or issue attachments directly; release assets are the CLI path.
- Push the target commit before creating the release.
- Keep evidence releases `--prerelease --latest=false`.
- Browser/manual option: `gh pr view --web`, drag screenshots into a comment, then copy those asset URLs into `IMPLEMENTATION-NOTES.md`.

### Azure DevOps Cheatsheet

```bash
ORG="https://dev.azure.com/ORG"
PROJECT="PROJECT"
WORK_ITEM_ID="12345"
FILE="before.png"
NAME="$(basename "$FILE")"

ATTACHMENT_URL="$(
  az devops invoke \
    --org "$ORG" \
    --area wit \
    --resource attachments \
    --route-parameters project="$PROJECT" \
    --query-parameters fileName="$NAME" \
    --http-method POST \
    --api-version 7.1 \
    --media-type application/octet-stream \
    --in-file "$FILE" \
    --query url \
    -o tsv
)"

az boards work-item relation add \
  --org "$ORG" \
  --id "$WORK_ITEM_ID" \
  --relation-type AttachedFile \
  --target-url "$ATTACHMENT_URL"
```

- Repeat for before and after files; use the returned attachment URLs in `IMPLEMENTATION-NOTES.md`.
- Add the same table to the PR with `az repos pr update --id "$PR_ID" --description "$(cat /tmp/pr-description.md)"`.
- If no work item exists, use an agreed Azure Artifacts feed with `az artifacts universal publish`; record the exact download command because packages do not give simple image URLs.

## Notes Format

Add or update `## UI Evidence Links` in `IMPLEMENTATION-NOTES.md`:

| Surface | Viewport | Before | After | Notes |
|---------|----------|--------|-------|-------|
| Checkout summary | Desktop 1440x900 | [before](...) | [after](...) | Same seeded cart |

Rules:

- Every row needs both before and after links, unless the notes explain why one side is impossible.
- Notes should name the fixture, state, or exception only when needed for replay.
- Keep links provider URLs or pushed repo paths, not local paths.

## Worker Brief Hook

When spawning a worker for a UI task, include this instruction:

> Capture before/after screenshots for changed UI surfaces, upload or push them to the active provider's durable asset storage, and record the links under `## UI Evidence Links` in `IMPLEMENTATION-NOTES.md`.

## Finalization and PR Handoff

Before final report or PR creation:

1. Verify every UI task has a linked before/after pair or an explicit reason the pair is impossible.
2. Verify `IMPLEMENTATION-NOTES.md` contains durable links, not local-only evidence.
3. Include a `UI Evidence` section in the PR body, PR comment, or PR-ready handoff snippet with the same links.
4. If PR creation is out of scope for the run, leave the exact PR-ready `UI Evidence` snippet in `IMPLEMENTATION-NOTES.md`.
