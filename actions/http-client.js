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
const { getAuthProviderFromParams } = require("./auth");

/**
 * This function return the Adobe commerce OAuth client
 *
 * @param {object} options - include the information to configure oauth
 * @param {object} getAuthorizationHeaders - authProvider
 * @param {object} logger - Logger
 */
function createClient(options, getAuthorizationHeaders, logger) {
  const instance = {};

  // Remove trailing slash if any
  const serverUrl = options.url;
  const apiVersion = options.version;

  /**
   * This function make the call to the api
   *
   * @param {object} requestData - include the request data
   * @param {string} _requestToken - access token
   * @param {object} customHeaders - include custom headers
   */
  async function apiCall(requestData, _requestToken = "", customHeaders = {}) {
    try {
      logger.debug(
        "Fetching URL: " +
          requestData.url +
          " with method: " +
          requestData.method,
      );

      const authHeaders = await getAuthorizationHeaders(requestData);

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

  return createClient(options, getAuthProviderFromParams(params), logger);
}

module.exports = {
  getClient,
};
