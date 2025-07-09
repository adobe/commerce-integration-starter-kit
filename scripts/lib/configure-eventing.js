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
const { makeError } = require('./helpers/errors')

/**
 * This method configures the commerce eventing module
 * @param {string} providerId - provider id
 * @param {string} instanceId - instance id
 * @param {object} workspaceConfiguration - workspace configuration
 * @param {object} environment - environment variables
 * @returns {object} - returns response object
 */
async function main (providerId, instanceId, workspaceConfiguration, environment) {
  const body = {
    config: {
      enabled: true,
      merchant_id: environment.COMMERCE_ADOBE_IO_EVENTS_MERCHANT_ID,
      environment_id: 'Stage',
      provider_id: providerId,
      instance_id: instanceId,
      workspace_configuration: JSON.stringify(workspaceConfiguration)
    }
  }

  try {
    await updateConfiguration(environment.COMMERCE_BASE_URL, environment, body)
    return {
      success: true
    }
  } catch (error) {
    const hints = []

    if (error.includes('Response code 404 (Not Found)')) {
      hints.push('Make sure the latest version of the Adobe I/O Events module (see https://developer.adobe.com/commerce/extensibility/events/release-notes/) is installed and enabled in Commerce (see https://developer.adobe.com/commerce/extensibility/events/installation/).')
      hints.push('If the module cannot be updated to the latest version, you can manually configure the Adobe I/O Events module in the Commerce Admin console (see https://developer.adobe.com/commerce/extensibility/events/configure-commerce/)')
    }

    return makeError(
      'UNEXPECTED_ERROR',
      'Unexpected error occurred while updating the eventing configuration of the Adobe I/O Events module in Commerce',
      {
        error,
        config: body.config,
        hints: hints.length > 0 ? hints : undefined
      }
    )
  }
}

exports.main = main
