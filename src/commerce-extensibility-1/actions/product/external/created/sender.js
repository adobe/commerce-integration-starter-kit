import { HTTP_INTERNAL_ERROR } from "#lib/constants";
import { createProduct } from "#src/product/commerce-product-api-client";

/**
 * This function send the product created data to the Adobe commerce REST API
 *
 * @returns the result data of sending information to Adobe commerce
 * @param {object} params - include the env params
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 */
async function sendData(params, transformed, preProcessed) {
  try {
    const response = await createProduct(params, transformed);
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
