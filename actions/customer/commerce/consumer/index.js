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

const { commerceCustomerMetrics } = require("../metrics");
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
  errorResponse,
  successResponse,
  isConsumerSuccessful,
} = require("../../../responses");

const {
  HTTP_BAD_REQUEST,
  HTTP_OK,
  HTTP_INTERNAL_ERROR,
} = require("../../../constants");

const Openwhisk = require("../../../openwhisk");

/**
 * This is the consumer of the events coming from Adobe Commerce related to customer entity.
 *
 * @returns response object with status code, request data received and response of the invoked action
 * @param {object} params - includes the env params, type and the data of the event
 */
async function main(params) {
  const { logger, currentSpan, contextCarrier } = getInstrumentationHelpers();
  currentSpan.addEvent("event.type", { value: params.type });
  commerceCustomerMetrics.consumerTotalCounter.add(1);

  try {
    const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH);

    let response = {};
    let statusCode = HTTP_OK;

    logger.info("Start processing request");
    logger.debug(`Consumer main params: ${stringParameters(params)}`);

    const errorMessage = checkMissingRequestInputs(params, ["type"], []);
    if (errorMessage) {
      logger.error(`Invalid request parameters: ${errorMessage}`);
      return errorResponse(
        HTTP_BAD_REQUEST,
        `Invalid request parameters: ${errorMessage}`,
      );
    }

    logger.info(`Params type: ${params.type}`);

    switch (params.type) {
      case `com.adobe.commerce.${params.EVENT_PREFIX}.observer.customer_save_commit_after`: {
        const error = checkMissingRequestInputs(
          params,
          ["data.value.created_at", "data.value.updated_at"],
          [],
        );

        if (error) {
          logger.error(`Invalid request parameters: ${error}`);
          return errorResponse(
            HTTP_BAD_REQUEST,
            `Invalid request parameters: ${error}`,
          );
        }

        const createdAt = Date.parse(params.data.value.created_at);
        const updatedAt = Date.parse(params.data.value.updated_at);

        if (createdAt === updatedAt) {
          logger.info("Invoking created customer");
          const res = await openwhiskClient.invokeAction(
            "customer-commerce/created",
            {
              ...params.data.value,
              __telemetryContext: contextCarrier,
            },
          );

          response = res?.response?.result?.body;
          statusCode = res?.response?.result?.statusCode;
        } else {
          logger.info("Invoking update customer");
          const res = await openwhiskClient.invokeAction(
            "customer-commerce/updated",
            params.data.value,
          );

          response = res?.response?.result?.body;
          statusCode = res?.response?.result?.statusCode;
        }

        break;
      }

      case `com.adobe.commerce.${params.EVENT_PREFIX}.observer.customer_delete_commit_after`: {
        logger.info("Invoking delete customer");
        const res = await openwhiskClient.invokeAction(
          "customer-commerce/deleted",
          params.data.value,
        );

        response = res?.response?.result?.body;
        statusCode = res?.response?.result?.statusCode;
        break;
      }

      case `com.adobe.commerce.${params.EVENT_PREFIX}.observer.customer_group_save_commit_after`: {
        logger.info("Invoking update customer group");
        const updateRes = await openwhiskClient.invokeAction(
          "customer-commerce/group-updated",
          params.data.value,
        );

        response = updateRes?.response?.result?.body;
        statusCode = updateRes?.response?.result?.statusCode;
        break;
      }

      case `com.adobe.commerce.${params.EVENT_PREFIX}.observer.customer_group_delete_commit_after`: {
        const error = checkMissingRequestInputs(
          params,
          ["data.value.customer_group_code"],
          [],
        );

        if (error) {
          logger.error(`Invalid request parameters: ${error}`);
          return errorResponse(
            HTTP_BAD_REQUEST,
            `Invalid request parameters: ${error}`,
          );
        }

        logger.info("Invoking delete customer group");
        const deleteRes = await openwhiskClient.invokeAction(
          "customer-commerce/group-deleted",
          params.data.value,
        );

        response = deleteRes?.response?.result?.body;
        statusCode = deleteRes?.response?.result?.statusCode;
        break;
      }

      default:
        logger.error(`Event type not found: ${params.type}`);
        return errorResponse(
          HTTP_BAD_REQUEST,
          `This case type is not supported: ${params.type}`,
        );
    }

    if (!response.success) {
      logger.error(`Error response: ${response.error}`);
      return errorResponse(statusCode, response.error);
    }

    logger.info(`Successful request: ${statusCode}`);
    commerceCustomerMetrics.consumerSuccessCounter.add(1);

    return successResponse(params.type, response);
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    return errorResponse(HTTP_INTERNAL_ERROR, `Server error: ${error.message}`);
  }
}

exports.main = instrumentEntrypoint(main, {
  ...telemetryConfig,
  isSuccessful: isConsumerSuccessful,
});
