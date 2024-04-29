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
const { actionSuccessResponse, actionErrorResponse } = require('../responses')
const { HTTP_OK, HTTP_INTERNAL_ERROR } = require('../constants')

/**
 * This is the starter kit indo endpoint.
 *
 * @returns {object} returns starter kit version and registration data
 * @param {object} params - includes the env params
 */
async function main (params) {
  const version = require('../../package.json').version
  const registrations = require('../../onboarding/custom/starter-kit-registrations.json')

  // create a Logger
  const logger = Core.Logger('starter-kit-info', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the starter kit info action')

    // log the response status code
    logger.info(`Successful request: ${HTTP_OK}`)
    return actionSuccessResponse({
      starter_kit_version: version,
      registrations
    })
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return actionErrorResponse(HTTP_INTERNAL_ERROR, `Server error: ${error.message}`)
  }
}

exports.main = main
