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
const { getEventName } = require('../../utils/naming')
const providersEventsConfig = require('../onboarding/config/events.json')
const { makeError } = require('./helpers/errors')

/**
 * Create the registrations based on the selection of the client from the file custom/starter-kit-registrations.json
 *
 * @param {object} clientRegistrations - client registrations
 * @param {Array} providers - list of providers
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
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
            event_code: getEventName(event, environment)
          })
        }

        const createEventRegistrationResult = await createRequestRegistration(accessToken, entityName, provider.key, events, environment)

        if (!createEventRegistrationResult.success) {
          const error = createEventRegistrationResult.error
          return makeError(
            error.label,
            error.reason,
            {
              ...error.payload,
              entityName,
              provider
            }
          )
        }

        console.log(`Registration created for entity ${entityName} - ${provider.key}`)
        result.push(createEventRegistrationResult.result)
      }
    }

    console.log('Create registrations process done correctly!')
    console.log('Created registrations: ', result)

    return {
      success: true,
      registrations: result
    }
  } catch (error) {
    const hints = [
      'Make sure your authentication environment parameters are correct. Also check the COMMERCE_BASE_URL',
      'Did you fill IO_CONSUMER_ID, IO_PROJECT_ID and IO_WORKSPACE_ID environment variables with the values in /onboarding/config/workspace.json?'
    ]

    return makeError(
      'UNEXPECTED_ERROR',
      'Unexpected error occurred while creating registrations',
      {
        error,
        hints: hints.length > 0 ? hints : undefined
      }
    )
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
 */
async function createRequestRegistration (accessToken, entityName, providerKey, events, environment) {
  const body = JSON.stringify({
    client_id: `${environment.OAUTH_CLIENT_ID}`,
    runtime_action: `${entityName}-${providerKey}/consumer`,
    name: getRegistrationName(providerKey, entityName),
    description: getRegistrationName(providerKey, entityName),
    events_of_interest: events,
    delivery_type: 'webhook'
  })

  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/registrations`
  const createEventRegistrationReq = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
      Accept: 'application/hal+json'
    },
    body
  })

  const result = await createEventRegistrationReq.json()

  if (!createEventRegistrationReq.ok) {
    return makeError(
      'CREATE_EVENT_REGISTRATION_FAILED',
      `I/O Management API: call to ${url} returned a non-2XX status code`,
      {
        response: result,
        code: createEventRegistrationReq.status
      }
    )
  }

  if (!result?.client_id) {
    return makeError(
      'CREATE_EVENT_REGISTRATION_FAILED',
      `I/O Management API: call to ${url} did not return the expected response`,
      {
        response: result,
        code: createEventRegistrationReq.status
      }
    )
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
