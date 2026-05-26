const { KnockMgmt } = require("@knocklabs/mgmt");

async function checkWorkflow() {
  const serviceToken = process.env.KNOCK_SERVICE_TOKEN;
  const knock = new KnockMgmt({ apiKey: serviceToken });
  const runId = process.env.ZEALT_RUN_ID;
  const workflowKey = `popover-demo-${runId}`;

  try {
    const wf = await knock.workflows.retrieve(workflowKey);
    console.log(wf);
  } catch (error) {
    console.error(error);
  }
}

checkWorkflow();
