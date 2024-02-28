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

jest.mock('../../../../../actions/order/external/updated/validator')
const { validateData } = require('../../../../../actions/order/external/updated/validator')

jest.mock('../../../../../actions/order/external/updated/sender')
const { sendData } = require('../../../../../actions/order/external/updated/sender')

const action = require('../../../../../actions/order/external/updated')
const { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, HTTP_INTERNAL_ERROR, HTTP_OK } = require('../../../../../actions/constants')
const { HTTPError } = require('got')

/**
 * Builds an HTTP Error
 * @param {number} statusCode error status code
 * @param {string} statusMessage error status message
 * @returns {HTTPError} http error
 */
function buildHttpError (statusCode, statusMessage) {
  const response = { statusCode, statusMessage }
  const httpError = new HTTPError(response)
  // uses the workaround described in https://github.com/sindresorhus/got/issues/1210#issuecomment-623534449
  // To have an error with response attribute
  httpError.response = response
  return httpError
}

describe('Order external updated', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  test('When validation fails, Then returns HTTP_BAD_REQUEST', async () => {
    const IGNORED_PARAMS = { data: {} }
    const FAILED_VALIDATION_RESPONSE = {
      success: false,
      message: 'Data provided does not validate with the schema'
    }
    const ERROR_RESPONSE = {
      statusCode: HTTP_BAD_REQUEST,
      body: {
        success: false,
        error: 'Data provided does not validate with the schema'
      }
    }
    validateData.mockReturnValue(FAILED_VALIDATION_RESPONSE)
    expect(await action.main(IGNORED_PARAMS)).toMatchObject(ERROR_RESPONSE)
  })
  test('When an HTTP error is caught, Then returns the status code in the error', async () => {
    const IGNORED_PARAMS = { data: {} }
    const SUCCESSFUL_VALIDATION_RESPONSE = {
      success: true
    }
    const STATUS_CODE = HTTP_UNAUTHORIZED
    const ERROR = buildHttpError(STATUS_CODE, 'Unauthorized')
    const ERROR_RESPONSE = {
      statusCode: STATUS_CODE,
      body: {
        success: false,
        error: ERROR.message
      }
    }
    validateData.mockReturnValue(SUCCESSFUL_VALIDATION_RESPONSE)
    sendData.mockRejectedValue(ERROR)
    expect(await action.main(IGNORED_PARAMS)).toMatchObject(ERROR_RESPONSE)
  })
  test('When an generic error is caught, Then returns HTTP_INTERNAL_ERROR', async () => {
    const IGNORED_PARAMS = { data: {} }
    const SUCCESSFUL_VALIDATION_RESPONSE = {
      success: true
    }
    const ERROR = new Error('generic error')
    const ERROR_RESPONSE = {
      statusCode: HTTP_INTERNAL_ERROR,
      body: {
        success: false,
        error: ERROR.message
      }
    }
    validateData.mockReturnValue(SUCCESSFUL_VALIDATION_RESPONSE)
    sendData.mockRejectedValue(ERROR)
    expect(await action.main(IGNORED_PARAMS)).toMatchObject(ERROR_RESPONSE)
  })
  test('When success, Then returns HTTP_OK', async () => {
    const IGNORED_PARAMS = { data: {} }
    const SUCCESSFUL_VALIDATION_RESPONSE = {
      success: true
    }
    const SUCCESSFUL_SEND_DATA_RESPONSE = 'anything'
    const SUCCESS_RESPONSE = {
      statusCode: HTTP_OK,
      body: {
        success: true
      }
    }
    validateData.mockReturnValue(SUCCESSFUL_VALIDATION_RESPONSE)
    sendData.mockReturnValue(SUCCESSFUL_SEND_DATA_RESPONSE)
    expect(await action.main(IGNORED_PARAMS)).toMatchObject(SUCCESS_RESPONSE)
  })
})
