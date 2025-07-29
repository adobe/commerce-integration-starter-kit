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

const DEFAULT_IMS_SCOPES = ['AdobeID', 'openid', 'read_organizations', 'additional_info.projectedProductContext', 'additional_info.roles', 'adobeio_api', 'read_client_secret', 'manage_client_secrets', 'commerce.accs']

/**
 * Resolves IMS authentication configuration from environment parameters
 * @param {object} params - Environment parameters containing OAuth configuration
 * @returns {Promise<object>} IMS authentication configuration object
 */
async function resolveConfigFromEnv (params) {
  let scopes = DEFAULT_IMS_SCOPES

  if (!!params.OAUTH_SCOPES || params.OAUTH_SCOPES?.length > 0) {
    if (typeof params.OAUTH_SCOPES === 'string') {
      try {
        scopes = JSON.parse(params.OAUTH_SCOPES)
      } catch (e) {
        throw new Error(`Invalid OAUTH_SCOPES format: ${params.OAUTH_SCOPES}. It should be a valid JSON array.`)
      }
    } else if (Array.isArray(params.OAUTH_SCOPES)) {
      scopes = params.OAUTH_SCOPES
    }
  }

  return {
    clientId: params.OAUTH_CLIENT_ID,
    clientSecrets: [params.OAUTH_CLIENT_SECRET],
    technicalAccountId: params.OAUTH_TECHNICAL_ACCOUNT_ID,
    technicalAccountEmail: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
    imsOrgId: params.OAUTH_ORG_ID,
    scopes
  }
}
/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 * @param {object} params includes env parameters
 * @returns {Promise<string>} returns the access token
 */
async function getAdobeAccessToken (params) {
  const config = await resolveConfigFromEnv(params)

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
  const config = await resolveConfigFromEnv(params)

  assertImsAuthParams(config)
  const imsAuthProvider = getImsAuthProvider(config)
  return imsAuthProvider.getHeaders()
}

module.exports = {
  getAdobeAccessToken,
  getAdobeAccessHeaders
}
