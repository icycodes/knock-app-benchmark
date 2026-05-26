const { KnockMgmt } = require("@knocklabs/mgmt");

async function checkMethods() {
  const serviceToken = process.env.KNOCK_SERVICE_TOKEN;
  const knock = new KnockMgmt({ apiKey: serviceToken });
  
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(knock.commits)));
}

checkMethods();
