/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */
const Oauth1a = require('oauth-1.0a')
const crypto = require('crypto')
const got = require('got')

/**
 * This function return the Adobe commerce OAuth client
 *
 * @param {object} options - include the information to configure oauth
 * @param {object} logger - Logger
 */
function getOauthClient (options, logger) {
  const instance = {}

  // Remove trailing slash if any
  const serverUrl = options.url
  const apiVersion = options.version
  const oauth = Oauth1a({
    consumer: {
      key: options.consumerKey,
      secret: options.consumerSecret
    },
    signature_method: 'HMAC-SHA256',
    hash_function: hashFunctionSha256
  })
  const token = {
    key: options.accessToken,
    secret: options.accessTokenSecret
  }

  /**
   * This function create the sha 256 hash
   *
   * @returns  {string} - returns generated hash
   * @param {string} baseString
   * @param {string} key
   */
  function hashFunctionSha256 (baseString, key) {
    return crypto.createHmac('sha256', key).update(baseString).digest('base64')
  }

  /**
   * This function make the call to the api
   *
   * @returns {object} - returns the call response
   * @param {object} requestData - include the request data
   * @param {string} requestToken - access token
   * @param {object} customHeaders - include custom headers
   */
  async function apiCall (requestData, requestToken = '', customHeaders = {}) {
    try {
      logger.info('Fetching URL: ' + requestData.url + ' with method: ' + requestData.method)

      const headers = {
        ...(requestToken
          ? { Authorization: 'Bearer ' + requestToken }
          : oauth.toHeader(oauth.authorize(requestData, token))),
        ...customHeaders
      }

      return await got(requestData.url, {
        http2: true,
        method: requestData.method,
        headers,
        body: requestData.body,
        responseType: 'json'
      }).json()
    } catch (error) {
      logger.error(`Error fetching URL ${requestData.url}: ${error}`)
      throw error
    }
  }

  instance.consumerToken = async function (loginData) {
    return apiCall({
      url: createUrl('integration/customer/token'),
      method: 'POST',
      body: loginData
    })
  }

  instance.get = async function (resourceUrl, requestToken = '') {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'GET'
    }
    return apiCall(requestData, requestToken)
  }

  /**
   * This function create the full url
   *
   * @returns {string} - generated url
   * @param {string} resourceUrl - Adobe commerce rest API resource url
   */
  function createUrl (resourceUrl) {
    return serverUrl + apiVersion + '/' + resourceUrl
  }

  instance.post = async function (resourceUrl, data, requestToken = '', customHeaders = {}) {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'POST',
      body: data
    }
    return apiCall(requestData, requestToken, customHeaders)
  }

  instance.put = async function (resourceUrl, data, requestToken = '', customHeaders = {}) {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'PUT',
      body: data
    }
    return apiCall(requestData, requestToken, customHeaders)
  }

  instance.delete = async function (resourceUrl, requestToken = '') {
    const requestData = {
      url: createUrl(resourceUrl),
      method: 'DELETE'
    }
    return apiCall(requestData, requestToken)
  }

  return instance
}

/**
 * This function create the oauth client to use for calling adobe commerce api
 *
 * @returns {object} - returns the oauth client
 * @param {object} options - define the options for the client
 * @param {object} logger - define the Logger
 */
function getCommerceOauthClient (options, logger) {
  options.version = 'V1'
  options.url = options.url + 'rest/'
  return getOauthClient(options, logger)
}

module.exports = {
  getOauthClient,
  getCommerceOauthClient
}
