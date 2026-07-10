/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { telemetryConfig } = require("../../../telemetry");
const {
  instrumentEntrypoint,
  getInstrumentationHelpers,
} = require("@adobe/aio-lib-telemetry");

const {
  stringParameters,
  checkMissingRequestInputs,
} = require("../../../utils");

const {
  actionErrorResponse,
  isActionSuccessful,
} = require("../../../responses");
const { HTTP_BAD_REQUEST } = require("../../../constants");

const created = require("../created");
const updated = require("../updated");

/**
 * Handles the customer save event by dispatching to the created or updated
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
    logger.info("New customer; dispatching to created handler");
    return await created.main(params);
  }

  logger.info("Existing customer; dispatching to updated handler");
  return await updated.main(params);
}

exports.main = instrumentEntrypoint(main, {
  ...telemetryConfig,
  isSuccessful: isActionSuccessful,
});
