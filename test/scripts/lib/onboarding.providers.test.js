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

const fetch = require("node-fetch");
const action = require("../../../scripts/lib/providers.js");

const DEFAULT_AUTH_HEADERS = {
  Authorization: "Bearer ezySOME_TOKEN",
  "x-api-key": "CLIENT_ID",
};
const RUNTIME_NAMESPACE = "1340225-testOrg-testWorkspace";
const PROVIDER_SUFFIX = "testOrg-testWorkspace";
const ENVIRONMENT = { AIO_runtime_namespace: RUNTIME_NAMESPACE };

// Mock factory functions
function createMockLinks() {
  return {
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
  };
}

function createMockEventMetadata() {
  return {
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
    _links: createMockLinks(),
  };
}

function createMockProvider({ id, label, instance_id, provider_metadata }) {
  return {
    id,
    label,
    description: "string",
    source: "string",
    docs_url: "string",
    instance_id,
    publisher: "string",
    provider_metadata,
    _embedded: {
      eventmetadata: [createMockEventMetadata()],
    },
    _links: {
      "rel:eventmetadata": createMockLinks()["rel:update"],
      "rel:update": createMockLinks()["rel:update"],
      self: createMockLinks().self,
    },
  };
}

function createMockGetExistingProvidersResponse(providers = []) {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        _embedded: {
          providers: providers.map((provider) => createMockProvider(provider)),
        },
        _links: {
          self: createMockLinks().self,
        },
      }),
  };
}

function createMockCreateProviderResponse(providerData) {
  return {
    ok: true,
    json: () => Promise.resolve(createMockProvider(providerData)),
  };
}

function createMockErrorResponse(status = 500, errorData = {}) {
  return {
    ok: false,
    status,
    json: () =>
      Promise.resolve({
        reason: "Invalid data",
        message: "Please provide valid data",
        ...errorData,
      }),
  };
}

const DEFAULT_PROVIDERS = [
  {
    label: "Backoffice Provider",
    provider_metadata: "3rd_party_custom_events",
    description: "Backoffice Provider that will receive events from commerce",
    docs_url: null,
  },
  {
    label: "Commerce Provider",
    provider_metadata: "dx_commerce_events",
    description: "Event provider for Adobe Commerce",
    docs_url: "https://developer.adobe.com/commerce/extensibility/events/",
  },
];

const DEFAULT_SUBSCRIPTIONS = [];

