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

const validator = require("../../../../../actions/stock/external/updated/validator");

describe("Given stock external updated validator", () => {
  describe("When method validateData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(validator.validateData).toBeInstanceOf(Function);
    });
  });
  describe("When data to validate is valid", () => {
    it.each([
      [
        {
          data: [
            { sku: "SKU1", source: "SOURCE1", quantity: 99, outOfStock: false },
            { sku: "SKU2", source: "SOURCE2", quantity: 66, outOfStock: true },
          ],
        },
      ],
      [
        {
          data: [
            {
              sku: "SKU1",
              source: "SOURCE1",
              quantity: 99,
              outOfStock: false,
              extra: "EXTRA",
            },
          ],
        },
      ],
    ])("Then for %o,  returns successful response", (params) => {
      const SUCCESSFUL_RESPONSE = { success: true };
      expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE);
    });
  });
  describe("When data to validate is not valid", () => {
    it.each([
      [{ data: { sku: "SKU", name: "NAME", description: "DESC" } }],
      [
        {
          data: {
            sku: "SKU",
            name: "NAME",
            price: "99.99",
            description: "DESC",
          },
        },
      ],
    ])("Then for %o,  returns error response", (params) => {
      const UNSUCCESSFUL_RESPONSE = { success: false };
      expect(validator.validateData(params)).toMatchObject(
        UNSUCCESSFUL_RESPONSE,
      );
    });
  });
});
