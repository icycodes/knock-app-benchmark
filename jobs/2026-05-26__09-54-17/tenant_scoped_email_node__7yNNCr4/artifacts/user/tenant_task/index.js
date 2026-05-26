const { Knock } = require("@knocklabs/node");
const KnockManagement = require("@knocklabs/mgmt");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function run() {
  const runId = process.env.ZEALT_RUN_ID;
  const knockApiToken = process.env.KNOCK_API_TOKEN;
  const knockServiceToken = process.env.KNOCK_SERVICE_TOKEN;
  const mailtrapDomain = process.env.MAILTRAP_DOMAIN;
  const gmailUserName = process.env.GMAIL_USER_NAME;

  if (!runId || !knockApiToken || !knockServiceToken || !mailtrapDomain || !gmailUserName) {
    console.error("Missing required environment variables");
    process.exit(1);
  }

  const knock = new Knock(knockApiToken);
  const mgmt = new KnockManagement(knockServiceToken);

  const tenantId = `tenant-${runId}`;
  const workflowKey = `tenant-welcome-${runId}`;
  const userId = `user-${runId}`;
  const recipientEmail = `${gmailUserName}+receiver-${runId}@gmail.com`;

  console.log(`Setting tenant: ${tenantId}`);
  await knock.tenants.set(tenantId, {
    name: `Tenant ${runId}`,
    settings: {
      branding: {
        primary_color: "#0000FF",
      },
    },
    app_name: `App ${runId}`,
  });

  console.log(`Upserting workflow: ${workflowKey}`);
  await mgmt.workflows.upsert(workflowKey, {
    environment: "development",
    workflow: {
      name: `Tenant Welcome Workflow ${runId}`,
      steps: [
        {
          type: "channel",
          channel_key: "mailtrap",
          ref: "email_step",
          template: {
            subject: "Welcome to {{ tenant.app_name }}",
            html_body: "Hi {{ recipient.name }}, welcome to {{ tenant.name }}!",
            settings: {
              from_email_address: `sender-${runId}@${mailtrapDomain}`,
            },
          },
        },
      ],
    },
  });

  console.log(`Activating workflow: ${workflowKey}`);
  await mgmt.workflows.activate(workflowKey, {
    environment: "development",
  });

  console.log("Committing all changes...");
  await mgmt.commits.commitAll({
    environment: "development",
    message: "Automated commit",
  });

  console.log(`Triggering workflow: ${workflowKey}`);
  const { workflow_run_id } = await knock.workflows.trigger(workflowKey, {
    tenant: tenantId,
    recipients: [
      {
        id: userId,
        email: recipientEmail,
        name: `User ${runId}`,
      },
    ],
  }, {
    knockEnvironment: "development"
  });

  const logFile = path.join(__dirname, "output.log");
  const logContent = [
    `Tenant ID: ${tenantId}`,
    `Workflow Key: ${workflowKey}`,
    `Workflow Run ID: ${workflow_run_id}`,
    `Recipient Email: ${recipientEmail}`,
  ].join("\n") + "\n";

  fs.writeFileSync(logFile, logContent);
  console.log("Automation completed successfully.");
}

run().catch((err) => {
  if (err.error && err.error.errors) {
    console.error("Validation errors:", JSON.stringify(err.error.errors, null, 2));
  }
  console.error("Error running automation:", err);
  process.exit(1);
});
