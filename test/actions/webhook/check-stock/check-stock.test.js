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

const action = require('../../../../actions/webhook/check-stock')

jest.mock('../../../../actions/webhook/check-stock/stock', () => ({
  checkAvailableStock: jest.fn()
}))
const { checkAvailableStock } = require('../../../../actions/webhook/check-stock/stock')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Given synchronous webhook action to check stock availability', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When received data is valid', () => {
    test('Then returns webhook success response',
      async () => {
        const params = {
          data: {
            cart_id: 'CART_ID',
            items: [
              {
                item_id: 'ITEM_ID',
                sku: 'SKU',
                qty: 1
              }
            ]
          }
        }

        checkAvailableStock.mockResolvedValueOnce(Promise.resolve({
          success: true
        }))

        const response = await action.main(params)

        expect(response).toEqual({
          statusCode: 200,
          body: {
            op: 'success'
          }
        })
      })
  })
  describe('When received data is invalid', () => {
    test('Then returns webhook error response', async () => {
      const params = {}

      const response = await action.main(params)

      expect(response).toEqual({
        statusCode: 200,
        body: {
          op: 'exception',
          message: "missing parameter(s) 'data.cart_id,data.items'"
        }
      })
    })
  })
  describe('When check-stock downstream fails', () => {
    test('Then returns webhook error response', async () => {
      const params = {
        data: {
          cart_id: 'CART_ID',
          items: [{
            item_id: 'ITEM_ID',
            sku: 'SKU',
            qty: 1
          }]
        }
      }

      checkAvailableStock.mockResolvedValueOnce(Promise.resolve({
        success: false,
        message: 'no stock found'
      }))

      const response = await action.main(params)

      expect(response).toEqual({
        statusCode: 200,
        body: {
          op: 'exception',
          message: 'no stock found'
        }
      })
    })
  })
})
