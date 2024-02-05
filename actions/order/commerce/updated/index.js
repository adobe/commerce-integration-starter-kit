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
const { stringParameters, errorResponse } = require('../../../utils')
const { transformData } = require('./transformer')
const { sendData } = require('./sender')
const { HTTP_OK, HTTP_INTERNAL_ERROR } = require('../../../constants')
const { validateData } = require('./validator')

/**
 * This action is on charge of sending updated order information in Adobe commerce to external back-office application
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  logger.info('[Order][Commerce][Updated] Start processing request')
  logger.debug(`[Order][Commerce][Updated] Consumer main params: ${stringParameters(params)}`)

  try {
    logger.debug(`[Order][Commerce][Updated] Validate data: ${JSON.stringify(params.data)}`)
    validateData(params.data)

    logger.debug(`[Order][Commerce][Updated] Transform data: ${JSON.stringify(params.data)}`)
    const data = transformData(params.data)

    logger.debug(`[Order][Commerce][Updated] Start sending data: ${JSON.stringify(data)}`)
    sendData(params, data)

    logger.debug('[Order][Commerce][Updated] Process finished successfully')
    return {
      statusCode: HTTP_OK,
      body: {
        action: 'updated',
        success: true
      }
    }
  } catch (error) {
    logger.error(`[Order][Commerce][Updated] Error processing the request: ${error.message}`)
    return errorResponse(HTTP_INTERNAL_ERROR, error.message, logger)
  }
}

exports.main = main
