/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

const { BACKOFFICE_PROVIDER_KEY } = require('../actions/constants')
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
  return `${stringToUppercaseFirstChar(providerKey)} ${stringToUppercaseFirstChar(entityName)} Synchronization`
}

/**
 * Generate the external backoffice provider name
 *
 * @param {object} params action parameters
 * @param {string} providerKey the provider key (could be found in onboarding/config/providers.js)
 * @returns {string} returns the provider name
 */
function getProviderName (params, providerKey) {
  const providersList = require('../onboarding/config/providers.json')
  const backofficeProvider = providersList.find(provider => provider.key === providerKey)

  return addSuffix(backofficeProvider.label, params)
}

module.exports = {
  addSuffix,
  getRegistrationName,
  getProviderName
}
