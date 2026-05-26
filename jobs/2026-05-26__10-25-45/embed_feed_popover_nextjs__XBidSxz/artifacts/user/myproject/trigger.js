const { KnockMgmt } = require("@knocklabs/mgmt");
const { Knock } = require("@knocklabs/node");

async function trigger() {
  const runId = process.env.ZEALT_RUN_ID;
  const apiKey = process.env.KNOCK_API_TOKEN; // secret key for node SDK

  if (!runId || !apiKey) {
    console.error("Missing ZEALT_RUN_ID or KNOCK_API_TOKEN");
    process.exit(1);
  }

  const knock = new Knock(apiKey);
  const workflowKey = `popover-demo-${runId}`;

  try {
    console.log(`Triggering workflow: ${workflowKey}`);
    
    await knock.workflows.trigger(workflowKey, {
      recipients: [`popover-user-${runId}`],
      data: {
        body: `hello from popover ${runId}`
      }
    });

    console.log("Trigger successful.");
  } catch (error) {
    console.error("Failed to trigger workflow:", error);
    process.exit(1);
  }
}

trigger();
