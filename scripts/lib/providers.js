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
const fs = require('fs')
const path = require('path')
const envPath = path.resolve(__dirname, '../../.env')

const { makeError } = require('./helpers/errors')
const { getMissingKeys } = require('../../actions/utils')
const { getExistingProviders } = require('../../utils/adobe-events-api')
const { addSuffix } = require('../../utils/naming')
const { arrayItemsErrorFormat } = require('./helpers/errors')

const providersEventsConfig = require('../onboarding/config/events.json')

/**
 * Creates an events provider via the I/O Management API
 * @param {object} environment - Environment configuration containing IO_MANAGEMENT_BASE_URL, IO_CONSUMER_ID, IO_PROJECT_ID, IO_WORKSPACE_ID
 * @param {object} authHeaders - Authentication headers including access token
 * @param {{key?: string, label?: string, description?: string, docs_url?: string}} provider - Provider configuration object
 * @returns {Promise<{success: boolean, provider?: object, error?: object}>} Result object with created provider or error
 */
async function createProvider (environment, authHeaders, provider) {
  // See: https://developer.adobe.com/events/docs/api#operation/createProvider
  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/providers`
  const createCustomEventProviderReq = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/hal+json',
      ...authHeaders
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
 * Checks if a provider was selected in client registrations
 * @param {string} selection - Provider key to check
 * @param {object} clientRegistrations - Client registrations mapping entity names to provider keys
 * @returns {boolean} True if provider is selected in any registration
 */
function hasSelection (selection, clientRegistrations) {
  return Object.values(clientRegistrations).some(value => value.includes(selection))
}

/**
 * Updates the .env file with provider id.
 *
 * @param {Array} providers - list of providers
 */
function writeToEnvFile (providers) {
  // Read the existing .env content
  let envContent = fs.readFileSync(envPath, 'utf8')
  envContent = envContent.replace(/\r\n/g, '\n').replace(/\s+$/, '')

  providers.forEach(provider => {
    const providerType = provider.key.toUpperCase()
    const providerIdEnv = `${providerType}_PROVIDER_ID=${provider.id}`
    const providerIdEnvRegex = new RegExp(`^${providerType}_PROVIDER_ID=.*$`, 'm')

    console.log(`Defining the ${provider.key} provider id as : ${provider.id} having instance id : ${provider.instanceId}`)
    if (providerIdEnvRegex.test(envContent)) {
      envContent = envContent.replace(providerIdEnvRegex, providerIdEnv)
    } else {
      envContent += `\n${providerIdEnv}`
    }
  })
  // Write back to the .env file
  fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8')
  console.log('Successfully updated .env file with provider id\'s')
}

/**
 * Main function to create events providers based on config/providers.json and client registrations
 * @param {object} clientRegistrations - Client registrations mapping entity names to provider keys
 * @param {object} environment - Environment configuration
 * @param {object} authHeaders - Authentication headers for API requests
 * @returns {Promise<object>} Result object with created providers or error
 */
async function main (clientRegistrations, environment, authHeaders) {
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

    const existingProviders = await getExistingProviders(environment, authHeaders)
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

        const createProviderResult = await createProvider(environment, authHeaders, provider)
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

    // update the env file with provider ID
    writeToEnvFile(result)
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
    const hints = [
      'Make sure your authentication environment parameters are correct. Also check the COMMERCE_BASE_URL',
      'Did you fill IO_CONSUMER_ID, IO_PROJECT_ID and IO_WORKSPACE_ID environment variables with the values in /onboarding/config/workspace.json?'
    ]

    return makeError(
      'UNEXPECTED_ERROR',
      'Unexpected error occurred while creating providers',
      {
        error,
        provider: currentProvider,
        hints: hints.length > 0 ? hints : undefined
      }
    )
  }
}

exports.main = main
