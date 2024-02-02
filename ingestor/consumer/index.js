/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */

const { Core, Events } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../../actions/utils')
const { CloudEvent } = require('cloudevents')
const uuid = require('uuid')
const { HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_UNAUTHORIZED } = require('../../actions/constants')
const { getBackofficeProviderName } = require('../../utils/naming')
const { getAdobeAccessToken } = require('../../utils/adobe-auth')
const { getExistingProviders } = require('../../utils/adobe-events-api')
const { validateData } = require('./validator')
const { checkAuthentication } = require('../auth')

/**
 * Build the events object
 *
 * @param {object} provider provider information
 * @param {Array} data events data received
 * @returns {Array} Array of events with provider information
 */
function buildEvents (provider, data) {
  const events = []
  const errors = []
  let success = true

  for (const eventInformation of data) {
    const result = validateData(eventInformation)

    if (!result.success) {
      errors.push(result.message)
      success = false
    }

    events.push({
      providerId: provider.id,
      providerName: provider.label,
      entity: eventInformation.entity,
      type: eventInformation.event,
      data: eventInformation.value,
      success: ''
    })
  }

  return {
    success,
    errors,
    events
  }
}

/**
 * This is web action receives publish external back-office application data and publish it to IO events
 *
 * @param {object} params - method params includes environment and request data
 * @returns {object} - response with success status and result
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  try {
    const statusCode = HTTP_OK

    logger.info('[Ingestor] Start processing request')
    logger.debug(`[Ingestor] Consumer main params: ${stringParameters(params)}`)

    const requiredParams = ['data']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      logger.error(`[Ingestor] Invalid request parameters: ${stringParameters(params)}`)
      return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger)
    }

    // Check authentication and throw exception in case of failure
    const authentication = await checkAuthentication(params)

    if (!authentication.success) {
      logger.error(`[Ingestor] ${authentication.message}`)
      return errorResponse(HTTP_UNAUTHORIZED, authentication.message, logger)
    }

    logger.debug('[Ingestor] Generate Adobe access token')
    const accessToken = await getAdobeAccessToken(params)

    logger.debug('[Ingestor] Get existing registrations')
    const providers = await getExistingProviders(params, accessToken)
    const providerName = getBackofficeProviderName(params)
    const provider = providers[providerName]

    if (!provider) {
      const errorMessage = '[Ingestor] Could not found any external backoffice provider'
      logger.error(errorMessage)
      return errorResponse(HTTP_INTERNAL_ERROR, errorMessage, logger)
    }

    const eventsResult = buildEvents(provider, params.data)

    if (!eventsResult.success) {
      logger.error('[Ingestor] Invalid events data')
      return errorResponse(HTTP_BAD_REQUEST, eventsResult.errors, logger)
    }

    logger.debug('[Ingestor] Initiate events client')
    const eventsClient = await Events.init(
      params.OAUTH_ORG_ID,
      params.OAUTH_CLIENT_ID,
      accessToken)

    logger.debug('[Ingestor] Process events data')
    for (const event of eventsResult?.events) {
      logger.debug(
          `[Ingestor] Process event ${event.type} for entity ${event.entity}`)

      const cloudEvent = new CloudEvent({
        source: 'urn:uuid:' + event.providerId,
        type: event.type,
        datacontenttype: 'application/json',
        data: event.data,
        id: uuid.v4()
      })

      logger.debug(`[Ingestor] Publish event ${event.type} to provider ${event.providerName}`)
      event.success = await eventsClient.publishEvent(cloudEvent)
    }

    logger.info(`[Ingestor] ${statusCode}: successful request`)

    return {
      statusCode,
      body: {
        request: params.data,
        response: {
          success: true,
          events: eventsResult.events
        }
      }
    }
  } catch (error) {
    return errorResponse(HTTP_INTERNAL_ERROR,
        `[Ingestor] Server error: ${error.message}`, logger)
  }
}

exports.main = main
