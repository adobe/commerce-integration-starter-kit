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

const action = require('../../../../../actions/customer-group/commerce/consumer');
jest.mock('openwhisk')
const openwhisk = require('openwhisk');

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Customer group commerce consumer', () => {
  test('main function should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  test('Given customer group updated in commerce, when event is received then customer group updated request is processed', async () => {
    const params = {
      type: 'com.adobe.commerce.observer.customer_group_save_commit_after',
      data: {
        value: {
          tax_class_name: "GROUP NAME"
        }
      }
    };

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
    });

    const response = await action.main(params);

    expect(response).toEqual({
      statusCode: 200,
      body: {
        request: {
          tax_class_name: "GROUP NAME"
        },
        response: {
          action: 'updated',
          success: true
        },
        type: "com.adobe.commerce.observer.customer_group_save_commit_after",
      }
    })
  })
  test('Given customer group deleted in commerce, when event is received then customer group deleted request is processed', async () => {
    const params = {
      type: 'com.adobe.commerce.observer.customer_group_delete_commit_after',
      data: {
        value: {
          tax_class_name: "GROUP NAME"
        }
      }
    };

    openwhisk.mockReturnValue({
      actions: {
        invoke: jest.fn().mockResolvedValue({
          response: {
            result: {
              statusCode: 200,
              body: {
                action: 'deleted',
                success: true
              }
            }
          }
        })
      }
    });

    const response = await action.main(params);

    expect(response).toEqual({
      statusCode: 200,
      body: {
        request: {
          tax_class_name: "GROUP NAME"
        },
        response: {
          action: 'deleted',
          success: true
        },
        type: "com.adobe.commerce.observer.customer_group_delete_commit_after",
      }
    })
  })
  test('Given params when process customer group commerce request missing required params then an error 400 is returned', async () => {

    const params = {};
    const response = await action.main(params);

    expect(response).toEqual({
      error: {
        statusCode: 400,
        body: {
          error: "missing parameter(s) 'type,data.value.tax_class_name'"
        }
      }
    })
  })
  test('Given params when customer group event type received is not supported then an error 400 is returned', async () => {
    const params = {
      type: 'NOT_SUPPORTED_TYPE',
      data: {
        value: {
          tax_class_name: "GROUP NAME"
        }
      }
    };
    const response = await action.main(params);

    expect(response).toEqual({
      statusCode: 400,
      body: {
        request: {
          tax_class_name: "GROUP NAME"
        },
        response: "This case type is not supported: NOT_SUPPORTED_TYPE",
        type: "NOT_SUPPORTED_TYPE",
      }
    })
  })
})
