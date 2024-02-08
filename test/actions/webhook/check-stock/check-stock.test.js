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

const action = require('../../../../actions/webhook/check-stock')

jest.mock('../../../../actions/webhook/check-stock/stock', () => ({
  checkAvailableStock: jest.fn()
}))
const { checkAvailableStock } = require('../../../../actions/webhook/check-stock/stock')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Synchronous webhook to check stock availability', () => {
  test('main function should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  describe('Given check-stock webhook receives information', () => {
    describe('When check-stock succeed', () => {
      test('Then return success operation',
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
    describe('When data parameter is missing', () => {
      test('Then return an exception operation response',
        async () => {
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
    describe('When required parameters are missing', () => {
      test('Then return an exception operation response',
        async () => {
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
    describe('When check-stock not succeed', () => {
      test('Then return success operation',
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
})
