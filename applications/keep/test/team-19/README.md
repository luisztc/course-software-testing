# Keep fault-revealing tests — Team 19

Team leader: `luisztc`. These additional cases were explored after reproducing faults in our assigned Ctrip application.

| Case | Requirement | Reproduction |
|---|---|---|
| [Search active notes from Archive](search-active-notes-from-archive.md) | REQ-4.1, REQ-2.6 | `search-active-notes-from-archive` |
| [Rename a label to an existing name](rename-label-to-existing-name.md) | REQ-3.3 | `rename-label-to-existing-name` |

Start the unmodified Keep application from `applications/keep` using `node start.cjs --port 4175`. In a separate terminal, run from this team directory:

```powershell
npm install --no-save --no-package-lock playwright
npx playwright install chromium
$env:BASE_URL='http://127.0.0.1:4175'
node fault-tests.cjs
```

Append a case identifier to reproduce it independently. Tests create uniquely named notes through normal UI operations. Run against a disposable local course instance, not your real notes. The expected results are based on the supplied requirements; the target was tested locally with Chromium. No external reference instance was run. Do not commit dependencies or runtime data.

An independently reproduced search capitalization defect overlaps other teams' PRs #1, #3 and #6, so it was excluded. PR #6's stale search during label navigation is also distinct from the Archive-to-keyword-search transition reported here. The label collision case targets business-name identity, not a particular validation message. Both cases reached behavioral assertions in local runs; bonus eligibility remains subject to TA review.

Suggested PR title: `[Keep][Team 19] Add fault-revealing tests`
