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

const { instrument, getInstrumentationHelpers } = require('@adobe/aio-lib-telemetry')
const { isOperationSuccessful } = require('../../../telemetry')

/**
 * This function send the customer created dara to the external back-office application
 *
 * @param {object} params - include the env params
 * @param {object} data - Customer data
 * @param {object} preProcessed - result of the pre-process logic if any
 * @returns {object} returns the sending result if needed for post process
 */
async function sendData (params, data, preProcessed) {
  // @TODO Here add the logic to send the information to 3rd party
  // @TODO Use params to retrieve needed parameters from the environment
  // @TODO in case of error return { success: false, statusCode: <error status code>, message: '<error message>' }
  const { currentSpan } = getInstrumentationHelpers()
  currentSpan.addEvent('created.phase', { value: 'sendData' })

  return {
    success: true
  }
}

module.exports = {
  sendData: instrument(sendData, {
    isSuccessful: isOperationSuccessful
  })
}
