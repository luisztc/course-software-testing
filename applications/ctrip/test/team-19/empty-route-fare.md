# REQ-2.8: Date bar displays a fare for an empty route

## Description and design basis

White-box test of the interaction between route search and fare navigation. `frontend/pages-flights.js`, `renderDateBar()`, gets a fare from `CALENDAR_FARES[iso]` independently of the selected route. `frontend/flights.js`, `flightsFor()`, returns no published matches for Beihai–Mars City.

## Requirement and expected output

REQ-2.4 defines the empty route. REQ-2.8 describes nearby minimum fares and selecting a date to refresh its flight list. A numeric advertised minimum fare should correspond to an available published flight for the current route and date; an empty route may display an unavailable/check-fares indicator instead.

## Difference from existing tests

`REQ-2.8.spec.ts` checks the ¥320 fare for Chengdu–Guangzhou on July 22. `REQ-2.4.spec.ts` checks empty Beihai–Mars City on July 23. Neither combines the empty-route search with fare/date navigation to July 22.

## Steps to reproduce

1. On the homepage search Beihai to Mars City for 2026-07-23.
2. Verify No flights found.
3. Inspect the July 22 action in Date bar, then click it.
4. Wait for the departure field to become 2026-07-22 and inspect matching flights.

## Observed output

The date bar advertises `¥320` for July 22, but changing to that date displays No flights found. No published matching flight substantiates that fare.

Evidence: `node fault-tests.cjs empty-route-fare` reports `FAIL ... No matching flights on July 22, but date bar advertises "2026-07-22\n¥320"`.
