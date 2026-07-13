import { HTTP_OK } from "./constants";

/**
 *
 * Returns a success response object, this method should be called on the handlers actions
 *
 * @param {string} message a descriptive message of the result
 *        e.g. 'missing xyz parameter'
 * @returns the response object, ready to be returned from the action main's function.
 */
function actionSuccessResponse(message) {
  return {
    statusCode: HTTP_OK,
    body: {
      success: true,
      message,
    },
  };
}

/**
 *
 * Returns a success response object, this method should be called on the handlers actions
 *
 * @param {number} statusCode the status code.
 *        e.g. 400
 * @param {string} error a descriptive message of the result
 *        e.g. 'missing xyz parameter'
 * @returns the response object, ready to be returned from the action main's function.
 */
function actionErrorResponse(statusCode, error) {
  return {
    statusCode,
    body: {
      success: false,
      error,
    },
  };
}

/**
 * Helper function used to determine if an action was successful.
 * @param {unknown} result - The result of the instrumented action.
 * @returns - True if the action is successful, false otherwise.
 */
function isActionSuccessful(result) {
  if (result && typeof result === "object") {
    return "body" in result && "success" in result.body && result.body.success;
  }

  // Not an object, we assume it's successful if it has a truthy value.
  return !!result;
}

/**
 *
 * Returns an error response object, this method should be called on the consumers and public webhooks
 *
 * @param {number} statusCode the error status code.
 *        e.g. 400
 * @param {string} message the error message.
 *        e.g. 'missing xyz parameter'
 * @returns the error object, ready to be returned from the action main's function.
 */
function errorResponse(statusCode, message) {
  return {
    error: {
      statusCode,
      body: {
        error: message,
      },
    },
  };
}

/**
 *
 * Returns a success response object, this method should be called on the consumers
 *
 * @param {string} type the event type received by consumer
 *        e.g. 'adobe.commerce.observer.catalog_product_save_commit_after'
 * @param {object} response the response object returned from the event handler
 *        e.g. '{ success: true, message: 'Product created successfully'}'
 * @returns the response object, ready to be returned from the action main's function.
 */
function successResponse(type, response) {
  return {
    statusCode: HTTP_OK,
    body: {
      type,
      response,
    },
  };
}

/**
 * Helper function used to determine if a consumer was successful.
 * @param {unknown} result - The result of the instrumented consumer.
 * @returns - True if the consumer is successful, false otherwise.
 */
function isConsumerSuccessful(result) {
  if (result && typeof result === "object") {
    if ("error" in result) {
      return false;
    }
    return "statusCode" in result && result.statusCode === HTTP_OK;
  }

  // Not an object, we assume it's successful if it has a truthy value.
  return !!result;
}

/**
 * Returns response error adapted to ingestion webhooks module
 *
 * @param {string} message the error message.
 *        e.g. 'missing xyz parameter'
 * @returns the response object, ready to be returned from the action main's function.
 */
function webhookErrorResponse(message) {
  return {
    statusCode: HTTP_OK,
    body: {
      op: "exception",
      message,
    },
  };
}

/**
 *
 * Returns a success response object, this method should be called on the sync webhooks
 *
 * @returns the response object, ready to be returned from the action main's function.
 */
function webhookSuccessResponse() {
  return {
    statusCode: HTTP_OK,
    body: {
      op: "success",
    },
  };
}

/**
 * Helper function used to determine if a webhook was successful.
 * @param {unknown} result - The result of the instrumented webhook.
 * @returns - True if the webhook is successful, false otherwise.
 */
function isWebhookSuccessful(result) {
  if (result && typeof result === "object") {
    return "op" in result && result.op === "success";
  }

  // Not an object, we assume it's successful if it has a truthy value.
  return !!result;
}

export {
  actionErrorResponse,
  actionSuccessResponse,
  errorResponse,
  isActionSuccessful,
  isConsumerSuccessful,
  isWebhookSuccessful,
  successResponse,
  webhookErrorResponse,
  webhookSuccessResponse,
};
