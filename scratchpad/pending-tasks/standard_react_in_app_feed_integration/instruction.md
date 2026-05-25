Knock provides pre-built React components to rapidly deploy a notification inbox or feed within a client-side application.

You need to implement a standard React component that renders the Knock in-app feed. You must correctly wrap the application using `KnockProvider` and `KnockFeedProvider`, passing in the user ID and the appropriate public environment variables for the API key and feed channel ID. Finally, render the pre-built `NotificationFeed` component.

**Constraints:**
- Use `@knocklabs/react` and import its bundled CSS.
- Do NOT use headless UI hooks for this specific task; you must use the standard pre-built UI components.
- Rely on `NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY` and `NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID` for authentication.