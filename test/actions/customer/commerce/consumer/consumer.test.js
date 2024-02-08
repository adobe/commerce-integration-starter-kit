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

const action = require('../../../../../actions/customer/commerce/consumer')
jest.mock('openwhisk')
const openwhisk = require('openwhisk')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Customer commerce consumer', () => {
  test('main function should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  test('Given customer created in commerce, when event is received then customer created request is processed', async () => {
    const params = {
      API_HOST: 'API_HOST',
      API_AUTH: 'API_AUTH',
      type: 'com.adobe.commerce.observer.customer_save_commit_after',
      data: {
        value: {
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
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
                action: 'created',
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
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
          created_at: '2000-01-01',
          updated_at: '2000-01-01'
        },
        response: {
          action: 'created',
          success: true
        },
        type: 'com.adobe.commerce.observer.customer_save_commit_after'
      }
    })
  })
  test('Given customer updated in commerce, when event is received then customer updated request is processed', async () => {
    const params = {
      type: 'com.adobe.commerce.observer.customer_save_commit_after',
      data: {
        value: {
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
          created_at: '2000-01-01',
          updated_at: '2000-01-02'
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
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
          created_at: '2000-01-01',
          updated_at: '2000-01-02'
        },
        response: {
          action: 'updated',
          success: true
        },
        type: 'com.adobe.commerce.observer.customer_save_commit_after'
      }
    })
  })
  test('Given customer deleted in commerce, when event is received then customer deleted request is processed', async () => {
    const params = {
      type: 'com.adobe.commerce.observer.customer_delete_commit_after',
      data: {
        value: {
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
          created_at: '2000-01-01',
          updated_at: '2000-01-02'
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
                action: 'deleted',
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
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
          created_at: '2000-01-01',
          updated_at: '2000-01-02'
        },
        response: {
          action: 'deleted',
          success: true
        },
        type: 'com.adobe.commerce.observer.customer_delete_commit_after'
      }
    })
  })
  test('Given params when customer event type received is not supported then an error 400 is returned', async () => {
    const params = {
      type: 'NOT_SUPPORTED_TYPE',
      data: {
        value: {
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
          created_at: '2000-01-01',
          updated_at: '2000-01-02'
        }
      }
    }
    const response = await action.main(params)

    expect(response).toEqual({
      statusCode: 400,
      body: {
        request: {
          sku: 'SKU',
          name: 'CUSTOMER',
          description: 'Customer description',
          created_at: '2000-01-01',
          updated_at: '2000-01-02'
        },
        response: 'This case type is not supported: NOT_SUPPORTED_TYPE',
        type: 'NOT_SUPPORTED_TYPE'
      }
    })
  })
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
          customer_group_id: 1,
          customer_group_code: 'CUSTOMER GROUP NAME',
          tax_class_id: 1,
          tax_class_name: 'TAX CLASS NAME',
          extension_attributes: {
            exclude_website_ids: []
          }
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
          customer_group_id: 1,
          customer_group_code: 'CUSTOMER GROUP NAME',
          tax_class_id: 1,
          tax_class_name: 'TAX CLASS NAME',
          extension_attributes: {
            exclude_website_ids: []
          }
        },
        response: {
          action: 'updated',
          success: true
        },
        type: 'com.adobe.commerce.observer.customer_group_save_commit_after'
      }
    })
  })
  test('Given customer group deleted in commerce, when event is received then customer group deleted request is processed', async () => {
    const params = {
      type: 'com.adobe.commerce.observer.customer_group_delete_commit_after',
      data: {
        value: {
          customer_group_id: 1,
          customer_group_code: 'CUSTOMER GROUP NAME',
          tax_class_id: 1,
          tax_class_name: 'TAX CLASS NAME',
          extension_attributes: {
            exclude_website_ids: []
          }
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
                action: 'deleted',
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
          customer_group_id: 1,
          customer_group_code: 'CUSTOMER GROUP NAME',
          tax_class_id: 1,
          tax_class_name: 'TAX CLASS NAME',
          extension_attributes: {
            exclude_website_ids: []
          }
        },
        response: {
          action: 'deleted',
          success: true
        },
        type: 'com.adobe.commerce.observer.customer_group_delete_commit_after'
      }
    })
  }
  )
  test('Given params when customer group event type received is not supported then an error 400 is returned', async () => {
    const params = {
      type: 'NOT_SUPPORTED_TYPE',
      data: {
        value: {
          customer_group_id: 1,
          customer_group_code: 'CUSTOMER GROUP NAME',
          tax_class_id: 1,
          tax_class_name: 'TAX CLASS NAME',
          extension_attributes: {
            exclude_website_ids: []
          }
        }
      }
    }
    const response = await action.main(params)

    expect(response).toEqual({
      statusCode: 400,
      body: {
        request: {
          customer_group_id: 1,
          customer_group_code: 'CUSTOMER GROUP NAME',
          tax_class_id: 1,
          tax_class_name: 'TAX CLASS NAME',
          extension_attributes: {
            exclude_website_ids: []
          }
        },
        response: 'This case type is not supported: NOT_SUPPORTED_TYPE',
        type: 'NOT_SUPPORTED_TYPE'
      }
    })
  })
})
