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

const ansis = require('ansis')
const { makeError, formatError } = require('../lib/helpers/errors')

require('dotenv').config()

/**
 * Logs an error ocurred during the commerce event subscribe process.
 * @param {object} errorInfo - General information about the error.
 */
function logCommerceEventSubscribeError (errorInfo) {
  const { label, reason, payload } = errorInfo
  const additionalDetails = payload
    ? formatError(payload)
    : 'No additional details'

  console.error(
    ansis.red('\nAn error occurred:\n'),
    ansis.bgRed(`\n COMMERCE_EVENT_SUBSCRIBE → ${label} \n`),
    ansis.red('\nProcess of subscribing to events in the Adobe I/O Events module in Commerce failed:\n'),
    ansis.red(reason),
    ansis.red(`\nAdditional error details: ${additionalDetails}\n`)
  )
}

/**
 * This method handles the commerce event subscribe script.
 * It configures the Adobe I/O Events Commerce module event subscriptions
 */
async function main () {
  console.log('Starting the commerce event subscribe process')

  const result = {
    successfulSubscriptions: [],
    failedSubscriptions: []
  }

  try {
    const commerceEventSubscriptions = require('./config/commerce-event-subscribe.json')
    for (const commerceEventSubscription of commerceEventSubscriptions) {
      const eventSubscribeResult = await require('../lib/event-subscribe').main(commerceEventSubscription, process.env)
      if (!eventSubscribeResult.success) {
        logCommerceEventSubscribeError(eventSubscribeResult.error)
        result.failedSubscriptions.push(commerceEventSubscription.event.name)

        continue
      }

      console.log(`Successfully subscribed to event: ${commerceEventSubscription.event.name}`)
      result.successfulSubscriptions.push(commerceEventSubscription.event.name)
    }
  } catch (error) {
    if (error?.code === 'MODULE_NOT_FOUND') {
      logCommerceEventSubscribeError(makeError(
        'MISSING_EVENT_SPEC_FILE',
        'The "commerce-event-subscribe.json" file was not found. Make sure the file exists in the "scripts/commerce-event-subscribe/config" directory',
        { error }
      ))

      return
    }

    if (error?.name === 'SyntaxError') {
      logCommerceEventSubscribeError(makeError(
        'INVALID_JSON_FILE',
        'The "commerce-event-subscribe.json" file is not a valid JSON file. Make sure the file in the "scripts/commerce-event-subscribe/config" directory contains well-formed JSON',
        { error }
      ))

      return
    }

    logCommerceEventSubscribeError(makeError(
      'UNEXPECTED_ERROR',
      'An unexpected error occurred',
      { error }
    ))

    return
  }

  console.log('Finished the commerce event subscribe process with result', result)
  return { result }
}

exports.main = main
