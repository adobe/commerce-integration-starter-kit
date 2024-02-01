/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */
const { context, getToken } = require('@adobe/aio-lib-ims')

/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 *
 * @param {object} params includes env parameters
 * @returns {string} returns the access token
 * @throws {Error} in case of any failure
 */
async function getAdobeAccessToken (params) {
  const ioManagementAPIScopes = ['AdobeID', 'openid', 'read_organizations', 'additional_info.projectedProductContext', 'additional_info.roles', 'adobeio_api', 'read_client_secret', 'manage_client_secrets']
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

  return await getToken()
}

module.exports = {
  getAdobeAccessToken
}
