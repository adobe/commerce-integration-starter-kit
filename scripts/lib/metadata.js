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

const fetch = require("node-fetch");

const { makeError } = require("./helpers/errors");
const providersEventsConfig = require("../onboarding/config/events.json");
const { getEventName } = require("../../utils/naming");

/**
 * Builds an array of provider events with their metadata
 * @param {object} providerEvents - Provider events configuration object
 * @returns Array of formatted event metadata
 */
function buildProviderData(providerEvents) {
  const events = [];

  for (const [event, { sampleEventTemplate }] of Object.entries(
    providerEvents,
  )) {
    events.push({
      eventCode: event,
      label: event,
      description: event,
      sampleEventTemplate,
    });
  }

  return events;
}

/**
 * Encodes a sample event template to base64 string
 * @param {object} sampleEventTemplate - Sample event template object
 * @returns {string|null} Base64 encoded string of the template or null if invalid
 */
function base64EncodedSampleEvent(sampleEventTemplate) {
  if (!sampleEventTemplate || typeof sampleEventTemplate !== "object") {
    return null;
  }
  return Buffer.from(JSON.stringify(sampleEventTemplate)).toString("base64");
}

/**
 * Adds event metadata to a provider via the I/O Management API
 * @param {{eventCode: string, label: string, description: string, sampleEventTemplate: object}} metadata - Event metadata object
 * @param {string} providerId - Provider ID
 * @param {object} environment - Environment configuration containing IO_MANAGEMENT_BASE_URL, IO_CONSUMER_ID, IO_PROJECT_ID, IO_WORKSPACE_ID
 * @param {object} authHeaders - Authentication headers for API requests
 * @returns Result object indicating success or error
 */
