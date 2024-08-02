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

require('dotenv').config()
const { checkMissingRequestInputs } = require('../../actions/utils')
const fetch = require('node-fetch')
const uuid = require('uuid')
const { getExistingProviders } = require('../../utils/adobe-events-api')
const { addSuffix } = require('../../utils/naming')
const providersEventsConfig = require('../onboarding/config/events.json')

/**
 * Create the events provider
 *
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 * @param {object} provider - provider data
 * @returns {object} - returns success or not and provider data
 */
async function createProvider (environment, accessToken, provider) {
  const createCustomEventProviderReq = await fetch(
        `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/providers`,
        {
          method: 'POST',
          headers: {
            'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
            Accept: 'application/hal+json'
          },
          body: JSON.stringify(
            {
              // read here about the use of the spread operator to merge objects: https://dev.to/sagar/three-dots---in-javascript-26ci
              ...(provider?.key === 'commerce' ? { provider_metadata: 'dx_commerce_events', instance_id: `${uuid.v4()}` } : null),
              ...(provider?.label ? { label: `${provider?.label}` } : null),
              ...(provider?.description ? { description: `${provider?.description}` } : null),
              ...(provider?.docs_url ? { docs_url: `${provider?.docs_url}` } : null)
            }
          )
        }
  )
  const result = await createCustomEventProviderReq.json()
  if (!result?.id) {
    return {
      success: false,
      error: {
        reason: result?.reason,
        message: result?.message
      }
    }
  }
  return {
    success: true,
    provider: result
  }
}

/**
 * Check if provider was selected
 *
 * @param {string} selection - option selected by client
 * @param {object} clientRegistrations - client registrations
 * @returns {boolean} - returns true or false
 */
function hasSelection (selection, clientRegistrations) {
  return Object.values(clientRegistrations).some(value => value.includes(selection))
}

/**
 * Create events providers based on the config/providers.json and client registrations custom/starter-kit-registrations.json
 *
 * @param {object} clientRegistrations - client registrations
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 * @returns {object} - return reponse with success status and providers created
 */
async function main (clientRegistrations, environment, accessToken) {
  // Load predefined provider, providerEvents and clientRegistrations
  const providersList = require('../onboarding/config/providers.json')

  try {
    // 'info' is the default level if not set
    console.log('Start process of creating providers: ', providersEventsConfig)

    // Validate client registration selection
    const requiredRegistrations = ['product', 'customer', 'order', 'stock']
    const errorMessage = checkMissingRequestInputs(clientRegistrations, requiredRegistrations, [])
    if (errorMessage) {
      // return and log client errors
      return {
        code: 400,
        success: false,
        error: errorMessage
      }
    }

    // Load the existing providers in org
    const existingProviders = await getExistingProviders(environment, accessToken)

    const result = []

    // Loop over the predefined providers and create the provider in the System
    for (const provider of providersList) {
      // Calculate provider label
      provider.label = addSuffix(provider.label, environment)
      const isProviderSelectedByClient = hasSelection(provider.key, clientRegistrations)
      if (isProviderSelectedByClient) {
        // Check if provider is already created
        const persistedProvider = existingProviders[provider.label]
        // persistedProvider = { value, expiration }
        if (persistedProvider) {
          console.log(`Skipping creation of "${provider.label}" creation`)

          result.push({
            key: provider.key,
            id: persistedProvider.id,
            instanceId: persistedProvider.instance_id,
            label: provider.label
          })
          continue
        }

        console.log('Creating provider with: ' + provider.label)
        console.log(`provider information: ${JSON.stringify(provider)}`)

        const createProviderResult = await createProvider(environment, accessToken, provider)
        if (!createProviderResult?.success) {
          const errorMessage = `Unable to create provider: reason = '${createProviderResult.error?.reason}', message = '${createProviderResult.error?.message}'`
          console.log(errorMessage)
          return {
            code: 500,
            success: false,
            error: errorMessage
          }
        }

        result.push({
          key: provider.key,
          id: createProviderResult.provider?.id,
          instanceId: createProviderResult.provider?.instance_id,
          label: provider.label
        })
      }
    }

    result.forEach(provider => console.log(`Defining the ${provider.key} provider id as : ${provider.id}`))

    const response = {
      code: 200,
      success: true,
      result
    }

    // log the response status code
    console.log(`${response.code}: Process of creating providers done successfully`)
    return response
  } catch (error) {
    const errorMessage = `Unable to complete the process of creating providers: ${error.message}`
    console.log(errorMessage)
    return {
      code: 500,
      success: false,
      error: errorMessage
    }
  }
}

exports.main = main
