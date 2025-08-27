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

jest.mock("node-fetch");

const {
  SampleEventTemplate,
} = require("../../../utils/sample-event-template.js");

const fetch = require("node-fetch");
const action = require("../../../scripts/lib/providers.js");

const DEFAULT_AUTH_HEADERS = {
  Authorization: "Bearer ezySOME_TOKEN",
  "x-api-key": "CLIENT_ID",
};
const RUNTIME_NAMESPACE = "1340225-testOrg-testWorkspace";
const PROVIDER_SUFFIX = "testOrg-testWorkspace";
const ENVIRONMENT = { AIO_runtime_namespace: RUNTIME_NAMESPACE };

const DEFAULT_PROVIDERS = [
  {
    key: "commerce",
    label: "Commerce Provider",
    description: "Commerce Provider that will receive events from commerce",
    docs_url: null,
  },
  {
    key: "backoffice",
    label: "Backoffice Provider",
    description: "Backoffice Provider that will receive events from commerce",
    docs_url: null,
  },
];

const DEFAULT_SUBSCRIPTIONS = [
  {
    providerKey: "commerce",
    events: {
      "com.adobe.commerce.observer.catalog_product_delete_commit_after": {
        sampleEventTemplate: new SampleEventTemplate(
          "com.adobe.commerce.observer.catalog_product_delete_commit_after",
          {},
        ),
      },
    },
  },
];

