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
const { HTTP_OK } = require('../../../actions/constants')
const { validateData } = require('./validator')
const { checkAvailableStock } = require('./stock')
const { stringParameters } = require('../../utils')

/**
 * Returns response error adapted to commerce webhooks module
 *
 * @param {string} message error message
 * @returns {object} return status code 200 and operation 'exception'.
 */
function errorWebhookResponse (message) {
  return {
    statusCode: HTTP_OK,
    body: {
      op: 'exception',
      message
    }
  }
}

/**
 * This web action is used to check stock of cart items on real time.
 *
 * @param {object} params - method params includes environment and request data
 * @returns {object} - response with success status and result
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  try {
    logger.info('[WebhookCheckStock] Start processing request')
    logger.debug(`[WebhookCheckStock] Webhook main params: ${stringParameters(params)}`)

    const validationResult = validateData(params)
    if (!validationResult.success) {
      logger.error(`[WebhookCheckStock] ${validationResult.message}`)
      return errorWebhookResponse(validationResult.message)
    }

    const checkAvailableStockResult = await checkAvailableStock(params.data)
    if (!checkAvailableStockResult.success) {
      logger.error(`[WebhookCheckStock] ${checkAvailableStockResult.message}`)
      return errorWebhookResponse(checkAvailableStockResult.message)
    }

    logger.info(`[WebhookCheckStock] ${HTTP_OK}: successful request`)

    return {
      statusCode: HTTP_OK,
      body: {
        op: 'success'
      }
    }
  } catch (error) {
    logger.error(`[WebhookCheckStock] Server error: ${error.message}`, error)
    return errorWebhookResponse(error.message)
  }
}

exports.main = main
