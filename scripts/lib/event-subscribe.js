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

const { eventSubscribe } = require("./commerce-eventing-api-client");
const { getEventName } = require("../../utils/naming");
const { makeError } = require("./helpers/errors");

/**
 * This method subscribes to an event in the commerce eventing module
 * @param {object} eventSpec - event specification as described in https://developer.adobe.com/commerce/extensibility/events/api/#subscribe-to-events
 * @param {object} environment - environment variables
 */
async function main(eventSpec, environment) {
  if (!environment.EVENT_PREFIX) {
    throw new Error(
      "EVENT_PREFIX is required but is missing or empty from the .env file.",
    );
  }

  if (!environment.COMMERCE_PROVIDER_ID) {
    throw new Error(
      'COMMERCE_PROVIDER_ID is required but is missing or empty from the .env file. Please run "npm run onboard".',
    );
  }

  eventSpec.event.parent = eventSpec.event.name;
  eventSpec.event.provider_id = environment.COMMERCE_PROVIDER_ID;
  eventSpec.event.name = getEventName(eventSpec.event.name, environment);

  try {
    await eventSubscribe(
      environment.AIO_COMMERCE_API_BASE_URL,
      environment,
      eventSpec,
    );

    return {
      success: true,
    };
  } catch (error) {
    let label = "UNEXPECTED_ERROR";
    let reason =
      "Unexpected error occurred while subscribing to an event in the Adobe I/O Events module in Commerce";
    const hints = [
      "Make sure your authentication environment parameters are correct. Also check the AIO_COMMERCE_API_BASE_URL",
    ];

    if (error?.message?.includes("Response code 400 (Bad Request)")) {
      label = "MALFORMED_EVENT_SPEC";
      reason = "The given event specification payload is not valid";
      hints.push(
        "Make sure the event name is valid and the subscription payload is not malformed",
      );
    }

    if (error?.message?.includes("Response code 404 (Not Found)")) {
      hints.push(
        "Make sure the latest version of the Adobe I/O Events module (see https://developer.adobe.com/commerce/extensibility/events/release-notes/) is installed and enabled in Commerce (see https://developer.adobe.com/commerce/extensibility/events/installation/).",
      );
      hints.push(
        "If the module cannot be updated to the latest version, you can manually configure the Adobe I/O Events module in the Commerce Admin console (see https://developer.adobe.com/commerce/extensibility/events/configure-commerce/)",
      );
    }

    return makeError(label, reason, {
      error,
      eventSpec,
      hints: hints.length > 0 ? hints : undefined,
    });
  }
}

exports.main = main;
