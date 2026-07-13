import {
  getInstrumentationHelpers,
  instrumentEntrypoint,
} from "@adobe/aio-lib-telemetry";

import { HTTP_BAD_REQUEST } from "#src/constants";
import * as created from "#src/order/commerce/created/index";
import * as updated from "#src/order/commerce/updated/index";
import { actionErrorResponse, isActionSuccessful } from "#src/responses";
import { telemetryConfig } from "#src/telemetry";
import { checkMissingRequestInputs, stringParameters } from "#src/utils";

const __esm_main = instrumentEntrypoint(main, {
  ...telemetryConfig,
  isSuccessful: isActionSuccessful,
});
/**
 * Handles the order save event by dispatching to the created or updated
 * handler. A record is treated as new when its created_at and updated_at
 * timestamps are equal, otherwise it is treated as an update.
 *
 * @returns response object from the created or updated handler
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main(params) {
  const { logger } = getInstrumentationHelpers();
  logger.info("Start processing request");
  logger.debug(`Upsert main params: ${stringParameters(params)}`);
  const errorMessage = checkMissingRequestInputs(
    params,
    ["data.value.created_at", "data.value.updated_at"],
    [],
  );
  if (errorMessage) {
    logger.error(`Invalid request parameters: ${errorMessage}`);
    return actionErrorResponse(
      HTTP_BAD_REQUEST,
      `Invalid request parameters: ${errorMessage}`,
    );
  }
  const createdAt = Date.parse(params.data.value.created_at);
  const updatedAt = Date.parse(params.data.value.updated_at);
  if (createdAt === updatedAt) {
    logger.info("New order; dispatching to created handler");
    return await created.main(params);
  }
  logger.info("Existing order; dispatching to updated handler");
  return await updated.main(params);
}

export { __esm_main as main };
