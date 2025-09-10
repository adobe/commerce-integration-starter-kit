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
const action = require("../../../scripts/lib/metadata.js");
const DEFAULT_AUTH_HEADERS = {
  Authorization: "Bearer ezySOME_TOKEN",
  "x-api-key": "CLIENT_ID",
};
const ENVIRONMENT = {
  EVENT_PREFIX: "test-project",
};

const eventTemplates = require("../../../scripts/onboarding/event-templates.js");

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const DEFAULT_PROVIDERS = [
  {
    key: "commerce",
    id: "COMMERCE_PROVIDER_ID",
    label: "Commerce Provider",
    eventsMetadata: [
      {
        eventCode:
          "com.adobe.commerce.observer.catalog_product_delete_commit_after",
        label:
          "com.adobe.commerce.observer.catalog_product_delete_commit_after",
        description:
          "Event triggered after a product is deleted in Adobe Commerce",
        sampleEventTemplate:
          eventTemplates[
            "com.adobe.commerce.observer.catalog_product_delete_commit_after"
          ].value,
      },
      {
        eventCode:
          "com.adobe.commerce.observer.catalog_product_save_commit_after",
        label: "com.adobe.commerce.observer.catalog_product_save_commit_after",
        description:
          "Event triggered after a product is saved in Adobe Commerce",
        sampleEventTemplate:
          eventTemplates[
            "com.adobe.commerce.observer.catalog_product_save_commit_after"
          ].value,
      },
    ],
  },
  {
    key: "backoffice",
    id: "BACKOFFICE_PROVIDER_ID",
    label: "Backoffice Provider",
    eventsMetadata: [
      {
        eventCode: "be-observer.catalog_product_create",
        label: "be-observer.catalog_product_create",
        description:
          "Event triggered when a product is created in the backoffice system",
        sampleEventTemplate:
          eventTemplates["be-observer.catalog_product_create"],
      },
      {
        eventCode: "be-observer.catalog_product_update",
        label: "be-observer.catalog_product_update",
        description:
          "Event triggered when a product is updated in the backoffice system",
        sampleEventTemplate:
          eventTemplates["be-observer.catalog_product_update"],
      },
    ],
  },
];

const DEFAULT_SUBSCRIPTIONS = [
  {
    providerKey: "commerce",
    events: {
      "com.adobe.commerce.observer.catalog_product_delete_commit_after": {
        event: {
          name: "observer.catalog_product_delete_commit_after",
          fields: [
            { name: "id" },
            { name: "sku" },
            { name: "name" },
            { name: "created_at" },
            { name: "updated_at" },
            { name: "description" },
          ],
        },
      },
    },
  },
];

describe("Given on-boarding metadata file", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When metadata configured for all providers", () => {
    test("Then returns success response", async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            description: "string",
            label: "string",
            event_code: "string",
            _embedded: {
              sample_event: {},
            },
            _links: {
              "rel:sample_event": {},
              "rel:update": {},
              self: {},
            },
          }),
      };
      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

      const response = await action.main(
        {
          app: {},
          eventing: { subscriptions: DEFAULT_SUBSCRIPTIONS },
        },
        DEFAULT_PROVIDERS,
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );
      expect(response).toEqual({
        success: true,
      });
    });
  });
  describe("When metadata configured for commerce providers", () => {
    test("Then returns success response", async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            description: "string",
            label: "string",
            event_code: "string",
            _embedded: {
              sample_event: {},
            },
            _links: {
              "rel:sample_event": {},
              "rel:update": {},
              self: {},
            },
          }),
      };

      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

      const response = await action.main(
        {
          app: {},
          eventing: { subscriptions: DEFAULT_SUBSCRIPTIONS },
        },
        DEFAULT_PROVIDERS,
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );

      expect(response).toEqual({
        success: true,
      });
    });
  });
  describe("When metadata configured for backoffice providers", () => {
    test("Then returns success response", async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            description: "string",
            label: "string",
            event_code: "string",
            _embedded: {
              sample_event: {},
            },
            _links: {
              "rel:sample_event": {},
              "rel:update": {},
              self: {},
            },
          }),
      };
      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

      const response = await action.main(
        {
          app: {},
          eventing: { subscriptions: DEFAULT_SUBSCRIPTIONS },
        },
        DEFAULT_PROVIDERS,
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );

      expect(response).toEqual({
        success: true,
      });
    });
  });
  describe("When metadata process API call fails", () => {
    test("Then returns error response", async () => {
      const fakeError = new Error("fake");
      fetch.mockRejectedValue(fakeError);

      const response = await action.main(
        {
          app: {},
          eventing: { subscriptions: DEFAULT_SUBSCRIPTIONS },
        },
        DEFAULT_PROVIDERS,
        ENVIRONMENT,
        DEFAULT_AUTH_HEADERS,
      );
      expect(response).toEqual({
        success: false,
        error: {
          label: "UNEXPECTED_ERROR",
          reason: "Unexpected error occurred while adding metadata to provider",
          payload: {
            error: fakeError,
            provider: {
              id: "COMMERCE_PROVIDER_ID",
              key: "commerce",
              label: "Commerce Provider",
            },
            hints: [
              "Make sure your authentication environment parameters are correct. Also check the COMMERCE_BASE_URL",
              "Did you fill IO_CONSUMER_ID, IO_PROJECT_ID and IO_WORKSPACE_ID environment variables with the values in /onboarding/config/workspace.json?",
            ],
          },
        },
      });
    });
  });
  describe("When create provider metadata process fails", () => {
    test("Then returns error response", async () => {
      const mockFetchCreateProviderMetadataResponse = {
        ok: true,
        status: 500,
        json: () =>
          Promise.resolve({
            reason: "Invalid data",
            message: "Please provide valid data",
          }),
      };
      fetch.mockResolvedValue(mockFetchCreateProviderMetadataResponse);

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
          eventing: { subscriptions: DEFAULT_SUBSCRIPTIONS },
        },
        DEFAULT_PROVIDERS,
        environment,
        DEFAULT_AUTH_HEADERS,
      );

      expect(response).toEqual({
        success: false,
        error: {
          label: "ADD_EVENT_CODE_TO_PROVIDER_FAILED",
          reason:
            "I/O Management API: call to https://io-management.fake/1234567890/1234567890/1234567890/providers/COMMERCE_PROVIDER_ID/eventmetadata did not return the expected response",
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
