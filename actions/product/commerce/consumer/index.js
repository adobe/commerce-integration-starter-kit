/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

/**
 * This is the consumer of the events coming from Adobe Commerce related to product entity.
 */
const { Core } = require('@adobe/aio-sdk')
const { stringParameters, checkMissingRequestInputs } = require('../../../utils')
const { HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')
const { errorResponse, successResponse } = require('../../../responses')

/**
 * This is the consumer of the events coming from Adobe Commerce related to product entity.
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('product-commerce-consumer', { level: params.LOG_LEVEL || 'info' })

  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

    let response = {}
    let statusCode = HTTP_OK

    logger.info('Start processing request')
    logger.debug(`Consumer main params: ${stringParameters(params)}`)

    const requiredParams = ['type', 'data.value.created_at', 'data.value.updated_at']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`Invalid request parameters: ${stringParameters(params)}`)
      return errorResponse(HTTP_BAD_REQUEST, `Invalid request parameters: ${errorMessage}`)
    }

    logger.info('Params type: ' + params.type)

    switch (params.type) {
      case 'com.adobe.commerce.observer.catalog_product_save_commit_after':
        const createdAt = Date.parse(params.data.value.created_at)
        const updatedAt = Date.parse(params.data.value.updated_at)
        if (createdAt === updatedAt) {
          logger.info('Invoking created product')

          const res = await openwhiskClient.invokeAction('product-commerce/created', params.data.value)
          response = res?.response?.result?.body
          statusCode = res?.response?.result?.statusCode
        } else {
          logger.info('Invoking update product')
          const res = await openwhiskClient.invokeAction('product-commerce/updated', params.data.value)
          response = res?.response?.result?.body
          statusCode = res?.response?.result?.statusCode
        }
        break
      case 'com.adobe.commerce.observer.catalog_product_delete_commit_after':
        logger.info('Invoking delete product')
        const res = await openwhiskClient.invokeAction('product-commerce/deleted', params.data.value)
        response = res?.response?.result?.body
        statusCode = res?.response?.result?.statusCode
        break
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
