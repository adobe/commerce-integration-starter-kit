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

const { createCustomer } = require('../../mockapi-api-client')
const { HTTP_INTERNAL_ERROR } = require('../../../constants')
const { Core } = require('@adobe/aio-sdk')

/**
 * This function send the customer created dara to the external back-office application
 *
 * @param {object} params - include the env params
 * @param {object} data - Customer data
 * @param {object} preProcessed - result of the pre-process logic if any
 * @returns {object} returns the sending result if needed for post process
 */
async function sendData (params, data, preProcessed) {
  const logger = Core.Logger('customer-commerce-created.sendData', { level: params.LOG_LEVEL || 'info' })
  logger.info(`data: ${JSON.stringify(data)}`)

  try {
    const createCustomerResult = await createCustomer('https://1339710-967summiteventing-stage.adobeioruntime.net/api/v1/web/Production/', data)
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      statusCode: HTTP_INTERNAL_ERROR,
      message: error.message
    }
  }
}

module.exports = {
  sendData
}
