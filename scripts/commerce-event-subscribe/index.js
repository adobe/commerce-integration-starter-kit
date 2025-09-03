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

const ansis = require("ansis");
const { makeError, formatError } = require("../lib/helpers/errors");
require("dotenv").config();

const initConfig = require("../../extensibility.config.js");
const { defineConfig } = require("../../utils/config");
const { requireEnvVars } = require("../../utils/env");
const v = require("valibot");
const {
  CommerceSdkValidationError,
} = require("@adobe/aio-commerce-lib-core/error");

/**
 * Logs an error ocurred during the commerce event subscribe process.
 * @param {object} errorInfo - General information about the error.
 */
function logCommerceEventSubscribeError(errorInfo) {
  const { label, reason, payload } = errorInfo;
  const additionalDetails = payload
    ? formatError(payload)
    : "No additional details";

  console.error(
    ansis.red("\nAn error occurred:\n"),
    ansis.bgRed(`\n COMMERCE_EVENT_SUBSCRIBE → ${label} \n`),
    ansis.red(
      "\nProcess of subscribing to events in the Adobe I/O Events module in Commerce failed:\n",
    ),
    ansis.red(reason),
    ansis.red(`\nAdditional error details: ${additionalDetails}\n`),
  );
}

/**
 * Transform subscription event fields to API format
 * @param {string|Array<string>} fields - Fields configuration
 * @returns {Array<object>} API-compatible fields format
 */
const transformFields = (fields) => {
  if (typeof fields === "string") {
    return [{ name: fields }];
  }
  if (Array.isArray(fields)) {
    return fields.map((field) => ({ name: field }));
  }

  throw new Error(
    `Invalid fields type: expected string or array, got ${typeof fields}`,
  );
};

/**
 * This method handles the commerce event subscribe script.
 * It configures the Adobe I/O Events Commerce module event subscriptions
 */
async function main() {
  console.log("Starting the commerce event subscribe process");

  const schema = requireEnvVars([
    "COMMERCE_BASE_URL",
    "COMMERCE_PROVIDER_ID",
    "BACKOFFICE_PROVIDER_ID",
    "EVENT_PREFIX",
  ]);
  const environmentResult = v.safeParse(schema, process.env);

  if (!environmentResult.success) {
    const error = new CommerceSdkValidationError(
      "Invalid environment variables",
      {
        issues: environmentResult.issues,
      },
    );

    console.error(error.display(true));

    throw error;
  }

  const environment = environmentResult.output;

  const {
    eventing: { subscriptions },
  } = defineConfig(initConfig, environment);

  const result = {
    successfulSubscriptions: [],
    failedSubscriptions: [],
  };

  const commerceEventSubscriptions = subscriptions.map((subscription) => {
    return {
      ...subscription,
      event: {
        ...subscription.event,
        provider_id: environment.COMMERCE_PROVIDER_ID,
        fields: transformFields(subscription.event?.fields || []),
      },
    };
  });

  try {
    for (const commerceEventSubscription of commerceEventSubscriptions) {
      const eventSubscribeResult = await require("../lib/event-subscribe").main(
        commerceEventSubscription,
        environment,
      );
      if (!eventSubscribeResult.success) {
        logCommerceEventSubscribeError(eventSubscribeResult.error);
        result.failedSubscriptions.push(commerceEventSubscription.event.name);

        continue;
      }

      console.log(
        `Successfully subscribed to event: ${commerceEventSubscription.event.name}`,
      );
      result.successfulSubscriptions.push(commerceEventSubscription.event.name);
    }
  } catch (error) {
    logCommerceEventSubscribeError(
      makeError("UNEXPECTED_ERROR", "An unexpected error occurred", { error }),
    );

    return;
  }

  console.log(
    "Finished the commerce event subscribe process with result",
    result,
  );
  return { result };
}

exports.main = main;
