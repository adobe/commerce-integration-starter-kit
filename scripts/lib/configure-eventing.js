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

const { updateConfiguration } = require("./commerce-eventing-api-client");
const { getEventProviders } = require("./commerce-eventing-api-client");
const { addEventProvider } = require("./commerce-eventing-api-client");
const { makeError } = require("./helpers/errors");

/**
 * This method configures the commerce eventing module
 * @param {object} commerceProvider - Commerce Provider
 * @param {object} workspaceConfiguration - Adobe I/O workspace configuration object
 */
async function main(commerceProvider, workspaceConfiguration) {
  const body = {
    config: {
      enabled: true,
      merchant_id: process.env.COMMERCE_ADOBE_IO_EVENTS_MERCHANT_ID,
      environment_id: "Stage",
      provider_id: commerceProvider.id,
      instance_id: commerceProvider.instanceId,
      workspace_configuration: JSON.stringify(workspaceConfiguration),
    },
  };

  try {
    const eventProviderResult = await getEventProviders(
      process.env.COMMERCE_BASE_URL,
      process.env,
    );
    const isNonDefaultProviderAdded = eventProviderResult.some(
      (provider) => provider.provider_id === commerceProvider.id,
    );
    const isDefaultWorkspaceEmpty = eventProviderResult.every(
      (item) => "id" in item || item.workspace_configuration === "",
    );

    if (isDefaultWorkspaceEmpty) {
      await updateCommerceEventingConfiguration(
        workspaceConfiguration,
        process.env,
      );
    }

    if (!isNonDefaultProviderAdded) {
      await addCommerceEventProvider(
        commerceProvider,
        workspaceConfiguration,
        process.env,
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    const hints = [
      'Ensure your "onboarding/config/workspace.json" file is up to date',
      "Did you run `aio app deploy`? Your runtime actions should be deployed before running the onboarding script",
      "Make sure your authentication environment parameters are correct. Also check the COMMERCE_BASE_URL",
    ];

    if (error?.message?.includes("Response code 404 (Not Found)")) {
      hints.push(
        "Make sure the latest version of the Adobe I/O Events module (see https://developer.adobe.com/commerce/extensibility/events/release-notes/) is installed and enabled in Commerce (see https://developer.adobe.com/commerce/extensibility/events/installation/).",
      );
      hints.push(
        "If the module cannot be updated to the latest version, you can manually configure the Adobe I/O Events module in the Commerce Admin console (see https://developer.adobe.com/commerce/extensibility/events/configure-commerce/)",
      );
    }

    return makeError(
      "UNEXPECTED_ERROR",
      "Unexpected error occurred while updating the eventing configuration of the Adobe I/O Events module in Commerce",
      {
        error,
        config: { ...body.config, workspace_configuration: undefined },
        hints: hints.length > 0 ? hints : undefined,
      },
    );
  }
}

/**
 * Adds the event provider to the commerce instance.
 *
 * @param {object} commerceProvider - commerce provider
 * @param {object} workspaceConfiguration - workspace configuration
 * @param {object} environment - environment variables
 */
async function addCommerceEventProvider(
  commerceProvider,
  workspaceConfiguration,
  environment,
) {
  await addEventProvider(environment.COMMERCE_BASE_URL, environment, {
    eventProvider: {
      provider_id: commerceProvider.id,
      instance_id: commerceProvider.instance_id,
      label: commerceProvider.label,
      description: commerceProvider.description,
      workspace_configuration: JSON.stringify(workspaceConfiguration),
    },
  });
  console.log(
    `\nAdded non-default provider with id "${commerceProvider.id}" and instance id "${commerceProvider.instance_id}" to the commerce instance`,
  );
}

/**
 * Updates the workspace configuration for the commerce instance.
 *
 * @param {object} workspaceConfiguration - workspace configuration
 * @param {object} environment - environment variables
 */
async function updateCommerceEventingConfiguration(
  workspaceConfiguration,
  environment,
) {
  await updateConfiguration(environment.COMMERCE_BASE_URL, environment, {
    config: {
      enabled: true,
      merchant_id: environment.COMMERCE_ADOBE_IO_EVENTS_MERCHANT_ID,
      environment_id: "Stage",
      workspace_configuration: JSON.stringify(workspaceConfiguration),
    },
  });
  console.log("\nUpdated the commerce instance with workspace configuration");
}

exports.main = main;
