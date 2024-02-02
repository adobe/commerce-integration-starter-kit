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
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../../../actions/utils')
const { CloudEvent } = require('cloudevents')
const uuid = require('uuid')
const {
  HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_UNAUTHORIZED,
  BACKOFFICE_PROVIDER_KEY
} = require('../../../actions/constants')
const { getAdobeAccessToken } = require('../../../utils/adobe-auth')
const { getProviderByKey } = require('../../../utils/adobe-events-api')
const { validateData } = require('./validator')
const { checkAuthentication } = require('../auth')

/**
 * Build the events object
 *
 * @param {object} provider provider information
 * @param {object} data events data received
 * @returns {object} Array of events with provider information
 */
function buildEvents (provider, data) {
  const events = []
  let success = true
  let errorMessage

  for (const eventInformation of data) {
    const result = validateData(eventInformation)

    if (!result.success) {
      errorMessage = `Invalid event value: ${result.message}`
      success = false
      break
    }

    events.push({
      providerId: provider.id,
      providerName: provider.label,
      type: eventInformation.event,
      data: eventInformation.value,
      uid: eventInformation.uid
    })
  }

  return {
    success,
    errorMessage,
    events
  }
}

/**
 * This web action allow external back-office application publish events to IO events using custom authentication mechanism.
 *
 * @param {object} params - method params includes environment and request data
 * @returns {object} - response with success status and result
 */
async function main (params) {
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  try {
    logger.info('[IngestionWebhook] Start processing request')
    logger.debug(`[IngestionWebhook] Webhook main params: ${stringParameters(params)}`)

    const requiredParams = ['data']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, [])

    if (errorMessage) {
      return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger)
    }

    const authentication = await checkAuthentication(params)

    if (!authentication.success) {
      logger.error(`[IngestionWebhook] ${authentication.message}`)
      return errorResponse(HTTP_UNAUTHORIZED, authentication.message, logger)
    }

    logger.debug('[IngestionWebhook] Generate Adobe access token')
    const accessToken = await getAdobeAccessToken(params)

    logger.debug('[IngestionWebhook] Get existing registrations')
    const provider = await getProviderByKey(params, accessToken, BACKOFFICE_PROVIDER_KEY)

    if (!provider) {
      const errorMessage = '[IngestionWebhook] Could not found any external backoffice provider'
      logger.error(errorMessage)
      return errorResponse(HTTP_INTERNAL_ERROR, errorMessage, logger)
    }

    const eventsResult = buildEvents(provider, params.data)

    if (!eventsResult.success) {
      return errorResponse(HTTP_BAD_REQUEST, eventsResult.errorMessage, logger)
    }

    logger.debug('[IngestionWebhook] Initiate events client')
    const eventsClient = await Events.init(
      params.OAUTH_ORG_ID,
      params.OAUTH_CLIENT_ID,
      accessToken)

    logger.debug('[IngestionWebhook] Process events data')
    for (const event of eventsResult?.events) {
      logger.debug(
          `[IngestionWebhook] Process event ${event.type} for entity ${event.entity}`)

      const cloudEvent = new CloudEvent({
        source: 'urn:uuid:' + event.providerId,
        type: event.type,
        datacontenttype: 'application/json',
        data: event.data,
        id: uuid.v4()
      })

      logger.debug(`[IngestionWebhook] Publish event ${event.type} to provider ${event.providerName}`)
      event.success = await eventsClient.publishEvent(cloudEvent)
    }

    logger.info(`[IngestionWebhook] ${HTTP_OK}: successful request`)

    return {
      statusCode: HTTP_OK,
      body: {
        success: true,
        events: eventsResult.events
      }
    }
  } catch (error) {
    return errorResponse(HTTP_INTERNAL_ERROR,
        `[IngestionWebhook] Server error: ${error.message}`, logger)
  }
}

exports.main = main
