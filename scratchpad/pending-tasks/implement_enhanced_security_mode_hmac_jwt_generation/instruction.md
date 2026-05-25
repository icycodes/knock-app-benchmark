To prevent bad actors from spoofing user IDs on the client, Knock's "Enhanced Security Mode" requires generating a securely signed JWT on the server to pass down to the client side.

You need to write a Node.js utility function that generates an HMAC JWT for client-side authentication. The function must take a `userId` as input and sign the payload using the RS256 algorithm with a private signing key provided via an environment variable. 

**Constraints:**
- The JWT payload must appropriately identify the `sub` (subject) as the user ID.
- The token MUST be signed using the `RS256` algorithm; symmetric algorithms (like HS256) will fail Knock's validation.
- Do NOT expose or hardcode any private keys in the code snippet.