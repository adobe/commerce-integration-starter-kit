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

const { makeError } = require('./helpers/errors')
const providersEventsConfig = require('../onboarding/config/events.json')

/**
 * This method build an array of provider events
 * @param {Array} providerEvents - provider events
 */
function buildProviderData (providerEvents) {
  const events = []

  for (const [event, { sampleEventTemplate }] of Object.entries(providerEvents)) {
    events.push({
      eventCode: event,
      label: event,
      description: event,
      sampleEventTemplate
    })
  }

  return events
}

/**
 * This method builds a base64 encoded sample event if one exists
 * @param {object} sampleEventTemplate - Sample Event Template as object
 */
function base64EncodedSampleEvent (sampleEventTemplate) {
  if (!sampleEventTemplate || typeof sampleEventTemplate !== 'object') {
    return null
  }
  return Buffer.from(JSON.stringify(sampleEventTemplate)).toString('base64')
}

/**
 * This method add the events codes to the provider
 *
 * @param {object} metadata - metadata data
 * @param {string} providerId - provider id
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 */
async function addEventCodeToProvider (metadata, providerId, environment, accessToken) {
  console.log(`Trying to create metadata for ${metadata?.eventCode} to provider ${providerId}`)

  const { eventCode, label, description, sampleEventTemplate } = metadata
  const sampleEvent = base64EncodedSampleEvent(sampleEventTemplate)
  const body = {
    // eslint-disable-next-line camelcase
    event_code: eventCode,
    label,
    description,
    ...(sampleEvent ? { sample_event_template: sampleEvent } : {})
  }

  const url = `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/providers/${providerId}/eventmetadata`
  const addEventMetadataReq = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
      Accept: 'application/hal+json'
    },
    body: JSON.stringify(body)
  })

  const result = await addEventMetadataReq.json()

  if (!(addEventMetadataReq.ok)) {
    return makeError(
      'ADD_EVENT_CODE_TO_PROVIDER_FAILED',
      `I/O Management API: call to ${url} returned a non-2XX status code`,
      {
        ...result,
        code: addEventMetadataReq.status
      }
    )
  }

  if (result?.reason) {
    return makeError(
      'ADD_EVENT_CODE_TO_PROVIDER_FAILED',
      `I/O Management API: call to ${url} did not return the expected response`,
      {
        ...result,
        code: addEventMetadataReq.status
      }
    )
  }

  return {
    success: true
  }
}

/**
 * This method add metadata to the provider
 *
 * @param {object} providerEvents - provider events
 * @param {string} providerId - provider id
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 */
async function addMetadataToProvider (providerEvents, providerId, environment, accessToken) {
  const commerceProviderMetadata = buildProviderData(providerEvents)

  for (const metadata of commerceProviderMetadata) {
    const result = await addEventCodeToProvider(metadata, providerId, environment, accessToken)

    if (!result.success) {
      return result
    }
  }

  return {
    success: true
  }
}

/**
 * Get existing provider metadata
 *
 * @param {string} providerId - provider id
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 * @param {string} next - next url
 */
async function getExistingMetadata (providerId, environment, accessToken, next = null) {
  const url = `${environment.IO_MANAGEMENT_BASE_URL}providers/${providerId}/eventmetadata`
  const fetchUrl = next ?? url
  const getExistingMetadataReq = await fetch(fetchUrl, {
    method: 'GET',
    headers: {
      'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
      Authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
      Accept: 'application/hal+json'
    }
  })

  if (!(getExistingMetadataReq.ok)) {
    const result = await getExistingMetadataReq.json()
    return makeError(
      'GET_EXISTING_METADATA_FAILED',
      `I/O Management API: call to ${url} returned a non-2XX status code`,
      {
        ...result,
        code: getExistingMetadataReq.status
      }
    )
  }

  const getExistingMetadataResult = await getExistingMetadataReq.json()
  const existingMetadata = []

  if (getExistingMetadataResult?._embedded?.eventmetadata) {
    for (const event of getExistingMetadataResult._embedded.eventmetadata) {
      existingMetadata[event.event_code] = event
    }
  }

  if (getExistingMetadataResult?._links?.next) {
    const data = await getExistingMetadata(providerId, environment, accessToken, getExistingMetadataResult._links.next)
    existingMetadata.push(...data)
  }

  return {
    success: true,
    existingMetadata
  }
}

/**
 * Add metadata events codes from file config/events.json to corresponding provider
 *
 * @param {object} clientRegistrations - client registrations
 * @param {Array} providers - list of providers
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 */
async function main (clientRegistrations, providers, environment, accessToken) {
  try {
    let providersEvents = {}

    const result = []
    for (const provider of providers) {
      const existingMetadataResult = await getExistingMetadata(provider.id, environment, accessToken)

      if (!existingMetadataResult.success) {
        return existingMetadataResult
      }

      const { existingMetadata } = existingMetadataResult

      for (const [entityName, options] of Object.entries(clientRegistrations)) {
        if (options?.includes(provider.key) && providersEventsConfig[entityName]) {
          for (const [event, eventProps] of Object.entries(providersEventsConfig[entityName][provider.key])) {
            if (existingMetadata[event]) {
              console.log(`Skipping, Metadata event code ${event} already exists!`)
              continue
            }

            providersEvents = {
              ...providersEvents,
              [event]: eventProps
            }
          }

          result.push({
            entity: entityName,
            label: provider.label
          })
        }
      }

      const addMetadataResult = await addMetadataToProvider(providersEvents, provider.id, environment, accessToken)
      if (!addMetadataResult.success) {
        return addMetadataResult
      }
    }

    return {
      success: true,
      result
    }
  } catch (error) {
    return makeError(
      'UNEXPECTED_ERROR',
      'Unexpected error occurred while adding metadata to provider',
      {
        ...error
      }
    )
  }
}

exports.main = main
