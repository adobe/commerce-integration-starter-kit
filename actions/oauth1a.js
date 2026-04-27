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

const { getIntegrationAuthProvider } = require("@adobe/aio-commerce-lib-auth");
const { getAdobeAccessToken } = require("../utils/adobe-auth");

/**
 * @returns the bearer token
 * @param {string} token - access token
 */
function withBearer(token) {
  return `Bearer ${token}`;
}

/**
 * This function return the Adobe commerce OAuth client
 *
 * @param {object} options - include the information to configure oauth
 * @param {object} params - environment params from the IO Runtime request
 * @param {object} logger - Logger
 */
function createClient(options, params, logger) {
  const instance = {};

  // Remove trailing slash if any
  const serverUrl = options.url;
  const apiVersion = options.version;

  let getAuthorizationHeaders;

  // `aio app dev` compatibility: inputs mapped to undefined env vars come as $<input_name> in dev mode, but as '' in prod mode
  if (
    params.COMMERCE_CONSUMER_KEY &&
    params.COMMERCE_CONSUMER_KEY !== "$COMMERCE_CONSUMER_KEY"
  ) {
    logger.info("Commerce client is using Commerce OAuth1 authentication");
    const integrationsAuth = getIntegrationAuthProvider({
      consumerKey: params.COMMERCE_CONSUMER_KEY,
      consumerSecret: params.COMMERCE_CONSUMER_SECRET,
      accessToken: params.COMMERCE_ACCESS_TOKEN,
      accessTokenSecret: params.COMMERCE_ACCESS_TOKEN_SECRET,
    });
    getAuthorizationHeaders = ({ url, method }) =>
      integrationsAuth.getHeaders(method, url);
  } else if (
    params.OAUTH_CLIENT_ID &&
    params.OAUTH_CLIENT_ID !== "$OAUTH_CLIENT_ID"
  ) {
    logger.info("Commerce client is using IMS OAuth authentication");
    getAuthorizationHeaders = async () => {
      const token = await getAdobeAccessToken(params);
      return { Authorization: withBearer(token) };
    };
  } else {
    throw new Error(
      "Unknown auth type, supported IMS OAuth or Commerce OAuth1. Please review documented auth types",
    );
  }

  /**
   * This function make the call to the api
   *
   * @param {object} requestData - include the request data
   * @param {string} requestToken - access token
   * @param {object} customHeaders - include custom headers
   */
  async function apiCall(requestData, requestToken = "", customHeaders = {}) {
    try {
      logger.debug(
        "Fetching URL: " +
          requestData.url +
          " with method: " +
          requestData.method,
      );

      let authHeaders = {};

      if (requestToken.length > 0) {
        authHeaders = { Authorization: withBearer(requestToken) };
      } else {
        authHeaders = await getAuthorizationHeaders(requestData);
      }

      const headers = {
        Accept: "application/json",
        ...customHeaders,
        ...authHeaders,
      };
      const response = await fetch(requestData.url, {
        method: requestData.method,
        headers,
        body: requestData.body,
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
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

  instance.get = (resourceUrl, requestToken = "") => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "GET",
    };
    return apiCall(requestData, requestToken);
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

  instance.post = (
    resourceUrl,
    data,
    requestToken = "",
    customHeaders = {},
  ) => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "POST",
      body: data,
    };
    return apiCall(requestData, requestToken, customHeaders);
  };

  instance.put = (resourceUrl, data, requestToken = "", customHeaders = {}) => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "PUT",
      body: data,
    };
    return apiCall(requestData, requestToken, customHeaders);
  };

  instance.delete = (resourceUrl, requestToken = "") => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "DELETE",
    };
    return apiCall(requestData, requestToken);
  };

  return instance;
}

/**
 * This function create the oauth client to use for calling adobe commerce api
 *
 * @param {object} clientOptions - define the options for the client
 * @param {object} logger - define the Logger
 */
function getClient(clientOptions, logger) {
  const { params, ...options } = clientOptions;
  options.version = "V1";

  return createClient(options, params, logger);
}

module.exports = {
  getClient,
};
