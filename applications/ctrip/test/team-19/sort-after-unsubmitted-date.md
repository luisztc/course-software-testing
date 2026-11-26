# REQ-2.10: Sorting silently changes the matching flight inventory

## Description and design basis

White-box transition test. In `frontend/pages-flights.js`, the date picker's `onSelect` updates `view.date` without refreshing the list. `visibleFlights()` later uses that unsubmitted value when a sort button calls `renderFlightsList()`.

## Requirement and expected behavior

REQ-2.10 explicitly states that sorting preserves flight identities. REQ-2.7 describes updating the matching list by clicking Update results after selecting a new date. For Chengdu–Guangzhou on July 21 the published inventory contains CZ3401, JD5162 and MU5234; July 22 contains only CZ3401. Editing the date alone leaves the original displayed inventory unchanged. Price sorting must order those three displayed flights by fare, not silently submit different search criteria.

## Difference from existing tests

The baseline REQ-2.7 case submits the new date before inspecting results. REQ-2.10 sorts an unchanged list. This case interleaves an unsubmitted, valid date edit and a sort. Team 12's PR #2 exercises a rejected route followed by filtering; this case instead uses a valid calendar selection, never submits or rejects the criteria, and checks the distinct sort interaction. Both concern criteria state, so the TA should determine whether they qualify as separate faults.

## Reproduction steps

1. Search Chengdu to Guangzhou, departure 2026-07-21.
2. Verify three flight cards: CZ3401, JD5162, MU5234.
3. Select 2026-07-22 from the results form's Departure date calendar; do not click Update results. Verify the three original cards remain.
4. Click Price: low to high and observe the list.

## Actual behavior and evidence

Only CZ3401 remains. JD5162 and MU5234 disappear, even though the user requested sorting, not a new search. The test reports `FAIL sort-after-unsubmitted-date` with actual `[Flight CZ3401]` instead of the three flight identities in ascending fare order.

Run `node fault-tests.cjs sort-after-unsubmitted-date` after following the setup in README.md. The expected output is based on the supplied requirements and fixture, not a live flight service.
