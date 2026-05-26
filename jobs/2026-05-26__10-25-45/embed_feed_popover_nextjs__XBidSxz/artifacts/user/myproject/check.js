const { KnockMgmt } = require("@knocklabs/mgmt");

async function check() {
  const serviceToken = process.env.KNOCK_SERVICE_TOKEN;
  const knock = new KnockMgmt({ apiKey: serviceToken });

  try {
    const envs = await knock.environments.list();
    console.log(envs);
  } catch (error) {
    console.error(error);
  }
}

check();
