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
const providersEventsConfig = require('../onboarding/config/events.json')

/**
 * This method build an array of provider events
 *
 * @param {Array} providerEvents - provider events
 * @returns {Array} - returns the list of events
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
 * @returns {string|null} - returns base64 encoded string
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
 * @returns {object} - returns response with success true or false
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

  const addEventMetadataReq = await fetch(
        `${environment.IO_MANAGEMENT_BASE_URL}${environment.IO_CONSUMER_ID}/${environment.IO_PROJECT_ID}/${environment.IO_WORKSPACE_ID}/providers/${providerId}/eventmetadata`,
        {
          method: 'POST',
          headers: {
            'x-api-key': `${environment.OAUTH_CLIENT_ID}`,
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
            Accept: 'application/hal+json'
          },
          body: JSON.stringify(body)
        }
  )

  const result = await addEventMetadataReq.json()
  if (result?.reason) {
    return {
      success: false,
      error: {
        reason: result?.reason,
        message: result?.message
      }
    }
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
 * @returns {object} - returns response with success true or false
 */
async function addMetadataToProvider (providerEvents, providerId, environment, accessToken) {
  const commerceProviderMetadata = buildProviderData(providerEvents)
  for (const metadata of commerceProviderMetadata) {
    const result = await addEventCodeToProvider(metadata, providerId, environment, accessToken)
    if (!result.success) {
      const errorMessage = `Unable to add event metadata: reason = '${result.error?.reason}', message = '${result.error?.message}'`
      console.log(errorMessage)

      return {
        success: false,
        error: errorMessage
      }
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
 * @returns {Array} - returns the provider metadata
 */
async function getExistingMetadata (providerId, environment, accessToken, next = null) {
  const url = `${environment.IO_MANAGEMENT_BASE_URL}providers/${providerId}/eventmetadata`
  const getExistingMetadataReq = await fetch(
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
  const getExistingMetadataResult = await getExistingMetadataReq.json()
  const existingMetadata = []
  if (getExistingMetadataResult?._embedded?.eventmetadata) {
    getExistingMetadataResult._embedded.eventmetadata.forEach(event => {
      existingMetadata[event.event_code] = event
    })
  }
  if (getExistingMetadataResult?._links?.next) {
    const data = await getExistingMetadata(providerId, environment, accessToken, getExistingMetadataResult._links.next)
    existingMetadata.push(...data)
  }
  return existingMetadata
}

/**
 * Add metadata events codes from file config/events.json to corresponding provider
 *
 * @param {object} clientRegistrations - client registrations
 * @param {Array} providers - list of providers
 * @param {object} environment - environment params
 * @param {string} accessToken - access token
 * @returns {object} - return response with the created metadata
 */
async function main (clientRegistrations, providers, environment, accessToken) {
  try {
    let providersEvents = {}

    const result = []
    for (const provider of providers) {
      const existingMetadata = await getExistingMetadata(provider.id, environment, accessToken)

      for (const [entityName, options] of Object.entries(clientRegistrations)) {
        if (options !== undefined && options.includes(provider.key)) {
          if (providersEventsConfig[entityName]) {
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
      }

      const addMetadataResult = await addMetadataToProvider(providersEvents, provider.id, environment, accessToken)
      if (!addMetadataResult.success) {
        return {
          code: 500,
          success: false,
          error: addMetadataResult.error
        }
      }
    }

    const response = {
      code: 200,
      success: true,
      result
    }

    console.log(`${response.code}: Process of adding metadata to provider done successfully`)
    return response
  } catch (error) {
    const errorMessage = `Unable to complete the process of adding metadata to provider: ${error.message}`
    console.log(errorMessage)
    return {
      code: 500,
      success: false,
      error: errorMessage
    }
  }
}

exports.main = main
