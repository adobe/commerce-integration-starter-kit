import { HTTP_INTERNAL_SERVER_ERROR } from "@adobe/aio-commerce-sdk/core/responses";

import { deleteCustomerGroup } from "#src/customer/commerce-customer-group-api-client";

/**
 * This function send the customer group deleted data to the Adobe commerce REST API
 *
 * @returns {Promise<
 *   | { success: true, message: unknown }
 *   | { success: false, statusCode: number, message: string }
 * >} Result consumed by the action's `main`. On success, `message` carries the
 *   Adobe Commerce API response; on failure, `statusCode` (from the API error, or
 *   HTTP_INTERNAL_SERVER_ERROR) and `message` are forwarded to the error response.
 * @param {object} params - include the env params
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 */
async function sendData(params, transformed, preProcessed) {
  try {
    const response = await deleteCustomerGroup(params, transformed);
    return {
      success: true,
      message: response,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
}

export { sendData };
