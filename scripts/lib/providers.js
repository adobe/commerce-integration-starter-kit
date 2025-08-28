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

require("dotenv").config();

const fetch = require("node-fetch");
const uuid = require("uuid");

const { makeError } = require("./helpers/errors");
const { getExistingProviders } = require("../../utils/adobe-events-api");
const { addSuffix } = require("../../utils/naming");

/**
 * Creates an events provider via the I/O Management API
 * @param {object} environment - Environment configuration containing IO_MANAGEMENT_BASE_URL, IO_CONSUMER_ID, IO_PROJECT_ID, IO_WORKSPACE_ID
 * @param {object} authHeaders - Authentication headers including access token
 * @param {object} provider - Provider configuration object
 * @returns Result object with created provider or error
 */
async function createProvider(environment, authHeaders, provider) {
  // See: https://developer.adobe.com/events/docs/api#operation/createProvider
  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/providers`;
  const createCustomEventProviderReq = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Accept: "application/hal+json",
      ...authHeaders,
    },
    body: JSON.stringify({
      // read here about the use of the spread operator to merge objects: https://dev.to/sagar/three-dots---in-javascript-26ci
      ...(provider?.key === "commerce" && {
        provider_metadata: "dx_commerce_events",
        instance_id: `${uuid.v4()}`,
      }),
      ...(provider?.label && { label: `${provider?.label}` }),
      ...(provider?.description && { description: `${provider?.description}` }),
      ...(provider?.docs_url && { docs_url: `${provider?.docs_url}` }),
    }),
  });

  const result = await createCustomEventProviderReq.json();

  if (!createCustomEventProviderReq.ok) {
    return makeError(
      "PROVIDER_CREATION_FAILED",
      `I/O Management API: call to ${url} returned a non-2XX status code`,
      {
        response: result,
        code: createCustomEventProviderReq.status,
      },
    );
  }

  if (!result?.id) {
    return makeError(
      "PROVIDER_CREATION_FAILED",
      `I/O Management API: call to ${url} did not return the expected response`,
      {
        response: result,
        code: createCustomEventProviderReq.status,
      },
    );
  }

  return {
    success: true,
    provider: result,
  };
}

/**
 * Main function to create events providers based on unified config.js
 * @param {object} config - Unified configuration object containing registrations, providers and subscriptions
 * @param {object} environment - Environment variables
 * @param {object} authHeaders - Authentication headers for API requests
 * @returns Result object with created providers or error
 */
async function main(
  { eventing: { providers, subscriptions } },
  environment,
  authHeaders,
) {
  let currentProvider;
  try {
    console.log("Start process of creating providers: ", subscriptions);

    // Validate client registration selection

    const existingProviders = await getExistingProviders(
      environment,
      authHeaders,
    );
    const result = [];

    const existingProvidersCollection = Object.values(existingProviders);

    for (const provider of providers) {
      currentProvider = provider;
      const key = provider.key;
      const label = addSuffix(provider.label, environment);

      const persistedProvider = existingProvidersCollection.find(
        (existingProvider) => {
          return (
            existingProvider.id === provider?.id ||
            existingProvider?.label === label
          );
        },
      );

      if (persistedProvider) {
        console.log(
          `Skipping creation of "${label}" creation, provider already exists`,
        );
        result.push({
          key,
          id: persistedProvider.id,
          instanceId: persistedProvider.instance_id,
          label,
          providerMetadata: persistedProvider.provider_metadata,
        });

        continue;
      }

      const createProviderResult = await createProvider(
        environment,
        authHeaders,
        {
          ...provider,
          label,
        },
      );
      if (!createProviderResult?.success) {
        return createProviderResult;
      }

      result.push({
        key,
        id: createProviderResult.provider?.id,
        instanceId: createProviderResult.provider?.instance_id,
        label,
        providerMetadata: createProviderResult.provider?.provider_metadata,
      });
    }

    for (const provider of result) {
      console.log(
        `Defining the provider with key: ${provider.key} as: ${provider.id}`,
      );
    }

    const response = {
      success: true,
      result,
    };

    console.log("Process of creating providers done successfully");
    return response;
  } catch (error) {
    const hints = [
      "Make sure your authentication environment parameters are correct. Also check the COMMERCE_BASE_URL",
      "Did you fill IO_CONSUMER_ID, IO_PROJECT_ID and IO_WORKSPACE_ID environment variables with the values in /onboarding/config/workspace.json?",
    ];

    return makeError(
      "UNEXPECTED_ERROR",
      "Unexpected error occurred while creating providers",
      {
        error,
        provider: currentProvider,
        hints: hints.length > 0 ? hints : undefined,
      },
    );
  }
}

exports.main = main;