beforeEach(() => {
  jest.resetModules();
  fetch.mockClear();
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

      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: test case
      fetch.mockImplementation((_url, options) => {
        if (options?.method === "GET" || !options?.method) {
          return Promise.resolve(createMockGetExistingProvidersResponse());
        }

        if (options?.method === "POST") {
          const body = JSON.parse(options.body || "{}");

          // Create commerce provider
          if (body.provider_metadata === "dx_commerce_events") {
            return Promise.resolve(
              createMockCreateProviderResponse({
                id: commerceProviderId,
                label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "AC_INSTANCE_ID",
                provider_metadata: "dx_commerce_events",
              }),
            );
          }

          if (body.provider_metadata === "3rd_party_custom_events") {
            return Promise.resolve(
              createMockCreateProviderResponse({
                id: backofficeProviderId,
                label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "BO_INSTANCE_ID",
                provider_metadata: "3rd_party_custom_events",
              }),
            );
          }
        }

        return Promise.reject(new Error("Unexpected fetch call"));
      });

      // Use providers without IDs - both will be created
      const providersToCreate = [
        {
          label: "Backoffice Provider",
          provider_metadata: "3rd_party_custom_events",
          description:
            "Backoffice Provider that will receive events from commerce",
          docs_url: null,
        },
        {
          label: "Commerce Provider",
          provider_metadata: "dx_commerce_events",
          description: "Event provider for Adobe Commerce",
          docs_url:
            "https://developer.adobe.com/commerce/extensibility/events/",
        },
      ];

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: providersToCreate,
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
            id: backofficeProviderId,
            instance_id: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "3rd_party_custom_events",
          },
          {
            id: commerceProviderId,
            instance_id: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "dx_commerce_events",
          },
        ],
      });
    });
  });

  describe("When commerce provider already exists", () => {
    test("Then only creates backoffice provider", async () => {
      const commerceProviderId = "EXISTING_COMMERCE_PROVIDER_ID";
      const backofficeProviderId = "BACKOFFICE_PROVIDER_ID";

      fetch.mockImplementation((_url, options) => {
        if (options?.method === "GET" || !options?.method) {
          return Promise.resolve(
            createMockGetExistingProvidersResponse([
              {
                id: commerceProviderId,
                label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "AC_INSTANCE_ID",
                provider_metadata: "dx_commerce_events",
              },
            ]),
          );
        }

        if (options?.method === "POST") {
          const body = JSON.parse(options.body || "{}");

          if (body.provider_metadata === "3rd_party_custom_events") {
            return Promise.resolve(
              createMockCreateProviderResponse({
                id: backofficeProviderId,
                label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "BO_INSTANCE_ID",
                provider_metadata: "3rd_party_custom_events",
              }),
            );
          }
        }

        return Promise.reject(new Error("Unexpected fetch call"));
      });

      // Commerce provider exists (has id), backoffice provider will be created (no id)
      const providersWithCommerceExisting = [
        {
          label: "Backoffice Provider", // No id - will be created
          provider_metadata: "3rd_party_custom_events",
          description:
            "Backoffice Provider that will receive events from commerce",
          docs_url: null,
        },
        {
          id: commerceProviderId, // Has id - already exists
          label: "Commerce Provider",
          provider_metadata: "dx_commerce_events",
          description: "Event provider for Adobe Commerce",
          docs_url:
            "https://developer.adobe.com/commerce/extensibility/events/",
        },
      ];

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: providersWithCommerceExisting,
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
            id: backofficeProviderId,
            instance_id: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "3rd_party_custom_events",
          },
          {
            id: commerceProviderId,
            instance_id: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "dx_commerce_events",
          },
        ],
      });
    });
  });

  describe("When backoffice provider already exists", () => {
    test("Then only creates commerce provider", async () => {
      const backofficeProviderId = "EXISTING_BACKOFFICE_PROVIDER_ID";
      const commerceProviderId = "COMMERCE_PROVIDER_ID";

      fetch.mockImplementation((_url, options) => {
        if (options?.method === "GET" || !options?.method) {
          return Promise.resolve(
            createMockGetExistingProvidersResponse([
              {
                id: backofficeProviderId,
                label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "BO_INSTANCE_ID",
                provider_metadata: "3rd_party_custom_events",
              },
            ]),
          );
        }

        if (options?.method === "POST") {
          const body = JSON.parse(options.body || "{}");

          if (body.provider_metadata === "dx_commerce_events") {
            return Promise.resolve(
              createMockCreateProviderResponse({
                id: commerceProviderId,
                label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "AC_INSTANCE_ID",
                provider_metadata: "dx_commerce_events",
              }),
            );
          }
        }

        return Promise.reject(new Error("Unexpected fetch call"));
      });

      // Backoffice provider exists (has id), commerce provider will be created (no id)
      const providersWithBackofficeExisting = [
        {
          id: backofficeProviderId, // Has id - already exists
          label: "Backoffice Provider",
          provider_metadata: "3rd_party_custom_events",
          description:
            "Backoffice Provider that will receive events from commerce",
          docs_url: null,
        },
        {
          label: "Commerce Provider", // No id - will be created
          provider_metadata: "dx_commerce_events",
          description: "Event provider for Adobe Commerce",
          docs_url:
            "https://developer.adobe.com/commerce/extensibility/events/",
        },
      ];

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: providersWithBackofficeExisting,
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
            id: backofficeProviderId,
            instance_id: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "3rd_party_custom_events",
          },
          {
            id: commerceProviderId,
            instance_id: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "dx_commerce_events",
          },
        ],
      });
    });
  });

  describe("When both providers already exist", () => {
    test("Then returns existing providers without creating new ones", async () => {
      const commerceProviderId = "EXISTING_COMMERCE_PROVIDER_ID";
      const backofficeProviderId = "EXISTING_BACKOFFICE_PROVIDER_ID";

      fetch.mockImplementation((_url, options) => {
        if (options?.method === "GET" || !options?.method) {
          return Promise.resolve(
            createMockGetExistingProvidersResponse([
              {
                id: commerceProviderId,
                label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "AC_INSTANCE_ID",
                provider_metadata: "dx_commerce_events",
              },
              {
                id: backofficeProviderId,
                label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
                instance_id: "BO_INSTANCE_ID",
                provider_metadata: "3rd_party_custom_events",
              },
            ]),
          );
        }

        // No POST calls should be made
        return Promise.reject(new Error("Unexpected fetch call"));
      });

      // Both providers exist (both have ids) - no creation should happen
      const existingProviders = [
        {
          id: backofficeProviderId, // Has id - already exists
          label: "Backoffice Provider",
          provider_metadata: "3rd_party_custom_events",
          description:
            "Backoffice Provider that will receive events from commerce",
          docs_url: null,
        },
        {
          id: commerceProviderId, // Has id - already exists
          label: "Commerce Provider",
          provider_metadata: "dx_commerce_events",
          description: "Event provider for Adobe Commerce",
          docs_url:
            "https://developer.adobe.com/commerce/extensibility/events/",
        },
      ];

      const response = await action.main(
        {
          app: {},
          eventing: {
            providers: existingProviders,
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
            id: backofficeProviderId,
            instance_id: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "3rd_party_custom_events",
          },
          {
            id: commerceProviderId,
            instance_id: "AC_INSTANCE_ID",
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            provider_metadata: "dx_commerce_events",
          },
        ],
      });
    });
  });

  describe("When create provider process call to API fails", () => {
    test("Then returns error response", async () => {
      const fakeError = new Error("fake");

      fetch.mockImplementation(() => Promise.reject(fakeError));
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

  describe("When create provider process fails with HTTP error", () => {
    test("Then returns error response with details", async () => {
      fetch.mockImplementation((_url, options) => {
        if (options?.method === "GET" || !options?.method) {
          return Promise.resolve(createMockGetExistingProvidersResponse());
        }

        if (options?.method === "POST") {
          return Promise.resolve(
            // biome-ignore lint/style/noMagicNumbers: test case
            createMockErrorResponse(500, {
              reason: "Invalid data",
              message: "Please provide valid data",
            }),
          );
        }

        return Promise.reject(new Error("Unexpected fetch call"));
      });

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
            "I/O Management API: call to https://io-management.fake/1234567890/1234567890/1234567890/providers returned a non-2XX status code",
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
