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
const { stringParameters, checkMissingRequestInputs } = require('../../../utils')
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
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  logger.info('[CustomerGroup][Commerce][Updated] Start processing request')
  logger.debug(`[CustomerGroup][Commerce][Updated] Consumer main params: ${stringParameters(params)}`)

  try {
    const requiredParams = ['data.customer_group_code']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])
    if (errorMessage) {
      logger.error(`[Customer][Commerce][Updated] ${errorMessage}`)
      return actionErrorResponse(HTTP_BAD_REQUEST, errorMessage)
    }

    logger.debug(`[CustomerGroup][Commerce][Updated] Validate data: ${JSON.stringify(params.data)}`)
    validateData(params.data)

    logger.debug(`[CustomerGroup][Commerce][Updated] Transform data: ${JSON.stringify(params.data)}`)
    const transformedData = transformData(params.data)

    logger.debug(`[CustomerGroup][Commerce][Updated] Preprocess data: ${JSON.stringify(params)}`)
    const preProcessed = preProcess(params, transformedData)

    logger.debug(`[CustomerGroup][Commerce][Updated] Start sending data: ${JSON.stringify(params)}`)
    const result = await sendData(params, transformedData, preProcessed)

    logger.debug(`[CustomerGroup][Commerce][Updated] Postprocess data: ${JSON.stringify(params)}`)
    const postProcessed = postProcess(params, transformedData, preProcessed, result)

    logger.debug('[CustomerGroup][Commerce][Updated] Process finished successfully')
    return actionSuccessResponse('Customer group updated successfully')
  } catch (error) {
    logger.error(`[CustomerGroup][Commerce][Updated] Error processing the request: ${error.message}`)
    return actionErrorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
