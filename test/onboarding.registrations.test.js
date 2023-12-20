/* 
* <license header>
*/

jest.mock('node-fetch')
const fetch = require('node-fetch')
const action = require('./../onboarding/registrations.js')
const clientRegistrations = require("./data/onboarding/registrations/create_commerce_and_backoffice_registrations.json");

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

describe('On-boarding registrations', () => {
    test('main should be defined', () => {
        expect(action.main).toBeInstanceOf(Function)
    })
    test('should register all providers events', async () => {

        const mockFetchCreateProductCommerceRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 1,
                    "name": "Product Commerce Synchronization",
                    "description": "string",
                    "client_id": "CLIENT_ID",
                    "registration_id": "REGISTRATION_ID_1",
                    "events_of_interest": [
                        {
                            "provider": "Commerce Provider",
                            "event_code": "EVENT_CODE",
                            "provider_id": "COMMERCE_PROVIDER_ID",
                            "event_label": "string",
                            "event_description": "string",
                            "provider_label": "string",
                            "provider_description": "string",
                            "provider_docs_url": "string",
                            "event_delivery_format": "string"
                        }
                    ],
                    "webhook_status": "string",
                    "created_date": "string",
                    "updated_date": "string",
                    "consumer_id": "string",
                    "project_id": "string",
                    "workspace_id": "string",
                    "webhook_url": "string",
                    "delivery_type": "string",
                    "runtime_action": "string",
                    "enabled": true
                }
            )
        }
        const mockFetchCreateProductBackofficeRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 2,
                    "name": "Product Backoffice Synchronization",
                    "description": "string",
                    "client_id": "CLIENT_ID",
                    "registration_id": "REGISTRATION_ID_2",
                    "events_of_interest": [
                        {
                            "provider": "Backoffice Provider",
                            "event_code": "EVENT_CODE",
                            "provider_id": "BACKOFFICE_PROVIDER_ID",
                            "event_label": "string",
                            "event_description": "string",
                            "provider_label": "string",
                            "provider_description": "string",
                            "provider_docs_url": "string",
                            "event_delivery_format": "string"
                        }
                    ],
                    "webhook_status": "string",
                    "created_date": "string",
                    "updated_date": "string",
                    "consumer_id": "string",
                    "project_id": "string",
                    "workspace_id": "string",
                    "webhook_url": "string",
                    "delivery_type": "string",
                    "runtime_action": "string",
                    "enabled": true
                }
            )
        }
        fetch.mockResolvedValueOnce(mockFetchCreateProductCommerceRegistrationResponse)
            .mockResolvedValueOnce(mockFetchCreateProductBackofficeRegistrationResponse);

        const clientRegistrations = require("./data/onboarding/registrations/create_commerce_and_backoffice_registrations.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, 'token')

        expect(response).toEqual({
            code: 200,
            registrations: [
                {
                id: 'REGISTRATION_ID_1',
                name: 'Product Commerce Synchronization',
                enabled: true
            },
                {
                    id: 'REGISTRATION_ID_2',
                    name: 'Product Backoffice Synchronization',
                    enabled: true
                }
            ]
        })
    })
    test('should create commerce registration only', async () => {
        const mockFetchCreateProductCommerceRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 1,
                    "name": "Product Commerce Synchronization",
                    "description": "string",
                    "client_id": "CLIENT_ID",
                    "registration_id": "REGISTRATION_ID_1",
                    "events_of_interest": [
                        {
                            "provider": "Commerce Provider",
                            "event_code": "EVENT_CODE",
                            "provider_id": "COMMERCE_PROVIDER_ID",
                            "event_label": "string",
                            "event_description": "string",
                            "provider_label": "string",
                            "provider_description": "string",
                            "provider_docs_url": "string",
                            "event_delivery_format": "string"
                        }
                    ],
                    "webhook_status": "string",
                    "created_date": "string",
                    "updated_date": "string",
                    "consumer_id": "string",
                    "project_id": "string",
                    "workspace_id": "string",
                    "webhook_url": "string",
                    "delivery_type": "string",
                    "runtime_action": "string",
                    "enabled": true
                }
            )
        }
        fetch.mockResolvedValueOnce(mockFetchCreateProductCommerceRegistrationResponse);

        const clientRegistrations = require("./data/onboarding/registrations/create_only_commerce_registrations.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, 'token')

        expect(response).toEqual({
            code: 200,
            registrations: [
                {
                    id: 'REGISTRATION_ID_1',
                    name: 'Product Commerce Synchronization',
                    enabled: true
                }
            ]
        })
    })
    test('should create backoffice registration only', async () => {
        const mockFetchCreateProductBackofficeRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 2,
                    "name": "Product Backoffice Synchronization",
                    "description": "string",
                    "client_id": "CLIENT_ID",
                    "registration_id": "REGISTRATION_ID_2",
                    "events_of_interest": [
                        {
                            "provider": "Backoffice Provider",
                            "event_code": "EVENT_CODE",
                            "provider_id": "BACKOFFICE_PROVIDER_ID",
                            "event_label": "string",
                            "event_description": "string",
                            "provider_label": "string",
                            "provider_description": "string",
                            "provider_docs_url": "string",
                            "event_delivery_format": "string"
                        }
                    ],
                    "webhook_status": "string",
                    "created_date": "string",
                    "updated_date": "string",
                    "consumer_id": "string",
                    "project_id": "string",
                    "workspace_id": "string",
                    "webhook_url": "string",
                    "delivery_type": "string",
                    "runtime_action": "string",
                    "enabled": true
                }
            )
        }
        fetch.mockResolvedValueOnce(mockFetchCreateProductBackofficeRegistrationResponse);

        const clientRegistrations = require("./data/onboarding/registrations/create_only_backoffice_registrations.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, 'token')

        expect(response).toEqual({
            code: 200,
            registrations: [
                {
                    id: 'REGISTRATION_ID_2',
                    name: 'Product Backoffice Synchronization',
                    enabled: true
                }
            ]
        })
    })
    test('should return a 500 and message error when process fail', async () => {
        const fakeError = new Error('fake')
        fetch.mockRejectedValue(fakeError)
        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, 'token')
        expect(response).toEqual({
            code: 500,
            error: 'Unable to complete the process of creating events registrations: fake'

        })
    })
    test('should 500 and message error when create registration call fails', async () => {
        const mockFetchCreateProviderMetadataResponse = {
            ok: true,
            json: () => Promise.resolve({
                "reason": "Invalid data",
                "message": "Please provide valid data"
            })
        }
        fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

        let clientRegistrations = require("./data/onboarding/registrations/create_commerce_and_backoffice_registrations.json");

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, 'token')

        expect(response).toEqual({
            code: 500,
            error: "Unable to create registration for product with provider commerce - COMMERCE_PROVIDER_ID"
        })
    })
})
