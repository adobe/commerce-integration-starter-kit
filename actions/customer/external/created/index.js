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
const { preProcess } = require('./pre')
const { postProcess } = require('./post')
const { actionErrorResponse, actionSuccessResponse } = require('../../../responses')

/**
 * This action is on charge of sending created customer information in external back-office application to Adobe commerce
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  logger.info('[Customer][External][Created] Start processing request')
  logger.debug(`[Customer][External][Created] Action main params: ${stringParameters(params)}`)

  try {
    logger.debug(`[Customer][External][Created] Validate data: ${JSON.stringify(params.data)}`)
    const validation = validateData(params)
    if (!validation.success) {
      logger.error(`[Customer][External][Created] ${validation.message}`)
      return actionErrorResponse(HTTP_BAD_REQUEST, validation.message)
    }

    logger.debug(`[Customer][External][Created] Transform data: ${JSON.stringify(params)}`)
    const transformed = transformData(params)

    logger.debug(`[Customer][External][Created] Preprocess data: ${JSON.stringify(params)}`)
    const preProcessed = preProcess(params, transformed)

    logger.debug(`[Customer][External][Created] Start sending data: ${JSON.stringify(transformed)}`)
    const result = await sendData(params, transformed, preProcessed)
    if (!result.success) {
      return actionErrorResponse(result.statusCode, result.message)
    }

    logger.debug(`[Customer][External][Created] Postprocess data: ${JSON.stringify(params)}`)
    const postProcessed = postProcess(params, transformed, preProcessed, result)

    logger.debug('[Customer][External][Created] Process finished successfully')
    return actionSuccessResponse('Customer created successfully')
  } catch (error) {
    logger.error(`[Customer][External][Created] Error processing the request: ${error}`)
    return actionErrorResponse(HTTP_INTERNAL_ERROR, error)
  }
}

exports.main = main
