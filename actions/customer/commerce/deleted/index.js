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
const { preProcess } = require('../../external/created/pre')
const { postProcess } = require('../../external/created/post')
const { actionSuccessResponse, actionErrorResponse } = require('../../../responses')

/**
 * This action is on charge of sending deleted customer information in Adobe commerce to external back-office application
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  logger.info('[Customer][Commerce][Deleted] Start processing request')
  logger.debug(`[Customer][Commerce][Deleted] Consumer main params: ${stringParameters(params)}`)

  try {
    logger.debug(`[Customer][Commerce][Deleted] Validate data: ${JSON.stringify(params.data)}`)
    validateData(params.data)

    logger.debug(`[Customer][Commerce][Deleted] Transform data: ${JSON.stringify(params.data)}`)
    const transformedData = transformData(params.data)

    logger.debug(`[Customer][Commerce][Deleted] Preprocess data: ${JSON.stringify(params)}`)
    const preProcessed = preProcess(params, transformedData)

    logger.debug(`[Customer][Commerce][Deleted] Start sending data: ${JSON.stringify(params)}`)
    const result = await sendData(params, transformedData, preProcessed)

    logger.debug(`[Customer][Commerce][Deleted] Postprocess data: ${JSON.stringify(params)}`)
    const postProcessed = postProcess(params, transformedData, preProcessed, result)

    logger.debug('[Customer][Commerce][Deleted] Process finished successfully')
    return actionSuccessResponse('Customer deleted successfully')
  } catch (error) {
    logger.error(`[Customer][Commerce][Deleted] Error processing the request: ${error.message}`)
    return actionErrorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
