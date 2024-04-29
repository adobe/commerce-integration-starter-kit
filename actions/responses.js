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

const { HTTP_OK } = require('./constants')

/**
 *
 * Returns a success response object, this method should be called on the handlers actions
 *
 * @param {string} message a descriptive message of the result
 *        e.g. 'missing xyz parameter'
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function actionSuccessResponse (message) {
  return {
    statusCode: HTTP_OK,
    body: {
      success: true,
      message
    }
  }
}

/**
 *
 * Returns a success response object, this method should be called on the handlers actions
 *
 * @param {number} statusCode the status code.
 *        e.g. 400
 * @param {string} error a descriptive message of the result
 *        e.g. 'missing xyz parameter'
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function actionErrorResponse (statusCode, error) {
  return {
    statusCode,
    body: {
      success: false,
      error
    }
  }
}

/**
 *
 * Returns an error response object, this method should be called on the consumers and public webhooks
 *
 * @param {number} statusCode the error status code.
 *        e.g. 400
 * @param {string} message the error message.
 *        e.g. 'missing xyz parameter'
 * @returns {object} the error object, ready to be returned from the action main's function.
 */
function errorResponse (statusCode, message) {
  return {
    error: {
      statusCode,
      body: {
        error: message
      }
    }
  }
}

/**
 *
 * Returns a success response object, this method should be called on the consumers
 *
 * @param {string} type the event type received by consumer
 *        e.g. 'adobe.commerce.observer.catalog_product_save_commit_after'
 * @param {object} response the response object returned from the event handler
 *        e.g. '{ success: true, message: 'Product created successfully'}'
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function successResponse (type, response) {
  return {
    statusCode: HTTP_OK,
    body: {
      type,
      response
    }
  }
}

/**
 * Returns response error adapted to ingestion webhooks module
 *
 * @param {string} message the error message.
 *        e.g. 'missing xyz parameter'
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function webhookErrorResponse (message) {
  return {
    statusCode: HTTP_OK,
    body: {
      op: 'exception',
      message
    }
  }
}

/**
 *
 * Returns a success response object, this method should be called on the sync webhooks
 *
 * @returns {object} the response object, ready to be returned from the action main's function.
 */
function webhookSuccessResponse () {
  return {
    statusCode: HTTP_OK,
    body: {
      op: 'success'
    }
  }
}

module.exports = {
  successResponse,
  errorResponse,
  actionErrorResponse,
  actionSuccessResponse,
  webhookErrorResponse,
  webhookSuccessResponse
}
