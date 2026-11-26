# Ctrip fault-revealing tests — Team 19

Team leader: `luisztc` (Team 19). Other team members should be listed by the team before submission if applicable.

| Case | Requirement | Reproduction |
|---|---|---|
| [Fare on a route with no inventory](empty-route-fare.md) | REQ-2.4, REQ-2.8 | `empty-route-fare` |
| [Past date typed directly into search](typed-past-date.md) | REQ-2.3 | `typed-past-date` |
| [Sorting after an unsubmitted date edit](sort-after-unsubmitted-date.md) | REQ-2.7, REQ-2.10 | `sort-after-unsubmitted-date` |
| [Saved search loses preferences (candidate)](history-loses-preferences.md) | REQ-2.5, REQ-2.6 | `history-loses-preferences` |

## Run

Start the original application from `applications/ctrip` with `python start.py --port 4173`. These are UI-only tests using Playwright's JavaScript library; standard Node.js and an installed Chromium browser are required. In a separate terminal, run from this directory:

```powershell
npm install --no-save --no-package-lock playwright
npx playwright install chromium
$env:BASE_URL='http://127.0.0.1:4173'
node fault-tests.cjs
```

To reproduce just one test, append its case identifier. A `FAIL` is an assertion against actual UI behavior; `ERROR` indicates a setup/interaction problem. A nonzero exit status is expected on the supplied defective implementation. Install dependencies locally only; do not commit `node_modules` or generated state.

Local runs used Chromium against the unmodified course implementation. The normative expected behavior comes from the supplied requirements and published fixture data; no external reference instance was available. We checked the corresponding baseline tests to distinguish the additional scenarios. No application code is changed.

The direct typing scenario is distinct from Team 12's PR #2 monthly-fares-date-button scenario, but the subsequently inspected Team 05 PR #15 reports the same homepage typed-past-departure behavior. Do not assume duplicate cases will earn credit. The sorting case extends the covered transition beyond the baseline; it shares a criteria-state theme with Team 12 PR #2, as discussed in its report. The history case has an explicit requirement-scope caveat. All four cases locally reached their final behavioral assertions; credit remains subject to TA review. Other independently reproduced cases that clearly overlapped prior PRs are not included.

Suggested PR title: `[Ctrip][Team 19] Add fault-revealing tests`

