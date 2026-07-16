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

import { Core } from "@adobe/aio-sdk";

import appConfig from "#app.commerce.config";
import { HTTP_INTERNAL_ERROR, HTTP_OK } from "#src/constants";
import { actionErrorResponse, actionSuccessResponse } from "#src/responses";

/**
 * Please DO NOT DELETE this action; future functionalities planned for upcoming starter kit releases may stop working.
 *
 * This is the starter kit info endpoint.
 * It returns the version of the starter kit and its event registration data.
 *
 * @returns starter kit version and registration data
 * @param {object} params - includes the env params
 */
function main(params) {
  const logger = Core.Logger("starter-kit-info", {
    level: params.LOG_LEVEL || "info",
  });

  try {
    logger.info("Calling the starter kit info action");
    logger.info(`Successful request: ${HTTP_OK}`);
    return actionSuccessResponse({
      starter_kit_version: appConfig.metadata.version,
      registrations: appConfig.eventing,
    });
  } catch (error) {
    logger.error(error);
    return actionErrorResponse(
      HTTP_INTERNAL_ERROR,
      `Server error: ${error.message}`,
    );
  }
}

export { main };
