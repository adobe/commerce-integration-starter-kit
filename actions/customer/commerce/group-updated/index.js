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
const { HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST } = require('../../../constants')
const { validateData } = require('./validator')
const { postProcess } = require('../../external/created/post')
const { preProcess } = require('../../external/created/pre')
const { actionSuccessResponse, actionErrorResponse } = require('../../../responses')

/**
 * This action is on charge of sending updated customer group information in Adobe commerce to external back-office application
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('customer-commerce-group-updated', { level: params.LOG_LEVEL || 'info' })

  logger.info('Start processing request')
  logger.debug(`Received params: ${stringParameters(params)}`)

  try {
    logger.debug(`Validate data: ${JSON.stringify(params.data)}`)
    const validation = validateData(params.data)
    if (!validation.success) {
      logger.error(`Validation failed with error: ${validation.message}`)
      return actionErrorResponse(HTTP_BAD_REQUEST, validation.message)
    }

    logger.debug(`Transform data: ${JSON.stringify(params.data)}`)
    const transformedData = transformData(params.data)

    logger.debug(`Preprocess data: ${stringParameters(params)}`)
    const preProcessed = preProcess(params, transformedData)

    logger.debug(`Start sending data: ${JSON.stringify(params)}`)
    const result = await sendData(params, transformedData, preProcessed)
    if (!result.success) {
      logger.error(`Send data failed: ${result.message}`)
      return actionErrorResponse(result.statusCode, result.message)
    }

    logger.debug(`Postprocess data: ${stringParameters(params)}`)
    const postProcessed = postProcess(params, transformedData, preProcessed, result)

    logger.debug('Process finished successfully')
    return actionSuccessResponse('Customer group updated successfully')
  } catch (error) {
    logger.error(`Error processing the request: ${error.message}`)
    return actionErrorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
