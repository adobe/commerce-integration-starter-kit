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
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../../../utils')
const { HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')

/**
 * This is the consumer of the events coming from Adobe Commerce related to stock entity.
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

    logger.info('[Stock][Commerce][Consumer] Start processing request')
    logger.debug(`[Stock][Commerce][Consumer] Consumer main params: ${stringParameters(params)}`)

    const requiredParams = ['type']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`[Stock][Commerce][Consumer] Invalid request parameters: ${stringParameters(params)}`)
      return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger)
    }

    logger.info('[Stock][Commerce][Consumer] Params type: ' + params.type)

    switch (params.type) {
      case 'com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after': {
        logger.info('[Stock][Commerce][Consumer] Invoking update stock item')
        const res = await openwhiskClient.invokeAction('stock-commerce/updated', params.data.value)
        response = res?.response?.result?.body
        statusCode = res?.response?.result?.statusCode
        break
      }
      default:
        logger.error(`[Stock][Commerce][Consumer] type not found: ${params.type}`)
        response = `This case type is not supported: ${params.type}`
        statusCode = HTTP_BAD_REQUEST
        break
    }

    logger.info(`[Stock][Commerce][Consumer] ${statusCode}: successful request`)
    return {
      statusCode,
      body: {
        type: params.type,
        request: params.data.value,
        response
      }
    }
  } catch (error) {
    return errorResponse(HTTP_INTERNAL_ERROR, `[Stock][Commerce][Consumer] Server error: ${error.message}`, logger)
  }
}

exports.main = main
