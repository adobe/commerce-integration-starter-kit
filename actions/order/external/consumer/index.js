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
const { HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST, HTTP_OK } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')

/**
 * This is the consumer of the events coming from External back-office applications related to order status entity.
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

    logger.info('[Order][External][Consumer] Start processing request')
    logger.debug(`[Order][External][Consumer] Consumer main params: ${stringParameters(params)}`)

    // check for missing request input parameters and headers
    const requiredParams = ['type', 'data']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      return errorResponse(HTTP_BAD_REQUEST, `[Order][External][Consumer] Invalid request parameters: ${errorMessage}`, logger)
    }

    logger.info(`[Order][External][Consumer] Params type: ${params.type}`)
    switch (params.type) {
      case 'be-observer.sales_order_status_update': {
        logger.info('[Order][External][Consumer] Invoking order status update')
        const updateRes = await openwhiskClient.invokeAction('order-backoffice/updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.sales_order_shipment_create': {
        logger.info('[Order][External][Consumer] Invoking shipment create')
        const updateRes = await openwhiskClient.invokeAction('order-backoffice/shipment-created', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.sales_order_shipment_update': {
        logger.info('[Order][External][Consumer] Invoking shipment update')
        const updateRes = await openwhiskClient.invokeAction('order-backoffice/shipment-updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      default: {
        logger.error(`[Order][External][Consumer] type not found: ${params.type}`)
        response = `This case type is not supported: ${params.type}`
        statusCode = HTTP_BAD_REQUEST
        break
      }
    }

    logger.info(`[Order][External][Consumer] ${statusCode}: successful request`)
    return {
      statusCode,
      body: {
        type: params.type,
        request: params.data,
        response
      }
    }
  } catch (error) {
    return errorResponse(
      HTTP_INTERNAL_ERROR,
            `[Order][External][Consumer] Server error: ${error.message}`,
            logger)
  }
}

exports.main = main
