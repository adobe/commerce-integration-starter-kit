const { context, getToken } = require('@adobe/aio-lib-ims')
require('dotenv').config();

async function main() {
    console.log('Starting the process of on-boarding based on you registration choice');

    const environment = process.env;
    const registrations = require('./custom/registrations.json');
    const ioManagementAPIScopes = ['AdobeID', 'openid', 'read_organizations', 'additional_info.projectedProductContext', 'additional_info.roles', 'adobeio_api', 'read_client_secret', 'manage_client_secrets'];
    const config = {
        client_id: environment.OAUTH_CLIENT_ID,
        client_secrets: [environment.OAUTH_CLIENT_SECRET],
        technical_account_id: environment.OAUTH_TECHNICAL_ACCOUNT_ID,
        technical_account_email: environment.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
        ims_org_id: environment.OAUTH_ORG_ID,
        scopes: ioManagementAPIScopes
    }

    await context.setCurrent('onboarding-config')
    await context.set('onboarding-config', config)

    const accessToken = await getToken()
    const createProvidersResult = await require('./providers').main(registrations, accessToken);

    if (!createProvidersResult.success) {
        const errorMessage = `Process of on-boarding (providers) failed with error: ${createProvidersResult.error}`;
        console.log(errorMessage);
        return {
            code: createProvidersResult.code,
            success: false,
            error: errorMessage
        }
    }

    const providers = createProvidersResult.result;
    const createProvidersMetadataResult = await require('./metadata').main(registrations, providers, accessToken);

    if (!createProvidersMetadataResult.success) {
        const errorMessage = `Process of on-boarding (metadata) failed with error: ${createProvidersResult.error}`;
        console.log(errorMessage);
        return {
            code: createProvidersResult.code,
            success: false,
            error: errorMessage
        }
    }

    const registerEntityEventsResult = await require('./registrations').main(registrations, providers, accessToken);
    if (!registerEntityEventsResult.success) {
        const errorMessage = `Process of on-boarding (registrations) failed with error: ${createProvidersResult.error}`;
        console.log(errorMessage);
        return {
            code: createProvidersResult.code,
            success: false,
            error: errorMessage
        }
    }

    console.log('Process of On-Boarding done successfully:', providers)

    return {
        code: 200,
        success: true,
        providers,
        registrations: registerEntityEventsResult.registrations
    }
}

exports.main = main;