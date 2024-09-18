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

const {Core, Events} = require("@adobe/aio-sdk");
const {getAdobeAccessToken} = require("../../../../utils/adobe-auth");
const {CloudEvent} = require("cloudevents");
const uuid = require("uuid");

/**
 * This function hold any logic needed post sending information to external backoffice application
 *
 * @param {object} params - data received before transformation
 * @param {object} transformed - transformed received data
 * @param {object} preProcessed - preprocessed result data
 * @param {object} result - result data from the sender
 */
function postProcess (params, transformed, preProcessed, result) {

  const logger = Core.Logger('order-commerce-created.post', { level: 'debug' });
  logger.info(`Start post process with transformed data: ${JSON.stringify(transformed)}`);

  logger.debug('Generate Adobe access token');
  getAdobeAccessToken(params).then(accessToken => {
    logger.debug(`Access token: ${accessToken}`);

    logger.debug('Initialize events client');
    return Events.init(params.OAUTH_ORG_ID, params.OAUTH_CLIENT_ID, accessToken).then(eventsClient => {
      const cloudEvent = new CloudEvent({
        source: `urn:uuid:${params.EMAIL_PROVIDER_ID}`,
        type: 'email.sales_order.created',
        datacontenttype: 'application/json',
        data: {
          orderId: `${transformed.data.ids.increment}`
        },
        id: uuid.v4()
      });

      logger.debug(`Publish event: ${cloudEvent}`);
      return eventsClient.publishEvent(cloudEvent).then(published => {
        if (published === 'OK') {
          logger.info('Published successfully to I/O Events');
        } else if (published === undefined) {
          logger.warn('Published to I/O Events but there were not interested registrations');
        }

        logger.info('Completed post process');
      });
    });
  }).catch(error => {
    logger.error(`Error in post process: ${error.message}`);
  });
}

module.exports = {
  postProcess
}
