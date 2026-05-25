In a multi-tenant SaaS application, a user might belong to multiple workspaces. They should only see in-app notifications relevant to the workspace they are currently viewing.

You need to modify a JWT generation script to include UCAN-formatted grants that restrict the Knock token's access solely to a specific tenant (e.g., `team_789`). Ensure the generated token passes these grants according to Knock's specific UCAN specification.

**Constraints:**
- The grants must be strictly formatted under the `grants` property within the JWT payload.
- The token must limit read access to the specific tenant ID provided.
- Do not rely on client-side filtering; the security boundary must be enforced within the token payload itself.