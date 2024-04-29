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

const action = require('../../../../../actions/customer/commerce/consumer')
jest.mock('openwhisk')
const openwhisk = require('openwhisk')
const { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_INTERNAL_ERROR } = require('../../../../../actions/constants')
const Openwhisk = require('../../../../../actions/openwhisk')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Given customer commerce consumer', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When a valid customer created event is received', () => {
    test('Then returns success response', async () => {
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
          response: {
            action: 'created',
            success: true
          },
          type: 'com.adobe.commerce.observer.customer_save_commit_after'
        }
      })
    })
  })
  describe('When a valid customer updated event is received', () => {
    test(
      'Then returns success response',
      async () => {
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
            response: {
              action: 'updated',
              success: true
            },
            type: 'com.adobe.commerce.observer.customer_save_commit_after'
          }
        })
      })
  })
  describe('When a valid customer deleted event is received', () => {
    test('Then returns success response', async () => {
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
          response: {
            action: 'deleted',
            success: true
          },
          type: 'com.adobe.commerce.observer.customer_delete_commit_after'
        }
      })
    })
  })
  describe('When a valid customer group updated event is received', () => {
    test('Then returns success response', async () => {
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
          response: {
            action: 'updated',
            success: true
          },
          type: 'com.adobe.commerce.observer.customer_group_save_commit_after'
        }
      })
    })
  })
  describe('When a valid customer group deleted event is received', () => {
    test('Then returns success response', async () => {
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
          response: {
            action: 'deleted',
            success: true
          },
          type: 'com.adobe.commerce.observer.customer_group_delete_commit_after'
        }
      })
    })
  })
  describe('When customer event type received is not supported', () => {
    test('Then returns error response', async () => {
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
    )('Then returns the status code %p and response',
      async (statusCode, response) => {
        const type = 'com.adobe.commerce.observer.customer_group_delete_commit_after'
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
        Openwhisk.prototype.invokeAction = jest.fn()
          .mockResolvedValue(ACTION_RESPONSE)
        expect(await action.main(params)).toMatchObject(CONSUMER_RESPONSE)
      })
  })
})
