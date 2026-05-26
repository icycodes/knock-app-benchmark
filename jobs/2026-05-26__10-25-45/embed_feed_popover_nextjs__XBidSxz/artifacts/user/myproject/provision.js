const { KnockMgmt } = require("@knocklabs/mgmt");

async function provision() {
  const runId = process.env.ZEALT_RUN_ID;
  const serviceToken = process.env.KNOCK_SERVICE_TOKEN;

  if (!runId || !serviceToken) {
    console.error("Missing ZEALT_RUN_ID or KNOCK_SERVICE_TOKEN");
    process.exit(1);
  }

  const knock = new KnockMgmt({ apiKey: serviceToken });
  const workflowKey = `popover-demo-${runId}`;

  try {
    console.log(`Provisioning workflow: ${workflowKey}`);
    
    // Create or update the workflow
    await knock.workflows.upsert(workflowKey, {
      workflow: {
        name: `Popover Demo ${runId}`,
        steps: [
          {
            ref: "in_app_feed_1",
            type: "channel",
            channel_key: "in-app",
            template: {
              markdown_body: "{{ data.body }}",
              action_url: ""
            }
          }
        ]
      }
    });

    // Activate the workflow in the development environment
    console.log(`Activating workflow: ${workflowKey}`);
    await knock.workflows.activate(workflowKey, { environment: "development" });
    
    console.log("Provisioning successful.");
  } catch (error) {
    console.error("Failed to provision workflow:", JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

provision();
