# Matt Pocock Skills: provenance and coverage

This is the source-of-truth audit for Matt Pocock material retained in the
Devpunks skill library.

## Audit snapshot

- Checked: 2026-08-12
- Curated catalog: <https://www.aihero.dev/skills>
- Upstream repository: <https://github.com/mattpocock/skills>
- Compared GitHub snapshot: `84fdeffd12f2ee307994d1eb6feb48173b6e0502`
- Upstream license SHA-256: `0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5`

The local files below are the only direct Matt-derived skills in this repo.
Each directory carries an adjacent `LICENSE` copied from the upstream root
license and an `UPSTREAM.md` with its immutable source commit. The local
adaptations remain intentionally customized; this audit does not replace them
with upstream files.

## Direct Matt-derived skills

| Local skill | Upstream skill | Relationship | Imported source |
| --- | --- | --- | --- |
| `agnostic/docs/writing-beats` | `in-progress/writing-beats` | adapted | [`694fa303`](https://github.com/mattpocock/skills/tree/694fa30311e02c2639942308513555e61ee84a6f/skills/in-progress/writing-beats) |
| `agnostic/docs/writing-fragments` | `in-progress/writing-fragments` | adapted | [`694fa303`](https://github.com/mattpocock/skills/tree/694fa30311e02c2639942308513555e61ee84a6f/skills/in-progress/writing-fragments) |
| `agnostic/docs/writing-shape` | `in-progress/writing-shape` | adapted | [`694fa303`](https://github.com/mattpocock/skills/tree/694fa30311e02c2639942308513555e61ee84a6f/skills/in-progress/writing-shape) |
| `agnostic/docs/writing-for-agents` | `productivity/writing-for-agents` | imported unchanged | [`2ffb184f`](https://github.com/mattpocock/skills/tree/2ffb184ffbb752faa664c0b204f3c9241b1428e9/skills/productivity/writing-for-agents) |
| `agnostic/generic/handoff` | `productivity/handoff` | adapted | [`221ffca9`](https://github.com/mattpocock/skills/tree/221ffca96736afefdc08ca7cf0b3965e9ea83f41/skills/productivity/handoff) |
| `agnostic/quality/codebase-design` | `engineering/codebase-design` | adapted | [`221ffca9`](https://github.com/mattpocock/skills/tree/221ffca96736afefdc08ca7cf0b3965e9ea83f41/skills/engineering/codebase-design) |
| `agnostic/quality/review` | `in-progress/review` | adapted | [`801dca68`](https://github.com/mattpocock/skills/tree/801dca688564c529fa84f247f64472520d9ebe28/skills/in-progress/review) |
| `agnostic/quality/tdd` | `engineering/tdd` | adapted | [`62f43a18`](https://github.com/mattpocock/skills/tree/62f43a18177be6ec82da242e59ffbc490a4c22ea/skills/engineering/tdd) |
| `agnostic/requirements/grilling` | `in-progress/batch-grill-me` | imported with local contract | [`9603c1cc`](https://github.com/mattpocock/skills/tree/9603c1cc8118d08bc1b3bf34cf714f62178dea3b/skills/in-progress/batch-grill-me) |
| `agnostic/research/improve-codebase-architecture` | `engineering/improve-codebase-architecture` | adapted | [`62f43a18`](https://github.com/mattpocock/skills/tree/62f43a18177be6ec82da242e59ffbc490a4c22ea/skills/engineering/improve-codebase-architecture) |
| `agnostic/research/prototype` | `engineering/prototype` | adapted | [`2ffb184f`](https://github.com/mattpocock/skills/tree/2ffb184ffbb752faa664c0b204f3c9241b1428e9/skills/engineering/prototype) |
| `misc/wait-what` | `productivity/wait-what` | imported unchanged | [`2ffb184f`](https://github.com/mattpocock/skills/tree/2ffb184ffbb752faa664c0b204f3c9241b1428e9/skills/productivity/wait-what) |

The retained writing skills were in upstream `skills/in-progress` at import
time, so they remain licensed and attributed even though they are not part of
the current curated page.

## Indirect derivative with Matt's retained license

`frameworks/effect/effect-service-design` is adapted from Dillon Mulroy's
`dmmulroy/skills` at commit
`8603380821fee6a77c82639f364ce8fe4f5a92be`. Dillon's source repository
retains the same Matt Pocock MIT license, so the local skill keeps that exact
license and now documents the full attribution chain in its adjacent
`UPSTREAM.md`. It is not counted as one of Matt's direct catalog skills.

## Comparison with the current AI Hero catalog

The AI Hero page currently lists 25 curated skills. A dash means the local
repo does not carry that skill. “Local analogue” means a Devpunks skill with a
similar role, not copied Matt material, and therefore it does not receive
Matt's license or attribution solely because the names overlap.

| AI Hero skill | Local coverage |
| --- | --- |
| `setup-matt-pocock-skills` | — |
| `ask-matt` | — |
| `grill-with-docs` | — |
| `to-spec` | local analogue: `agnostic/planning/create-spec` |
| `to-tickets` | local analogue: `agnostic/requirements/write-backlog` |
| `implement` | local analogue: `agnostic/planning/implement-spec` |
| `code-review` | direct adaptation: `agnostic/quality/review` |
| `wayfinder` | local analogue: `agnostic/planning/wayfinder` |
| `prototype` | direct adaptation: `agnostic/research/prototype` |
| `research` | local analogue: `agnostic/research/parallel-research` |
| `improve-codebase-architecture` | direct adaptation: `agnostic/research/improve-codebase-architecture` |
| `diagnosing-bugs` | local analogue: `agnostic/debug/debug-agent` |
| `resolving-merge-conflicts` | — |
| `triage` | — |
| `wizard` | — |
| `grill-me` | — |
| `handoff` | direct adaptation: `agnostic/generic/handoff` |
| `to-questionnaire` | — |
| `teach` | — |
| `wait-what` | imported unchanged: `misc/wait-what` |
| `writing-for-agents` | imported unchanged: `agnostic/docs/writing-for-agents` |
| `codebase-design` | direct adaptation: `agnostic/quality/codebase-design` |
| `domain-modeling` | — |
| `grilling` | direct adaptation: `agnostic/requirements/grilling` |
| `tdd` | direct adaptation: `agnostic/quality/tdd` |

## MIT license notice

The adjacent `LICENSE` files for the direct Matt-derived skills preserve the
upstream notice exactly:

MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
