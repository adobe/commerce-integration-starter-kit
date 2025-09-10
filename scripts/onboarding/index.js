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
const { imsProviderWithEnvResolver } = require("../../utils/adobe-auth");
const { makeError, formatError } = require("../lib/helpers/errors");
const {
  CommerceSdkValidationError,
} = require("@adobe/aio-commerce-lib-core/error");
const v = require("valibot");
const { upsertEnvFile } = require("../../utils/upsert-env");

const initialConfig = require("../../extensibility.config.js");
const { defineConfig } = require("../../utils/config");
const { requireEnvVars } = require("../../utils/env");

require("dotenv").config();

/**
 * Logs an error occurred during the onboarding process
 * @param {'getAccessToken' | 'providers' | 'metadata' | 'registrations'} phase - The phase of the onboarding process where the error occurred
 * @param {{label: string, reason: string, payload?: any}} errorInfo - Error information object with label, reason, and optional payload
 */
function logOnboardingError(phase, errorInfo) {
  const { label, reason, payload } = errorInfo;
  const phaseLabels = {
    environment: "ENVIRONMENT_VARIABLES",
    getAccessToken: "GET_ACCESS_TOKEN",
    providers: "PROVIDER_ONBOARDING",
    metadata: "METADATA_ONBOARDING",
    registrations: "REGISTRATIONS_ONBOARDING",
  };

  const payloadError = payload ? formatError(payload) : "No additional details";
  const additionalDetails =
    CommerceSdkValidationError.isSdkError(payload) &&
    typeof payload?.display === "function"
      ? `\n${payload.display()}`
      : payloadError;

  console.error(
    ansis.red("\nAn error occurred:\n"),
    ansis.bgRed(`\n ${phaseLabels[phase]} → ${label} \n`),
    ansis.red(`\nProcess of on-boarding (${phase}) failed:\n`),
    ansis.red(reason),
    ansis.red(`\nAdditional error details: ${additionalDetails}\n`),
  );
}

/**
 * Logs an error occurred during the configure eventing process
 * @param {{label: string, reason: string, payload?: any}} errorInfo - Error information object with label, reason, and optional payload
 */
function logConfigureEventingError(errorInfo) {
  const { label, reason, payload } = errorInfo;
  const additionalDetails = payload
    ? formatError(payload)
    : "No additional details";

  console.error(
    ansis.red("\nAn error occurred:\n"),
    ansis.bgRed(`\n CONFIGURE_EVENTING → ${label} \n`),
    ansis.red(
      "\nProcess of configuring Adobe I/O Events module in Commerce failed:\n",
    ),
    ansis.red(reason),
    ansis.red(`\nAdditional error details: ${additionalDetails}\n`),
  );
}

/**
 * Main onboarding function that creates events providers, adds metadata, creates registrations, and configures Adobe I/O Events module in Commerce
 * @returns Object with providers and registrations on success, or void on error
 */
async function main() {
  const schema = requireEnvVars([
    "COMMERCE_BASE_URL",
    "IO_CONSUMER_ID",
    "IO_PROJECT_ID",
    "IO_WORKSPACE_ID",
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
    logOnboardingError(
      "environment",
      makeError(
        "INVALID_ENV_VARS",
        "Missing or invalid environment variables for Onboarding script.",
        error,
      ).error,
    );

    return;
  }

  const config = defineConfig(initialConfig, environmentResult.output);

  console.log(
    "Starting the process of on-boarding based on your registration choices",
  );

  let authHeaders;

  try {
    // resolve params
    const imsAuthProvider = await imsProviderWithEnvResolver(process.env);
    authHeaders = await imsAuthProvider.getHeaders();
  } catch (error) {
    if (error instanceof CommerceSdkValidationError) {
      logOnboardingError(
        "getAccessToken",
        makeError(
          "INVALID_IMS_AUTH_PARAMS",
          "Missing or invalid environment variables for Adobe IMS authentication.",
          error,
        ).error,
      );
      return;
    }

    logOnboardingError(
      "getAccessToken",
      makeError(
        "UNEXPECTED_IMS_AUTH_ERROR",
        "An error occurred while trying to get Adobe IMS authentication headers.",
        error,
      ).error,
    );
    return;
  }

  const createProvidersResult = await require("../lib/providers").main(
    config,
    process.env,
    authHeaders,
  );

  if (!createProvidersResult.success) {
    logOnboardingError("providers", createProvidersResult.error);
    return;
  }

  const providers = createProvidersResult.result.map((provider) => {
    const configProvider = config.eventing.providers.find(
      (p) =>
        p.id === provider.id ||
        p.providerMetadata === provider.providerMetadata,
    );
    return {
      ...configProvider,
      ...provider,
    };
  });

  const createProvidersMetadataResult = await require("../lib/metadata").main(
    config,
    providers,
    process.env,
    authHeaders,
  );

  if (!createProvidersMetadataResult.success) {
    logOnboardingError("metadata", createProvidersMetadataResult.error);
    return;
  }

  console.log(
    "Onboarding completed successfully:",
    providers.map(({ eventsMetadata, ...provider }) => provider),
  );
  console.log(
    "Starting the process of configuring Adobe I/O Events module in Commerce...",
  );

  const commerceProvider = providers.find(
    (p) => p.providerMetadata === "dx_commerce_events",
  );

  upsertEnvFile(".env", {
    COMMERCE_PROVIDER_ID: commerceProvider.id,
    BACKOFFICE_PROVIDER_ID: providers.find(
      (p) => p.providerMetadata === "3rd_party_custom_events",
    ).id,
    AIO_EVENTS_PROVIDERMETADATA_TO_PROVIDER_MAPPING: providers
      .map((p) => `${p.providerMetadata}:${p.id}`)
      .join(","),
  });

  try {
    // eslint-disable-next-line node/no-missing-require,node/no-unpublished-require
    const workspaceConfiguration = require("./config/workspace.json");
    const configureEventingResult =
      await require("../lib/configure-eventing").main(
        commerceProvider,
        workspaceConfiguration,
      );

    if (!configureEventingResult.success) {
      logConfigureEventingError(configureEventingResult.error);
      return;
    }
  } catch (error) {
    if (error?.code === "MODULE_NOT_FOUND") {
      logConfigureEventingError(
        makeError(
          "MISSING_WORKSPACE_FILE",
          'The "workspace.json" file was not found.',
          {
            error,
            hints: [
              'Make sure the file exists in the "scripts/onboarding/config/workspace.json" directory',
              "See https://developer.adobe.com/commerce/extensibility/events/project-setup/#download-the-workspace-configuration-file for instructions on how to download the file.",
              'Also, make sure the file is named "workspace.json".',
            ],
          },
        ),
      );

      return;
    }

    logConfigureEventingError(
      makeError("UNEXPECTED_ERROR", "An unexpected error occurred", { error }),
    );

    return;
  }

  console.log(
    "Process of configuring Adobe I/O Events module in Commerce completed successfully",
  );
  return {
    providers: providers.map(({ eventsMetadata, ...provider }) => provider),
  };
}

exports.main = main;
