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

const { updateConfiguration } = require('./commerce-eventing-api-client')
const { getEventProviders } = require('./commerce-eventing-api-client')
const { addEventProvider } = require('./commerce-eventing-api-client')

/**
 * This method configures the commerce eventing module
 * @param {string} providerId - provider id
 * @param {string} instanceId - instance id
 * @param {object} workspaceConfiguration - workspace configuration
 * @param {object} environment - environment variables
 * @returns {object} - returns response object
 */
async function main (providerId, instanceId, workspaceConfiguration, environment) {
  try {
    const eventProviderResult = await getEventProviders(environment.COMMERCE_BASE_URL, environment)
    const isDefaultProviderConfigured = !eventProviderResult.some(item => !('id' in item))
    const isNonDefaultProviderAdded = eventProviderResult.some(provider => provider.provider_id === providerId)

    if (isDefaultProviderConfigured && !isNonDefaultProviderAdded) {
      await updateConfiguration(
        environment.COMMERCE_BASE_URL,
        environment,
        {
          config: {
            enabled: true,
            merchant_id: environment.COMMERCE_ADOBE_IO_EVENTS_MERCHANT_ID,
            environment_id: 'Stage',
            provider_id: providerId,
            instance_id: instanceId,
            workspace_configuration: JSON.stringify(workspaceConfiguration)
          }
        }
      )
      console.log(`\nUpdating the commerce instance with default provider with id "${providerId}" and instance id "${instanceId}"`)
      return {
        code: 200,
        success: true
      }
    }

    if (!isNonDefaultProviderAdded) {
      const providersList = require('../onboarding/config/providers.json')
      let label, description

      providersList.forEach(provider => {
        if (provider.key === 'commerce') {
          label = provider.label
          description = provider.description
        }
      })

      await addEventProvider(
        environment.COMMERCE_BASE_URL,
        environment,
        {
          eventProvider: {
            provider_id: providerId,
            instance_id: instanceId,
            label,
            description,
            workspace_configuration: JSON.stringify(workspaceConfiguration)
          }
        }
      )
      console.log(`\nAdding non-default provider with id "${providerId}" and instance id "${instanceId}" to the commerce instance`)
    }
    return {
      code: 200,
      success: true
    }
  } catch (error) {
    const errorMessage = `Unable to complete the process of commerce configuration: ${error.message}`
    console.log(errorMessage)
    return {
      code: 500,
      success: false,
      error: errorMessage
    }
  }
}

exports.main = main
