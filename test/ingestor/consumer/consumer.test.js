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

const action = require('../../../ingestor/consumer')

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn()
  },
  Events: {
    init: jest.fn()
  }
}))
const { Core, Events } = require('@adobe/aio-sdk')

const mockLoggerInstance = {
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn()
}
Core.Logger.mockReturnValue(mockLoggerInstance)

const mockEventsInstance = { publishEvent: jest.fn() }
Events.init.mockReturnValue(mockEventsInstance)

jest.mock('@adobe/aio-lib-ims', () => ({
  getToken: jest.fn(),
  context: {
    setCurrent: jest.fn(),
    set: jest.fn()
  }
}))
const { getToken } = require('@adobe/aio-lib-ims')

jest.mock('node-fetch')
const fetch = require('node-fetch')

beforeEach(() => {
  Events.init.mockClear() // only clears calls stats
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('External backoffice events ingestion webhook', () => {
  test('main function should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  describe('Given ingestion webhook receives an event', () => {
    describe('When data information is correct', () => {
      test('Then publish event to backoffice provider',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1',
            data: [
              {
                entity: 'product',
                event: 'be-observer.catalog_product_create',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              }
            ]
          }

          getToken.mockResolvedValueOnce(Promise.resolve('access token'))

          const mockFetchGetExistingProvidersResponse = {
            ok: true,
            json: () => Promise.resolve({
              _embedded: {
                providers: [
                  {
                    id: 'PROVIDER_ID',
                    label: 'Backoffice Provider - eistarterkitv1',
                    description: 'string',
                    source: 'string',
                    docs_url: 'string',
                    publisher: 'string'
                  }
                ]
              }
            })
          }
          fetch.mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
          mockEventsInstance.publishEvent.mockResolvedValueOnce(
            Promise.resolve('OK'))
          const response = await action.main(params)

          expect(response).toEqual({
            statusCode: 200,
            body: {
              request: [
                {
                  entity: 'product',
                  event: 'be-observer.catalog_product_create',
                  value: {
                    sku: 'TEST_WEBHOOK_2',
                    name: 'Test webhook 1 testu',
                    price: 52,
                    description: 'Test webhook 1 description'
                  }
                }
              ],
              response: {
                success: true,
                events: [
                  {
                    data: {
                      sku: 'TEST_WEBHOOK_2',
                      name: 'Test webhook 1 testu',
                      price: 52,
                      description: 'Test webhook 1 description'
                    },
                    entity: 'product',
                    providerId: 'PROVIDER_ID',
                    providerName: 'Backoffice Provider - eistarterkitv1',
                    success: 'OK',
                    type: 'be-observer.catalog_product_create'
                  }
                ]
              }
            }
          })
        })
    })
    describe('When data parameter is missing', () => {
      test('Then return 400 error response',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1'
          }

          const response = await action.main(params)

          expect(response).toEqual({
            error: {
              statusCode: 400,
              body: {
                error: "missing parameter(s) 'data'"
              }
            }
          })
        })
    })
    describe('When generation of access token fail', () => {
      test('Then return 500 error response',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1',
            data: [
              {
                entity: 'product',
                event: 'be-observer.catalog_product_create',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              }
            ]
          }

          getToken.mockRejectedValue(new Error('fake error'))

          const response = await action.main(params)

          expect(response).toEqual({
            error: {
              statusCode: 500,
              body: {
                error: '[Ingestor] Server error: fake error'
              }
            }
          })
        })
    })
    describe('When fetching existing providers fails', () => {
      test('Then return 500 error',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1',
            data: [
              {
                entity: 'product',
                event: 'be-observer.catalog_product_create',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              }
            ]
          }

          getToken.mockResolvedValueOnce(Promise.resolve('access token'))

          fetch.mockRejectedValue(new Error('fake error'))

          const response = await action.main(params)

          expect(response).toEqual({
            error: {
              statusCode: 500,
              body: {
                error: '[Ingestor] Server error: fake error'
              }
            }
          })
        })
    })
    describe('When external backoffice not found', () => {
      test('Then return 500 error',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1',
            data: [
              {
                entity: 'product',
                event: 'be-observer.catalog_product_create',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              }
            ]
          }

          getToken.mockResolvedValueOnce(Promise.resolve('access token'))

          fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({})
          })

          const response = await action.main(params)

          expect(response).toEqual({
            error: {
              statusCode: 500,
              body: {
                error: '[Ingestor] Could not found any external backoffice provider'
              }
            }
          })
        })
    })
    describe('When publish events fails', () => {
      test('Then return 500 error',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1',
            data: [
              {
                entity: 'product',
                event: 'be-observer.catalog_product_create',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              }
            ]
          }

          getToken.mockResolvedValueOnce(Promise.resolve('access token'))

          const mockFetchGetExistingProvidersResponse = {
            ok: true,
            json: () => Promise.resolve({
              _embedded: {
                providers: [
                  {
                    id: 'PROVIDER_ID',
                    label: 'Backoffice Provider - eistarterkitv1',
                    description: 'string',
                    source: 'string',
                    docs_url: 'string',
                    publisher: 'string'
                  }
                ]
              }
            })
          }
          fetch.mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
          mockEventsInstance.publishEvent.mockRejectedValue(new Error('fake error'))
          const response = await action.main(params)

          expect(response).toEqual({
            error: {
              statusCode: 500,
              body: {
                error: '[Ingestor] Server error: fake error'
              }
            }
          })
        })
    })
  })
  describe('Given ingestion webhook events data', () => {
    describe('When data is missing required parameters', () => {
      test('Then returns 400 error',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1',
            data: [
              {
                event: 'be-observer.catalog_product_create',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              },
              {
                entity: 'product',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              },
              {
                entity: 'product',
                event: 'be-observer.catalog_product_create'
              }
            ]
          }

          getToken.mockResolvedValueOnce(Promise.resolve('access token'))

          const mockFetchGetExistingProvidersResponse = {
            ok: true,
            json: () => Promise.resolve({
              _embedded: {
                providers: [
                  {
                    id: 'PROVIDER_ID',
                    label: 'Backoffice Provider - eistarterkitv1',
                    description: 'string',
                    source: 'string',
                    docs_url: 'string',
                    publisher: 'string'
                  }
                ]
              }
            })
          }
          fetch.mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)

          const response = await action.main(params)

          expect(response).toEqual({
            error: {
              statusCode: 400,
              body: {
                error: [
                  "missing parameter(s) 'entity'",
                  "missing parameter(s) 'event'",
                  "missing parameter(s) 'value'"
                ]
              }
            }
          })
        })
    })
    describe('When Event sdk is initialized', () => {
      test('Then has input credentials received in params',
        async () => {
          const params = {
            OAUTH_ORG_ID: 'OAUTH_ORG_ID',
            OAUTH_CLIENT_ID: 'OAUTH_CLIENT_ID',
            AIO_runtime_namespace: 'eistarterkitv1',
            data: [
              {
                entity: 'product',
                event: 'be-observer.catalog_product_create',
                value: {
                  sku: 'TEST_WEBHOOK_2',
                  name: 'Test webhook 1 testu',
                  price: 52,
                  description: 'Test webhook 1 description'
                }
              }
            ]
          }

          getToken.mockResolvedValueOnce(Promise.resolve('access token'))

          const mockFetchGetExistingProvidersResponse = {
            ok: true,
            json: () => Promise.resolve({
              _embedded: {
                providers: [
                  {
                    id: 'PROVIDER_ID',
                    label: 'Backoffice Provider - eistarterkitv1',
                    description: 'string',
                    source: 'string',
                    docs_url: 'string',
                    publisher: 'string'
                  }
                ]
              }
            })
          }
          fetch.mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)

          await action.main(params)
          expect(Events.init)
            .toHaveBeenCalledWith('OAUTH_ORG_ID', 'OAUTH_CLIENT_ID', 'access token')
        })
    })
  })
})
