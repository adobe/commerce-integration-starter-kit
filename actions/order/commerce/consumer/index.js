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
 * This is the consumer of the events coming from Adobe Commerce related to order entity.
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

    logger.info('[Order][Commerce][Consumer] Start processing request')
    logger.debug(`[Order][Commerce][Consumer] Consumer main params: ${stringParameters(params)}`)

    const requiredParams = ['type', 'data.value.created_at', 'data.value.updated_at']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`[Order][Commerce][Consumer] Invalid request parameters: ${stringParameters(params)}`)
      return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger)
    }

    logger.info('[Order][Commerce][Consumer] Params type: ' + params.type)

    switch (params.type) {
      case 'com.adobe.commerce.observer.sales_order_save_commit_after': {
        const createdAt = Date.parse(params.data.value.created_at)
        const updatedAt = Date.parse(params.data.value.updated_at)
        if (createdAt === updatedAt) {
          logger.info('[Order][Commerce][Consumer] Invoking created order')

          const res = await openwhiskClient.invokeAction(
            'order-commerce/created', params.data.value)
          response = res?.response?.result?.body
          statusCode = res?.response?.result?.statusCode
        } else {
          logger.info('[Order][Commerce][Consumer] Invoking update order')
          const res = await openwhiskClient.invokeAction(
            'order-commerce/updated', params.data.value)
          response = res?.response?.result?.body
          statusCode = res?.response?.result?.statusCode
        }
        break
      }
      default:
        logger.error(`[Order][Commerce][Consumer] type not found: ${params.type}`)
        response = `This case type is not supported: ${params.type}`
        statusCode = HTTP_BAD_REQUEST
        break
    }

    logger.info(`[Order][Commerce][Consumer] ${statusCode}: successful request`)
    return {
      statusCode,
      body: {
        type: params.type,
        request: params.data.value,
        response
      }
    }
  } catch (error) {
    logger.error(`[Order][Commerce][Consumer] Server error: ${error.message}`)
    return errorResponse(HTTP_INTERNAL_ERROR, error.message, logger)
  }
}

exports.main = main
