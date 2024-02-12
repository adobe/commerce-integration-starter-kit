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
const { stringParameters, checkMissingRequestInputs, errorResponse } = require('../../../utils')
const { transformData } = require('./transformer')
const { sendData } = require('./sender')
const { HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST } = require('../../../constants')
const { validateData } = require('./validator')
const { preProcess } = require('../../external/created/pre')
const { postProcess } = require('../../external/created/post')

/**
 * This action is on charge of sending deleted customer group information in Adobe commerce to external back-office application
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  logger.info('[CustomerGroup][Commerce][Deleted] Start processing request')
  logger.debug(`[CustomerGroup][Commerce][Deleted] Consumer main params: ${stringParameters(params)}`)

  try {
    const requiredParams = [
      'data.customer_group_code']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])
    if (errorMessage) {
      return errorResponse(HTTP_BAD_REQUEST, `[Customer][Commerce][Deleted] ${errorMessage}`, logger)
    }

    logger.debug(`[CustomerGroup][Commerce][Deleted] Validate data: ${JSON.stringify(params.data)}`)
    validateData(params.data)

    logger.debug(`[CustomerGroup][Commerce][Deleted] Transform data: ${JSON.stringify(params.data)}`)
    const transformedData = transformData(params.data)

    logger.debug(`[CustomerGroup][Commerce][Deleted] Preprocess data: ${JSON.stringify(params)}`)
    const preProcessed = preProcess(params, transformedData)

    logger.debug(`[CustomerGroup][Commerce][Deleted] Start sending data: ${JSON.stringify(params)}`)
    const result = await sendData(params, transformedData, preProcessed)

    logger.debug(`[CustomerGroup][Commerce][Deleted] Postprocess data: ${JSON.stringify(params)}`)
    const postProcessed = postProcess(params, transformedData, preProcessed, result)

    logger.debug('[CustomerGroup][Commerce][Deleted] Process finished successfully')
    return {
      statusCode: HTTP_OK,
      body: {
        action: 'deleted',
        success: true
      }
    }
  } catch (error) {
    logger.error(`[CustomerGroup][Commerce][Deleted] Error processing the request: ${error.message}`)
    return {
      statusCode: HTTP_INTERNAL_ERROR,
      body: {
        success: false,
        error: [error.message]
      }
    }
  }
}

exports.main = main
