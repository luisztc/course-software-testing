# REQ-2.5 / REQ-2.6: Reusing a search resets traveler and cabin preferences (candidate)

## Description and design basis

White-box test. In `frontend/pages-core.js`, `saveSearchHistory()` records route/date but not cabin or children, and `renderHomeHistory()` passes Economy and false explicitly when replaying a saved search.

## Requirement and expected behavior

REQ-2.5 requires the selected cabin and children preference to carry into flight results. REQ-2.6 provides direct reuse of saved search criteria. Combining the two, a repeated search should reasonably retain the preferences originally used in that search.

**Scope caveat:** REQ-2.6 expressly guarantees only route and date on history replay, not traveler/cabin preferences. This is a reproducible user-visible inconsistency and a candidate test, but its eligibility for bonus credit is not certain.

## Difference from existing tests

REQ-2.5 baseline covers a fresh search; REQ-2.6 baseline opens the seeded route history with default preferences. This case creates a fresh history entry via UI with non-default preferences and then reuses it.

## Reproduction steps

1. Select Traveling with children and Business on the homepage.
2. Search Chengdu to Guangzhou for 2026-07-22. Verify Business and Children included on Flight results.
3. Reload, return Home, and activate the July 22 Chengdu–Guangzhou entry in Search history.
4. Inspect Cabin class and the Children included marker.

## Actual behavior and evidence

The route and date are restored, but Business becomes Economy and Children included disappears. `node fault-tests.cjs history-loses-preferences` reports a failed assertion: `{cabin: 'Economy', children: false}` instead of `{cabin: 'Business', children: true}`.

Follow the local setup in README.md. No real user account or external service is used.
