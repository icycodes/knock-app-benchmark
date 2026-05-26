const { KnockMgmt } = require("@knocklabs/mgmt");

async function commit() {
  const serviceToken = process.env.KNOCK_SERVICE_TOKEN;
  const knock = new KnockMgmt({ apiKey: serviceToken });

  try {
    const runId = process.env.ZEALT_RUN_ID;
    await knock.commits.commitAll({
      environment: "development",
      commit_message: `Commit workflow for ${runId}`
    });
    console.log("Committed all changes.");
  } catch (error) {
    console.error(error);
  }
}

commit();
