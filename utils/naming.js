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

const SEPARATOR = '-'

/**
 * Get label suffix
 *
 * @param {string} runtimeNamespace - runtime namespace
 * @returns {string} - returns the suffix
 */
function labelSuffix (runtimeNamespace) {
  return runtimeNamespace.substring(runtimeNamespace.indexOf(SEPARATOR) + 1)
}

/**
 * Add suffix to a string
 *
 * @param {string} labelPrefix - label prefix
 * @param {object} environment - environment params
 * @returns {string} - returns the string with the suffix
 */
function addSuffix (labelPrefix, environment) {
  if (!labelPrefix) {
    throw Error('Cannot add suffix to undefined label')
  }
  if (!environment?.AIO_runtime_namespace) {
    throw Error('Unable to add suffix. AIO_runtime_namespace is undefined in the environment')
  }
  return `${labelPrefix} - ${labelSuffix(environment.AIO_runtime_namespace)}`
}

/**
 * Capitalize the first char of a given string
 *
 * @param {string} string the text to modify
 * @returns {string} string
 */
function stringToUppercaseFirstChar (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Generate the registration name based on the provider key and entity name
 *
 * @param {string} providerKey provider key
 * @param {string} entityName entity name
 * @returns {string} the generated registration name
 */
function getRegistrationName (providerKey, entityName) {
  return `${stringToUppercaseFirstChar(providerKey)} ${stringToUppercaseFirstChar(entityName)} Sync`
}

/**
 * Generate the external backoffice provider name
 *
 * @param {object} params action parameters
 * @param {string} providerKey the provider key (could be found in onboarding/config/providers.js)
 * @returns {string} returns the provider name
 */
function getProviderName (params, providerKey) {
  const providersList = require('../scripts/onboarding/config/providers.json')
  const backofficeProvider = providersList.find(provider => provider.key === providerKey)

  return addSuffix(backofficeProvider.label, params)
}

module.exports = {
  addSuffix,
  getRegistrationName,
  getProviderName
}
