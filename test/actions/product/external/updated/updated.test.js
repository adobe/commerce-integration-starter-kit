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

jest.mock('../../../../../actions/product/external/updated/validator')
const { validateData } = require('../../../../../actions/product/external/updated/validator')

jest.mock('../../../../../actions/product/external/updated/sender')
const { sendData } = require('../../../../../actions/product/external/updated/sender')

const action = require('../../../../../actions/product/external/updated')
const { HTTP_BAD_REQUEST, HTTP_INTERNAL_ERROR, HTTP_OK } = require('../../../../../actions/constants')

describe('Given product external updated action', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When product event data is invalid', () => {
    test('Then returns action error response', async () => {
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
  })
  describe('When an exception is thrown', () => {
    test('Then return action error response', async () => {
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
  })
  describe('When product event data is valid', () => {
    test('Then returns action success response', async () => {
      const IGNORED_PARAMS = { data: {} }
      const SUCCESSFUL_VALIDATION_RESPONSE = {
        success: true
      }
      const SUCCESSFUL_SEND_DATA_RESPONSE = {
        success: true,
        response: 'anything'
      }
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
})
