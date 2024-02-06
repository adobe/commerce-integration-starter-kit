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
const action = require('../../../../../actions/stock/commerce/consumer')
jest.mock('openwhisk')
const openwhisk = require('openwhisk')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Stock commerce consumer', () => {
  test('main function should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  test('Given stock item updated in commerce, when event is received then stock item updated request is processed', async () => {
    const params = {
      type: 'com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after',
      data: {
        value: {
          item_id: '1',
          product_id: '1',
          stock_id: 1,
          qty: 1
        }
      }
    }

    openwhisk.mockReturnValue({
      actions: {
        invoke: jest.fn().mockResolvedValue({
          response: {
            result: {
              statusCode: 200,
              body: {
                action: 'updated',
                success: true
              }
            }
          }
        })
      }
    })

    const response = await action.main(params)

    expect(response).toEqual({
      statusCode: 200,
      body: {
        request: {
          item_id: '1',
          product_id: '1',
          stock_id: 1,
          qty: 1
        },
        response: {
          action: 'updated',
          success: true
        },
        type: 'com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after'
      }
    })
  })
  test('Given params when stock item event type received is not supported then an error 400 is returned', async () => {
    const params = {
      type: 'NOT_SUPPORTED_TYPE',
      data: {
        value: {
          item_id: '1',
          product_id: '1',
          stock_id: 1,
          qty: 1
        }
      }
    }
    const response = await action.main(params)

    expect(response).toEqual({
      statusCode: 400,
      body: {
        request: {
          item_id: '1',
          product_id: '1',
          stock_id: 1,
          qty: 1
        },
        response: 'This case type is not supported: NOT_SUPPORTED_TYPE',
        type: 'NOT_SUPPORTED_TYPE'
      }
    })
  })
})
