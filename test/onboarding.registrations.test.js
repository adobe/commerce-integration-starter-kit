/* 
* <license header>
*/

jest.mock('node-fetch')
const fetch = require('node-fetch')
const action = require('./../onboarding/registrations.js')
const clientRegistrations = require('./data/onboarding/registrations/create_commerce_and_backoffice_registrations.json');

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

const ACCESS_TOKEN = 'token';

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
                    "name": "Commerce Product Synchronization",
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
        const mockFetchExistingRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "page": {
                        "size": 0,
                        "number": 0,
                        "numberOfElements": 0,
                        "totalElements": 0,
                        "totalPages": 0
                    },
                    "_links": {
                        "first": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "last": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "prev": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "self": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        }
                    },
                    "_embedded": {
                        "registrations": [
                            {
                                "id": 0,
                                "name": "string",
                                "description": "string",
                                "client_id": "string",
                                "registration_id": "string",
                                "events_of_interest": [
                                    {
                                        "provider": "string",
                                        "event_code": "string",
                                        "provider_id": "string",
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
                                "enabled": true,
                                "_links": {
                                    "rel:events": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "rel:trace": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "self": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    }
                                }
                            }
                        ]
                    }
                }
            )
        }
        const mockFetchCreateProductBackofficeRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 2,
                    "name": "Backoffice Product Synchronization",
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
        fetch.mockResolvedValueOnce(mockFetchExistingRegistrationResponse)
            .mockResolvedValueOnce(mockFetchCreateProductCommerceRegistrationResponse)
            .mockResolvedValueOnce(mockFetchCreateProductBackofficeRegistrationResponse);

        const clientRegistrations = require('./data/onboarding/registrations/create_commerce_and_backoffice_registrations.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

        expect(response).toEqual({
            code: 200,
            success: true,
            registrations: [
                {
                    id: 1,
                registration_id: 'REGISTRATION_ID_1',
                name: 'Commerce Product Synchronization',
                enabled: true
            },
                {
                    id: 2,
                    registration_id: 'REGISTRATION_ID_2',
                    name: 'Backoffice Product Synchronization',
                    enabled: true
                }
            ]
        })
    })
    test('should create commerce registration only', async () => {
        const mockFetchExistingRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "page": {
                        "size": 0,
                        "number": 0,
                        "numberOfElements": 0,
                        "totalElements": 0,
                        "totalPages": 0
                    },
                    "_links": {
                        "first": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "last": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "prev": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "self": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        }
                    },
                    "_embedded": {
                        "registrations": [
                            {
                                "id": 0,
                                "name": "string",
                                "description": "string",
                                "client_id": "string",
                                "registration_id": "string",
                                "events_of_interest": [
                                    {
                                        "provider": "string",
                                        "event_code": "string",
                                        "provider_id": "string",
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
                                "enabled": true,
                                "_links": {
                                    "rel:events": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "rel:trace": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "self": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    }
                                }
                            }
                        ]
                    }
                }
            )
        }
        const mockFetchCreateProductCommerceRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 1,
                    "name": "Commerce Product Synchronization",
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
        fetch.mockResolvedValueOnce(mockFetchExistingRegistrationResponse)
            .mockResolvedValueOnce(mockFetchCreateProductCommerceRegistrationResponse);

        const clientRegistrations = require('./data/onboarding/registrations/create_only_commerce_registrations.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

        expect(response).toEqual({
            code: 200,
            success: true,
            registrations: [
                {
                    id: 1,
                    registration_id: 'REGISTRATION_ID_1',
                    name: 'Commerce Product Synchronization',
                    enabled: true
                }
            ]
        })
    })
    test('should create backoffice registration only', async () => {
        const mockFetchExistingRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "page": {
                        "size": 0,
                        "number": 0,
                        "numberOfElements": 0,
                        "totalElements": 0,
                        "totalPages": 0
                    },
                    "_links": {
                        "first": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "last": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "prev": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "self": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        }
                    },
                    "_embedded": {
                        "registrations": [
                            {
                                "id": 0,
                                "name": "string",
                                "description": "string",
                                "client_id": "string",
                                "registration_id": "string",
                                "events_of_interest": [
                                    {
                                        "provider": "string",
                                        "event_code": "string",
                                        "provider_id": "string",
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
                                "enabled": true,
                                "_links": {
                                    "rel:events": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "rel:trace": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "self": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    }
                                }
                            }
                        ]
                    }
                }
            )
        }
        const mockFetchCreateProductBackofficeRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 2,
                    "name": "Backoffice Product Synchronization",
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
        fetch.mockResolvedValueOnce(mockFetchExistingRegistrationResponse)
            .mockResolvedValueOnce(mockFetchCreateProductBackofficeRegistrationResponse);

        const clientRegistrations = require('./data/onboarding/registrations/create_only_backoffice_registrations.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

        expect(response).toEqual({
            code: 200,
            success: true,
            registrations: [
                {
                    id: 2,
                    registration_id: 'REGISTRATION_ID_2',
                    name: 'Backoffice Product Synchronization',
                    enabled: true
                }
            ]
        })
    })
    test('should not create existing registration', async () => {
        const mockFetchExistingRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "page": {
                        "size": 0,
                        "number": 0,
                        "numberOfElements": 0,
                        "totalElements": 0,
                        "totalPages": 0
                    },
                    "_links": {
                        "first": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "last": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "prev": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        },
                        "self": {
                            "href": "string",
                            "templated": true,
                            "type": "string",
                            "deprecation": "string",
                            "name": "string",
                            "profile": "http://example.com",
                            "title": "string",
                            "hreflang": "string",
                            "seen": "string"
                        }
                    },
                    "_embedded": {
                        "registrations": [
                            {
                                "id": 2,
                                "name": "Backoffice Product Synchronization",
                                "description": "string",
                                "client_id": "string",
                                "registration_id": "EXISTING_BACKOFFICE_ID",
                                "events_of_interest": [
                                    {
                                        "provider": "string",
                                        "event_code": "string",
                                        "provider_id": "string",
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
                                "enabled": true,
                                "_links": {
                                    "rel:events": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "rel:trace": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    },
                                    "self": {
                                        "href": "string",
                                        "templated": true,
                                        "type": "string",
                                        "deprecation": "string",
                                        "name": "string",
                                        "profile": "http://example.com",
                                        "title": "string",
                                        "hreflang": "string",
                                        "seen": "string"
                                    }
                                }
                            }
                        ]
                    }
                }
            )
        }
        const mockFetchCreateProductBackofficeRegistrationResponse = {
            ok: true,
            json: () => Promise.resolve(
                {
                    "id": 1,
                    "name": "Commerce Product Synchronization",
                    "description": "string",
                    "client_id": "CLIENT_ID",
                    "registration_id": "CREATED_REGISTRATION_ID",
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
        fetch.mockResolvedValueOnce(mockFetchExistingRegistrationResponse)
            .mockResolvedValueOnce(mockFetchCreateProductBackofficeRegistrationResponse);

        const clientRegistrations = require('./data/onboarding/registrations/create_commerce_and_backoffice_registrations.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

        expect(response).toEqual({
            code: 200,
            success: true,
            registrations: [
                {
                    id: 1,
                    registration_id: 'CREATED_REGISTRATION_ID',
                    name: 'Commerce Product Synchronization',
                    enabled: true
                },
                {
                    id: 2,
                    registration_id: 'EXISTING_BACKOFFICE_ID',
                    name: 'Backoffice Product Synchronization',
                    enabled: true
                }
            ]
        })
    })
    test('should return a 500 and message error when process fail', async () => {
        const fakeError = new Error('fake')
        fetch.mockRejectedValue(fakeError)
        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)
        expect(response).toEqual({
            code: 500,
            success: false,
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

        let clientRegistrations = require('./data/onboarding/registrations/create_commerce_and_backoffice_registrations.json');

        const response = await action.main(clientRegistrations, DEFAULT_PROVIDERS, ACCESS_TOKEN)

        expect(response).toEqual({
            code: 500,
            success: false,
            error: "Unable to create registration for product with provider commerce - COMMERCE_PROVIDER_ID"
        })
    })
})
