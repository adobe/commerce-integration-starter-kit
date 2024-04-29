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

const action = require('../../../../../actions/order/commerce/consumer')
jest.mock('openwhisk')
const openwhisk = require('openwhisk')
const { HTTP_BAD_REQUEST } = require('../../../../../actions/constants')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Given order commerce consumer', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When a valid order created event is received', () => {
    test('Then returns success response', async () => {
      const params = {
        API_HOST: 'API_HOST',
        API_AUTH: 'API_AUTH',
        type: 'com.adobe.commerce.observer.sales_order_save_commit_after',
        data: {
          value: {
            real_order_id: 'ORDER_ID',
            increment_id: 'ORDER_INCREMENTAL_ID',
            items: [
              {
                item_id: 'ITEM_ID'
              }
            ],
            created_at: '2000-01-01',
            updated_at: '2000-01-01'
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
            success: true
          },
          type: 'com.adobe.commerce.observer.sales_order_save_commit_after'
        }
      })
    })
  })
  describe('When a valid order updated event is received', () => {
    test('Then returns success response', async () => {
      const params = {
        type: 'com.adobe.commerce.observer.sales_order_save_commit_after',
        data: {
          value: {
            real_order_id: 'ORDER_ID',
            increment_id: 'ORDER_INCREMENTAL_ID',
            items: [
              {
                item_id: 'ITEM_ID'
              }
            ],
            created_at: '2000-01-01',
            updated_at: '2000-01-01'
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
            success: true
          },
          type: 'com.adobe.commerce.observer.sales_order_save_commit_after'
        }
      })
    })
  })
  describe('When an invalid order event is received', () => {
    test('Then returns error response', async () => {
      const params = {}
      const response = await action.main(params)

      expect(response).toEqual({
        error: {
          statusCode: 400,
          body: {
            error: "Invalid request parameters: missing parameter(s) 'type,data.value.created_at,data.value.updated_at'"
          }
        }
      })
    })
  })
  describe('When order event type received is not supported', () => {
    test('Then returns error response',
      async () => {
        const params = {
          type: 'NOT_SUPPORTED_TYPE',
          data: {
            value: {
              real_order_id: 'ORDER_ID',
              increment_id: 'ORDER_INCREMENTAL_ID',
              items: [
                {
                  item_id: 'ITEM_ID'
                }
              ],
              created_at: '2000-01-01',
              updated_at: '2000-01-01'
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
})
