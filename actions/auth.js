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
const { parseArrayParam } = require("./utils");
const logger = Core.Logger("auth", { level: "info" });
/**
 *
 * @param {object} params - Environment params from the IO Runtime request
 * @param {Array} expected - expected keys inside the params
 * @returns the missing params
 */
function checkIfMissing(params, expected) {
  return expected
    .filter((value) => !params[value])
    .map((key) => {
      return {
        error: true,
        message: `Missing ${key} in params`,
        key,
      };
    });
}

/**
 *
 * @param {object} params - Environment params from the IO Runtime request
 * @param {Array} expected - list of keys
 * @throws {Error} - throws error if the params are missing
 */
function validateParams(params, expected) {
  // check if missing
  const validated = checkIfMissing(params, expected);
  if (validated.length > 0) {
    throw new Error(
      `Expected parameters are missing ${validated.map((value) => value.key).join(", ")}`,
    );
  }
}

/**
 * This function returns the auth object based on the params
 * @param {object} params - Environment params from the IO Runtime request
 * @returns the auth object for the request
 * @throws {Error} - throws error if the params are missing
 */
function fromParams(params) {
  // `aio app dev` compatibility: inputs mapped to undefined env vars come as $<input_name> in dev mode, but as '' in prod mode
  if (
    params.AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_KEY &&
    params.AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_KEY !==
      "$AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_KEY"
  ) {
    logger.info("Commerce client is using Commerce OAuth1 authentication");
    validateParams(params, [
      "AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_KEY",
      "AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_SECRET",
      "AIO_COMMERCE_AUTH_INTEGRATION_ACCESS_TOKEN",
      "AIO_COMMERCE_AUTH_INTEGRATION_ACCESS_TOKEN_SECRET",
    ]);
    const {
      AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_KEY: consumerKey,
      AIO_COMMERCE_AUTH_INTEGRATION_CONSUMER_SECRET: consumerSecret,
      AIO_COMMERCE_AUTH_INTEGRATION_ACCESS_TOKEN: accessToken,
      AIO_COMMERCE_AUTH_INTEGRATION_ACCESS_TOKEN_SECRET: accessTokenSecret,
    } = params;
    return {
      commerceOAuth1: {
        consumerKey,
        consumerSecret,
        accessToken,
        accessTokenSecret,
      },
    };
  }

  // `aio app dev` compatibility: inputs mapped to undefined env vars come as $<input_name> in dev mode, but as '' in prod mode
  if (
    params.AIO_COMMERCE_AUTH_IMS_CLIENT_ID &&
    params.AIO_COMMERCE_AUTH_IMS_CLIENT_ID !==
      "$AIO_COMMERCE_AUTH_IMS_CLIENT_ID"
  ) {
    logger.info("Commerce client is using IMS OAuth authentication");
    validateParams(params, [
      "AIO_COMMERCE_AUTH_IMS_CLIENT_ID",
      "AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS",
      "AIO_COMMERCE_AUTH_IMS_SCOPES",
    ]);
    const {
      AIO_COMMERCE_AUTH_IMS_CLIENT_ID: clientId,
      AIO_COMMERCE_AUTH_IMS_CLIENT_SECRETS: clientSecretsRaw,
      AIO_COMMERCE_AUTH_IMS_SCOPES: scopesRaw,
    } = params;

    // Parse JSON strings to arrays
    const clientSecrets = parseArrayParam(clientSecretsRaw, []);
    const scopes = parseArrayParam(scopesRaw, ["AdobeID", "openid"]);

    const imsProps = {
      clientId,
      clientSecret: Array.isArray(clientSecrets)
        ? clientSecrets[0]
        : clientSecrets,
      scopes,
    };
    if (params.OAUTH_HOST) {
      return {
        ims: {
          ...imsProps,
          host: params.OAUTH_HOST,
        },
      };
    }
    return {
      ims: imsProps,
    };
  }

  throw new Error(
    "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
  );
}

module.exports = {
  validateParams,
  fromParams,
};
