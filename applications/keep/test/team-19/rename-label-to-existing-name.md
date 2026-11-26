# REQ-3.3: Renaming to an existing label creates ambiguous identities

## Description and design basis

White-box boundary test. `frontend/app.js` checks for an existing business name in `createLabel()` but does not apply this condition in `saveLabel()`. Renaming a label to another label's exact name causes two sidebar actions with the same business identity.

## Requirement and expected output

REQ-3.3 identifies each user label by its business name and requires the rename to update the sidebar action. Two indistinguishable label actions violate that identity contract. A valid UI can reject the collision or resolve it without leaving duplicate actions; this test does not prescribe a message or merge policy.

## Difference from existing tests

`REQ-3.3.spec.ts` renames a label to a fresh name and checks membership and persistence. The new test chooses the name of a second, independently UI-created label. It is different from the active-note keyword-search and settings defects reported in PRs #1 and #3.

## Steps to reproduce

1. Open Edit Labels and create two isolated labels, ending in `-A` and `-B`.
2. Change `Label name ...-A` to the exact name of `...-B` and click `Save label ...-A`.
3. Close Edit Labels using Done and count sidebar buttons named `...-B`.
4. Reload the page and count again.

## Observed output

The sidebar contains two buttons named `...-B` rather than a single unambiguous entry. The duplicate label identities survive a reload.

Evidence: `node fault-tests.cjs rename-label-to-existing-name` compares the counts before and after reload to `[1,1]`.
