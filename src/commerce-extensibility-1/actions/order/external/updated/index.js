import {
  badRequest,
  buildErrorResponse,
  internalServerError,
  ok,
} from "@adobe/aio-commerce-sdk/core/responses";
import AioLogger from "@adobe/aio-lib-core-logging";

import { stringParameters } from "#lib/utils";

import { postProcess } from "./post.js";
import { preProcess } from "./pre.js";
import { sendData } from "./sender.js";
import { transformData } from "./transformer.js";
import { validateData } from "./validator.js";

/**
 * This action is on charge of sending updated order status information in external back-office application to Adobe commerce
 *
 * @returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main(params) {
  const logger = AioLogger("order-external-updated", {
    level: params.LOG_LEVEL || "info",
  });
  logger.info("Start processing request");
  logger.debug(`Received params: ${stringParameters(params)}`);
  try {
    logger.debug(`Validate data: ${JSON.stringify(params.data)}`);
    const validation = validateData(params);
    if (!validation.success) {
      logger.error(`Validation failed with error: ${validation.message}`);
      return badRequest(validation.message);
    }
    logger.debug(`Transform data: ${stringParameters(params)}`);
    const transformed = transformData(params);
    logger.debug(`Preprocess data: ${stringParameters(params)}`);
    const preProcessed = preProcess(params, transformed);
    logger.debug(`Start sending data: ${JSON.stringify(transformed)}`);
    const result = await sendData(params, transformed, preProcessed);
    if (!result.success) {
      logger.error(`Send data failed: ${result.message}`);
      return buildErrorResponse(result.statusCode, {
        body: { message: result.message },
      });
    }
    logger.debug(`Postprocess data: ${stringParameters(params)}`);
    postProcess(params, transformed, preProcessed, result);
    logger.debug("Process finished successfully");
    return ok("Order updated successfully");
  } catch (error) {
    logger.error(`Error processing the request: ${error}`);
    return internalServerError(error.message);
  }
}

export { main };
