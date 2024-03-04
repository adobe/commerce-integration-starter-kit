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
const { HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST, HTTP_OK } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')
const { errorResponse, successResponse } = require('../../../responses')

/**
 * This is the consumer of the events coming from External back-office applications related to Customer entity.
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('customer-external-consumer', { level: params.LOG_LEVEL || 'info' })

  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

    let response = {}
    let statusCode = HTTP_OK

    logger.info('Start processing request')
    logger.debug(`Consumer main params: ${stringParameters(params)}`)

    // check for missing request input parameters and headers
    const requiredParams = ['type', 'data']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`Invalid request parameters: ${errorMessage}`)
      return errorResponse(HTTP_BAD_REQUEST, `Invalid request parameters: ${errorMessage}`)
    }

    logger.info(`Params type: ${params.type}`)
    switch (params.type) {
      case 'be-observer.customer_create': {
        logger.info('Invoking customer create')
        const createRes = await openwhiskClient.invokeAction(
          'customer-backoffice/created', params.data)
        response = createRes?.response?.result?.body
        statusCode = createRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_update': {
        logger.info('Invoking customer update')
        const updateRes = await openwhiskClient.invokeAction('customer-backoffice/updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_delete': {
        logger.info('Invoking customer delete')
        const deleteRes = await openwhiskClient.invokeAction('customer-backoffice/deleted', params.data)
        response = deleteRes?.response?.result?.body
        statusCode = deleteRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_group_create': {
        logger.info('Invoking customer group create')
        const createRes = await openwhiskClient.invokeAction('customer-backoffice/group-created', params.data)
        response = createRes?.response?.result?.body
        statusCode = createRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_group_update': {
        logger.info('Invoking customer group update')
        const updateRes = await openwhiskClient.invokeAction('customer-backoffice/group-updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_group_delete': {
        logger.info('Invoking customer group delete')
        const deleteRes = await openwhiskClient.invokeAction('customer-backoffice/group-deleted', params.data)
        response = deleteRes?.response?.result?.body
        statusCode = deleteRes?.response?.result?.statusCode
        break
      }
      default:
        logger.error(`Event type not found: ${params.type}`)
        return errorResponse(HTTP_BAD_REQUEST, `This case type is not supported: ${params.type}`)
    }

    if (!response.success) {
      logger.error(`Error response: ${response.error}`)
      return errorResponse(statusCode, response.error)
    }

    logger.info(`Successful request: ${statusCode}`)
    return successResponse(params.type, response)
  } catch (error) {
    logger.error(`Server error: ${error.message}`)
    return errorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
