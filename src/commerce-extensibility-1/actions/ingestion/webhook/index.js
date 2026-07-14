import { publishEvent } from "@adobe/aio-commerce-lib-app";
import { CommerceSdkValidationError } from "@adobe/aio-commerce-lib-core/error";
import { createAdobeIoEventsApiClient } from "@adobe/aio-commerce-lib-events/io-events";
import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";
import { Core } from "@adobe/aio-sdk";

import {
  BACKOFFICE_PROVIDER_KEY,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_ERROR,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from "#src/constants";
import { errorResponse, successResponse } from "#src/responses";
import { stringParameters } from "#src/utils";

import { checkAuthentication } from "./auth.js";
import { validateData } from "./validator.js";

/**
 * This web action allow external back-office application publish event to IO event using custom authentication mechanism.
 *
 * @param {object} params - method params includes environment and request data
 * @returns response with success status and result
 */
async function main(params) {
  const logger = Core.Logger("ingestion-webhook", {
    level: params.LOG_LEVEL || "info",
  });
  try {
    logger.info("Start processing request");
    logger.debug(`Webhook main params: ${stringParameters(params)}`);
    const authentication = checkAuthentication(params);
    if (!authentication.success) {
      logger.error(
        `Authentication failed with error: ${authentication.message}`,
      );
      return errorResponse(HTTP_UNAUTHORIZED, authentication.message);
    }
    const validationResult = validateData(params);
    if (!validationResult.success) {
      logger.error(`Validation failed with error: ${validationResult.message}`);
      return errorResponse(HTTP_BAD_REQUEST, validationResult.message);
    }
    const client = createAdobeIoEventsApiClient({
      auth: resolveImsAuthParams(params),
    });
    const eventType = params.data.event;
    logger.info(`Process event data ${eventType}`);
    logger.debug(
      `Publish event ${eventType} to provider ${BACKOFFICE_PROVIDER_KEY}`,
    );
    await publishEvent({
      client,
      provider: BACKOFFICE_PROVIDER_KEY,
      event: eventType,
      payload: params.data.value,
    });
    logger.info(`Successful request: ${HTTP_OK}`);
    return successResponse(eventType, {
      success: true,
      message: "Event published successfully",
    });
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    if (error instanceof CommerceSdkValidationError) {
      logger.error(error.display());
    }
    return errorResponse(HTTP_INTERNAL_ERROR, error.message);
  }
}

export { main };
