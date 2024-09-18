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

const { Core } = require('@adobe/aio-sdk')
const { stringParameters, checkMissingRequestInputs } = require('../../../utils')
const { HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')
const { errorResponse, successResponse } = require('../../../responses')

/**
 * This is the consumer of the events coming from Adobe Commerce related to order entity.
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('order-email-consumer', { level: params.LOG_LEVEL || 'info' })

  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

    let response = {}
    let statusCode = HTTP_OK

    logger.info('Start processing request')
    logger.debug(`Consumer main params: ${stringParameters(params)}`)

    const requiredParams = ['type',]
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`Invalid request parameters: ${stringParameters(params)}`)
      return errorResponse(HTTP_BAD_REQUEST, `Invalid request parameters: ${errorMessage}`)
    }

    logger.info('Params type: ' + params.type)

    switch (params.type) {
      case 'email.sales_order.created': {
          logger.info('Invoking created order')
          const res = await openwhiskClient.invokeAction(
            'order-email/created', params.data)
          response = res?.response?.result?.body
          statusCode = res?.response?.result?.statusCode
        break
      }
      default:
        logger.error(`Event type not found: ${params.type}`)
        return errorResponse(HTTP_BAD_REQUEST, `This case type is not supported: ${params.type}`)
    }

    if (!response.success) {
      logger.error(`Error response: ${response.error}`)
      return errorResponse(statusCode, response.error)
    }

    logger.info(`Successful request: ${statusCode}`)
    return successResponse(params.type, response)
  } catch (error) {
    logger.error(`Server error: ${error.message}`)
    return errorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
