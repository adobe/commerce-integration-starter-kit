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

const { createShipment } = require('../../commerce-shipment-api-client')
const { HTTP_INTERNAL_ERROR } = require('../../../constants')

/**
 * This function send the shipment created data to the Adobe commerce REST API
 *
 * @returns {object} - returns the result data of sending information to Adobe commerce
 * @param {object} params - include the env params
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 */
async function sendData (params, transformed, preProcessed) {
  try {
    const response = await createShipment(
      params.COMMERCE_BASE_URL,
      params.COMMERCE_CONSUMER_KEY,
      params.COMMERCE_CONSUMER_SECRET,
      params.COMMERCE_ACCESS_TOKEN,
      params.COMMERCE_ACCESS_TOKEN_SECRET,
      params.data.id,
      transformed)

    return {
      success: true,
      message: response
    }
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.statusCode || HTTP_INTERNAL_ERROR,
      message: error.message

    }
  }
}
module.exports = {
  sendData
}
