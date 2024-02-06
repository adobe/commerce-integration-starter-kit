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
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../../../utils')
const { HTTP_INTERNAL_ERROR, HTTP_BAD_REQUEST, HTTP_OK } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')

/**
 * This is the consumer of the events coming from External back-office applications related to Customer entity.
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

    let response = {}
    let statusCode = HTTP_OK

    logger.info('[Customer][External][Consumer] Start processing request')
    logger.debug(`[Customer][External][Consumer] Consumer main params: ${stringParameters(params)}`)

    // check for missing request input parameters and headers
    const requiredParams = ['type', 'data']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      return errorResponse(HTTP_BAD_REQUEST, `[Customer][External][Consumer] Invalid request parameters: ${errorMessage}`, logger)
    }

    logger.info(`[Customer][External][Consumer] Params type: ${params.type}`)
    switch (params.type) {
      case 'be-observer.customer_create': {
        logger.info('[Customer][External][Consumer] Invoking customer create')
        const createRes = await openwhiskClient.invokeAction(
          'customer-backoffice/created', params.data)
        response = createRes?.response?.result?.body
        statusCode = createRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_update': {
        logger.info('[Customer][External][Consumer] Invoking customer update')
        const updateRes = await openwhiskClient.invokeAction('customer-backoffice/updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_delete': {
        logger.info('[Customer][External][Consumer] Invoking customer delete')
        const deleteRes = await openwhiskClient.invokeAction('customer-backoffice/deleted', params.data)
        response = deleteRes?.response?.result?.body
        statusCode = deleteRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_group_create': {
        logger.info('[CustomerGroup][External][Consumer] Invoking customer group create')
        const createRes = await openwhiskClient.invokeAction('customer-backoffice/group-created', params.data)
        response = createRes?.response?.result?.body
        statusCode = createRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_group_update': {
        logger.info('[CustomerGroup][External][Consumer] Invoking customer group update')
        const updateRes = await openwhiskClient.invokeAction('customer-backoffice/group-updated', params.data)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'be-observer.customer_group_delete': {
        logger.info('[CustomerGroup][External][Consumer] Invoking customer group delete')
        const deleteRes = await openwhiskClient.invokeAction('customer-backoffice/group-deleted', params.data)
        response = deleteRes?.response?.result?.body
        statusCode = deleteRes?.response?.result?.statusCode
        break
      }
      default:
        logger.error(`[Customer][External][Consumer] type not found: ${params.type}`)
        response = `This case type is not supported: ${params.type}`
        statusCode = HTTP_BAD_REQUEST
        break
    }

    logger.info(`[Customer][External][Consumer] ${statusCode}: successful request`)
    return {
      statusCode,
      body: {
        type: params.type,
        request: params.data,
        response
      }
    }
  } catch (error) {
    return errorResponse(
      HTTP_INTERNAL_ERROR,
      `[Customer][External][Consumer] Server error: ${error.message}`,
      logger)
  }
}

exports.main = main
