import { HTTP_INTERNAL_ERROR } from "#src/constants";
import { createShipment } from "#src/order/commerce-shipment-api-client";

/**
 * This function send the shipment created data to the Adobe commerce REST API
 *
 * @returns the result data of sending information to Adobe commerce
 * @param {object} params - include the env params
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 */
async function sendData(params, transformed, preProcessed) {
  try {
    const response = await createShipment(
      params,
      params.data.orderId,
      transformed,
    );
    return {
      success: true,
      message: response,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.statusCode || HTTP_INTERNAL_ERROR,
      message: error.message,
    };
  }
}

export { sendData };
