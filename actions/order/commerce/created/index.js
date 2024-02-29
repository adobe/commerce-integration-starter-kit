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
const { stringParameters } = require('../../../utils')
const { transformData } = require('./transformer')
const { sendData } = require('./sender')
const { HTTP_INTERNAL_ERROR } = require('../../../constants')
const { validateData } = require('./validator')
const { preProcess } = require('../../../customer/external/created/pre')
const { postProcess } = require('../../../customer/external/created/post')
const { actionSuccessResponse, actionErrorResponse } = require('../../../responses')

/**
 * This action is on charge of sending created order information in Adobe commerce to external back-office application
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  logger.info('[Order][Commerce][Created] Start processing request')
  logger.debug(`[Order][Commerce][Created] Consumer main params: ${stringParameters(params)}`)

  try {
    logger.debug(`[Order][Commerce][Created] Validate data: ${JSON.stringify(params.data)}`)
    validateData(params.data)

    logger.debug(`[Order][Commerce][Created] Transform data: ${JSON.stringify(params.data)}`)
    const transformedData = transformData(params.data)

    logger.debug(`[Order][Commerce][Created] Preprocess data: ${JSON.stringify(params)}`)
    const preProcessed = preProcess(params, transformedData)

    logger.debug(`[Order][Commerce][Created] Start sending data: ${JSON.stringify(params)}`)
    const result = await sendData(params, transformedData, preProcessed)
    if (!result.success) {
      logger.error(`[Order][Commerce][Created] ${result.message}`)
      return actionErrorResponse(result.statusCode, result.message)
    }

    logger.debug(`[Order][Commerce][Created] Postprocess data: ${JSON.stringify(params)}`)
    const postProcessed = postProcess(params, transformedData, preProcessed, result)

    logger.debug('[Order][Commerce][Created] Process finished successfully')
    return actionSuccessResponse('Order created successfully')
  } catch (error) {
    logger.error(`[Order][Commerce][Created] Error processing the request: ${error.message}`)
    return actionErrorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
