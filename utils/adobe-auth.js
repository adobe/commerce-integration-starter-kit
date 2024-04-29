/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
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
