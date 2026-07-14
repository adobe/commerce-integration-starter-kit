import { Core } from "@adobe/aio-sdk";

import { HTTP_OK } from "#src/constants";
import { webhookErrorResponse, webhookSuccessResponse } from "#src/responses";
import { stringParameters } from "#src/utils";

import { checkAvailableStock } from "./stock.js";
import { validateData } from "./validator.js";

/**
 * This web action is used to check stock of cart items on real time.
 *
 * @param {object} params - method params includes environment and request data
 * @returns - response with success status and result
 */
async function main(params) {
  const logger = Core.Logger("webhook-check-stock", {
    level: params.LOG_LEVEL || "info",
  });
  try {
    logger.info("Start processing request");
    logger.debug(`Webhook main params: ${stringParameters(params)}`);
    const validationResult = validateData(params);
    if (!validationResult.success) {
      logger.error(`Validation failed with error: ${validationResult.message}`);
      return webhookErrorResponse(validationResult.message);
    }
    const checkAvailableStockResult = await checkAvailableStock(params.data);
    if (!checkAvailableStockResult.success) {
      logger.error(`Stock check failed: ${checkAvailableStockResult.message}`);
      return webhookErrorResponse(checkAvailableStockResult.message);
    }
    logger.info(`Successful request: ${HTTP_OK}`);
    return webhookSuccessResponse();
  } catch (error) {
    logger.error(`Server error: ${error.message}`, error);
    return webhookErrorResponse(error.message);
  }
}

export { main };
