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
  imsProviderWithEnvResolver,
  integrationProviderWithEnvResolver,
} = require("../utils/adobe-auth");

const {
  CommerceSdkValidationError,
} = require("@adobe/aio-commerce-lib-core/error");

/**
 * This function returns the auth function from @adobe/aio-commerce-lib-auth based on the environment parameters.
 * @param {object} params - Environment params from the IO Runtime request
 * @returns the auth object for the request
 * @throws {Error} - throws error if the params are missing
 */
async function getAuthProviderFromParams(params) {
  // `aio app dev` compatibility: inputs mapped to undefined env vars come as $<input_name> in dev mode, but as '' in prod mode
  try {
    if (
      params.COMMERCE_CONSUMER_KEY &&
      params.COMMERCE_CONSUMER_KEY !== "$COMMERCE_CONSUMER_KEY"
    ) {
      logger.info("Commerce client will use CommerceIntegration provider");
      const integrationProvider =
        await integrationProviderWithEnvResolver(params);
      return ({ method, url }) => {
        return integrationProvider.getHeaders(method, url);
      };
    }

    // `aio app dev` compatibility: inputs mapped to undefined env vars come as $<input_name> in dev mode, but as '' in prod mode
    if (
      params.OAUTH_CLIENT_ID &&
      params.OAUTH_CLIENT_ID !== "$OAUTH_CLIENT_ID"
    ) {
      logger.info("Commerce client will use ImsAuth provider");
      const imsProvider = await imsProviderWithEnvResolver(params);
      return async () => {
        const token = await imsProvider.getAccessToken();
        return { Authorization: `Bearer ${token}` };
      };
    }
  } catch (error) {
    if (error instanceof CommerceSdkValidationError) {
      logger.error(
        `Unable to create authProvider params: ${error.display(false)}`,
      );

      throw new Error(
        `Unable to create authProvider params: ${error.display(false)}`,
      );
    }

    throw new Error(`Unable to create authProvider params: ${error.message}`);
  }

  throw new Error(
    "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
  );
}

module.exports = {
  getAuthProviderFromParams,
};
