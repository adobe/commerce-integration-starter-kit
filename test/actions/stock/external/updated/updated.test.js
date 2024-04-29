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

jest.mock('../../../../../actions/stock/external/updated/validator')
const { validateData } = require('../../../../../actions/stock/external/updated/validator')

jest.mock('../../../../../actions/stock/external/updated/sender')
const { sendData } = require('../../../../../actions/stock/external/updated/sender')

const action = require('../../../../../actions/stock/external/updated')
const { HTTP_BAD_REQUEST, HTTP_INTERNAL_ERROR, HTTP_OK } = require('../../../../../actions/constants')

describe('Given stock external updated action', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When stock event data is invalid', () => {
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
      const IGNORED_PARAMS = { data: [] }
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
  describe('When stock event data is valid', () => {
    test('Then returns action success response', async () => {
      const IGNORED_PARAMS = { data: [] }
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
