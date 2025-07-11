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

const { getClient } = require('../../actions/oauth1a')
const { Core } = require('@adobe/aio-sdk')
const logger = Core.Logger('commerce-eventing-api-client', { level: 'info' })

/**
 * This function calls Adobe commerce rest API to update the eventing configuration
 *
 * @param {string} baseUrl - Adobe commerce rest api base url
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function updateConfiguration (baseUrl, params, data) {
  const client = getClient(
    {
      url: baseUrl,
      params
    },
    logger
  )

  return await client.put(
    'eventing/updateConfiguration',
    JSON.stringify(data),
    '',
    { 'Content-Type': 'application/json' }
  )
}

/**
 * This function calls Adobe commerce rest API to subscribe to an event
 *
 * @param {string} baseUrl - Adobe commerce rest api base url
 * @param {object} params - Environment params from the IO Runtime request
 * @param {object} data - Adobe commerce api payload
 */
async function eventSubscribe (baseUrl, params, data) {
  const client = getClient(
    {
      url: baseUrl,
      params
    },
    logger
  )

  return await client.post(
    'eventing/eventSubscribe',
    JSON.stringify(data),
    '',
    { 'Content-Type': 'application/json' }
  )
}

module.exports = {
  updateConfiguration,
  eventSubscribe
}
