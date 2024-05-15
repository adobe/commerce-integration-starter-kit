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

jest.mock('node-fetch')
const fetch = require('node-fetch')
const action = require('../../../scripts/lib/metadata.js')
const ACCESS_TOKEN = 'token'
const EMPTY_ENVIRONMENT = {}

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

const DEFAULT_PROVIDERS = [
  {
    key: 'commerce',
    id: 'COMMERCE_PROVIDER_ID',
    label: 'Commerce Provider'
  },
  {
    key: 'backoffice',
    id: 'BACKOFFICE_PROVIDER_ID',
    label: 'Backoffice Provider'
  }
]

describe('Given on-boarding metadata file', () => {
  describe('When method main is defined', () => {
    test('Then is an instance of Function', () => {
      expect(action.main).toBeInstanceOf(Function)
    })
  })
  describe('When metadata configured for all providers', () => {
    test('Then returns success response', async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        json: () => Promise.resolve({
          description: 'string',
          label: 'string',
          event_code: 'string',
          _embedded: {
            sample_event: {}
          },
          _links: {
            'rel:sample_event': {},
            'rel:update': {},
            self: {}
          }
        })
      }
      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse)

      const clientRegistrations = require('../../data/onboarding/metadata/create_commerce_and_backoffice_providers_metadata.json')

      const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, EMPTY_ENVIRONMENT, ACCESS_TOKEN)

      expect(response).toEqual({
        code: 200,
        success: true,
        result: [{
          entity: 'product',
          label: 'Commerce Provider'
        },
        {
          entity: 'product',
          label: 'Backoffice Provider'
        }
        ]
      })
    })
  })
  describe('When metadata configured for commerce providers', () => {
    test('Then returns success response', async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        json: () => Promise.resolve({
          description: 'string',
          label: 'string',
          event_code: 'string',
          _embedded: {
            sample_event: {}
          },
          _links: {
            'rel:sample_event': {},
            'rel:update': {},
            self: {}
          }
        })
      }
      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse)

      const clientRegistrations = require('../../data/onboarding/metadata/create_only_commerce_providers_metadata.json')

      const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, EMPTY_ENVIRONMENT, ACCESS_TOKEN)

      expect(response).toEqual({
        code: 200,
        success: true,
        result: [
          {
            entity: 'product',
            label: 'Commerce Provider'
          }
        ]
      })
    })
  })
  describe('When metadata configured for backoffice providers', () => {
    test('Then returns success response', async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        json: () => Promise.resolve({
          description: 'string',
          label: 'string',
          event_code: 'string',
          _embedded: {
            sample_event: {}
          },
          _links: {
            'rel:sample_event': {},
            'rel:update': {},
            self: {}
          }
        })
      }
      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse)

      const clientRegistrations = require('../../data/onboarding/metadata/create_only_backoffice_providers_metadata.json')

      const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, EMPTY_ENVIRONMENT, ACCESS_TOKEN)

      expect(response).toEqual({
        code: 200,
        success: true,
        result: [
          {
            entity: 'product',
            label: 'Backoffice Provider'
          }
        ]
      })
    })
  })
  describe('When metadata process API call fails', () => {
    test('Then returns error response', async () => {
      const fakeError = new Error('fake')
      fetch.mockRejectedValue(fakeError)
      const clientRegistrations = require('../../data/onboarding/metadata/create_commerce_and_backoffice_providers_metadata.json')
      const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, EMPTY_ENVIRONMENT, ACCESS_TOKEN)
      expect(response).toEqual({
        code: 500,
        success: false,
        error: 'Unable to complete the process of adding metadata to provider: fake'
      })
    })
  })
  describe('When create provider metadata process fails', () => {
    test('Then returns error response', async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        json: () => Promise.resolve({
          reason: 'Invalid data',
          message: 'Please provide valid data'
        })
      }
      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse)

      const clientRegistrations = require('../../data/onboarding/metadata/create_commerce_and_backoffice_providers_metadata.json')

      const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, EMPTY_ENVIRONMENT)

      expect(response).toEqual({
        code: 500,
        success: false,
        error: "Unable to add event metadata: reason = 'Invalid data', message = 'Please provide valid data'"
      })
    })
  })
})
