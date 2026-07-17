import { publishEvent } from "@adobe/aio-commerce-lib-app";
import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";
import { CommerceSdkValidationError } from "@adobe/aio-commerce-sdk/core/error";
import {
  badRequest,
  HTTP_OK,
  internalServerError,
  ok,
  unauthorized,
} from "@adobe/aio-commerce-sdk/core/responses";
import { createAdobeIoEventsApiClient } from "@adobe/aio-commerce-sdk/events/io-events";
import AioLogger from "@adobe/aio-lib-core-logging";

import appConfig from "#app.commerce.config";
import { stringParameters } from "#lib/utils";

import { checkAuthentication } from "./auth.js";
import { validateData } from "./validator.js";

const BACKOFFICE_PROVIDER_KEY = appConfig.eventing.external[0].provider.key;

/**
 * This web action allow external back-office application publish event to IO event using custom authentication mechanism.
 *
 * @param {object} params - method params includes environment and request data
 * @returns response with success status and result
 */
async function main(params) {
  const logger = AioLogger("ingestion-webhook", {
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
      return unauthorized(authentication.message);
    }
    const validationResult = validateData(params);
    if (!validationResult.success) {
      logger.error(`Validation failed with error: ${validationResult.message}`);
      return badRequest(validationResult.message);
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
    return ok({
      body: {
        type: eventType,
        response: {
          success: true,
          message: "Event published successfully",
        },
      },
    });
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    if (error instanceof CommerceSdkValidationError) {
      logger.error(error.display());
    }
    return internalServerError(error.message);
  }
}

export { main };
