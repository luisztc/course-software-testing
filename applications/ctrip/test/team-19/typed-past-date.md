# REQ-2.3: Editable departure field permits a prohibited past date

## Description and design basis

White-box, input-boundary test. `frontend/pages-core.js`, `submitQuickSearch()`, checks whether the date string is empty but does not compare it with `BUSINESS_MIN_DATE`. The same page's calendar disables departure dates earlier than that boundary.

## Requirement and expected output

REQ-2.3 specifies that 2026-07-18 is disabled because it precedes July 19, the supplied clock date. The editable Departure date textbox and Search flights action should not accept that same prohibited date as a valid query. No exact validation-message wording is assumed.

## Difference from existing tests

`REQ-2.3.spec.ts` checks the disabled calendar action only. It does not use the public editable field followed by Search flights. Team 12's PR #2 covers the monthly-fares dialog's enabled past-date action; this case exercises the homepage's direct text input and independent `submitQuickSearch()` path, rather than that dialog.

## Steps to reproduce

1. Open the initial one-way search form.
2. Type `2026-07-18` directly into Departure date without selecting the disabled calendar action.
3. Click Search flights.
4. Observe whether the application enters the results route.

## Observed output

The application accepts the past date and navigates to Flight results.

Evidence: `node fault-tests.cjs typed-past-date` reports `FAIL ... Past departure date was accepted and results opened`.
