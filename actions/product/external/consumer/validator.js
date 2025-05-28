/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { Core } = require('@adobe/aio-sdk')

/**
 * This function validate the product data received
 *
 * @param {object} data - Received data from adobe commerce
 * @returns {object} - returns the result of validation object
 */
function validateData (data) {

  const logger = Core.Logger('validator', { level: process.env.LOG_LEVEL || 'info' })

  const requiredParams = [
    'type',
    'data.value.created_at',
    'data.value.updated_at'
  ]

  const { checkMissingRequestInputs, stringParameters } = require('../../../utils')
  const errorMessage = checkMissingRequestInputs(data, requiredParams, [])

  if (errorMessage) {
    logger.error(`Invalid request parameters: ${stringParameters(data)}`)
    return {
      success:false,
      message: `Invalid request parameters: ${errorMessage}`
    }
  }

  if (errorMessage) {
    return {
      success: false,
      message: errorMessage
    }
  }

  return {
    success: true
  }
}

module.exports = {
  validateData
}
