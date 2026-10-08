# Source Capture

Use this reference when a user supplies a source for the wiki: a file, pasted or exported text, a meeting export, or a URL to fetch. Capture runs before extraction and ingest. Each supplied source goes through capture, even when ingest later finds nothing new (a _knowledge no-op_). Capture ends with exactly one outcome from [Outcomes](#outcomes) for each source.

## Terms

- _original_: the exact supplied bytes. For a file, the file bytes. For pasted or exported text, the exact text, encoded as UTF-8 without other changes. For a web source, the fetched response body. Each _original_ stays byte-for-byte unchanged for as long as the repository keeps it.
- _derived_: text made from an _original_, such as PDF text, a cleaned transcript or Markdown converted from HTML. Each _derived_ file names the _original_ revision it came from.
- _revision_: one _original_ identity, its SHA-256. When the source content changes, the result is a new _revision_.

## Layout and provenance

Store each _revision_ in its own directory under the raw home the [wiki contract](wiki-contract.md) declares, `raw/` in this layout:

```text
raw/<origin>/<slug>/<revision12>/
  <file>          # the original
  source.json     # provenance record
  <derived files> # optional
```

- `<origin>`: the source class already used in the raw home, for example `external` for fetched web sources.
- `<slug>`: a stable kebab-case name for the source, kept across revisions.
- `<revision12>`: the first 12 characters of the upstream revision ID when the origin publishes one (Git commit, document version), else the first 12 characters of the _original_ SHA-256.

`source.json` is one JSON object. Record `null` for a value the source does not have.

| Field | Value |
| --- | --- |
| `title` | Source title as published or supplied. |
| `author` | Author as published or supplied. |
| `kind` | Short type, for example `external-markdown`, `pdf`, `meeting-transcript`, `meeting-notes`, `pasted-text`. |
| `original_url` | Canonical origin URL. |
| `revision` | Full upstream revision ID. |
| `retrieved_url` | Exact URL the bytes came from. |
| `captured_on` | Capture date, `YYYY-MM-DD`. |
| `supplied_via` | How the source arrived, for example "User-provided URL in this conversation". |
| `file` | _Original_ file name in this directory. |
| `media_type` | Media type of the _original_. |
| `bytes` | _Original_ size in bytes. |
| `sha256` | _Original_ SHA-256, lowercase hex. |
| `preservation` | What was kept and what was not supplied, in one sentence. |
| `derived` | Optional list; one entry per _derived_ file: `file`, `sha256`, `from_sha256` (the `sha256` of the _original_ it came from) and `method` (tool or procedure, with version when known). |

## Source kinds

- **PDF:** the _original_ is the PDF file. Extracted text is a _derived_ file with a `derived` entry.
- **Meeting material** (Granola or equivalent): capture the transcript and the notes as separate _originals_ (slugs `<meeting>-transcript` and `<meeting>-notes`), each with the speaker and timestamp information as supplied. `preservation` names each part that was not supplied, for example the recording or the transcript; capture only what was supplied.
- **Web source:** the _original_ is the fetched content, with `original_url`, `revision` when the origin exposes one, `retrieved_url` and `captured_on`. Prefer a raw endpoint that returns the source itself. A fetch tool that summarizes or converts the page returns _derived_ text; save it as _derived_ only beside a real _original_. A URL-only reference is not a preserved _original_: its outcome is **not captured**.

## Steps

### 1. Acquire

Obtain the _original_ bytes and compute their SHA-256 and byte count.

A URL, a summary or a command exit status is never proof of acquisition; only bytes in hand count. When access fails, the source is missing, or only a reference or summary is available, stop with outcome **not captured**.

Complete when: the _original_ bytes, SHA-256 and byte count are in hand, or the outcome is **not captured** with the exact gap named.

### 2. Reuse or place

Search all `source.json` files in the raw home for the acquired SHA-256.

- Match found: run the [readback](#5-read-back) on that record. When it prints `OK`, reuse the identical verified _original_ and finish with outcome **committed** for the existing path. Write no second copy.
- No match: create a new `<revision12>` directory. A changed source becomes a new revision beside the older one; write only into the new directory, so no older _original_ is overwritten.

Complete when: either an existing revision passed readback, or a new empty revision directory exists.

### 3. Preserve

Write the _original_ bytes unchanged to `<revision12>/<file>`. Write `source.json`. Frontmatter, normalization, re-encoding and line-ending changes go into _derived_ files only and leave the _original_ unchanged.

Complete when: the SHA-256 and byte count of the written file equal the acquired values, and `source.json` records them.

### 4. Commit

Stage and commit only the revision directory:

```sh
git add -- <revision-dir>
git commit --only -m "<message>" -- <revision-dir>
```

`--only` commits the named paths and keeps unrelated staged and working-tree changes as they were. Let hooks run. When the commit fails, keep the saved files: the outcome is **saved-uncommitted**.

Complete when: `git status --short -- <revision-dir>` prints nothing, and all other paths have the same status as before the commit.

### 5. Read back

Run, inside the repository:

```sh
node ../scripts/verify-captured-source.mjs <revision-dir>/source.json [--ref <rev>]
```

The script path is relative to this reference. The script reads the committed `source.json` and committed blobs at the ref (default `HEAD`). It checks the _original_ SHA-256 and byte count, and for each `derived` entry its SHA-256 and that `from_sha256` equals the _original_ SHA-256. It prints one `OK` line and exits 0, or prints one reason and exits 1.

- Reason starts with `not committed`: outcome **saved-uncommitted**.
- Any other reason: outcome **unverified**.

Complete when: the script printed `OK` for this record, or the outcome is set from its reason.

### 6. Derive

Optional; runs only after outcome **committed**. Write each _derived_ file in the revision directory, add its `derived` entry to `source.json`, then repeat [Commit](#4-commit) and [Read back](#5-read-back) for the same directory.

When extraction fails, the committed _original_ stays as it is and the outcome stays **committed**; report the extraction as retriable integration work.

Complete when: readback prints `OK` with the new `derived` count, or the failed extraction is reported as retriable.

## Outcomes

Report one outcome per source, with its revision path and the evidence that set it.

- **not captured**: no _original_ was acquired. Nothing is written. Report the exact gap and what the user can supply to resolve it.
- **saved-uncommitted**: the _original_ and `source.json` are on disk without a verified commit. Keep them as an unfinished capture; retry from [Commit](#4-commit).
- **unverified**: a commit exists but readback failed. Keep the commit and the files. Report the script reason, find the cause and correct it with a new commit, then repeat [Read back](#5-read-back). A size or SHA-256 mismatch on a text _original_ with CRLF line endings usually means a Git end-of-line filter normalized the blob; add `<raw-home>/** -text` to `.gitattributes`, commit it with the revision directory, and read back again.
- **committed**: readback printed `OK`. Report the path, SHA-256 and commit ID, then hand off to extraction and ingest. When later extraction or synthesis fails, the outcome stays **committed** and the report names the retriable integration work. A knowledge no-op also ends here.

**committed** means a local commit. It establishes no remote retention, and it authorizes no push; pushing is a separate decision that the user makes.
