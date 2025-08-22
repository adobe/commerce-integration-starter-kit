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

const action = require("../../../../../actions/product/commerce/deleted");
jest.mock("../../../../../actions/product/commerce/deleted/validator");
const {
  validateData,
} = require("../../../../../actions/product/commerce/deleted/validator");

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("Given product commerce deleted action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When invalid product deleted event data is received", () => {
    test("Then returns action error response", async () => {
      const params = {
        data: {},
      };

      const ERROR_MESSAGE = "Invalid data";
      validateData.mockReturnValue({
        success: false,
        message: ERROR_MESSAGE,
      });

      const response = await action.main(params);

      expect(response).toEqual({
        statusCode: 400,
        body: {
          success: false,
          error: ERROR_MESSAGE,
        },
      });
    });
  });
  // @TODO Here you can add unit tests to cover the cases implemented in the product deleted runtime action
});
