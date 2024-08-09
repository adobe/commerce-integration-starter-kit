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

const { getCommerceOauthClient } = require('../oauth1a')
const { Core } = require('@adobe/aio-sdk')
const logger = Core.Logger('commerce-shipment-api-client', { level: 'info' })

/**
 * This function call Adobe commerce rest API to create a shipment
 *
 * @returns {object} - API response object
 * @param {string} baseUrl - Adobe commerce rest api base url
 * @param {string} consumerKey - Adobe commerce integration consumer key
 * @param {string} consumerSecret - Adobe commerce integration consumer secret
 * @param {string} accessToken - Adobe commerce integration access token
 * @param {string} accessTokenSecret - Adobe commerce integration access token secret
 * @param {string} orderId - Adobe commerce order id
 * @param {object} data - Adobe commerce api payload
 */
async function createShipment (baseUrl, consumerKey, consumerSecret, accessToken, accessTokenSecret, orderId, data) {
  const client = getCommerceOauthClient(
    {
      url: baseUrl,
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret
    },
    logger
  )

  return await client.post(
    `order/${orderId}/ship`,
    JSON.stringify(data),
    '',
    { 'Content-Type': 'application/json' }
  )
}

/**
 * This function call Adobe commerce rest API to update a shipment
 *
 * @returns {object} - API response object
 * @param {string} baseUrl - Adobe commerce rest api base url
 * @param {string} consumerKey - Adobe commerce integration consumer key
 * @param {string} consumerSecret - Adobe commerce integration consumer secret
 * @param {string} accessToken - Adobe commerce integration access token
 * @param {string} accessTokenSecret - Adobe commerce integration access token secret
 * @param {object} data - Adobe commerce api payload
 */
async function updateShipment (baseUrl, consumerKey, consumerSecret, accessToken, accessTokenSecret, data) {
  const client = getCommerceOauthClient(
    {
      url: baseUrl,
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret
    },
    logger
  )
  return await client.post(
    'shipment',
    JSON.stringify(data),
    '',
    { 'Content-Type': 'application/json' }
  )
}

module.exports = {
  createShipment,
  updateShipment
}
