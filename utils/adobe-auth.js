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

const {
  assertImsAuthParams,
  getImsAuthProvider,
} = require("@adobe/aio-commerce-lib-auth");

const DEFAULT_IMS_SCOPES = [
  "AdobeID",
  "openid",
  "read_organizations",
  "additional_info.projectedProductContext",
  "additional_info.roles",
  "adobeio_api",
  "read_client_secret",
  "manage_client_secrets",
  "commerce.accs",
];

/**
 * Resolve IMS configuration from environment parameters
 * @param {object} params - Environment parameters containing ImsAuth configuration
 * @returns IMS authentication configuration object
 */
function resolveImsConfig(params) {
  return {
    clientId: params.AIO_COMMERCE_AUTH_IMS_CLIENT_ID,
    clientSecrets: params.AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS || [],
    technicalAccountId: params.AIO_COMMERCE_AUTH_IMS_TECHNICAL_ACCOUNT_ID,
    technicalAccountEmail: params.AIO_COMMERCE_AUTH_IMS_TECHNICAL_ACCOUNT_EMAIL,
    imsOrgId: params.AIO_COMMERCE_AUTH_IMS_IMS_ORG_ID,
    scopes: params.AIO_COMMERCE_AUTH_IMS_SCOPES || DEFAULT_IMS_SCOPES,
    environment: params.AIO_CLI_ENV || "prod",
  };
}

/**
 * Generate access token to connect with Adobe tools (e.g. IO Events)
 * @param {object} params includes env parameters
 * @returns the access token
 */
function getAdobeAccessToken(params) {
  const config = resolveImsConfig(params);

  assertImsAuthParams(config);
  const imsAuthProvider = getImsAuthProvider(config);

  return imsAuthProvider.getAccessToken();
}

/**
 * Get the access token headers for Adobe tools (e.g. IO Events)
 * @param {object} params - IMS authentication parameters
 * @returns the headers with access token
 */
function getAdobeAccessHeaders(params) {
  const config = resolveImsConfig(params);
  assertImsAuthParams(config);
  const imsAuthProvider = getImsAuthProvider(config);

  return imsAuthProvider.getHeaders();
}

module.exports = {
  getAdobeAccessToken,
  getAdobeAccessHeaders,
};
