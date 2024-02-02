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

describe('Order commerce consumer', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  test('Given order created in commerce, when event is received then order created request is processed', async () => {
    const params = {
      API_HOST: 'API_HOST',
      API_AUTH: 'API_AUTH',
      type: 'com.adobe.commerce.observer.sales_order_save_commit_after',
      data: {
        value: {
          real_order_id: 'ORDER_ID',
          increment_id: 'ORRDER_INCREMENTAL_ID',
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
          increment_id: 'ORRDER_INCREMENTAL_ID',
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
  test('Given order updated in commerce, when event is received then order updated request is processed', async () => {
    const params = {
      type: 'com.adobe.commerce.observer.sales_order_save_commit_after',
      data: {
        value: {
          real_order_id: 'ORDER_ID',
          increment_id: 'ORRDER_INCREMENTAL_ID',
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
          increment_id: 'ORRDER_INCREMENTAL_ID',
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
  test('Should return a 400 and message error when process order commerce request missing required params', async () => {
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
  test('should 400 and message error when order commerce event type is not supported', async () => {
    const params = {
      type: 'NOT_SUPPORTED_TYPE',
      data: {
        value: {
          real_order_id: 'ORDER_ID',
          increment_id: 'ORRDER_INCREMENTAL_ID',
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
          increment_id: 'ORRDER_INCREMENTAL_ID',
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
