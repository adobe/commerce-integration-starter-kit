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

const action = require('../../../../../actions/product/commerce/consumer')
jest.mock('openwhisk')
const openwhisk = require('openwhisk')

jest.mock('@adobe/aio-lib-state', () => {
  // Mock AdobeState class
  class AdobeStateMock {
    constructor() {}
    async get() { return undefined; } // or return { expiration: '', value: '' } if needed
    async put() { return 'mock-key'; }
    async delete() { return null; }
    async deleteAll() { return { keys: 0 }; }
    async any() { return false; }
    async stats() { return { bytesKeys: 0, bytesValues: 0, keys: 0 }; }
    async *list() { yield { keys: [] }; }
  }
  // The module exports both init and AdobeState
  return {
    init: jest.fn().mockResolvedValue(new AdobeStateMock()),
    AdobeState: AdobeStateMock
  }
})
const stateLib = require('@adobe/aio-lib-state')

const { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_INTERNAL_ERROR } = require('../../../../../actions/constants')
const Openwhisk = require('../../../../../actions/openwhisk')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('Given product commerce consumer', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When a valid product created event is received', () => {
    test('Then returns success response', async () => {
      const params = {
        API_HOST: 'API_HOST',
        API_AUTH: 'API_AUTH',
        type: 'com.adobe.commerce.observer.catalog_product_save_commit_after',
        data: {
          value: {
            sku: 'SKU',
            name: 'PRODUCT',
            description: 'Product description',
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
          type: 'com.adobe.commerce.observer.catalog_product_save_commit_after'
        }
      })
    })
  })

})
