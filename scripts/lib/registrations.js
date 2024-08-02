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
const { getExistingRegistrations } = require('../../utils/adobe-events-api')
const { getRegistrationName } = require('../../utils/naming')
const providersEventsConfig = require('../onboarding/config/events.json')

/**
 * Create the registrations based on the selection of the client from the file custom/starter-kit-registrations.json
 *
 * @param {object} clientRegistrations - client registrations
 * @param {Array} providers - list of providers
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 * @returns {object} - returns response with success status and registrations information
 */
async function main (clientRegistrations, providers, environment, accessToken) {
  const result = []

  try {
    const existingRegistrations = await getExistingRegistrations(environment, accessToken)
    for (const provider of providers) {
      console.log(`Start creating registrations for the provider: ${provider.label}`)

      for (const [entityName, options] of Object.entries(clientRegistrations)) {
        if (!options.includes(provider.key)) {
          continue
        }

        const registrationName = getRegistrationName(provider.key, entityName)
        if (existingRegistrations[registrationName]) {
          console.log(`Registration ${registrationName} already exists for entity ${entityName} - ${provider.key}`)
          result.push(existingRegistrations[registrationName])
          continue
        }

        const events = []
        for (const event of Object.keys(providersEventsConfig[entityName][provider.key])) {
          events.push({
            provider_id: provider.id,
            event_code: event
          })
        }

        const createEventRegistrationResult = await createRequestRegistration(accessToken, entityName, provider.key, events, environment)
        if (!createEventRegistrationResult.success) {
          const errorMessage = `Unable to create registration for ${entityName} with provider ${provider.key} - ${provider.id}`
          console.log(errorMessage)
          console.log(`Reason: ${createEventRegistrationResult.error.reason}, message: ${createEventRegistrationResult.error.message}`)
          return {
            code: 500,
            success: false,
            error: errorMessage
          }
        }
        console.log(`Registration created for entity ${entityName} - ${provider.key}`)
        result.push(createEventRegistrationResult.result)
      }
    }
    console.log('Create registrations process done correctly!')
    console.log('Created registrations: ', result)
    return {
      code: 200,
      success: true,
      registrations: result
    }
  } catch (error) {
    const errorMessage = `Unable to complete the process of creating events registrations: ${error.message}`
    console.log(errorMessage)
    return {
      code: 500,
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Create the registration in Adobe event
 *
 * @param {string} accessToken - access token
 * @param {string} entityName - entity name
 * @param {string} providerKey - provider key
 * @param {Array} events - provider events
 * @param {object} environment - environment params
 * @returns {object} - returns success status and registration info
 */
async function createRequestRegistration (accessToken, entityName, providerKey, events, environment) {
  const body = JSON.stringify(
    {
      client_id: `${environment.OAUTH_CLIENT_ID}`,
      runtime_action: `${entityName}-${providerKey}/consumer`,
      name: getRegistrationName(providerKey, entityName),
      description: getRegistrationName(providerKey, entityName),
      events_of_interest: events,
      delivery_type: 'webhook'
    }
  )

  const createEventRegistrationReq = await fetch(
        `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/registrations`,
        {
          method: 'POST',
          headers: {
            'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
            Accept: 'application/hal+json'
          },
          body
        }
  )

  const result = await createEventRegistrationReq.json()

  if (!result?.client_id) {
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
    result: {
      id: result?.id,
      registration_id: result?.registration_id,
      name: result?.name,
      enabled: result?.enabled
    }
  }
}

exports.main = main
