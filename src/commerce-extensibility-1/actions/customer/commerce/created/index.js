import {
  getInstrumentationHelpers,
  instrumentEntrypoint,
} from "@adobe/aio-lib-telemetry";

import { HTTP_BAD_REQUEST, HTTP_INTERNAL_ERROR } from "#src/constants";
import {
  actionErrorResponse,
  actionSuccessResponse,
  isActionSuccessful,
} from "#src/responses";
import { telemetryConfig } from "#src/telemetry";
import { stringParameters } from "#src/utils";

import { postProcess } from "./post";
import { preProcess } from "./pre";
import { sendData } from "./sender";
import { transformData } from "./transformer";
import { validateData } from "./validator";

/**
 * This action is on charge of sending created customer information in Adobe commerce to external back-office application
 *
 * @returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function __main(params) {
  const { logger } = getInstrumentationHelpers();
  logger.info("Start processing request");
  logger.debug(`Received params: ${stringParameters(params)}`);
  try {
    logger.debug(`Validate data: ${JSON.stringify(params.data)}`);
    const validation = validateData(params.data);
    if (!validation.success) {
      logger.error(`Validation failed with error: ${validation.message}`);
      return actionErrorResponse(HTTP_BAD_REQUEST, validation.message);
    }
    logger.debug(`Transform data: ${JSON.stringify(params.data)}`);
    const transformedData = transformData(params.data);
    logger.debug(`Preprocess data: ${stringParameters(params)}`);
    const preProcessed = preProcess(params, transformedData);
    logger.debug(`Start sending data: ${JSON.stringify(params)}`);
    const result = await sendData(params, transformedData, preProcessed);
    if (!result.success) {
      logger.error(`Send data failed: ${result.message}`);
      return actionErrorResponse(result.statusCode, result.message);
    }
    logger.debug(`Postprocess data: ${stringParameters(params)}`);
    postProcess(params, transformedData, preProcessed, result);
    logger.debug("Process finished successfully");
    return actionSuccessResponse("Customer created successfully");
  } catch (error) {
    logger.error(`Error processing the request: ${error.message}`);
    return actionErrorResponse(HTTP_INTERNAL_ERROR, error.message);
  }
}

export const main = instrumentEntrypoint(__main, {
  ...telemetryConfig,
  isSuccessful: isActionSuccessful,
});
