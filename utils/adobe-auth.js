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

const { assertImsAuthParams, getImsAuthProvider } = require('@adobe/aio-commerce-lib-auth')
const { context } = require('@adobe/aio-lib-ims')

const DEFAULT_IMS_SCOPES = ['AdobeID', 'openid', 'read_organizations', 'additional_info.projectedProductContext', 'additional_info.roles', 'adobeio_api', 'read_client_secret', 'manage_client_secrets', 'commerce.accs']

async function resolveConfigFromEnv (params) {
  const config = {
    clientId: params.OAUTH_CLIENT_ID,
    clientSecrets: [params.OAUTH_CLIENT_SECRET],
    technicalAccountId: params.OAUTH_TECHNICAL_ACCOUNT_ID,
    technicalAccountEmail: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
    imsOrgId: params.OAUTH_ORG_ID,
    scopes: !!params.OAUTH_SCOPES || params.OAUTH_SCOPES?.length > 0 ? params.OAUTH_SCOPES : DEFAULT_IMS_SCOPES,
    context: "onboarding-config"
  };

  await context.setCurrent(params.context)

  return config;
}
/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 * @param {object} params includes env parameters
 * @returns {Promise<string>} returns the access token
 */
async function getAdobeAccessToken (params) {
  const config = await resolveConfigFromEnv(params);

  assertImsAuthParams(config)
  const imsAuthProvider = getImsAuthProvider(config)

  return imsAuthProvider.getAccessToken()
}

/**
 * Get the access token headers for Adobe tools (e.g. IO Events)
 * @param {object} params - IMS authentication parameters
 * @returns {Promise<object>} returns the headers with access token
 */
async function getAdobeAccessHeaders (params) {
  const config = await resolveConfigFromEnv(params);

  assertImsAuthParams(config)
  const imsAuthProvider = getImsAuthProvider(config)
  return imsAuthProvider.getHeaders()
}

module.exports = {
  getAdobeAccessToken,
  getAdobeAccessHeaders
}
