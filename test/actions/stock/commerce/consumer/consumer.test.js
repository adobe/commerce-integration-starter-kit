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
const { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_INTERNAL_ERROR } = require('../../../../../actions/constants')
const Openwhisk = require('../../../../../actions/openwhisk')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Given stock commerce consumer', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When a valid stock item updated event is received', () => {
    test('Then returns success response', async () => {
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
          response: {
            action: 'updated',
            success: true
          },
          type: 'com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after'
        }
      })
    })
  })
  describe('When stock event type received is not supported', () => {
    test('Then returns error response', async () => {
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
        error: {
          statusCode: HTTP_BAD_REQUEST,
          body: {
            error: 'This case type is not supported: NOT_SUPPORTED_TYPE'
          }
        }
      })
    })
  })
  describe('When the downstream response success is false', () => {
    it.each([
      [HTTP_BAD_REQUEST, { success: false, error: 'Invalid data' }],
      [HTTP_NOT_FOUND, { success: false, error: 'Entity not found' }],
      [HTTP_INTERNAL_ERROR, { success: false, error: 'Internal error' }]
    ]
    )('Then returns the status code %p and response', async (statusCode, response) => {
      const type = 'com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after'
      const ACTION_RESPONSE = {
        response: {
          result: {
            body: response,
            statusCode
          }
        }
      }
      const CONSUMER_RESPONSE = {
        error: {
          statusCode,
          body: {
            error: response.error
          }
        }
      }
      const params = { type, data: { value: { customer_group_code: 'xxx' } } }
      Openwhisk.prototype.invokeAction = jest.fn().mockResolvedValue(ACTION_RESPONSE)
      expect(await action.main(params)).toMatchObject(CONSUMER_RESPONSE)
    })
  })
})
