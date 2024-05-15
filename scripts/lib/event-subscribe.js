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

const { eventSubscribe } = require('./commerce-eventing-api-client')

/**
 * This method subscribes to an event in the commerce eventing module
 * @param {object} eventSpec - event specification as described in https://developer.adobe.com/commerce/extensibility/events/api/#subscribe-to-events
 * @param {object} environment - environment variables
 * @returns {object} - returns response object
 */
async function main (eventSpec, environment) {
  try {
    await eventSubscribe(
      environment.COMMERCE_BASE_URL,
      environment.COMMERCE_CONSUMER_KEY,
      environment.COMMERCE_CONSUMER_SECRET,
      environment.COMMERCE_ACCESS_TOKEN,
      environment.COMMERCE_ACCESS_TOKEN_SECRET,
      eventSpec

    )
    return {
      code: 200,
      success: true
    }
  } catch (error) {
    const errorMessage = `Unable to complete the process of event subscription: ${error.message}`
    console.log(errorMessage)
    return {
      code: 500,
      success: false,
      error: errorMessage
    }
  }
}

exports.main = main
