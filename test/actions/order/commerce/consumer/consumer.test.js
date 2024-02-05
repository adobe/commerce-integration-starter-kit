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

const action = require('../../../../../actions/order/commerce/consumer')
jest.mock('openwhisk')
const openwhisk = require('openwhisk')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Order events received from commerce', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  describe('Given order created or updated in commerce', () => {
    describe('When event is received with equal created and updated date', () => {
      test('Then order created request is processed', async () => {
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
            request: {
              real_order_id: 'ORDER_ID',
              increment_id: 'ORDER_INCREMENTAL_ID',
              items: [
                {
                  item_id: 'ITEM_ID'
                }
              ],
              created_at: '2000-01-01',
              updated_at: '2000-01-01'
            },
            response: {
              success: true
            },
            type: 'com.adobe.commerce.observer.sales_order_save_commit_after'
          }
        })
      })
    })
    describe('When event is received with not equal created and updated date', () => {
      test('Then order updated request is processed', async () => {
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
            request: {
              real_order_id: 'ORDER_ID',
              increment_id: 'ORDER_INCREMENTAL_ID',
              items: [
                {
                  item_id: 'ITEM_ID'
                }
              ],
              created_at: '2000-01-01',
              updated_at: '2000-01-01'
            },
            response: {
              success: true
            },
            type: 'com.adobe.commerce.observer.sales_order_save_commit_after'
          }
        })
      })
    })
    describe('When event is received with missing required parameters', () => {
      test('Then process return a 400 and message error', async () => {
        const params = {}
        const response = await action.main(params)

        expect(response).toEqual({
          error: {
            statusCode: 400,
            body: {
              error: "missing parameter(s) 'type,data.value.created_at,data.value.updated_at'"
            }
          }
        })
      })
    })
    describe('When event is received with not supported event type', () => {
      test('Then process return 400 and message error',
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
            statusCode: 400,
            body: {
              request: {
                real_order_id: 'ORDER_ID',
                increment_id: 'ORDER_INCREMENTAL_ID',
                items: [
                  {
                    item_id: 'ITEM_ID'
                  }
                ],
                created_at: '2000-01-01',
                updated_at: '2000-01-01'
              },
              response: 'This case type is not supported: NOT_SUPPORTED_TYPE',
              type: 'NOT_SUPPORTED_TYPE'
            }
          })
        })
    })
  })
})
