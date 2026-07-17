import {
  HTTP_OK,
  internalServerError,
  ok,
} from "@adobe/aio-commerce-sdk/core/responses";
import AioLogger from "@adobe/aio-lib-core-logging";

import appConfig from "#app.commerce.config";

/**
 * Please DO NOT DELETE this action; future functionalities planned for upcoming starter kit releases may stop working.
 *
 * This is the starter kit info endpoint.
 * It returns the version of the starter kit and its event registration data.
 *
 * @returns starter kit version and eventing data
 * @param {object} params - includes the env params
 */
function main(params) {
  const logger = AioLogger("starter-kit-info", {
    level: params.LOG_LEVEL || "info",
  });

  try {
    logger.info("Calling the starter kit info action");
    logger.info(`Successful request: ${HTTP_OK}`);
    return ok({
      body: {
        message: {
          starter_kit_version: appConfig.metadata.version,
          // Kept for backwards compatibility; the data now lives in `eventing`.
          registrations:
            'This information now lives in the "eventing" property.',
          eventing: appConfig.eventing,
        },
      },
    });
  } catch (error) {
    logger.error(error);
    return internalServerError(`Server error: ${error.message}`);
  }
}

export { main };
