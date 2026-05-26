const fs = require("fs");
const path = require("path");
const { Knock: KnockClient } = require("@knocklabs/node");
const { Knock: KnockMgmt } = require("@knocklabs/mgmt");

const runId = process.env.ZEALT_RUN_ID;
const apiToken = process.env.KNOCK_API_TOKEN;
const serviceToken = process.env.KNOCK_SERVICE_TOKEN;
const mailtrapDomain = process.env.MAILTRAP_DOMAIN;
const gmailUserName = process.env.GMAIL_USER_NAME;

if (!runId) {
  throw new Error("Missing ZEALT_RUN_ID environment variable.");
}
if (!apiToken) {
  throw new Error("Missing KNOCK_API_TOKEN environment variable.");
}
if (!serviceToken) {
  throw new Error("Missing KNOCK_SERVICE_TOKEN environment variable.");
}
if (!mailtrapDomain) {
  throw new Error("Missing MAILTRAP_DOMAIN environment variable.");
}
if (!gmailUserName) {
  throw new Error("Missing GMAIL_USER_NAME environment variable.");
}

const tenantId = `tenant-${runId}`;
const workflowKey = `tenant-welcome-${runId}`;
const recipientId = `user-${runId}`;
const recipientEmail = `${gmailUserName}+receiver-${runId}@gmail.com`;
const recipientName = `Tenant User ${runId}`;
const appName = `App ${runId}`;
const tenantName = `Tenant ${runId}`;
const primaryColor = "#3366FF";
const fromEmailAddress = `sender-${runId}@${mailtrapDomain}`;

const outputPath = path.join(__dirname, "output.log");

async function run() {
  const knock = new KnockClient(apiToken);
  const knockMgmt = new KnockMgmt({ apiKey: serviceToken });

  await knock.tenants.set(tenantId, {
    name: tenantName,
    settings: {
      branding: {
        primary_color: primaryColor,
      },
    },
    app_name: appName,
  });

  const workflowBody = {
    name: `Tenant Welcome ${runId}`,
    steps: [
      {
        ref: `email-step-${runId}`,
        name: "Tenant Welcome Email",
        type: "channel",
        channel_key: "mailtrap",
        templates: {
          subject: `Welcome to {{ tenant.app_name }} - ${runId}`,
          html: `<p>Hi {{ recipient.name }},</p><p>Welcome to {{ tenant.name }}!</p>`,
        },
        settings: {
          from_email_address: fromEmailAddress,
        },
      },
    ],
    environment: "development",
  };

  await knockMgmt.workflows.upsert(workflowKey, workflowBody);
  await knockMgmt.workflows.activate(workflowKey, { environment: "development" });

  const triggerResponse = await knock.workflows.trigger(workflowKey, {
    tenant: tenantId,
    recipients: [
      {
        id: recipientId,
        email: recipientEmail,
        name: recipientName,
      },
    ],
  });

  const workflowRunId = triggerResponse?.workflow_run_id || triggerResponse?.workflowRunId;
  if (!workflowRunId) {
    throw new Error("Workflow run ID missing from trigger response.");
  }

  const logLines = [
    `Tenant ID: ${tenantId}`,
    `Workflow Key: ${workflowKey}`,
    `Workflow Run ID: ${workflowRunId}`,
    `Recipient Email: ${recipientEmail}`,
  ];

  fs.appendFileSync(outputPath, `${logLines.join("\n")}\n`);

  console.log("Tenant workflow automation completed.");
  console.log(logLines.join("\n"));
}

run().catch((error) => {
  console.error("Automation failed:", error);
  process.exit(1);
});
