const { HTTP_OK } = require('./constants')

/**
 *
 * Returns a success response object, this method should be called on the handlers actions
 *
 * @param {string} message a descriptive message of the result
 *        e.g. 'missing xyz parameter'
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function actionSuccessResponse (message) {
  return {
    statusCode: HTTP_OK,
    body: {
      success: true,
      message
    }
  }
}

/**
 *
 * Returns a success response object, this method should be called on the handlers actions
 *
 * @param {number} statusCode the status code.
 *        e.g. 400
 * @param {string} error a descriptive message of the result
 *        e.g. 'missing xyz parameter'
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function actionErrorResponse (statusCode, error) {
  return {
    statusCode,
    body: {
      success: false,
      error
    }
  }
}

/**
 *
 * Returns an error response object, this method should be called on the consumers and public webhooks
 *
 * @param {number} statusCode the error status code.
 *        e.g. 400
 * @param {string} message the error message.
 *        e.g. 'missing xyz parameter'
 * @returns {object} the error object, ready to be returned from the action main's function.
 */
function errorResponse (statusCode, message) {
  return {
    error: {
      statusCode,
      body: {
        error: message
      }
    }
  }
}

/**
 *
 * Returns a success response object, this method should be called on the consumers
 *
 * @param {string} type the event type received by consumer
 *        e.g. 'adobe.commerce.observer.catalog_product_save_commit_after'
 * @param {object} response the response object returned from the event handler
 *        e.g. '{ success: true, message: 'Product created successfully'}'
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function successResponse (type, response) {
  return {
    statusCode: HTTP_OK,
    body: {
      type,
      response
    }
  }
}

module.exports = {
  successResponse,
  errorResponse,
  actionErrorResponse,
  actionSuccessResponse
}
