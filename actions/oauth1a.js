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
const got= require('got')

function getOauthClient(options, logger) {
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

    function hashFunctionSha256(baseString, key) {
        return crypto.createHmac('sha256', key).update(baseString).digest('base64')
    }

    async function apiCall(requestData, requestToken = '', customHeaders = {}) {
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
                headers: headers,
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

    function createUrl(resourceUrl) {
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

function getCommerceOauthClient(options, logger) {
    options.version = 'V1'
    options.url = options.url + 'rest/'
    return getOauthClient(options, logger)
}

module.exports = {
    getOauthClient,
    getCommerceOauthClient
}
