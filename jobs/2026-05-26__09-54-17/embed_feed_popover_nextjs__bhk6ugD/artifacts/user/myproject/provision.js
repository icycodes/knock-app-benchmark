const { KnockMgmt } = require("@knocklabs/mgmt");

const runId = process.env.ZEALT_RUN_ID;
const serviceToken = process.env.KNOCK_SERVICE_TOKEN;

const knock = new KnockMgmt({ bearerToken: serviceToken });

async function provision() {
  const workflowKey = `popover-demo-${runId}`;
  
  console.log(`Provisioning workflow: ${workflowKey}`);
  
  try {
    const workflow = await knock.workflows.upsert(workflowKey, {
      workflow: {
        name: `Popover Demo ${runId}`,
        active: true,
        steps: [
          {
            type: "channel",
            channel_key: "in-app",
            ref: "in-app-step",
            template: {
              markdown_body: "{{ data.body }}",
              action_url: "{{ data.action_url }}"
            },
          },
        ],
      }
    });
    
    console.log("Workflow provisioned successfully");
  } catch (error) {
    console.error("Error provisioning workflow:", JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

provision();
