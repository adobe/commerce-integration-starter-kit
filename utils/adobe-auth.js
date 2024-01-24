const {context, getToken} = require("@adobe/aio-lib-ims");


async function getAdobeAccessToken(params) {
    const ioManagementAPIScopes = ['AdobeID', 'openid', 'read_organizations', 'additional_info.projectedProductContext', 'additional_info.roles', 'adobeio_api', 'read_client_secret', 'manage_client_secrets'];
    const config = {
        client_id: params.OAUTH_CLIENT_ID,
        client_secrets: [params.OAUTH_CLIENT_SECRET],
        technical_account_id: params.OAUTH_TECHNICAL_ACCOUNT_ID,
        technical_account_email: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
        ims_org_id: params.OAUTH_ORG_ID,
        scopes: ioManagementAPIScopes
    }

    await context.setCurrent('onboarding-config')
    await context.set('onboarding-config', config)

    return await getToken();
}

module.exports = {
    getAdobeAccessToken
}