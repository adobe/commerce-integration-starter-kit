/* 
* <license header>
*/

jest.mock('node-fetch')
const fetch = require('node-fetch')
const action = require('./../onboarding/metadata.js')

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
        const mockFetchGetAdobeTokenResponse = {
            ok: true,
            json: () => Promise.resolve({
                "access_token": "token"
            })
        }

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
        fetch.mockResolvedValueOnce(mockFetchGetAdobeTokenResponse)
            .mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        const clientRegistrations = require("./data/onboarding/metadata/create_commerce_and_backoffice_providers_metadata.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS)

        expect(response).toEqual({
            code: 200,
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
        const mockFetchGetAdobeTokenResponse = {
            ok: true,
            json: () => Promise.resolve({
                "access_token": "token"
            })
        }

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
        fetch.mockResolvedValueOnce(mockFetchGetAdobeTokenResponse)
            .mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        let clientRegistrations = require("./data/onboarding/metadata/create_only_commerce_providers_metadata.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS)

        expect(response).toEqual({
            code: 200,
            result: [
                {
                    entity: 'product',
                    label: 'Commerce Provider'
                }
            ]
        })
    })
    test('should create backoffice metadata provider only', async () => {
        const mockFetchGetAdobeTokenResponse = {
            ok: true,
            json: () => Promise.resolve({
                "access_token": "token"
            })
        }

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
        fetch.mockResolvedValueOnce(mockFetchGetAdobeTokenResponse)
            .mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        let clientRegistrations = require("./data/onboarding/metadata/create_only_backoffice_providers_metadata.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS)

        expect(response).toEqual({
            code: 200,
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
        const response = await action.main()
        expect(response).toEqual({
            code: 500,
            error: 'Unable to complete the process of adding metadata to provider: fake'

        })
    })
    test('should return 500 and message error when generate oauth token fails', async () => {

        let errorMessage = "Invalid credentials";
        const mockFetchGetAdobeTokenResponse = {
            ok: true,
            json: () => Promise.resolve({
                "error": errorMessage
            })
        }

        fetch.mockResolvedValueOnce(mockFetchGetAdobeTokenResponse);

        const response = await action.main([], [])

        expect(response).toEqual({
            code: 500,
            error: `Unable to generate oauth token: ${errorMessage}`
        })
    })
    test('should 500 and message error when create provider metadata fails', async () => {
        const mockFetchGetAdobeTokenResponse = {
            ok: true,
            json: () => Promise.resolve({
                "access_token": "token"
            })
        }
        const mockFetchCreateProviderMetadataResponse = {
            ok: true,
            json: () => Promise.resolve({
                "reason": "Invalid data",
                "message": "Please provide valid data"
            })
        }
        fetch.mockResolvedValueOnce(mockFetchGetAdobeTokenResponse)
            .mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        let clientRegistrations = require("./data/onboarding/providers/create_commerce_and_backoffice_providers.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS)

        expect(response).toEqual({
            code: 500,
            error: "Unable to add event metadata: reason = 'Invalid data', message = 'Please provide valid data'"
        })
    })
})
