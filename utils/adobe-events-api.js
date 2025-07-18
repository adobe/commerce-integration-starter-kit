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

const fetch = require('node-fetch')
const { getProviderName } = require('./naming')

/**
 * Makes API call to IO Events to get existing registrations with pagination support
 * @param {object} environment - Environment configuration containing IO_MANAGEMENT_BASE_URL, IO_CONSUMER_ID, IO_PROJECT_ID, IO_WORKSPACE_ID
 * @param {object} authHeaders - Authentication headers including Adobe OAuth access token
 * @param {string} [next] - Next URL for pagination
 * @returns {Promise<Array<{id: string, registration_id: string, name: string, enabled: boolean}>>} Array of registration objects
 * @throws {Error} Throws exception if the API call fails
 */
async function getExistingRegistrationsData (environment, authHeaders, next = null) {
  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/registrations`
  const getRegistrationsReq = await fetch(
    next || url,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Accept: 'application/hal+json',
        ...authHeaders
      }
    }
  )

  const getRegistrationsResult = await getRegistrationsReq.json()
  const existingRegistrations = []

  if (getRegistrationsResult?._embedded?.registrations) {
    for (const registration of getRegistrationsResult._embedded.registrations) {
      existingRegistrations.push({
        id: registration.id,
        registration_id: registration.registration_id,
        name: registration.name,
        enabled: registration.enabled
      })
    }
  }

  if (getRegistrationsResult?._links?.next) {
    existingRegistrations.push(...await getExistingRegistrationsData(environment, authHeaders, getRegistrationsResult._links.next.href))
  }

  return existingRegistrations
}

/**
 * Gets existing registrations for the current project as a keyed object
 * @param {object} environment - Environment configuration containing needed parameters to call IO Event API
 * @param {object} authHeaders - Authentication headers for API requests
 * @returns {Promise<object>} Object mapping registration names to registration objects
 * @throws {Error} Throws exception if the API call fails
 */
async function getExistingRegistrations (environment, authHeaders) {
  const existingRegistrationsResult = await getExistingRegistrationsData(environment, authHeaders)
  const existingRegistrations = {}

  for (const item of existingRegistrationsResult) {
    existingRegistrations[item.name] = item
  }

  return existingRegistrations
}

/**
 * Gets the list of existing providers for the consumer organization
 * @param {object} environment - Environment configuration containing IO_MANAGEMENT_BASE_URL and IO_CONSUMER_ID
 * @param {object} authHeaders - Authentication headers for API requests
 * @returns {Promise<object>} Object mapping provider labels to provider objects
 */
async function getExistingProviders (environment, authHeaders) {
  // See: https://developer.adobe.com/events/docs/api#operation/getProvidersByConsumerOrgId
  const getCreatedProvidersReq = await fetch(
      `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/providers`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Accept: 'application/hal+json',
          ...authHeaders
        }
      }
  )
  const getCreatedProvidersResult = await getCreatedProvidersReq.json()
  const existingProviders = {}
  if (getCreatedProvidersResult?._embedded?.providers) {
    for (const provider of getCreatedProvidersResult._embedded.providers) {
      existingProviders[provider.label] = provider
    }
  }

  return existingProviders
}

/**
 * Gets an existing provider by its key from the providers configuration
 * @param {object} params - Parameters needed to make the call to Adobe IO Events
 * @param {object} authHeaders - Authentication headers including Adobe OAuth access token
 * @param {string} providerKey - Provider key used to find the provider (from onboarding/config/providers.json)
 * @returns {Promise<object|undefined>} Provider object if found, undefined otherwise
 */
async function getProviderByKey (params, authHeaders, providerKey) {
  const providers = await getExistingProviders(params, authHeaders)
  const providerName = getProviderName(params, providerKey)
  return providers[providerName]
}

module.exports = {
  getExistingProviders,
  getExistingRegistrations,
  getProviderByKey
}
