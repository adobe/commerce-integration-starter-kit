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

const SEPARATOR = "-";

/**
 * Get label suffix
 *
 * @param {string} runtimeNamespace - runtime namespace
 * @returns the suffix
 */
function labelSuffix(runtimeNamespace) {
  return runtimeNamespace.substring(runtimeNamespace.indexOf(SEPARATOR) + 1);
}

/**
 * Add suffix to a string
 *
 * @param {string} labelPrefix - label prefix
 * @param {object} environment - environment params
 * @returns the string with the suffix
 */
function addSuffix(labelPrefix, environment) {
  if (!labelPrefix) {
    throw new Error("Cannot add suffix to undefined label");
  }
  if (!environment?.AIO_runtime_namespace) {
    throw new Error(
      "Unable to add suffix. AIO_runtime_namespace is undefined in the environment",
    );
  }

  return `${labelPrefix} - ${labelSuffix(environment.AIO_runtime_namespace)}`;
}

/**
 * Generate the external backoffice provider name
 *
 * @param {object} providersList
 * @param {object} params action parameters
 * @param {string} providerKey the provider key
 * @returns the provider name
 */
function getProviderName(providersList, params, providerKey) {
  const backofficeProvider = providersList.find(
    (provider) => provider.key === providerKey,
  );

  return addSuffix(backofficeProvider.label, params);
}

/**
 * Add event prefix defined in .env file to event name.
 *
 * @param {string} eventName event name
 * @param {object} environment - environment params
 * @returns the event name
 */
function getEventName(eventName, environment) {
  const eventPrefix = environment.EVENT_PREFIX;
  const prefix = "com.adobe.commerce.";

  if (!eventPrefix) {
    throw new Error(
      "EVENT_PREFIX is required but was not provided in .env file.",
    );
  }

  if (eventName.startsWith(prefix)) {
    return `${prefix}${eventPrefix}.${eventName.slice(prefix.length)}`;
  }

  if (eventName.startsWith("be-observer")) {
    return eventName;
  }

  return `${eventPrefix}.${eventName}`;
}

module.exports = {
  addSuffix,
  getProviderName,
  getEventName,
};
