const { Knock } = require('@knocklabs/node');
const { KnockMgmt } = require('@knocklabs/mgmt');
const fs = require('fs');

async function main() {
    const runId = process.env.ZEALT_RUN_ID || 'local-run';
    const knockApiToken = process.env.KNOCK_API_TOKEN;
    const knockServiceToken = process.env.KNOCK_SERVICE_TOKEN;
    const gmailUserName = process.env.GMAIL_USER_NAME || 'test';
    const mailtrapDomain = process.env.MAILTRAP_DOMAIN || 'example.com';

    if (!knockApiToken) {
        console.error("KNOCK_API_TOKEN is not set");
        process.exit(1);
    }
    
    const knock = new Knock({ apiKey: knockApiToken });
    const mgmtClient = new KnockMgmt({ serviceToken: knockServiceToken });

    const tenantId = `tenant-${runId}`;
    console.log("Setting tenant...");
    await knock.tenants.set(tenantId, {
        name: `Tenant ${runId}`,
        settings: {
            branding: {
                primary_color: "#FF5733"
            }
        },
        app_name: `App ${runId}`
    });

    const workflowKey = `tenant-welcome-${runId}`;
    const workflowData = {
        name: `Tenant Welcome ${runId}`,
        key: workflowKey,
        steps: [
            {
                type: "channel",
                ref: "email_step",
                channel_key: "mailtrap",
                settings: {
                    from_email_address: `sender-${runId}@${mailtrapDomain}`
                },
                template: {
                    settings: {},
                    subject: `Welcome to {{ tenant.app_name }}`,
                    html_body: `<p>Hi {{ recipient.name }},</p><p>Welcome to {{ tenant.name }}!</p>`
                }
            }
        ]
    };

    console.log("Upserting workflow...");
    await mgmtClient.workflows.upsert(workflowKey, {
        environment: "development",
        workflow: workflowData
    });

    console.log("Committing changes...");
    await mgmtClient.commits.commitAll({
        environment: "development",
        commit_message: `Commit for ${workflowKey}`
    });

    console.log("Activating workflow...");
    await mgmtClient.workflows.activate(workflowKey, {
        environment: "development"
    });

    const recipientEmail = `${gmailUserName}+receiver-${runId}@gmail.com`;
    console.log("Triggering workflow...");
    const result = await knock.workflows.trigger(workflowKey, {
        tenant: tenantId,
        recipients: [
            {
                id: `user-${runId}`,
                name: `User ${runId}`,
                email: recipientEmail
            }
        ]
    });

    const logContent = `Tenant ID: ${tenantId}
Workflow Key: ${workflowKey}
Workflow Run ID: ${result.workflow_run_id}
Recipient Email: ${recipientEmail}
`;
    fs.writeFileSync('/home/user/tenant_task/output.log', logContent);
    console.log("Success");
}

main().catch(console.error);
