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

const { Core, Events } = require('@adobe/aio-sdk')
const { stringParameters } = require('../../../actions/utils')
const { CloudEvent } = require('cloudevents')
const uuid = require('uuid')
const {
  HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_UNAUTHORIZED,
  BACKOFFICE_PROVIDER_KEY, PUBLISH_EVENT_SUCCESS
} = require('../../../actions/constants')
const { getAdobeAccessToken} = require('../../../utils/adobe-auth')
const { getProviderByKey } = require('../../../utils/adobe-events-api')
const { validateData } = require('./validator')
const { checkAuthentication } = require('./auth')
const { errorResponse, successResponse } = require('../../responses')
const { CommerceSdkValidationError } = require("@adobe/aio-commerce-lib-core/validation");


/**
 * This web action allow external back-office application publish event to IO event using custom authentication mechanism.
 *
 * @param {object} params - method params includes environment and request data
 * @returns {object} - response with success status and result
 */
async function main (params) {
  const logger = Core.Logger('ingestion-webhook', { level: params.LOG_LEVEL || 'info' })
  try {
    logger.info('Start processing request')
    logger.debug(`Webhook main params: ${stringParameters(params)}`)

    const authentication = await checkAuthentication(params)
    if (!authentication.success) {
      logger.error(`Authentication failed with error: ${authentication.message}`)
      return errorResponse(HTTP_UNAUTHORIZED, authentication.message)
    }

    const validationResult = validateData(params)
    if (!validationResult.success) {
      logger.error(`Validation failed with error: ${validationResult.message}`)
      return errorResponse(HTTP_BAD_REQUEST, validationResult.message)
    }

    logger.debug('Generate Adobe access token')
    const accessToken = await getAdobeAccessToken({
        clientId: params.AIO_COMMERCE_IMS_CLIENT_ID,
        clientSecrets: params.AIO_COMMERCE_IMS_CLIENT_SECRETS,
        imsOrgId: params.AIO_COMMERCE_IMS_ORG_ID,
        technicalAccountId: params.AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_ID,
        technicalAccountEmail: params.AIO_COMMERCE_IMS_TECHNICAL_ACCOUNT_EMAIL,
        scopes: params.AIO_COMMERCE_IMS_SCOPES,
        env: params.AIO_COMMERCE_IMS_ENVIRONMENT,
        context: params.AIO_COMMERCE_IMS_CTX
    })
    console.log(accessToken)
    const authHeaders = {
        Authorization: `Bearer ${accessToken}`,
        'x-api-key': params.AIO_COMMERCE_IMS_CLIENT_ID
    }

    logger.debug('Get existing registrations')
    const provider = await getProviderByKey(params, authHeaders, BACKOFFICE_PROVIDER_KEY)

    if (!provider) {
      const errorMessage = 'Could not find any external backoffice provider'
      logger.error(`${errorMessage}`)
      return errorResponse(HTTP_INTERNAL_ERROR, errorMessage)
    }

    logger.debug('Initiate events client')
    const eventsClient = await Events.init(
        params.AIO_COMMERCE_IMS_ORG_ID,
        params.AIO_COMMERCE_IMS_CLIENT_ID,
        accessToken)

    const eventType = params.data.event
    logger.info(`Process event data ${eventType}`)
    const cloudEvent = new CloudEvent({
      source: 'urn:uuid:' + provider.id,
      type: eventType,
      datacontenttype: 'application/json',
      data: params.data.value,
      id: uuid.v4()
    })

    logger.debug(`Publish event ${eventType} to provider ${provider.label}`)
    const publishEventResult = await eventsClient.publishEvent(cloudEvent)
    logger.debug(`Publish event result: ${publishEventResult}`)
    if (publishEventResult !== PUBLISH_EVENT_SUCCESS) {
      logger.error(`Unable to publish event ${eventType}: Unknown event type`)
      return errorResponse(HTTP_BAD_REQUEST, `Unable to publish event ${eventType}: Unknown event type`)
    }

    logger.info(`Successful request: ${HTTP_OK}`)

    return successResponse(eventType, {
      success: true,
      message: 'Event published successfully'
    })
  } catch (error) {
    if (error instanceof CommerceSdkValidationError) {
      logger.error(error.display());
      return errorResponse(HTTP_INTERNAL_ERROR, error.message)
    }

    logger.error(`Server error: ${error.message}`)
    return errorResponse(HTTP_INTERNAL_ERROR, error.message)
  }
}

exports.main = main
