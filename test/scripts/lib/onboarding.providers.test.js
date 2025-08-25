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
jest.mock("node:path", () => {
  const originalPath = jest.requireActual("node:path");
  return {
    ...originalPath,
    resolve: jest.fn((...args) => {
      if (args.includes("../../.env")) {
        return originalPath.resolve(
          __dirname,
          "../../data/onboarding/.env_test",
        );
      }
      return originalPath.resolve(...args);
    }),
  };
});

const fetch = require("node-fetch");
const fs = require("node:fs");
const path = require("node:path");
const action = require("../../../scripts/lib/providers.js");

const DEFAULT_AUTH_HEADERS = {
  Authorization: "Bearer ezySOME_TOKEN",
  "x-api-key": "CLIENT_ID",
};
const RUNTIME_NAMESPACE = "1340225-testOrg-testWorkspace";
const PROVIDER_SUFFIX = "testOrg-testWorkspace";
const ENVIRONMENT = { AIO_runtime_namespace: RUNTIME_NAMESPACE };
const TEST_ENV_PATH = path.resolve(
  __dirname,
  "../../data/onboarding/.env_test",
);
const fixtures = require("./fixtures/providers.js");

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

const DEFAULT_SUBSCRIPTIONS = {
  product: {
    commerce: {
      "com.adobe.commerce.observer.catalog_product_delete_commit_after": {
        sampleEventTemplate: {
          value: {
            id: 2,
            sku: "24-MB01",
            name: "Joust Duffle Bag",
            created_at: "2024-06-12 16:31:43",
            updated_at: "2024-08-05 10:03:49",
            description: "Comfortable sporty duffel bag",
          },
        },
      },
      "com.adobe.commerce.observer.catalog_product_save_commit_after": {
        sampleEventTemplate: {
          value: {
            id: 2,
            sku: "24-MB01",
            name: "Joust Duffle Bag",
            created_at: "2024-06-12 16:31:43",
            updated_at: "2024-08-05 10:03:49",
            description: "Comfortable sporty duffel bag",
          },
        },
      },
    },
    backoffice: {
      "be-observer.catalog_product_create": {
        sampleEventTemplate: {
          sku: "SKU-EXT-0001",
          name: "Product Created Externally",
          price: 0.0,
          description: "This is a sample product created externally",
        },
      },
      "be-observer.catalog_product_update": {
        sampleEventTemplate: {
          sku: "SKU-EXT-0001",
          name: "Product Created Externally",
          price: 99.99,
          description: "This is a sample product created externally",
        },
      },
      "be-observer.catalog_product_delete": {
        sampleEventTemplate: {
          sku: "SKU-EXT-0001",
        },
      },
    },
  },
  customer: {
    commerce: {
      "com.adobe.commerce.observer.customer_save_commit_after": {
        sampleEventTemplate: {
          value: {
            id: 123,
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@fakedomain.com",
            created_at: "2024-06-12 16:31:43",
            updated_at: "2024-08-05 10:03:49",
          },
        },
      },
      "com.adobe.commerce.observer.customer_delete_commit_after": {
        sampleEventTemplate: {
          value: {
            id: 123,
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@fakedomain.com",
          },
        },
      },
      "com.adobe.commerce.observer.customer_group_save_commit_after": {
        sampleEventTemplate: {
          value: {
            customer_group_code: "VIP",
            tax_class_id: 3,
            extension_attributes: {
              exclude_website_ids: [],
            },
            customer_group_id: "18",
          },
        },
      },
      "com.adobe.commerce.observer.customer_group_delete_commit_after": {
        sampleEventTemplate: {
          value: {
            customer_group_code: "VIP",
            customer_group_id: "18",
            tax_class_id: "3",
          },
        },
      },
    },
    backoffice: {
      "be-observer.customer_create": {
        sampleEventTemplate: {
          name: "Jane",
          lastname: "Doe",
          email: "jane.doe@fakedomain.com",
        },
      },
      "be-observer.customer_update": {
        sampleEventTemplate: {
          id: 15,
          name: "Jane",
          lastname: "Doe",
          email: "jane.doe@fakedomain.com",
        },
      },
      "be-observer.customer_delete": {
        sampleEventTemplate: {
          id: 15,
        },
      },
      "be-observer.customer_group_create": {
        sampleEventTemplate: {
          name: "Backoffice Group",
          taxClassId: 3,
        },
      },
      "be-observer.customer_group_update": {
        sampleEventTemplate: {
          id: 19,
          name: "Backoffice Group",
          taxClassId: 2,
        },
      },
      "be-observer.customer_group_delete": {
        sampleEventTemplate: {
          id: 19,
        },
      },
    },
  },
  order: {
    commerce: {
      "com.adobe.commerce.observer.sales_order_save_commit_after": {
        sampleEventTemplate: {
          value: {
            id: "12",
            increment_id: "000000012",
            created_at: "2024-08-05 14:34:19",
            updated_at: "2024-08-05 14:34:19",
          },
        },
      },
    },
    backoffice: {
      "be-observer.sales_order_status_update": {
        sampleEventTemplate: {
          id: 1,
          status: "shipped",
          notifyCustomer: false,
        },
      },
      "be-observer.sales_order_shipment_create": {
        sampleEventTemplate: {
          orderId: 8,
          items: [
            {
              orderItemId: 8,
              qty: 1,
            },
          ],
          tracks: [
            {
              trackNumber: "Custom Value",
              title: "Custom Title",
              carrierCode: "custom",
            },
          ],
          comment: {
            comment: "Order Shipped in Backoffice",
            visibleOnFront: true,
          },
          stockSourceCode: "default",
        },
      },
      "be-observer.sales_order_shipment_update": {
        sampleEventTemplate: {
          id: 33,
          orderId: 8,
          items: [
            {
              entityId: 19,
              orderItemId: 8,
              qty: 1,
            },
          ],
          tracks: [
            {
              entityId: 19,
              trackNumber: "Custom Value Upd",
              title: "Custom Title Upd",
              carrierCode: "custom",
            },
          ],
          comments: [
            {
              entityId: 19,
              notifyCustomer: false,
              comment: "Order Shipment Updated in Backoffice",
              visibleOnFront: true,
            },
          ],
          stockSourceCode: "default",
        },
      },
    },
  },
  stock: {
    commerce: {
      "com.adobe.commerce.observer.cataloginventory_stock_item_save_commit_after":
        {
          sampleEventTemplate: {
            value: {
              item_id: "25",
              product_id: "27",
              stock_id: 1,
              qty: "0",
              min_qty: "0",
              use_config_min_qty: "1",
              is_qty_decimal: "0",
              backorders: "0",
              use_config_backorders: "1",
              min_sale_qty: "1",
              use_config_min_sale_qty: "1",
              max_sale_qty: "10000",
              use_config_max_sale_qty: "1",
              is_in_stock: "0",
              low_stock_date: "2024-08-05 14:37:59",
              notify_stock_qty: "1",
              use_config_notify_stock_qty: "1",
              manage_stock: "1",
              use_config_manage_stock: "1",
              stock_status_changed_auto: "0",
              use_config_qty_increments: "1",
              qty_increments: "1",
              use_config_enable_qty_inc: "1",
              enable_qty_increments: "0",
              is_decimal_divided: 0,
              website_id: 0,
              deferred_stock_update: "0",
              use_config_deferred_stock_update: "1",
              type_id: "simple",
              min_qty_allowed_in_shopping_cart: [
                {
                  customer_group_id: "32000",
                  min_sale_qty: "",
                  record_id: "0",
                },
              ],
            },
          },
        },
    },
    backoffice: {
      "be-observer.catalog_stock_update": {
        sampleEventTemplate: [
          {
            sku: "SKU-EXT-0001",
            source: "default",
            quantity: 66,
            outOfStock: false,
          },
        ],
      },
    },
  },
};

