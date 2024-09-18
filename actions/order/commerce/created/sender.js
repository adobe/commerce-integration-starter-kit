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

const {createOrder} = require("../../mock-oms-order-api-client");

/**
 * This function send the order created data to the external back-office application
 *
 * @param {object} params - include the env params
 * @param {object} data - order data
 * @param {object} preProcessed - result of the pre-process logic if any
 * @returns {object} returns the sending result if needed for post process
 */
async function sendData (params, data, preProcessed) {

  const response = await createOrder(
    params.OMS_API_BASE_URL,
    data
  )

  const result = await response.json()
  if (!response.ok) {
    return {
        success: false,
        statusCode: response.status,
        message: result.error
        }
    }

  return {
    success: true,
    result: result
  }
}

module.exports = {
  sendData
}
