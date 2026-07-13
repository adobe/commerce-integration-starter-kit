/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

vi.mock("graphql-request", () => ({
  GraphQLClient: vi.fn().mockImplementation(() => ({
    request: vi.fn().mockResolvedValue({
      products: {
        items: [],
        total_count: 0,
      },
    }),
  })),
}));

import * as action from "#src/product/commerce/full-sync/index";

vi.mock("#src/product/commerce/full-sync/validator");
vi.mock("#src/product/commerce/full-sync/sender");
vi.mock("#src/product/commerce-product-graphql-client");

import { sendData } from "#src/product/commerce/full-sync/sender";
import { validateData } from "#src/product/commerce/full-sync/validator";
import { queryProducts } from "#src/product/commerce-product-graphql-client";

queryProducts.mockImplementation(() =>
  Promise.resolve({
    products: {
      items: [],
      total_count: 0,
    },
  }),
);

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("Given product commerce full sync action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });

  describe("When invalid product data is received", () => {
    test("Then returns action error response", async () => {
      const params = {};

      const ERROR_MESSAGE = "Invalid data";
      validateData.mockReturnValue({
        success: false,
        message: ERROR_MESSAGE,
      });

      const response = await action.main(params);

      expect(response).toEqual({
        statusCode: 200,
        body: {
          success: true,
          message: expect.stringContaining("completed with some errors"),
        },
      });
    });
  });

  describe("When GraphQL query fails", () => {
    test("Then returns action error response", async () => {
      const params = {};

      queryProducts.mockResolvedValue({
        errors: [{ message: "GraphQL error" }],
      });

      const response = await action.main(params);

      expect(response).toEqual({
        statusCode: 200,
        body: {
          success: true,
          message: expect.stringContaining("completed with some errors"),
        },
      });
    });
  });

  describe("When sending data fails", () => {
    test("Then returns action error response", async () => {
      const params = {};

      validateData.mockReturnValue({ success: true });
      queryProducts.mockResolvedValue({
        products: {
          items: [{ id: 1, name: "Product 1" }],
          total_count: 1,
        },
      });
      sendData.mockResolvedValue({
        success: false,
        message: "Failed to send data",
        statusCode: 400,
      });

      const response = await action.main(params);

      expect(response).toEqual({
        statusCode: 200,
        body: {
          success: true,
          message: expect.stringContaining("completed with some errors"),
        },
      });
    });
  });

  // @TODO Here you can add unit tests to cover the cases implemented in the product full sync runtime action
});
