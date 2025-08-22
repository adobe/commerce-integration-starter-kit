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
  getImsAccessToken,
  getOAuthHeader,
} = require("@adobe/commerce-sdk-auth");
const { fromParams } = require("./auth");

/**
 * @returns {string} - returns the bearer token
 * @param {string} token - access token
 */
function withBearer(token) {
  return `Bearer ${token}`;
}

/**
 * This function return the Adobe commerce OAuth client
 *
 * @param {object} options - include the information to configure oauth
 * @param {object} authOptions - 'IMS' or 'COMMERCE'
 * @param {object} logger - Logger
 */
function createClient(options, authOptions, logger) {
  const instance = {};

  // Remove trailing slash if any
  const serverUrl = options.url;
  const apiVersion = options.version;

  let getAuthorizationHeaders = async (opts) => {
    throw new Error("getAuthorizationHeaders not implemented");
  };

  if (authOptions?.ims) {
    const { ims } = authOptions;
    getAuthorizationHeaders = async (_opts) => {
      const imsResponse = await getImsAccessToken(ims);
      return {
        Authorization: withBearer(imsResponse.access_token),
      };
    };
  } else if (authOptions?.commerceOAuth1) {
    const { commerceOAuth1 } = authOptions;
    const oauthToken = {
      key: commerceOAuth1.accessToken,
      secret: commerceOAuth1.accessTokenSecret,
    };
    const oauth = getOAuthHeader(commerceOAuth1);
    getAuthorizationHeaders = async ({ url, method }) => {
      return oauth.toHeader(
        oauth.authorize(
          {
            url,
            method,
          },
          oauthToken,
        ),
      );
    };
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

  instance.get = async (resourceUrl, requestToken = "") => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "GET",
    };
    return apiCall(requestData, requestToken);
  };

  /**
   * This function create the full url
   *
   * @returns {string} - generated url
   * @param {string} resourceUrl - Adobe commerce rest API resource url
   */
  function createUrl(resourceUrl) {
    return serverUrl + apiVersion + "/" + resourceUrl;
  }

  instance.post = async (
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

  instance.put = async (
    resourceUrl,
    data,
    requestToken = "",
    customHeaders = {},
  ) => {
    const requestData = {
      url: createUrl(resourceUrl),
      method: "PUT",
      body: data,
    };
    return apiCall(requestData, requestToken, customHeaders);
  };

  instance.delete = async (resourceUrl, requestToken = "") => {
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
  return createClient(options, fromParams(params), logger);
}

module.exports = {
  getClient,
};
