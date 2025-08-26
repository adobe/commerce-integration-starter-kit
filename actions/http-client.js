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

const got = require("got");

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
 * @param {object} logger - Logger
 * @returns the auth object for the request
 * @throws {Error} - throws error if the params are missing
 */
async function getAuthProviderFromParams(params, logger) {
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
  }

  throw new Error(
    "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
  );
}

/**
 * This function return the Adobe commerce OAuth client
 *
 * @param {object} options - include the information to configure oauth
 * @param {object} params - params from the IO Runtime request
 * @param {object} logger - Logger
 */
async function createClient(options, params, logger) {
  const instance = {};

  // Remove trailing slash if any
  const serverUrl = options.url;
  const apiVersion = options.version;
  const authProvider = await getAuthProviderFromParams(params, logger);

  /**
   * This function make the call to the api
   *
   * @param {object} requestData - include the request data
   * @param {object} customHeaders - include custom headers
   */
  async function apiCall(requestData, customHeaders = {}) {
    try {
      logger.debug(
        "Fetching URL: " +
          requestData.url +
          " with method: " +
          requestData.method,
      );

      const authHeaders = await authProvider(requestData);

      const headers = {
        ...customHeaders,
        ...authHeaders,
      };

      return await got(requestData.url, {
        http2: true,
        method: requestData.method,
        headers,
        body: requestData.body,
        responseType: "json",
      }).json();
    } catch (error) {
      logger.error(`Error fetching URL ${requestData.url}: ${error}`);
      throw error;
    }
  }

  instance.consumerToken = async (loginData) =>
    apiCall({
      url: createUrl("integration/customer/token"),
      method: "POST",
      body: loginData,
    });

  instance.get = (resourceUrl) => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "GET",
    };
    return apiCall(requestData);
  };

  /**
   * This function create the full url
   *
   * @returns - generated url
   * @param {string} resourceUrl - Adobe commerce rest API resource url
   */
  function createUrl(resourceUrl) {
    return `${serverUrl}${apiVersion}/${resourceUrl}`;
  }

  instance.post = (resourceUrl, data, customHeaders = {}) => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "POST",
      body: data,
    };
    return apiCall(requestData, customHeaders);
  };

  instance.put = (resourceUrl, data, customHeaders = {}) => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "PUT",
      body: data,
    };
    return apiCall(requestData, customHeaders);
  };

  instance.delete = (resourceUrl) => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "DELETE",
    };
    return apiCall(requestData);
  };

  return instance;
}

/**
 * This function create the oauth client to use for calling adobe commerce api
 *
 * @param {object} clientOptions - define the options for the client
 * @param {object} logger - define the Logger
 */
async function getClient(clientOptions, logger) {
  const { params, ...options } = clientOptions;
  options.version = "V1";

  return await createClient(options, params, logger);
}

module.exports = {
  getClient,
  getAuthProviderFromParams,
};
