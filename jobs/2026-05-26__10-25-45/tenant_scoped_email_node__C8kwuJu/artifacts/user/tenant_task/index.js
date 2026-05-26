"use strict";

const fs = require("fs");
const path = require("path");
const { Knock } = require("@knocklabs/node");
const { KnockMgmt } = require("@knocklabs/mgmt");

// ── Environment ──────────────────────────────────────────────────────────────
const KNOCK_API_TOKEN = process.env.KNOCK_API_TOKEN;
const KNOCK_SERVICE_TOKEN = process.env.KNOCK_SERVICE_TOKEN;
const GMAIL_USER_NAME = process.env.GMAIL_USER_NAME;
const MAILTRAP_DOMAIN = process.env.MAILTRAP_DOMAIN;
const RUN_ID = process.env.ZEALT_RUN_ID;

if (!KNOCK_API_TOKEN) throw new Error("KNOCK_API_TOKEN is required");
if (!KNOCK_SERVICE_TOKEN) throw new Error("KNOCK_SERVICE_TOKEN is required");
if (!GMAIL_USER_NAME) throw new Error("GMAIL_USER_NAME is required");
if (!MAILTRAP_DOMAIN) throw new Error("MAILTRAP_DOMAIN is required");
if (!RUN_ID) throw new Error("ZEALT_RUN_ID is required");

// ── Resource identifiers ─────────────────────────────────────────────────────
const TENANT_ID = `tenant-${RUN_ID}`;
const WORKFLOW_KEY = `tenant-welcome-${RUN_ID}`;
const RECIPIENT_ID = `user-${RUN_ID}`;
const RECIPIENT_EMAIL = `${GMAIL_USER_NAME}+receiver-${RUN_ID}@gmail.com`;
const FROM_EMAIL = `sender-${RUN_ID}@${MAILTRAP_DOMAIN}`;
const APP_NAME = `Acme App ${RUN_ID}`;
const PRIMARY_COLOR = "#4F46E5";
const LOG_FILE = path.join(__dirname, "output.log");

// ── Clients ───────────────────────────────────────────────────────────────────
const knock = new Knock({ apiKey: KNOCK_API_TOKEN });
const mgmt = new KnockMgmt({ apiKey: KNOCK_SERVICE_TOKEN });

async function main() {
  // ── 1. Set tenant ─────────────────────────────────────────────────────────
  console.log(`[1/4] Setting tenant: ${TENANT_ID}`);
  await knock.tenants.set(TENANT_ID, {
    name: `Tenant ${RUN_ID}`,
    settings: {
      branding: {
        primary_color: PRIMARY_COLOR,
      },
    },
    app_name: APP_NAME,
  });
  console.log(`      Tenant set OK (app_name="${APP_NAME}", primary_color="${PRIMARY_COLOR}")`);

  // ── 2. Upsert workflow ────────────────────────────────────────────────────
  console.log(`[2/4] Upserting workflow: ${WORKFLOW_KEY}`);
  await mgmt.workflows.upsert(WORKFLOW_KEY, {
    environment: "development",
    workflow: {
      name: `Tenant Welcome ${RUN_ID}`,
      steps: [
        {
          ref: "email_step",
          type: "channel",
          channel_key: "mailtrap",
          channel_type: "email",
          template: {
            settings: {
              layout_key: null,
            },
            subject: `Welcome from {{ tenant.app_name }}`,
            html_body: `<p>Hello {{ recipient.name }},</p><p>You have been invited to join <strong>{{ tenant.name }}</strong>. We are excited to have you!</p>`,
          },
          channel_overrides: {
            from_address: FROM_EMAIL,
          },
        },
      ],
    },
  });
  console.log(`      Workflow upserted OK`);

  // ── 3. Commit workflow to development environment ─────────────────────────
  console.log(`[3/5] Committing workflow: ${WORKFLOW_KEY}`);
  await mgmt.commits.commitAll({
    environment: "development",
    resource_type: "workflow",
    resource_id: WORKFLOW_KEY,
    commit_message: `Upsert tenant-welcome workflow for run ${RUN_ID}`,
  });
  console.log(`      Workflow committed OK`);

  // ── 4. Activate workflow ──────────────────────────────────────────────────
  console.log(`[4/5] Activating workflow: ${WORKFLOW_KEY}`);
  await mgmt.workflows.activate(WORKFLOW_KEY, {
    environment: "development",
    status: true,
  });
  console.log(`      Workflow activated OK`);

  // ── 5. Trigger workflow ───────────────────────────────────────────────────
  console.log(`[5/5] Triggering workflow: ${WORKFLOW_KEY}`);
  const triggerResult = await knock.workflows.trigger(WORKFLOW_KEY, {
    tenant: TENANT_ID,
    recipients: [
      {
        id: RECIPIENT_ID,
        email: RECIPIENT_EMAIL,
        name: `Receiver ${RUN_ID}`,
      },
    ],
  });
  const workflowRunId = triggerResult.workflow_run_id;
  console.log(`      Workflow triggered OK (run_id=${workflowRunId})`);

  // ── 5. Write log file ─────────────────────────────────────────────────────
  const logLines = [
    `Tenant ID: ${TENANT_ID}`,
    `Workflow Key: ${WORKFLOW_KEY}`,
    `Workflow Run ID: ${workflowRunId}`,
    `Recipient Email: ${RECIPIENT_EMAIL}`,
  ].join("\n") + "\n";

  fs.writeFileSync(LOG_FILE, logLines, "utf8");
  console.log(`\nLog written to ${LOG_FILE}:`);
  console.log(logLines.trimEnd());
}

main().catch((err) => {
  console.error("Fatal error:", err?.error ?? err);
  process.exit(1);
});
