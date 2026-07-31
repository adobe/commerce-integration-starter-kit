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
          data: { description: "DESC", name: "NAME", price: 99.99, sku: "SKU" },
        },
      ], // required properties
      [
        {
          data: {
            description: "DESC",
            extra: "EXTRA",
            name: "NAME",
            price: 99.99,
            sku: "SKU",
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
      [{ data: { description: "DESC", name: "NAME", sku: "SKU" } }], // missing required properties
      [
        {
          data: {
            description: "DESC",
            name: "NAME",
            price: "99.99",
            sku: "SKU",
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
