/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Core } = require("@adobe/aio-sdk");
const logger = Core.Logger("auth", { level: "info" });
const {
  assertImsAuthParams,
  assertIntegrationAuthParams,
} = require("@adobe/aio-commerce-lib-auth");
const {
  CommerceSdkValidationError,
} = require("@adobe/aio-commerce-lib-core/error");

/**
 * This function returns the auth object based on the params
 * @param {object} params - Environment params from the IO Runtime request
 * @returns the auth object for the request
 * @throws {Error} - throws error if the params are missing
 */
function fromParams(params) {
  // `aio app dev` compatibility: inputs mapped to undefined env vars come as $<input_name> in dev mode, but as '' in prod mode
  try {
    if (
      params.COMMERCE_CONSUMER_KEY &&
      params.COMMERCE_CONSUMER_KEY !== "$COMMERCE_CONSUMER_KEY"
    ) {
      logger.info(
        "Commerce client attempting to parse CommerceIntegration params",
      );
      const commerceOAuth1 = resolveIntegrationConfig(params);
      assertIntegrationAuthParams(commerceOAuth1);
      logger.info("Commerce client will use CommerceIntegration provider");
      return {
        commerceOAuth1,
      };
    }

    // `aio app dev` compatibility: inputs mapped to undefined env vars come as $<input_name> in dev mode, but as '' in prod mode
    if (
      params.OAUTH_CLIENT_ID &&
      params.OAUTH_CLIENT_ID !== "$OAUTH_CLIENT_ID"
    ) {
      logger.info("Commerce client attempting to parse ImsAuth params");
      const ims = resolveImsConfig(params);
      assertImsAuthParams(ims);
      logger.info("Commerce client will use ImsAuth provider");
      return {
        ims,
      };
    }
  } catch (error) {
    if (error instanceof CommerceSdkValidationError) {
      throw new Error(
        `Unable to create authProvider params: ${error.display(false)}`,
      );
    }

    throw new Error(`Unable to create authProvider params: ${error.message}`);
  }
}

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

function resolveIntegrationConfig(params) {
  return {
    consumerKey: params.COMMERCE_CONSUMER_KEY,
    consumerSecret: params.COMMERCE_CONSUMER_SECRET,
    accessToken: params.COMMERCE_ACCESS_TOKEN,
    accessTokenSecret: params.COMMERCE_ACCESS_TOKEN_SECRET,
  };
}

/**
 * Resolve IMS configuration from environment parameters
 * @param {object} params - Environment parameters containing ImsAuth configuration
 * @returns IMS authentication configuration object
 */
function resolveImsConfig(params) {
  return {
    clientId: params.OAUTH_CLIENT_ID,
    clientSecrets: params.OAUTH_CLIENT_SECRET
      ? [params.OAUTH_CLIENT_SECRET]
      : [],
    technicalAccountId: params.OAUTH_TECHNICAL_ACCOUNT_ID,
    technicalAccountEmail: params.OAUTH_TECHNICAL_ACCOUNT_EMAIL,
    imsOrgId: params.OAUTH_ORG_ID,
    scopes: params.OAUTH_SCOPES || DEFAULT_IMS_SCOPES,
    environment: params.AIO_CLI_ENV || "prod",
  };
}

module.exports = {
  fromParams,
};
