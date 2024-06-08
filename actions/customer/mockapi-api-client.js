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

const { Core } = require('@adobe/aio-sdk')
const got = require('got')

/**
 * This function call Adobe commerce rest API to create a customer
 *
 * @returns {object} - API response object
 * @param {string} baseUrl - Backoffice rest api base url
 * @param {string} body - Payload
 */
async function createCustomer (baseUrl, body) {
  const logger = Core.Logger('mockapi-api-client', { level: 'debug' })
  logger.debug(`Fetching URL: ${baseUrl} with method: POST and body: ${body}`)
  try {
    return await got(`${baseUrl}save-events`, {
      http2: true,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).text()
  } catch (error) {
    logger.error(`Error fetching URL ${baseUrl}save-events: ${error}`)
    throw error
  }
}

module.exports = {
  createCustomer
}
