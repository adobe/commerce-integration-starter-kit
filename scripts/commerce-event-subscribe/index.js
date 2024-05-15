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

require('dotenv').config()

/**
 * This method handles the commerce event subscribe script, it configures the Adobe I/O Events Commerce module event subscriptions
 * @returns {object} - returns a response with successful and failed commerce event subscriptions
 */
async function main () {
  console.log('Starting the commerce event subscribe process')

  const result = {
    successful_subscriptions: [],
    failed_subscriptions: []
  }

  try {
    const commerceEventSubscriptions = require('./config/commerce-event-subscribe.json')
    for (const commerceEventSubscription of commerceEventSubscriptions) {
      const eventSubscribeResult = await require('../lib/event-subscribe').main(commerceEventSubscription, process.env)
      if (!eventSubscribeResult.success) {
        let errorMessage = `Failed to subscribe to event: ${commerceEventSubscription.event.name} with error: ${eventSubscribeResult.error}`
        if (eventSubscribeResult.error.includes('Response code 400 (Bad Request)')) {
          errorMessage += ' - Please make sure the event name is valid and the subscription payload is not malformed'
        }
        if (eventSubscribeResult.error.includes('Response code 404 (Not Found)')) {
          errorMessage += ' - Make sure the latest version of the Adobe I/O Events module (see https://developer.adobe.com/commerce/extensibility/events/release-notes/) is installed and enabled in Commerce (see https://developer.adobe.com/commerce/extensibility/events/installation/). If the module cannot be updated to the latest version, you can use the "bin/magento events:subscribe" command to manually configure the event subscriptions. (See the command reference at https://developer.adobe.com/commerce/extensibility/events/commands/).'
        }
        console.log(errorMessage)
        result.failed_subscriptions.push(commerceEventSubscription.event.name)
        continue
      }
      console.log(`Successfully subscribed to event: ${commerceEventSubscription.event.name}`)
      result.successful_subscriptions.push(commerceEventSubscription.event.name)
    }
    console.log('Finished the commerce event subscribe process with result', result)
    return {
      code: 200,
      success: true,
      result
    }
  } catch (error) {
    if (error?.code === 'MODULE_NOT_FOUND') {
      console.log('Failed to subscribe to events with error: "commerce-event-subscribe.json" file not found. Make sure the file exists in the "scripts/commerce-event-subscribe/config" directory')
      return {
        code: 500,
        success: false,
        error: error.message
      }
    }
    if (error?.name === 'SyntaxError') {
      console.log('Failed to subscribe to events with error: "commerce-event-subscribe.json" file is not a valid JSON file. Make sure the file in the "scripts/commerce-event-subscribe/config" directory contains well-formed JSON')
      return {
        code: 500,
        success: false,
        error: error.message
      }
    }
    console.log('Failed to subscribe to events with error:', error)
    return {
      code: 500,
      success: false,
      error: error.message
    }
  }
}

exports.main = main
