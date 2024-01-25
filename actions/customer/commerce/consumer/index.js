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

/**
 * This is the consumer of the events coming from Adobe Commerce related to customer entity.
 */
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../../../utils')
const openwhisk = require('openwhisk');
const {HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR} = require("../../../constants");

const createCustomer = async (client, data) => {

  try {
    return await client.actions.invoke({
      name: "customer/commerce-created",
      blocking: true,
      params: {
        data
      }
    });
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

const updateCustomer = async (client, data) => {

  try {
    return await client.actions.invoke({
      name: "customer/commerce-updated",
      blocking: true,
      params: {
        data
      }
    });
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

const deleteCustomer = async (client, data) => {

  try {
    return await client.actions.invoke({
      name: "customer/commerce-deleted",
      blocking: true,
      params: {
        data
      }
    });
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

async function main (params) {

  try {
    const openwhiskClient = openwhisk({apihost: params.API_HOST, api_key: params.API_AUTH});
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    let response = {};
    let statusCode = HTTP_OK;

    logger.info('[Customer][Commerce][Consumer] Start processing request');
    logger.debug(`[Customer][Commerce][Consumer] Consumer main params: ${stringParameters(params)}`);

    const requiredParams = ['type', 'data.value.created_at', 'data.value.updated_at']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, []);

    if (errorMessage) {
      logger.error(`[Customer][Commerce][Consumer] Invalid request parameters: ${stringParameters(params)}`);
      return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger);
    }

    logger.info('[Consumer][Commerce][Consumer] Params type: ' + params.type);

    switch (params.type) {
      case "com.adobe.commerce.observer.customer_save_commit_after":
        const createdAt = Date.parse(params.data.value.created_at);
        const updatedAt = Date.parse(params.data.value.updated_at);
        if (createdAt === updatedAt) {
          logger.info('[Customer][Commerce][Consumer] Invoking created customer');

          const res = await createCustomer(openwhiskClient, params.data.value);
          response = res?.response?.result?.body;
          statusCode = res?.response?.result?.statusCode;
        } else {
          logger.info('[Customer][Commerce][Consumer] Invoking update customer');
          const res = await updateCustomer(openwhiskClient, params.data.value);
          response = res?.response?.result?.body;
          statusCode = res?.response?.result?.statusCode;
        }
        break;
      case "com.adobe.commerce.observer.customer_delete_commit_after":
        logger.info('[Customer][Commerce][Consumer] Invoking delete customer');
        const res = await deleteCustomer(openwhiskClient, params.data.value);
        response = res?.response?.result?.body;
        statusCode = res?.response?.result?.statusCode;
        break;
      default:
        logger.error(`[Customer][Commerce][Consumer] type not found: ${params.type}`);
        response = `This case type is not supported: ${params.type}`;
        statusCode = HTTP_BAD_REQUEST;
        break;
    }

    logger.info(`[Customer][Commerce][Consumer] ${statusCode}: successful request`)
    return {
      statusCode: statusCode,
      body: {
        type: params.type,
        request: params.data.value,
        response
      }
    }
  } catch (error) {
    return errorResponse(HTTP_INTERNAL_ERROR, `[Consumer][Commerce][Consumer] Server error: ${error.message}`, logger)
  }
}

exports.main = main
