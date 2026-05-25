### 1. Library Overview
*   **Description**: Knock is a notification-as-a-service platform that provides a unified API and set of UI components to power cross-channel product messaging (Email, SMS, Push, In-app, Slack, Discord). It centralizes notification logic, template management, and user preferences.
*   **Ecosystem Role**: It acts as the orchestration layer between an application and various delivery providers (SendGrid, Twilio, APNs, etc.), allowing developers to offload the complexity of routing, batching, and preference management.
*   **Project Setup**:
    1.  **Install dependencies**: `npm install @knocklabs/node @knocklabs/react`
    2.  **Environment Variables**:
        *   `KNOCK_API_KEY`: Secret key for server-side calls.
        *   `NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY`: Public key for client-side components.
        *   `NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID`: ID for the in-app feed channel.
    3.  **Initialize Client**: Wrap your app with `KnockProvider` and `KnockFeedProvider`.
    4.  **Backend Trigger**: Use the Node SDK to trigger workflows: `new Knock({ apiKey }).workflows.trigger(id, { recipients, data })`.
### 2. Core Primitives & APIs
*   **Workflows**: The core unit of notification logic. Encapsulates routing, timing (delays), and batching.
    *   [Workflow Triggering Guide](https://docs.knock.app/send-notifications/triggering-workflows/overview)
*   **Recipients**: Users or Objects (like a Project or Team) that receive notifications.
    *   [Identifying Recipients](https://docs.knock.app/managing-recipients/identifying-recipients)
*   **Feeds & UI Components**: Pre-built React components for in-app notifications.
    *   [React UI Components](https://docs.knock.app/in-app-ui/react/overview)
*   **Preferences**: Logic for allowing users to opt-in/out of specific channels or categories.
    *   [Preferences Overview](https://docs.knock.app/preferences/overview)
*   **Tenants**: Used for multi-tenant applications to scope feeds and apply per-tenant branding.
    *   [Tenants Documentation](https://docs.knock.app/multi-tenancy/overview)
**Code Snippets:**
*Server-side Trigger:*
```javascript
import Knock from "@knocklabs/node";
const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });
await knock.workflows.trigger("new-comment", {
  recipients: ["user_123"],
  actor: "user_456",
  data: { comment_body: "Hello world!" },
  tenant: "team_789"
});
```
*Client-side Feed (React):*
```jsx
import { KnockProvider, KnockFeedProvider, NotificationFeed } from "@knocklabs/react";
import "@knocklabs/react/dist/index.css";
<KnockProvider apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY} userId={userId}>
  <KnockFeedProvider feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID}>
    <NotificationFeed />
  </KnockFeedProvider>
</KnockProvider>
```
### 3. Real-World Use Cases & Templates
*   **Activity Feeds**: Mentions, likes, and comments in SaaS apps (e.g., Linear, Slack).
*   **Multi-tenant SaaS**: Scoping notifications to specific workspaces or organizations.
*   **Transactional Messaging**: Magic links, password resets, and billing alerts.
*   **Templates**: [Knock Example Apps Repository](https://github.com/knocklabs/example-apps) includes Next.js, React, and Mobile starters.
*   **Custom Inbox**: [Inbox Example App](https://github.com/knocklabs/inbox-example-app) shows how to build a custom UI using headless hooks.
### 4. Developer Friction Points
*   **HMAC/Security Configuration**: Implementing "Enhanced Security Mode" (HMAC) requires generating a JWT on the backend using RS256, which can be tricky to coordinate with client-side initialization. [Security Docs](https://docs.knock.app/in-app-ui/security-and-authentication).
*   **Environment Promotion Flow**: Knock uses a git-like commit system for workflows. Promoting changes from development to production requires a manual "Commit" and "Promote" step in the dashboard, which can be frustrating for developers used to pure code-based migrations. [Commits & Branches](https://docs.knock.app/version-control/commits).
*   **JWT Scoping for Tenants**: Restricting a user's feed access to specific tenants requires correctly formatting "grants" inside the JWT, which follows the UCAN specification and is often a source of configuration errors. [Scoping Tokens](https://docs.knock.app/in-app-ui/security-and-authentication#scoping-a-token-to-a-tenant).
### 5. Evaluation Ideas
*   **Basic**: Trigger a multi-channel workflow (Email + In-app) from a server action.
*   **Security**: Implement HMAC-signed user tokens to secure a client-side notification feed.
*   **Multi-tenancy**: Configure a feed that only shows notifications for the user's active "Workspace" using JWT grants.
*   **Preferences**: Build a custom React preference center that allows users to toggle "Marketing" vs "Transactional" notifications.
*   **Advanced Logic**: Set up a "Sliding Window" batching function that groups 10+ notifications into a single digest.
*   **Headless UI**: Build a completely custom notification list using the `useNotifications` hook instead of the pre-built component.
### 6. Sources
1.  [Knock Docs - llms.txt](https://docs.knock.app/llms.txt): Comprehensive index of documentation.
2.  [Knock Docs - Quick Start (Next.js)](https://docs.knock.app/getting-started/quick-start/nextjs): Standard integration path.
3.  [Knock Docs - Security & Auth](https://docs.knock.app/in-app-ui/security-and-authentication): Details on HMAC and JWT grants.
4.  [Knock Docs - Tenants](https://docs.knock.app/multi-tenancy/overview): Multi-tenancy architecture.
5.  [Knock GitHub - Javascript SDK](https://github.com/knocklabs/javascript/issues): Source for common developer issues and hydration errors.
6.  [G2 Reviews - Knock](https://www.g2.com/products/knock-knock/reviews): User feedback on learning curve and environment management.