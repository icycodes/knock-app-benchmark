Sometimes the pre-built Knock components do not match a strict custom design system, requiring a "headless" approach to extract the data while bringing your own DOM elements.

You need to build a fully custom React notification list component using the headless `useNotifications` hook (or `@knocklabs/react-core` equivalents). The component should iterate through the fetched notification items and render a standard HTML `<ul>` and `<li>` list containing the text of each notification.

**Constraints:**
- Do NOT import or render the `<NotificationFeed />` component.
- You must handle and render the empty state (when there are no notifications) gracefully.
- Include a button on each rendered list item that calls a function to mark that specific notification as read.