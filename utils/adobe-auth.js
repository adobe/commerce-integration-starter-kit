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

const { assertImsAuthParams, getImsAuthProvider } = require('@adobe/aio-commerce-lib-auth');
const DEFAULT_IMS_SCOPES = ['AdobeID', 'openid', 'read_organizations', 'additional_info.projectedProductContext', 'additional_info.roles', 'adobeio_api', 'read_client_secret', 'manage_client_secrets'];

/**
 * Convert the parameters into the format expected by the IMS auth provider. Only to be used for OAUTH_* parameters.
 * TODO: remove this function once the IMS auth provider is updated to accept the new format
 * @param params
 * @returns {{AIO_COMMERCE_IMS_CLIENT_ID: (string|*), AIO_COMMERCE_IMS_CLIENT_SECRETS: *, AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_ID: *, AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_EMAIL: *, AIO_COMMERCE_IMS_IMS_ORG_ID: (string|*), AIO_COMMERCE_IMS_ENV: string, AIO_COMMERCE_IMS_CTX: string, AIO_COMMERCE_IMS_SCOPES: string}}
 */
function intoImsAuthParameters (params) {
  return {
    AIO_COMMERCE_IMS_CLIENT_ID: params.OAUTH_CLIENT_ID,
    AIO_COMMERCE_IMS_CLIENT_SECRETS: JSON.stringify([params.OAUTH_CLIENT_SECRET]),
    AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_ID: params.OAUTH_TECHNICAL_ACCOUNT_ID,
    AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_EMAIL: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
    AIO_COMMERCE_IMS_IMS_ORG_ID: params.OAUTH_ORG_ID,
    AIO_COMMERCE_IMS_ENV: 'prod', // There is no alternative
    AIO_COMMERCE_IMS_CTX: 'onboarding-config', // There is no alternative
    AIO_COMMERCE_IMS_SCOPES: JSON.stringify(params.OAUTH_SCOPES ?? DEFAULT_IMS_SCOPES)
  }
}

/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 * @param {object} params includes env parameters
 * @returns {Result} returns the access token
 */
async function getAdobeAccessToken (params) {
  assertImsAuthParams(params);
  const imsAuthProvider = getImsAuthProvider(params);

  return imsAuthProvider.getAccessToken();
}

/**
 * Get the access token headers for Adobe tools (e.g. IO Events)
 * @param params
 * @returns {Promise<object>} returns the headers with access token
 */
async function getAdobeAccessHeaders (params) {
  assertImsAuthParams(params);
  const imsAuthProvider = getImsAuthProvider(params);

  return imsAuthProvider.getHeaders();
}

module.exports = {
  getAdobeAccessToken,
  getAdobeAccessHeaders,
}
