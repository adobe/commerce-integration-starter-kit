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

const fetch = require('node-fetch')
const uuid = require('uuid')

const { makeError } = require('./helpers/errors')
const { getMissingKeys } = require('../../actions/utils')
const { getExistingProviders } = require('../../utils/adobe-events-api')
const { addSuffix } = require('../../utils/naming')
const { arrayItemsErrorFormat } = require('./helpers/errors')

const providersEventsConfig = require('../onboarding/config/events.json')

/**
 * Create the events provider
 *
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 * @param {object} provider - provider data
 */
async function createProvider (environment, accessToken, provider) {
  // See: https://developer.adobe.com/events/docs/api#operation/createProvider
  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/providers`
  const createCustomEventProviderReq = await fetch(url, {
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
        ...(provider?.key === 'commerce' && { provider_metadata: 'dx_commerce_events', instance_id: `${uuid.v4()}` }),
        ...(provider?.label && { label: `${provider?.label}` }),
        ...(provider?.description && { description: `${provider?.description}` }),
        ...(provider?.docs_url && { docs_url: `${provider?.docs_url}` })
      }
    )
  })

  const result = await createCustomEventProviderReq.json()

  if (!createCustomEventProviderReq.ok) {
    return makeError(
      'PROVIDER_CREATION_FAILED',
      `I/O Management API: call to ${url} returned a non-2XX status code`,
      {
        response: result,
        code: createCustomEventProviderReq.status
      }
    )
  }

  if (!result?.id) {
    return makeError(
      'PROVIDER_CREATION_FAILED',
      `I/O Management API: call to ${url} did not return the expected response`,
      {
        response: result,
        code: createCustomEventProviderReq.status
      }
    )
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
 */
async function main (clientRegistrations, environment, accessToken) {
  // Load predefined provider, providerEvents and clientRegistrations
  const providersList = require('../onboarding/config/providers.json')
  let currentProvider

  try {
    console.log('Start process of creating providers: ', providersEventsConfig)

    // Validate client registration selection
    const requiredRegistrations = ['product', 'customer', 'order', 'stock']
    const missingRegistrations = getMissingKeys(clientRegistrations, requiredRegistrations)

    if (missingRegistrations.length > 0) {
      const lines = [
        arrayItemsErrorFormat(
          missingRegistrations,
          item => `Registration "${item}" is required`
        ),
        '\nCheck that they are present in "/onboarding/config/starter-kit-registrations.json"'
      ]

      const reason = lines.join('\n')
      return makeError('MISSING_REGISTRATIONS', reason, {
        requiredRegistrations,
        missingRegistrations
      })
    }

    const existingProviders = await getExistingProviders(environment, accessToken)
    const result = []

    for (const provider of providersList) {
      currentProvider = provider
      provider.label = addSuffix(provider.label, environment)
      const isProviderSelectedByClient = hasSelection(provider.key, clientRegistrations)

      if (isProviderSelectedByClient) {
        const persistedProvider = existingProviders[provider.label]

        if (persistedProvider) {
          console.log(`Skipping creation of "${provider.label}" creation, provider already exists`)
          result.push({
            key: provider.key,
            id: persistedProvider.id,
            instanceId: persistedProvider.instance_id,
            label: provider.label
          })

          continue
        }

        console.log('Creating provider with:', provider.label)
        console.log('Provider information:', provider)

        const createProviderResult = await createProvider(environment, accessToken, provider)
        if (!createProviderResult?.success) {
          return createProviderResult
        }

        result.push({
          key: provider.key,
          id: createProviderResult.provider?.id,
          instanceId: createProviderResult.provider?.instance_id,
          label: provider.label
        })
      }
    }

    for (const provider of result) {
      console.log(`Defining the provider with key: ${provider.key} as: ${provider.id}`)
    }

    const response = {
      success: true,
      result
    }

    console.log('Process of creating providers done successfully')
    return response
  } catch (error) {
    return makeError(
      'UNEXPECTED_ERROR',
      'Unexpected error occurred while creating providers',
      { error, provider: currentProvider }
    )
  }
}

exports.main = main
