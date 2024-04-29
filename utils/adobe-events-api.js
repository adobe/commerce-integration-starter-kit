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
 * Make the API call to IO Events to get the existing registrations
 *
 * @param {object} environment includes the needed parameters to call IO Event
 * @param {string} accessToken Adobe OAuth access token
 * @param {?string} next registrations url to get more data
 * @returns {Array} returns array of registrations
 * @throws {Error} Throw exception in case the API call fails
 */
async function getExistingRegistrationsData (environment, accessToken, next = null) {
  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/registrations`

  const getRegistrationsReq = await fetch(
    next || url,
    {
      method: 'GET',
      headers: {
        'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        Accept: 'application/hal+json'
      }
    }
  )
  const getRegistrationsResult = await getRegistrationsReq.json()

  const existingRegistrations = []
  if (getRegistrationsResult?._embedded?.registrations) {
    getRegistrationsResult._embedded.registrations.forEach(registration => {
      existingRegistrations.push({
        id: registration.id,
        registration_id: registration.registration_id,
        name: registration.name,
        enabled: registration.enabled
      })
    })
  }

  if (getRegistrationsResult?._links?.next) {
    existingRegistrations.push(...await getExistingRegistrationsData(environment, accessToken, getRegistrationsResult._links.next.href))
  }

  return existingRegistrations
}

/**
 * Get the existing registration for current project
 *
 * @param {object} environment includes the needed parameters to call IO Event
 * @param {string} accessToken Adobe OAuth access token
 * @returns {Array} returns array of registrations with the name of the registration as key
 * @throws {Error} Throw exception in case the API call fails
 */
async function getExistingRegistrations (environment, accessToken) {
  const existingRegistrationsResult = await getExistingRegistrationsData(environment, accessToken)
  const existingRegistrations = []
  existingRegistrationsResult.forEach(item => { existingRegistrations[item.name] = item })
  return existingRegistrations
}

/**
 * Get the list of existing providers
 *
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 * @returns {Array} - returns the list of providers
 */
async function getExistingProviders (environment, accessToken) {
  const getCreatedProvidersReq = await fetch(
      `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/providers`,
      {
        method: 'GET',
        headers: {
          'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
          Accept: 'application/hal+json'
        }
      }
  )
  const getCreatedProvidersResult = await getCreatedProvidersReq.json()
  const existingProviders = []
  if (getCreatedProvidersResult?._embedded?.providers) {
    getCreatedProvidersResult._embedded.providers.forEach(provider => {
      existingProviders[provider.label] = provider
    })
  }
  return existingProviders
}

/**
 * This method get the existing provider by its key, the key could be found on the file (onboarding/config/providers.json)
 *
 * @param {object} params includes parameters needed to make the call to Adobe IO Events
 * @param {string} accessToken Adobe OAuth access token
 * @param {string} providerKey Provider key used to find the provider
 * @returns {Promise<*>} return IO Event provider
 */
async function getProviderByKey (params, accessToken, providerKey) {
  const providers = await getExistingProviders(params, accessToken)
  const providerName = getProviderName(params, providerKey)
  return providers[providerName]
}

module.exports = {
  getExistingProviders,
  getExistingRegistrations,
  getProviderByKey
}
