import * as validator from "#src/stock/external/updated/validator";

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
            { outOfStock: false, quantity: 99, sku: "SKU1", source: "SOURCE1" },
            { outOfStock: true, quantity: 66, sku: "SKU2", source: "SOURCE2" },
          ],
        },
      ],
      [
        {
          data: [
            {
              extra: "EXTRA",
              outOfStock: false,
              quantity: 99,
              sku: "SKU1",
              source: "SOURCE1",
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
      [{ data: { description: "DESC", name: "NAME", sku: "SKU" } }],
      [
        {
          data: {
            description: "DESC",
            name: "NAME",
            price: "99.99",
            sku: "SKU",
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
