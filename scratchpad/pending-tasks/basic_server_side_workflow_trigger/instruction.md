Backend applications use Knock to orchestrate notifications across channels without hardcoding delivery logic. 

You need to write a Node.js script using `@knocklabs/node` that initializes the Knock client and triggers a workflow named `new-comment`. In this trigger call, you must include a recipient (`user_123`), an actor (`user_456`), a custom data payload containing `comment_body: "Hello world!"`, and scope the trigger to a specific tenant (`team_789`).

**Constraints:**
- Use the `@knocklabs/node` SDK for the trigger implementation.
- The `KNOCK_API_KEY` must be loaded from standard environment variables.
- The output script must be self-contained and execute the trigger asynchronously.