# Ctrip fault-revealing tests — Team 19

Team leader: `luisztc` (Team 19). Other team members should be listed by the team before submission if applicable.

| Case | Requirement | Reproduction |
|---|---|---|
| [Fare on a route with no inventory](empty-route-fare.md) | REQ-2.4, REQ-2.8 | `empty-route-fare` |
| [Past date typed directly into search](typed-past-date.md) | REQ-2.3 | `typed-past-date` |

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

The direct typing scenario is distinct from Team 12's PR #2 monthly-fares-date-button scenario: it exercises the homepage text field and `submitQuickSearch`, not the results dialog's generated date actions. Other independently reproduced cases that overlapped PR #2 are not included.

Suggested PR title: `[Ctrip][Team 19] Add fault-revealing tests`