beforeEach(() => {
  jest.resetModules();
  // Reset path.resolve mock calls
  path.resolve.mockClear();
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
          app: {
            registrations: fixtures.CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS,
          },
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
          },
          {
            key: "backoffice",
            id: backofficeProviderId,
            instanceId: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
          },
        ],
      });
    });
  });
  describe("When commerce provider configured", () => {
    test("Then returns success response", async () => {
      const commerceProviderId = "COMMERCE_PROVIDER_ID";

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
          app: { registrations: fixtures.CREATE_COMMERCE_PROVIDER_ONLY },
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
          },
        ],
      });
    });
  });
  describe("When backoffice provider configured", () => {
    test("Then returns success response", async () => {
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
          app: { registrations: fixtures.CREATE_BACKOFFICE_PROVIDER_ONLY },
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
            key: "backoffice",
            id: backofficeProviderId,
            instanceId: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
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
          app: {
            registrations: fixtures.CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS,
          },
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
          },
          {
            key: "backoffice",
            id: backofficeProviderId,
            instanceId: "BO_INSTANCE_ID",
            label: `Backoffice Provider - ${PROVIDER_SUFFIX}`,
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
          app: {
            registrations: fixtures.CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS,
          },
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
  describe("When configuration is invalid", () => {
    test("Then returns error response", async () => {
      const response = await action.main(
        {
          app: { registrations: fixtures.MISSING_ENTITIES_CLIENT_REGISTRATION },
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
          label: "MISSING_REGISTRATIONS",
          reason:
            '└── Registration "customer" is required\n\nCheck that they are present in "/onboarding/config.js"',
          payload: {
            missingRegistrations: ["customer"],
            requiredRegistrations: ["product", "customer", "order", "stock"],
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
          app: {
            registrations: fixtures.CREATE_COMMERCE_AND_BACKOFFICE_PROVIDERS,
          },
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
  describe("When writing provider IDs to env file", () => {
    test("Then writes provider IDs correctly", async () => {
      fs.writeFileSync(TEST_ENV_PATH, "", "utf8");

      const commerceProviderId = "COMMERCE_PROVIDER_ID";
      const mockFetchGetExistingProvidersResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            _embedded: { providers: [] },
          }),
      };
      const mockFetchCreateCommerceProviderResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: commerceProviderId,
            label: `Commerce Provider - ${PROVIDER_SUFFIX}`,
            instance_id: "AC_INSTANCE_ID",
          }),
      };

      fetch
        .mockResolvedValueOnce(mockFetchGetExistingProvidersResponse)
        .mockResolvedValueOnce(mockFetchCreateCommerceProviderResponse);

      const response = await action.main(
        {
          app: {
            registrations: {
              product: ["commerce"],
              customer: ["commerce"],
              order: ["commerce"],
              stock: ["commerce"],
            },
          },
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
          },
        ],
      });

      const envContent = fs.readFileSync(TEST_ENV_PATH, "utf8");
      expect(envContent.trim()).toBe(
        "COMMERCE_PROVIDER_ID=COMMERCE_PROVIDER_ID",
      );
    });
  });
});
