/*
* <license header>
*/

/**
 * This is the consumer of the events coming from Adobe Commerce related to product entity.
 */
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../../../utils')
const openwhisk = require('openwhisk');
const {HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR} = require("../../../constants");

const createProduct = async (ow, data) => {

  try {
    return await ow.actions.invoke({
      name: "product/commercecreated",
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
    const ow = openwhisk({apihost: params.API_HOST, api_key: params.API_AUTH});
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    let response = {};
    let statusCode = HTTP_OK;

    logger.info('[Product][Commerce][Consumer] Start processing request');
    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(`[Product][Commerce][Consumer] Consumer main params: ${stringParameters(params)}`);

    // check for missing request input parameters and headers
    const requiredParams = ['type', 'data.value.created_at', 'data.value.updated_at']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, []);

    if (errorMessage) {
      // return and log client errors
      return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger);
    }

    logger.info('[Product][Commerce][Consumer] Params type: ' + params.type);

    switch (params.type) {
      case "com.adobe.commerce.observer.catalog_product_save_commit_after":
        if (params.data.created_at === params.data.updated_at) {
          logger.info('[Product][Commerce][Consumer] Invoking created product');

          const res = await createProduct(ow, params.data.value);
          // This logic will change after adding the rest of actions
          response = res?.response?.result?.body;
          statusCode = res?.response?.result?.statusCode;
        } else {
          logger.info('[Product][Commerce][Consumer] Invoking update product');
          response = 'update product';
          statusCode = HTTP_OK;
        }
        break;
      case "com.adobe.commerce.observer.catalog_product_delete_commit_after":
        logger.info('[Product][Commerce][Consumer] Invoking delete product');
        response = 'delete product';
        statusCode = HTTP_OK;
        break;
      default:
        logger.error(`[Product][Commerce][Consumer] type not found: ${params.type}`);
        response = `This case type is not supported: ${params.type}`;
        statusCode = HTTP_BAD_REQUEST;
        break;
    }

    // log the response status code
    logger.info(`[Product][Commerce][Consumer] ${statusCode}: successful request`)
    return {
      statusCode: statusCode,
      body: {
        type: params.type,
        request: params.data,
        response
      }
    }
  } catch (error) {
    // return with HTTP_INTERNAL_ERROR
    return errorResponse(HTTP_INTERNAL_ERROR, `[Product][Commerce][Consumer] Server error: ${error.message}`, logger)
  }
}

exports.main = main
