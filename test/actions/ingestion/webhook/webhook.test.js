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

const action = require("../../../../actions/ingestion/webhook");

jest.mock("@adobe/aio-sdk", () => ({
  Core: {
    Logger: jest.fn(),
  },
  Events: {
    init: jest.fn(),
  },
}));
const { Core, Events } = require("@adobe/aio-sdk");

const mockLoggerInstance = {
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};
Core.Logger.mockReturnValue(mockLoggerInstance);

const mockEventsInstance = { publishEvent: jest.fn() };
Events.init.mockReturnValue(mockEventsInstance);

jest.mock("@adobe/aio-lib-ims", () => ({
  context: {
    setCurrent: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock("@adobe/aio-commerce-lib-auth", () => {
  const originalModule = jest.requireActual("@adobe/aio-commerce-lib-auth");
  return {
    __esModule: true,
    ...originalModule,
    getImsAuthProvider: jest.fn(),
  };
});

const { getImsAuthProvider } = require("@adobe/aio-commerce-lib-auth");

jest.mock("node-fetch");
const fetch = require("node-fetch");

beforeEach(() => {
  Events.init.mockClear(); // only clears calls stats
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const validEnvParams = {
  OAUTH_CLIENT_ID: "OAUTH_CLIENT_ID",
  OAUTH_CLIENT_SECRET: "OAUTH_CLIENT_SECRET",
  OAUTH_TECHNICAL_ACCOUNT_ID: "example@adobe-ds.com",
  OAUTH_TECHNICAL_ACCOUNT_EMAIL: "example2@adobe-ds.com",
  OAUTH_ORG_ID: "OAUTH_ORG_ID",
};

/**
 * Mocks a resolved access token for testing
 */
function mockResolvedAccessToken() {
  getImsAuthProvider.mockReturnValueOnce({
    getAccessToken: jest.fn().mockResolvedValue("access token"),
    getHeaders: jest.fn(),
  });
}

/**
 * Creates a mock fetch response for providers
 * @param {Array} providers - Array of provider objects
 */
function createMockFetchProvidersResponse(providers) {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        _embedded: {
          providers,
        },
      }),
  };
}

describe("Given external backoffice events ingestion webhook", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When received data information is valid", () => {
    test("Then returns success response", async () => {
      const params = {
        ...validEnvParams,
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      mockResolvedAccessToken();
      fetch.mockResolvedValueOnce(
        createMockFetchProvidersResponse([
          {
            id: "PROVIDER_ID",
            label: "Backoffice Provider - eistarterkitv1",
            description: "string",
            source: "string",
            docs_url: "string",
            publisher: "string",
          },
        ]),
      );
      mockEventsInstance.publishEvent.mockResolvedValueOnce(
        Promise.resolve("OK"),
      );
      const response = await action.main(params);

      expect(response).toEqual({
        statusCode: 200,
        body: {
          response: {
            success: true,
            message: "Event published successfully",
          },
          type: "be-observer.catalog_product_create",
        },
      });
    });
  });
  describe("When received data information is invalid", () => {
    test("Then returns error response", async () => {
      const params = {
        OAUTH_ORG_ID: "OAUTH_ORG_ID",
        OAUTH_CLIENT_ID: "OAUTH_CLIENT_ID",
        AIO_runtime_namespace: "eistarterkitv1",
      };

      const response = await action.main(params);

      expect(response).toEqual({
        error: {
          statusCode: 400,
          body: {
            error: "missing parameter(s) 'data.uid,data.event,data.value'",
          },
        },
      });
    });
  });
  describe("When generation of access token fail", () => {
    test("Then returns error response", async () => {
      const params = {
        ...validEnvParams,
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      getImsAuthProvider.mockImplementation(() => {
        return {
          getAccessToken: () => {
            throw new Error("fake error");
          },
          getHeaders: () => {},
        };
      });

      const response = await action.main(params);

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: "fake error",
          },
        },
      });
    });
    test("Then returns error response with CommerceSdkValidationError", async () => {
      const params = {
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      const response = await action.main(params);

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: "Invalid ImsAuthProvider configuration",
          },
        },
      });

      // Verify logger.error was called with the correct messages
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        "Server error: Invalid ImsAuthProvider configuration",
      );
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid ImsAuthProvider configuration"),
      );
    });
  });
  describe("When fetching existing providers fails", () => {
    test("Then returns error response", async () => {
      const params = {
        ...validEnvParams,
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      mockResolvedAccessToken();
      fetch.mockRejectedValue(new Error("fake error"));

      const response = await action.main(params);

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: "fake error",
          },
        },
      });
    });
  });
  describe("When external backoffice not found", () => {
    test("Then returns error response", async () => {
      const params = {
        ...validEnvParams,
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      mockResolvedAccessToken();
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const response = await action.main(params);

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: "Could not find any external backoffice provider",
          },
        },
      });
    });
  });
  describe("When publish events fails", () => {
    test("Then returns error response", async () => {
      const params = {
        ...validEnvParams,
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      mockResolvedAccessToken();
      fetch.mockResolvedValueOnce(
        createMockFetchProvidersResponse([
          {
            id: "PROVIDER_ID",
            label: "Backoffice Provider - eistarterkitv1",
            description: "string",
            source: "string",
            docs_url: "string",
            publisher: "string",
          },
        ]),
      );
      mockEventsInstance.publishEvent.mockRejectedValue(
        new Error("fake error"),
      );
      const response = await action.main(params);

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: {
            error: "fake error",
          },
        },
      });
    });
  });
  describe("When publish events response is undefined", () => {
    test("Then returns error response", async () => {
      const params = {
        ...validEnvParams,
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      mockResolvedAccessToken();
      fetch.mockResolvedValueOnce(
        createMockFetchProvidersResponse([
          {
            id: "PROVIDER_ID",
            label: "Backoffice Provider - eistarterkitv1",
            description: "string",
            source: "string",
            docs_url: "string",
            publisher: "string",
          },
        ]),
      );
      mockEventsInstance.publishEvent.mockResolvedValueOnce(
        Promise.resolve(undefined),
      );
      const response = await action.main(params);

      expect(response).toEqual({
        error: {
          statusCode: 400,
          body: {
            error:
              "Unable to publish event be-observer.catalog_product_create: Unknown event type",
          },
        },
      });
    });
  });
  describe("When Event sdk is initialized", () => {
    test("Then receives credentials params in the input", async () => {
      const params = {
        ...validEnvParams,
        AIO_runtime_namespace: "eistarterkitv1",
        data: {
          uid: "product-123",
          event: "be-observer.catalog_product_create",
          value: {
            sku: "TEST_WEBHOOK_2",
            name: "Test webhook test",
            price: 52,
            description: "Test webhook description",
          },
        },
      };

      mockResolvedAccessToken();
      fetch.mockResolvedValueOnce(
        createMockFetchProvidersResponse([
          {
            id: "PROVIDER_ID",
            label: "Backoffice Provider - eistarterkitv1",
            description: "string",
            source: "string",
            docs_url: "string",
            publisher: "string",
          },
        ]),
      );

      await action.main(params);
      expect(Events.init).toHaveBeenCalledWith(
        "OAUTH_ORG_ID",
        "OAUTH_CLIENT_ID",
        "access token",
      );
    });
  });
});
