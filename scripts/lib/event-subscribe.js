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
const { makeError } = require('./helpers/errors')

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
      environment,
      eventSpec
    )

    return {
      success: true
    }
  } catch (error) {
    return makeError(
      'UNEXPECTED_ERROR',
      'Unexpected error occurred while subscribing to an event in the Adobe I/O Events module in Commerce',
      { error, eventSpec }
    )
  }
}

exports.main = main
