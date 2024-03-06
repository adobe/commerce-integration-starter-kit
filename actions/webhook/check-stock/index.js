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
const { webhookErrorResponse, webhookSuccessResponse } = require('../../responses')

/**
 * This web action is used to check stock of cart items on real time.
 *
 * @param {object} params - method params includes environment and request data
 * @returns {object} - response with success status and result
 */
async function main (params) {
  const logger = Core.Logger('webhook-check-stock', { level: params.LOG_LEVEL || 'info' })
  try {
    logger.info('Start processing request')
    logger.debug(`Webhook main params: ${stringParameters(params)}`)

    const validationResult = validateData(params)
    if (!validationResult.success) {
      logger.error(`Validation failed with error: ${validationResult.message}`)
      return webhookErrorResponse(validationResult.message)
    }

    const checkAvailableStockResult = await checkAvailableStock(params.data)
    if (!checkAvailableStockResult.success) {
      logger.error(`${checkAvailableStockResult.message}`)
      return webhookErrorResponse(checkAvailableStockResult.message)
    }

    logger.info(`Successful request: ${HTTP_OK}`)
    return webhookSuccessResponse()
  } catch (error) {
    logger.error(`Server error: ${error.message}`, error)
    return webhookErrorResponse(error.message)
  }
}

exports.main = main
