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

jest.mock("@adobe/aio-lib-state", () => {
  class AdobeStateMock {
    get() {
      return Promise.resolve();
    }

    put() {
      return Promise.resolve("mock-key");
    }
  }
  // The module exports both init and AdobeState
  return {
    init: jest.fn().mockResolvedValue(new AdobeStateMock()),
    AdobeState: AdobeStateMock,
  };
});

const Openwhisk = require("../../../../../actions/openwhisk");
const consumer = require("../../../../../actions/product/external/consumer");
const {
  HTTP_OK,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_ERROR,
} = require("../../../../../actions/constants");

const { Core } = require("@adobe/aio-sdk");
const logger = Core.Logger("infiniteLoopBreaker", { level: "info" });

jest.mock("../../../../../actions/openwhisk");

describe("Given product external consumer", () => {
  describe("When method main is defined", () => {
    logger.debug("When method main is defined");
    test("Then is an instance of Function", () => {
      expect(consumer.main).toBeInstanceOf(Function);
    });
  });

  describe("When required params are missing", () => {
    logger.debug("When required params are missing");
    it.each([{}, { data: {} }, { type: "be-observer.catalog_product_create" }])(
      "Then for parameter %p returns error message",
      async (params) => {
        const INVALID_REQUEST_PARAMS_RESPONSE = {
          error: {
            body: {
              error: expect.any(String),
            },
            statusCode: HTTP_BAD_REQUEST,
          },
        };
        expect(await consumer.main(params)).toMatchObject(
          INVALID_REQUEST_PARAMS_RESPONSE,
        );
      },
    );
  });

  describe("When product event type received is not supported", () => {
    logger.debug("When product event type received is not supported");
    test("Then returns error response", async () => {
      const UNSUPPORTED_TYPE = "foo";
      const TYPE_NOT_FOUND_RESPONSE = {
        error: {
          body: {
            error: "This case type is not supported: foo",
          },
          statusCode: HTTP_BAD_REQUEST,
        },
      };
      const params = { type: UNSUPPORTED_TYPE, data: {} };
      expect(await consumer.main(params)).toMatchObject(
        TYPE_NOT_FOUND_RESPONSE,
      );
    });
  });

  describe("When product event received is valid", () => {
    it.each([
      [
        "created",
        "be-observer.catalog_product_create",
        "product-backoffice/created",
        { value: { sku: "SKU", description: "description" } },
      ],
      [
        "update",
        "be-observer.catalog_product_update",
        "product-backoffice/updated",
        { value: { sku: "SKU", description: "description" } },
      ],
      [
        "deleted",
        "be-observer.catalog_product_delete",
        "product-backoffice/deleted",
        { one: "one", two: "two" },
      ],
    ])(
      "Then returns success response for %p action",
      async (_name, type, action, data) => {
        logger.debug("When product event received is valid");
        const params = { type, data };
        const invocation = jest.fn();
        Openwhisk.prototype.invokeAction = invocation;
        await consumer.main(params);
        expect(invocation).toHaveBeenCalledWith(action, data);
      },
    );
  });

  describe("When downstream throw an exception", () => {
    logger.debug("When downstream throw an exception");
    test("Then returns error response", async () => {
      const ERROR_MESSAGE = "Unexpected Error";
      const INTERNAL_SERVER_ERROR_RESPONSE = {
        error: {
          statusCode: HTTP_INTERNAL_ERROR,
          body: {
            error: expect.stringContaining(ERROR_MESSAGE),
          },
        },
      };
      const type = "be-observer.catalog_product_create";
      const params = {
        type,
        data: {
          value: {
            sku: "SKU",
            name: "PRODUCT",
            description: "Product description",
            created_at: "2000-01-01",
            updated_at: "2000-01-01",
          },
        },
      };
      Openwhisk.prototype.invokeAction = jest
        .fn()
        .mockRejectedValue(new Error(ERROR_MESSAGE));
      expect(await consumer.main(params)).toMatchObject(
        INTERNAL_SERVER_ERROR_RESPONSE,
      );
    });
  });

  describe("When downstream returns an error", () => {
    logger.debug("When downstream returns an error");
    it.each([
      [HTTP_BAD_REQUEST, { success: false, error: "Invalid data" }],
      [HTTP_NOT_FOUND, { success: false, error: "Entity not found" }],
      [HTTP_INTERNAL_ERROR, { success: false, error: "Internal error" }],
    ])(
      "Then returns error response with the status code %p",
      async (statusCode, response) => {
        const type = "be-observer.catalog_product_create";
        const ACTION_RESPONSE = {
          response: {
            result: {
              body: response,
              statusCode,
            },
          },
        };
        const CONSUMER_RESPONSE = {
          error: {
            statusCode,
            body: {
              error: response.error,
            },
          },
        };
        const params = {
          type,
          data: {
            value: {
              sku: "SKU",
              name: "PRODUCT",
              description: "Product description",
              created_at: "2000-01-01",
              updated_at: "2000-01-01",
            },
          },
        };
        Openwhisk.prototype.invokeAction = jest
          .fn()
          .mockResolvedValue(ACTION_RESPONSE);
        expect(await consumer.main(params)).toMatchObject(CONSUMER_RESPONSE);
      },
    );
  });

  describe("When downstream returns a success response", () => {
    logger.debug("When downstream returns a success response");
    test("Then returns success response", async () => {
      const type = "be-observer.catalog_product_create";
      const ACTION_RESPONSE = {
        response: {
          result: {
            body: {
              success: true,
              message: "Success message",
            },
            statusCode: HTTP_OK,
          },
        },
      };
      const CONSUMER_RESPONSE = {
        statusCode: HTTP_OK,
        body: {
          type,
          response: {
            success: true,
            message: "Success message",
          },
        },
      };
      const params = {
        type: "be-observer.catalog_product_create",
        data: {
          value: {
            sku: "SKU",
            name: "PRODUCT",
            description: "Product description",
            created_at: "2000-01-01",
            updated_at: "2000-01-01",
          },
        },
      };
      Openwhisk.prototype.invokeAction = jest
        .fn()
        .mockResolvedValue(ACTION_RESPONSE);
      expect(await consumer.main(params)).toMatchObject(CONSUMER_RESPONSE);
    });
  });
});
