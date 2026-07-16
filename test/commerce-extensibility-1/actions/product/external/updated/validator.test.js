import * as validator from "#src/product/external/updated/validator";

describe("Given product external updated validator", () => {
  describe("When method validateData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(validator.validateData).toBeInstanceOf(Function);
    });
  });
  describe("When data to validate is valid", () => {
    it.each([
      [
        {
          data: { sku: "SKU", name: "NAME", price: 99.99, description: "DESC" },
        },
      ], // required properties
      [
        {
          data: {
            sku: "SKU",
            name: "NAME",
            price: 99.99,
            description: "DESC",
            extra: "EXTRA",
          },
        },
      ], // additional properties
    ])("Then for %o,  returns successful response", (params) => {
      const SUCCESSFUL_RESPONSE = { success: true };
      expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE);
    });
  });
  describe("When data to validate is not valid", () => {
    it.each([
      [{ data: { sku: "SKU", name: "NAME", description: "DESC" } }], // missing required properties
      [
        {
          data: {
            sku: "SKU",
            name: "NAME",
            price: "99.99",
            description: "DESC",
          },
        },
      ], // wrong type property
    ])("Then for %o, returns error response", (params) => {
      const UNSUCCESSFUL_RESPONSE = { success: false };
      expect(validator.validateData(params)).toMatchObject(
        UNSUCCESSFUL_RESPONSE,
      );
    });
  });
});
