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
const { HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST, HTTP_OK } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')
const { errorResponse, successResponse } = require('../../../responses')
const stateLib = require('@adobe/aio-lib-state')
const { storeFingerPrint, isAPotentialInfiniteLoop } = require('../../../infiniteLoopBreaker')

/**
 * This is the consumer of the events coming from External back-office applications related to product entity.
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('product-external-consumer', { level: params.LOG_LEVEL || 'info' })

  logger.info('Start processing request')
  logger.debug(`Consumer main params: ${stringParameters(params)}`)

  // Create a state instance
  const state = await stateLib.init()

  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

    let response = {}
    let statusCode = HTTP_OK

    // check for missing request input parameters and headers
    const requiredParams = ['type', 'data']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`Invalid request parameters: ${errorMessage}`)
      return errorResponse(HTTP_BAD_REQUEST, `Invalid request parameters: ${errorMessage}`)
    }

    logger.info(`Params type: ${params.type}`)

    // Detect infinite loop and break it
    const infiniteLoopEventTypes = [
      'be-observer.catalog_product_create',
      'be-observer.catalog_product_update'
    ]

    const infiniteLoopData = {
      fingerprintFn: fnFingerprint(params),
      keyFn: fnInfiniteLoopKey(params),
      event: params.type,
      eventTypes: infiniteLoopEventTypes
    }

    if (await isAPotentialInfiniteLoop(state, infiniteLoopData)) {
      logger.info(`Infinite loop break for event ${params.type}`)
      return successResponse(params.type, `event discarded to prevent infinite loop  ${params.type})`)
    }

    switch (params.type) {
      case 'be-observer.catalog_product_create': {
        logger.info('Invoking product create')
        const createRes = await openwhiskClient.invokeAction('product-backoffice/created', params.data)
        response = createRes?.response?.result?.body
        statusCode = createRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.catalog_product_update': {
        logger.info('Invoking product update')
        const updateRes = await openwhiskClient.invokeAction('product-backoffice/updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.catalog_product_delete': {
        logger.info('Invoking product delete')
        const deleteRes = await openwhiskClient.invokeAction('product-backoffice/deleted', params.data)
        response = deleteRes?.response?.result?.body
        statusCode = deleteRes?.response?.result?.statusCode
        break
      }
      default: {
        logger.error(`Event type not found: ${params.type}`)
        return errorResponse(HTTP_BAD_REQUEST, `This case type is not supported: ${params.type}`)
      }
    }

    if (!response.success) {
      logger.error(`Error response: ${response.error}`)
      return errorResponse(statusCode, response.error)
    }

    // Prepare to detect infinite loop on subsequent events
    await storeFingerPrint(state, fnInfiniteLoopKey(params), fnFingerprint(params))

    logger.info(`Successful request: ${statusCode}`)
    return successResponse(params.type, response)
  } catch (error) {
    logger.error(`Server error: ${error.message}`)
    return errorResponse(HTTP_INTERNAL_ERROR, error.message)
  }

  /**
   * This function generates a function to generate fingerprint for the data to be used in infinite loop detection based on params.
   * @param {object} params Data received from the event
   * @returns {Function} the function that generates the fingerprint
   */
  function fnFingerprint (params) {
    return () => { return { product: params.data.value.sku, description: params.data.value.description } }
  }

  /**
   * This function generates a function to create a key for the infinite loop detection based on params.
   * @param {object} params Data received from the event
   * @returns {Function} the function that generates the keu
   */
  function fnInfiniteLoopKey (params) {
    return () => { return `ilk_${params.data.value.sku}` }
  }
}

exports.main = main
