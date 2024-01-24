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

/**
 * This is the consumer of the events coming from Adobe Commerce related to product entity.
 */
const { Core, Events } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../actions/utils')
const { CloudEvent } = require("cloudevents");
const uuid = require('uuid')
const {HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR} = require("../../../constants");
const {getRegistrationName} = require("../utils/naming");
const {getAdobeAccessToken} = require("../utils/adobe-auth");
const {getExistingRegistrations} = require("../utils/adobe-events-api");
const eventsMap = require("./events-mapping.json");
const {validateData} = require("./validator");

function mapData(data) {
  // TODO Transform received data here to expected by consumer

  return {
    value: data
  };
}

async function main (params) {
  try {
    const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

    let statusCode = HTTP_OK;

    logger.info('[Ingestor] Start processing request');
    logger.debug(`[Ingestor] Consumer main params: ${stringParameters(params)}`);

    const requiredParams = ['payload']
    const errorMessage = checkMissingRequestInputs(params, requiredParams, []);

    if (errorMessage) {
      logger.error(`[Ingestor] Invalid request parameters: ${stringParameters(params)}`);
      return errorResponse(HTTP_BAD_REQUEST, errorMessage, logger);
    }

    logger.debug('[Ingestor] Params type: ' + params.payload);

    // Check authentication and throw exception in case of failure

    logger.debug('[Ingestor] Generate Adobe access token');
    const accessToken = await getAdobeAccessToken(params);

    logger.debug('[Ingestor] Get existing registrations');
    const providers = getExistingRegistrations(params, accessToken);

    const eventsMap = require('events-mapping.json');
    /*
    data = {
      entity: 'product',
      event: 'product-created',
      value: {
        ... event data
      }
    }
    */
    const events = [];

    for (const element of params.payload) {
      const registrationName = getRegistrationName('backoffice', element.entity);
      const result = validateData(element, eventsMap, registrationName);

      if (!result.success) {
        logger.error(`[Ingestor] ${result.message}`);
        return errorResponse(HTTP_BAD_REQUEST, result.message, logger);
      }

      const provider = providers[registrationName];

      events.push = {
        providerId: provider.id,
        providerName: provider.name,
        entity: element.entity,
        type: eventsMap[element.event],
        data: mapData(element.value),
        success: ''
      }
    }

    logger.debug('[Ingestor] Initiate events client');
    const eventsClient = await Events.init(
        params.OAUTH_ORG_ID,
        params.OAUTH_CLIENT_ID,
        accessToken);

    logger.debug('[Ingestor] Process events payload');
    for (const event of events) {
      logger.debug(`[Ingestor] Process event ${event.type} for entity ${event.entity}`);

      let cloudEvent = new CloudEvent({
        source: 'urn:uuid:' + event.providerId,
        type: event.type,
        datacontenttype: "application/json",
        data: event.data,
        id: uuid.v4()
      });

      logger.debug(`[Ingestor] Publish event for provider ${event.providerName}`);
      event.success = await eventsClient.publishEvent(cloudEvent);
    }

    logger.info(`[Ingestor] ${statusCode}: successful request`)

    return {
      statusCode: statusCode,
      body: {
        request: params.payload,
        response: {
          success: true,
          events
        }
      }
    }
  } catch (error) {
    return errorResponse(HTTP_INTERNAL_ERROR, `[Ingestor] Server error: ${error.message}`, logger)
  }
}

exports.main = main
