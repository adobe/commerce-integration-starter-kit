/* 
* <license header>
*/

jest.mock('node-fetch')
const fetch = require('node-fetch')
const action = require('../../onboarding/metadata.js')
const ACCESS_TOKEN = 'token';

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
];

describe('On-boarding metadata', () => {
    test('main should be defined', () => {
        expect(action.main).toBeInstanceOf(Function)
    })
    test('should create all providers metadata', async () => {
         const mockFetchCreateProviderMetadataResponse = {
            ok: true,
            json: () => Promise.resolve({
                "description": "string",
                "label": "string",
                "event_code": "string",
                "_embedded": {
                    "sample_event": {}
                },
                "_links": {
                    "rel:sample_event": {},
                    "rel:update": {},
                    "self": {}
                }
            })
        }
        fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        const clientRegistrations = require('../data/onboarding/metadata/create_commerce_and_backoffice_providers_metadata.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

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
    test('should create commerce provider metadata only', async () => {
        const mockFetchCreateProviderMetadataResponse = {
            ok: true,
            json: () => Promise.resolve({
                "description": "string",
                "label": "string",
                "event_code": "string",
                "_embedded": {
                    "sample_event": {}
                },
                "_links": {
                    "rel:sample_event": {},
                    "rel:update": {},
                    "self": {}
                }
            })
        }
        fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        let clientRegistrations = require('../data/onboarding/metadata/create_only_commerce_providers_metadata.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

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
    test('should create backoffice metadata provider only', async () => {
        const mockFetchCreateProviderMetadataResponse = {
            ok: true,
            json: () => Promise.resolve({
                "description": "string",
                "label": "string",
                "event_code": "string",
                "_embedded": {
                    "sample_event": {}
                },
                "_links": {
                    "rel:sample_event": {},
                    "rel:update": {},
                    "self": {}
                }
            })
        }
        fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        let clientRegistrations = require('../data/onboarding/metadata/create_only_backoffice_providers_metadata.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

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
    test('should return a 500 and message error when process fail', async () => {
        const fakeError = new Error('fake')
        fetch.mockRejectedValue(fakeError)
        let clientRegistrations = require('../data/onboarding/metadata/create_commerce_and_backoffice_providers_metadata.json');
        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)
        expect(response).toEqual({
            code: 500,
            success: false,
            error: 'Unable to complete the process of adding metadata to provider: fake'

        })
    })
    test('should 500 and message error when create provider metadata fails', async () => {
        const mockFetchCreateProviderMetadataResponse = {
            ok: true,
            json: () => Promise.resolve({
                "reason": "Invalid data",
                "message": "Please provide valid data"
            })
        }
        fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        let clientRegistrations = require('../data/onboarding/metadata/create_commerce_and_backoffice_providers_metadata.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS)

        expect(response).toEqual({
            code: 500,
            success: false,
            error: "Unable to add event metadata: reason = 'Invalid data', message = 'Please provide valid data'"
        })
    })
})
