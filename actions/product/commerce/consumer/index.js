/*
* <license header>
*/

/**
 * This is the consumer of the events coming from Adobe Commerce related to product entity.
 */
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../../../utils')

async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    let response = {};
    let statusCode = 200;

    logger.info('[Product][Commerce] Start processing request');
    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(`[Product][Commerce] Consumer main params: ${stringParameters(params)}`);

    // check for missing request input parameters and headers
    const requiredParams = ['type', 'data.name', 'data.sku', 'data.created_at', 'data.updated_at']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, []);

    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    logger.info('[Product][Commerce] Params type: ' + params.type);

    switch (params.type) {
      case "com.adobe.commerce.observer.catalog_product_save_commit_after":
        if (params.data.created_at === params.data.updated_at) {
          logger.info('[Product][Commerce] Invoking create product');
          response = 'create product';
          statusCode = 200;
        } else {
          logger.info('[Product][Commerce] Invoking update product');
          response = 'update product';
          statusCode = 200;
        }
        break;
      case "com.adobe.commerce.observer.catalog_product_delete_commit_after":
        logger.info('[Product][Commerce] Invoking delete product');
        response = 'delete product';
        statusCode = 200;
        break;
      default:
        logger.error(`[Product][Commerce] type not found: ${params.type}`);
        response = `This case type is not supported: ${params.type}`;
        statusCode = 400;
        break;
    }

    // log the response status code
    logger.info(`[Product][Commerce] ${statusCode}: successful request`)
    return {
      statusCode: statusCode,
      body: {
        type: params.type,
        request: params.data,
        response
      }
    }
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, `[Product][Commerce] Server error: ${error.message}`, logger)
  }
}

exports.main = main
