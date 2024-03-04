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
const { errorResponse, successResponse } = require('../../../responses')
const { HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR } = require('../../../constants')
const Openwhisk = require('../../../openwhisk')

/**
 * This is the consumer of the events coming from Adobe Commerce related to customer entity.
 *
 * @returns {object} returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main (params) {
  const logger = Core.Logger('customer-commerce-consumer', { level: params.LOG_LEVEL || 'info' })
  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

    let response = {}
    let statusCode = HTTP_OK

    logger.info('Start processing request')
    logger.debug(`Consumer main params: ${stringParameters(params)}`)

    const requiredParams = ['type']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`Invalid request parameters: ${errorMessage}`)
      return errorResponse(HTTP_BAD_REQUEST, `Invalid request parameters: ${errorMessage}`)
    }

    logger.info('Params type: ' + params.type)

    switch (params.type) {
      case 'com.adobe.commerce.observer.customer_save_commit_after': {
        const requiredParams = [
          'data.value.created_at',
          'data.value.updated_at']
        const errorMessage = checkMissingRequestInputs(params, requiredParams,
          [])
        if (errorMessage) {
          logger.error(`Invalid request parameters: ${errorMessage}`)
          return errorResponse(HTTP_BAD_REQUEST, `Invalid request parameters: ${errorMessage}`)
        }

        const createdAt = Date.parse(params.data.value.created_at)
        const updatedAt = Date.parse(params.data.value.updated_at)
        if (createdAt === updatedAt) {
          logger.info('Invoking created customer')
          const res = await openwhiskClient.invokeAction(
            'customer-commerce/created', params.data.value)
          response = res?.response?.result?.body
          statusCode = res?.response?.result?.statusCode
        } else {
          logger.info('Invoking update customer')
          const res = await openwhiskClient.invokeAction(
            'customer-commerce/updated', params.data.value)
          response = res?.response?.result?.body
          statusCode = res?.response?.result?.statusCode
        }
        break
      }
      case 'com.adobe.commerce.observer.customer_delete_commit_after': {
        logger.info('Invoking delete customer')
        const res = await openwhiskClient.invokeAction(
          'customer-commerce/deleted', params.data.value)
        response = res?.response?.result?.body
        statusCode = res?.response?.result?.statusCode
        break
      }
      case 'com.adobe.commerce.observer.customer_group_save_commit_after': {
        logger.info('Invoking update customer group')
        const updateRes = await openwhiskClient.invokeAction(
          'customer-commerce/group-updated', params.data.value)
        response = updateRes?.response?.result?.body
        statusCode = updateRes?.response?.result?.statusCode
        break
      }
      case 'com.adobe.commerce.observer.customer_group_delete_commit_after': {
        const requiredParams = [
          'data.value.customer_group_code']
        const errorMessage = checkMissingRequestInputs(params, requiredParams,
          [])
        if (errorMessage) {
          logger.error(`Invalid request parameters: ${errorMessage}`)
          return errorResponse(HTTP_BAD_REQUEST, `Invalid request parameters: ${errorMessage}`)
        }
        logger.info('Invoking delete customer group')
        const deleteRes = await openwhiskClient.invokeAction(
          'customer-commerce/group-deleted', params.data.value)
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
    return errorResponse(HTTP_INTERNAL_ERROR, `Server error: ${error.message}`)
  }
}

exports.main = main