beforeEach(() => {
  jest.resetModules();
  // Reset path.resolve mock calls
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given On-boarding providers file", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When create all providers configured", () => {
    test("Then returns success response", async () => {
      const commerceProviderId = "COMMERCE_PROVIDER_ID";
      const backofficeProviderId = "BACKOFFICE_PROVIDER_ID";

      const mockFetchGetExistingProvidersResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            _embedded: {
              providers: [
                {
                  id: "string",
                  label: "string",
                  description: "string",
                  source: "string",
                  docs_url: "string",
                  publisher: "string",
                  _embedded: {
                    eventmetadata: [
                      {
                        description: "string",
                        label: "string",
                        event_code: "string",
                        _embedded: {
                          sample_event: {
                            format: "string",
                            sample_payload: "string",
                            _links: {},
                          },
                        },
                        _links: {
                          "rel:sample_event": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          "rel:update": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          self: {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                        },
                      },
                    ],
                  },
                  _links: {
                    "rel:eventmetadata": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      const mockFetchCreateCommerceProviderResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: commerceProviderId,
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            description: "string",
            source: "string",
            docs_url: "string",
            instance_id: "AC_INSTANCE_ID",
            publisher: "string",
            provider_metadata: "dx_commerce_events",
            _embedded: {
              eventmetadata: [
                {
                  description: "string",
                  label: "string",
                  event_code: "string",
                  _embedded: {
                    sample_event: {
                      format: "string",
                      sample_payload: "string",
                      _links: {},
                    },
                  },
                  _links: {
                    "rel:sample_event": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              "rel:eventmetadata": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              "rel:update": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      const mockFetchCreateBackofficeProviderResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: backofficeProviderId,
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            description: "string",
            source: "string",
            docs_url: "string",
            instance_id: "BO_INSTANCE_ID",
            publisher: "string",
            provider_metadata: "3rd_party_custom_events",
            _embedded: {
              eventmetadata: [
                {
                  description: "string",
                  label: "string",
                  event_code: "string",
                  _embedded: {
                    sample_event: {
                      format: "string",
                      sample_payload: "string",
                      _links: {},
                    },
                  },
                  _links: {
                    "rel:sample_event": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              "rel:eventmetadata": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              "rel:update": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };

      fetch
        .mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
        .mockResolvedValueOnce(mockFetchCreateCommerceProviderResponse)
        .mockResolvedValueOnce(mockFetchCreateBackofficeProviderResponse);

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: DEFAULT_PROVIDERS,
            subscriptions: DEFAULT_SUBSCRIPTIONS,
          },
        },
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );

      expect(response).toEqual({
        success: true,
        result: [
          {
            key: "commerce",
            id: commerceProviderId,
            instanceId: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "dx_commerce_events",
          },
          {
            key: "backoffice",
            id: backofficeProviderId,
            instanceId: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "3rd_party_custom_events",
          },
        ],
      });
    });
  });
  describe("When commerce provider configured", () => {
    test("Then returns success response", async () => {
      const commerceProviderId = "COMMERCE_PROVIDER_ID";
      const backofficeProviderId = "BACKOFFICE_PROVIDER_ID";

      const mockFetchGetExistingProvidersResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            _embedded: {
              providers: [
                {
                  id: backofficeProviderId,
                  label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
                  description: "string",
                  source: "string",
                  docs_url: "string",
                  publisher: "string",
                  instance_id: "BO_INSTANCE_ID",
                  provider_metadata: "3rd_party_custom_events",
                  _embedded: {
                    eventmetadata: [
                      {
                        description: "string",
                        label: "string",
                        event_code: "string",
                        _embedded: {
                          sample_event: {
                            format: "string",
                            sample_payload: "string",
                            _links: {},
                          },
                        },
                        _links: {
                          "rel:sample_event": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          "rel:update": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          self: {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                        },
                      },
                    ],
                  },
                  _links: {
                    "rel:eventmetadata": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      const mockFetchCreateCommerceProviderResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: commerceProviderId,
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            description: "string",
            source: "string",
            docs_url: "string",
            instance_id: "AC_INSTANCE_ID",
            publisher: "string",
            provider_metadata: "dx_commerce_events",
            _embedded: {
              eventmetadata: [
                {
                  description: "string",
                  label: "string",
                  event_code: "string",
                  _embedded: {
                    sample_event: {
                      format: "string",
                      sample_payload: "string",
                      _links: {},
                    },
                  },
                  _links: {
                    "rel:sample_event": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              "rel:eventmetadata": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              "rel:update": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      fetch
        .mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
        .mockResolvedValueOnce(mockFetchCreateCommerceProviderResponse);

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: DEFAULT_PROVIDERS,
            subscriptions: DEFAULT_SUBSCRIPTIONS,
          },
        },
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );

      expect(response).toEqual({
        success: true,
        result: [
          {
            key: "commerce",
            id: commerceProviderId,
            instanceId: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "dx_commerce_events",
          },
          {
            key: "backoffice",
            id: backofficeProviderId,
            instanceId: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "3rd_party_custom_events",
          },
        ],
      });
    });
  });
  describe("When backoffice provider configured", () => {
    test("Then returns success response", async () => {
      const backofficeProviderId = "BACKOFFICE_PROVIDER_ID";
      const commerceProviderId = "COMMERCE_PROVIDER_ID";

      const mockFetchGetExistingProvidersResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            _embedded: {
              providers: [
                {
                  id: commerceProviderId,
                  label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
                  description: "string",
                  source: "string",
                  docs_url: "string",
                  publisher: "string",
                  instance_id: "AC_INSTANCE_ID",
                  provider_metadata: "dx_commerce_events",
                  _embedded: {
                    eventmetadata: [
                      {
                        description: "string",
                        label: "string",
                        event_code: "string",
                        _embedded: {
                          sample_event: {
                            format: "string",
                            sample_payload: "string",
                            _links: {},
                          },
                        },
                        _links: {
                          "rel:sample_event": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          "rel:update": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          self: {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                        },
                      },
                    ],
                  },
                  _links: {
                    "rel:eventmetadata": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      const mockFetchCreateBackofficeProviderResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: backofficeProviderId,
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            description: "string",
            source: "string",
            docs_url: "string",
            instance_id: "BO_INSTANCE_ID",
            publisher: "string",
            provider_metadata: "3rd_party_custom_events",
            _embedded: {
              eventmetadata: [
                {
                  description: "string",
                  label: "string",
                  event_code: "string",
                  _embedded: {
                    sample_event: {
                      format: "string",
                      sample_payload: "string",
                      _links: {},
                    },
                  },
                  _links: {
                    "rel:sample_event": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              "rel:eventmetadata": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              "rel:update": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      fetch
        .mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
        .mockResolvedValueOnce(mockFetchCreateBackofficeProviderResponse);

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: DEFAULT_PROVIDERS,
            subscriptions: DEFAULT_SUBSCRIPTIONS,
          },
        },
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );
      expect(response).toEqual({
        success: true,
        result: [
          {
            key: "commerce",
            id: commerceProviderId,
            instanceId: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "dx_commerce_events",
          },
          {
            key: "backoffice",
            id: backofficeProviderId,
            instanceId: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "3rd_party_custom_events",
          },
        ],
      });
    });
  });
  describe("When provider configured not exists", () => {
    test("Then returns success response", async () => {
      const commerceProviderId = "EXISTING_COMMERCE_PROVIDER_ID";
      const backofficeProviderId = "BACKOFFICE_PROVIDER_ID";

      const mockFetchGetExistingProvidersResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            _embedded: {
              providers: [
                {
                  id: commerceProviderId,
                  label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
                  description: "string",
                  source: "string",
                  docs_url: "string",
                  instance_id: "AC_INSTANCE_ID",
                  publisher: "string",
                  provider_metadata: "dx_commerce_events",
                  _embedded: {
                    eventmetadata: [
                      {
                        description: "string",
                        label: "string",
                        event_code: "string",
                        _embedded: {
                          sample_event: {
                            format: "string",
                            sample_payload: "string",
                            _links: {},
                          },
                        },
                        _links: {
                          "rel:sample_event": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          "rel:update": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          self: {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                        },
                      },
                    ],
                  },
                  _links: {
                    "rel:eventmetadata": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      const mockFetchCreateBackofficeProviderResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: backofficeProviderId,
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            description: "string",
            source: "string",
            docs_url: "string",
            instance_id: "BO_INSTANCE_ID",
            publisher: "string",
            provider_metadata: "3rd_party_custom_events",
            _embedded: {
              eventmetadata: [
                {
                  description: "string",
                  label: "string",
                  event_code: "string",
                  _embedded: {
                    sample_event: {
                      format: "string",
                      sample_payload: "string",
                      _links: {},
                    },
                  },
                  _links: {
                    "rel:sample_event": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              "rel:eventmetadata": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              "rel:update": {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      fetch
        .mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
        .mockResolvedValueOnce(mockFetchCreateBackofficeProviderResponse);

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: DEFAULT_PROVIDERS,
            subscriptions: DEFAULT_SUBSCRIPTIONS,
          },
        },
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );

      expect(response).toEqual({
        success: true,
        result: [
          {
            key: "commerce",
            id: commerceProviderId,
            instanceId: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "dx_commerce_events",
          },
          {
            key: "backoffice",
            id: backofficeProviderId,
            instanceId: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            providerMetadata: "3rd_party_custom_events",
          },
        ],
      });
    });
  });
  describe("When create provider process call to API fails", () => {
    test("Then returns error response", async () => {
      const fakeError = new Error("fake");
      fetch.mockRejectedValue(fakeError);
      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: DEFAULT_PROVIDERS,
            subscriptions: DEFAULT_SUBSCRIPTIONS,
          },
        },
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );
      expect(response).toEqual({
        success: false,
        error: {
          label: "UNEXPECTED_ERROR",
          reason: "Unexpected error occurred while creating providers",
          payload: {
            error: fakeError,
            provider: undefined,
            hints: [
              "Make sure your authentication environment parameters are correct. Also check the COMMERCE_BASE_URL",
              "Did you fill IO_CONSUMER_ID, IO_PROJECT_ID and IO_WORKSPACE_ID environment variables with the values in /onboarding/config/workspace.json?",
            ],
          },
        },
      });
    });
  });
  describe("When create provider process fails", () => {
    test("Then returns error response", async () => {
      const mockFetchGetExistingProvidersResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            _embedded: {
              providers: [
                {
                  id: "string",
                  label: "string",
                  description: "string",
                  source: "string",
                  docs_url: "string",
                  publisher: "string",
                  _embedded: {
                    eventmetadata: [
                      {
                        description: "string",
                        label: "string",
                        event_code: "string",
                        _embedded: {
                          sample_event: {
                            format: "string",
                            sample_payload: "string",
                            _links: {},
                          },
                        },
                        _links: {
                          "rel:sample_event": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          "rel:update": {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                          self: {
                            href: "string",
                            templated: true,
                            type: "string",
                            deprecation: "string",
                            name: "string",
                            profile: "http://example.com",
                            title: "string",
                            hreflang: "string",
                            seen: "string",
                          },
                        },
                      },
                    ],
                  },
                  _links: {
                    "rel:eventmetadata": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    "rel:update": {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                    self: {
                      href: "string",
                      templated: true,
                      type: "string",
                      deprecation: "string",
                      name: "string",
                      profile: "http://example.com",
                      title: "string",
                      hreflang: "string",
                      seen: "string",
                    },
                  },
                },
              ],
            },
            _links: {
              self: {
                href: "string",
                templated: true,
                type: "string",
                deprecation: "string",
                name: "string",
                profile: "http://example.com",
                title: "string",
                hreflang: "string",
                seen: "string",
              },
            },
          }),
      };
      const mockFetchCreateCommerceProviderResponse = {
        ok: true,
        status: 500,
        json: () =>
          Promise.resolve({
            reason: "Invalid data",
            message: "Please provide valid data",
          }),
      };
      fetch
        .mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
        .mockResolvedValueOnce(mockFetchCreateCommerceProviderResponse);

      const environment = {
        ...ENVIRONMENT,
        IO_MANAGEMENT_BASE_URL: "https://io-management.fake/",
        IO_CONSUMER_ID: "1234567890",
        IO_PROJECT_ID: "1234567890",
        IO_WORKSPACE_ID: "1234567890",
      };

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: DEFAULT_PROVIDERS,
            subscriptions: DEFAULT_SUBSCRIPTIONS,
          },
        },
        environment,
        DEFAULT_AUTH_HEADERS,
      );

      expect(response).toEqual({
        success: false,
        error: {
          label: "PROVIDER_CREATION_FAILED",
          reason:
            "I/O Management API: call to https://io-management.fake/1234567890/1234567890/1234567890/providers did not return the expected response",
          payload: {
            code: 500,
            response: {
              reason: "Invalid data",
              message: "Please provide valid data",
            },
          },
        },
      });
    });
  });
});