async function addEventCodeToProvider(
  metadata,
  providerId,
  environment,
  authHeaders,
) {
  console.log(
    `Trying to create metadata for ${metadata?.eventCode} to provider ${providerId}`,
  );

  const { eventCode, label, description, sampleEventTemplate } = metadata;
  const sampleEvent = base64EncodedSampleEvent(sampleEventTemplate);
  const body = {
    // eslint-disable-next-line camelcase
    event_code: eventCode,
    label,
    description,
    ...(sampleEvent ? { sample_event_template: sampleEvent } : {}),
  };

  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/providers/${providerId}/eventmetadata`;
  const addEventMetadataReq = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Accept: "application/hal+json",
      ...authHeaders,
    },
    body: JSON.stringify(body),
  });

  const result = await addEventMetadataReq.json();

  if (!addEventMetadataReq.ok) {
    return makeError(
      "ADD_EVENT_CODE_TO_PROVIDER_FAILED",
      `I/O Management API: call to ${url} returned a non-2XX status code`,
      {
        response: result,
        code: addEventMetadataReq.status,
      },
    );
  }

  if (result?.reason) {
    return makeError(
      "ADD_EVENT_CODE_TO_PROVIDER_FAILED",
      `I/O Management API: call to ${url} did not return the expected response`,
      {
        response: result,
        code: addEventMetadataReq.status,
      },
    );
  }

  return {
    success: true,
  };
}

/**
 * Adds multiple event metadata entries to a provider
 * @param {object} providerEvents - Provider events configuration object
 * @param {string} providerId - Provider ID
 * @param {object} environment - Environment configuration
 * @param {object} authHeaders - Authentication headers for API requests
 * @returns Result object indicating success or error
 */
async function addMetadataToProvider(
  providerEvents,
  providerId,
  environment,
  authHeaders,
) {
  const commerceProviderMetadata = buildProviderData(providerEvents);

  for (const metadata of commerceProviderMetadata) {
    const result = await addEventCodeToProvider(
      metadata,
      providerId,
      environment,
      authHeaders,
    );

    if (!result.success) {
      return result;
    }
  }

  return {
    success: true,
  };
}

/**
 * Retrieves existing metadata for a provider with pagination support
 * @param {string} providerId - Provider ID
 * @param {object} environment - Environment configuration containing IO_MANAGEMENT_BASE_URL
 * @param {object} authHeaders - Authentication headers for API requests
 * @param {string|null} [next] - Next URL for pagination
 * @returns Result object with existing metadata or error
 */
async function getExistingMetadata(
  providerId,
  environment,
  authHeaders,
  next = null,
) {
  const url = `${environment.IO_MANAGEMENT_BASE_URL}providers/${providerId}/eventmetadata`;
  const fetchUrl = next ?? url;
  const getExistingMetadataReq = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Accept: "application/hal+json",
      ...authHeaders,
    },
  });

  if (!getExistingMetadataReq.ok) {
    const result = await getExistingMetadataReq.json();
    return makeError(
      "GET_EXISTING_METADATA_FAILED",
      `I/O Management API: call to ${url} returned a non-2XX status code`,
      {
        response: result,
        code: getExistingMetadataReq.status,
      },
    );
  }

  const getExistingMetadataResult = await getExistingMetadataReq.json();
  const existingMetadata = [];

  if (getExistingMetadataResult?._embedded?.eventmetadata) {
    for (const event of getExistingMetadataResult._embedded.eventmetadata) {
      existingMetadata[event.event_code] = event;
    }
  }

  if (getExistingMetadataResult?._links?.next) {
    const data = await getExistingMetadata(
      providerId,
      environment,
      authHeaders,
      getExistingMetadataResult._links.next,
    );
    existingMetadata.push(...data);
  }

  return {
    success: true,
    existingMetadata,
  };
}

/**
 * Main function to add metadata events codes from config/events.json to corresponding providers
 * @param {object} clientRegistrations - Client registrations mapping entity names to provider keys
 * @param {Array<{id: string, key: string, label: string}>} providers - List of provider objects
 * @param {object} environment - Environment configuration
 * @param {object} authHeaders - Authentication headers for API requests
 * @returns Result object with operation outcome
 */
async function main(clientRegistrations, providers, environment, authHeaders) {
  let currentProvider;
  let eventName;
  try {
    let providersEvents = {};

    const result = [];
    for (const provider of providers) {
      currentProvider = provider;
      const existingMetadataResult = await getExistingMetadata(
        provider.id,
        environment,
        authHeaders,
      );

      if (!existingMetadataResult.success) {
        return existingMetadataResult;
      }

      const { existingMetadata } = existingMetadataResult;

      for (const [entityName, options] of Object.entries(clientRegistrations)) {
        if (options?.includes(provider.key)) {
          if (providersEventsConfig[entityName]) {
            for (const [event, eventProps] of Object.entries(
              providersEventsConfig[entityName][provider.key],
            )) {
              eventName = getEventName(event, environment);
              if (existingMetadata[eventName]) {
                console.log(
                  `Skipping, Metadata event code ${eventName} already exists!`,
                );
                continue;
              }
              providersEvents = {
                ...providersEvents,
                [eventName]: eventProps,
              };
            }
          }

          result.push({
            entity: entityName,
            label: provider.label,
          });
        }
      }

      const addMetadataResult = await addMetadataToProvider(
        providersEvents,
        provider.id,
        environment,
        authHeaders,
      );
      if (!addMetadataResult.success) {
        return addMetadataResult;
      }
    }

    return {
      success: true,
      result,
    };
  } catch (error) {
    const hints = [
      "Make sure your authentication environment parameters are correct. Also check the COMMERCE_BASE_URL",
      "Did you fill IO_CONSUMER_ID, IO_PROJECT_ID and IO_WORKSPACE_ID environment variables with the values in /onboarding/config/workspace.json?",
    ];

    return makeError(
      "UNEXPECTED_ERROR",
      "Unexpected error occurred while adding metadata to provider",
      {
        error,
        provider: currentProvider,
        hints: hints.length > 0 ? hints : undefined,
      },
    );
  }
}

exports.main = main;
