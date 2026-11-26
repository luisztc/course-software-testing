# REQ-4.1: Global search remains stuck on archived notes

## Description and design basis

White-box, cross-view test. `frontend/app.js` handles `search-input` by re-rendering the current main view. `renderArchivedView()` does not apply the keyword and does not switch to active notes. In contrast, `renderNotesView()` filters active notes.

## Requirement and expected output

REQ-4.1 specifies that entering a keyword in the global Search control filters active notes by title or content. REQ-2.6 separates archived notes from active Notes. Entering a keyword while Archive is open should therefore show the matching active note, not leave an archived-only result. This does not require a prescribed navigation animation or layout.

## Difference from existing tests

`REQ-4.1.spec.ts` starts keyword search from the active Notes view. `REQ-2.6.spec.ts` separately checks archival transitions. Neither starts a keyword search after navigating into Archive.

Team 03's PR #6 reports a previous search hiding notes when subsequently selecting a label. The present case instead starts in Archive, enters a new keyword, and observes that the archive renderer continues showing archived notes without applying the active-note search. It exercises a different view and transition.

## Steps to reproduce

1. Create two notes with an identical unique prefix and distinct endings, `Active` and `Archive`.
2. Archive the second note using its own Archive action.
3. Select Archived in Sidebar and verify the archived note is visible.
4. Enter the common prefix in the global Search box.
5. Count the active and archived note regions by identity.

## Observed output

The active note remains absent and the archived note remains visible. Expected counts (active, archived) are `[1,0]`, but actual counts are `[0,1]`.

Evidence: `node fault-tests.cjs search-active-notes-from-archive` reports the count mismatch.
