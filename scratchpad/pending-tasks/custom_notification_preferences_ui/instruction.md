A robust notification system requires a preference center allowing users to control what messages they receive and where (e.g., opting out of marketing emails but keeping transactional alerts).

You need to build a custom React preference center component using Knock's preference API hooks (e.g., `usePreferences`). The component must display toggle inputs allowing a user to specifically opt-in or opt-out of "Marketing" versus "Transactional" workflow categories across their email channel.

**Constraints:**
- Must interface directly with the Knock preferences API to persist state; do not use a mocked local React state.
- Ensure the UI handles loading states while the preferences are being fetched or updated.
- The preference updates must specifically target workflow categories, not individual workflow IDs.