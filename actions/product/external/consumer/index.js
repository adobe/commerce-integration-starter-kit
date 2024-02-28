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

const { Core } = require('@adobe/aio-sdk')
const { stringParameters, checkMissingRequestInputs } = require('../../../utils')
const { HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST, HTTP_OK } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')
const { errorResponse, successResponse } = require('../../../responses')

/**
 * This is the consumer of the events coming from External back-office applications related to product entity.
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

    let response = {}
    let statusCode = HTTP_OK

    logger.info('[Product][External][Consumer] Start processing request')
    logger.debug(`[Product][External][Consumer] Consumer main params: ${stringParameters(params)}`)

    // check for missing request input parameters and headers
    const requiredParams = ['type', 'data']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`[Product][External][Consumer] Invalid request parameters: ${errorMessage}`)
      return errorResponse(HTTP_BAD_REQUEST, errorMessage)
    }

    logger.info(`[Product][External][Consumer] Params type: ${params.type}`)
    switch (params.type) {
      case 'be-observer.catalog_product_create':
        logger.info('[Product][External][Consumer] Invoking product create')
        const createRes = await openwhiskClient.invokeAction('product-backoffice/created', params.data)
        response = createRes?.response?.result?.body
        statusCode = createRes?.response?.result?.statusCode
        break
      case 'be-observer.catalog_product_update':
        logger.info('[Product][External][Consumer] Invoking product update')
        const updateRes = await openwhiskClient.invokeAction('product-backoffice/updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      case 'be-observer.catalog_product_delete':
        logger.info('[Product][External][Consumer] Invoking product delete')
        const deleteRes = await openwhiskClient.invokeAction('product-backoffice/deleted', params.data)
        response = deleteRes?.response?.result?.body
        statusCode = deleteRes?.response?.result?.statusCode
        break
      default:
        logger.error(`[Product][External][Consumer] type not found: ${params.type}`)
        return errorResponse(HTTP_BAD_REQUEST, `This case type is not supported: ${params.type}`)
    }

    if (!response.success) {
      logger.error(`[Product][External][Consumer] ${response.error}`)
      return errorResponse(statusCode, response.error)
    }

    logger.info(`[Product][External][Consumer] ${statusCode}: successful request`)
    return successResponse(params.type, response)
  } catch (error) {
    logger.error(`[Product][External][Consumer] Server error: ${error.message}`)
    return errorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
