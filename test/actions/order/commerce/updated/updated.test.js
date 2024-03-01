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

const action = require('../../../../../actions/order/commerce/updated')
jest.mock('../../../../../actions/order/commerce/updated/validator')
const { validateData } = require('../../../../../actions/order/commerce/updated/validator')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Commerce order updated', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  describe('When process order commerce request has invalid data', () => {
    test('Then an error 400 is returned', async () => {
      const params = {
        data: {}
      }

      const ERROR_MESSAGE = 'Invalid data'
      validateData.mockReturnValue({
        success: false,
        message: ERROR_MESSAGE
      })

      const response = await action.main(params)

      expect(response).toEqual({
        statusCode: 400,
        body: {
          success: false,
          error: ERROR_MESSAGE
        }
      })
    })
  })
  // @TODO Here you can add unit tests to cover the cases implemented in the order updated runtime action
})
