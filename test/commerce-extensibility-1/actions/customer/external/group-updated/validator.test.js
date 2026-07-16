import * as validator from "#src/customer/external/group-updated/validator";

describe("Given customer group external updated validator", () => {
  describe("When method validateData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(validator.validateData).toBeInstanceOf(Function);
    });
  });
  describe("When data to validate is valid", () => {
    it.each([
      [{ data: { id: 8, name: "NAME", taxClassId: 99 } }], // required properties
      [{ data: { id: 8, name: "NAME", taxClassId: 99, description: "DESC" } }], // additional properties
    ])("Then for %o,  returns successful response", (params) => {
      const SUCCESSFUL_RESPONSE = { success: true };
      expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE);
    });
  });
  describe("When data to validate is not valid", () => {
    it.each([
      [{ data: { id: 8, name: "NAME" } }], // missing required properties
      [{ data: { id: "8", name: "NAME", taxClassId: 99 } }], // wrong type property
    ])("Then for %o,  returns error response", (params) => {
      const UNSUCCESSFUL_RESPONSE = { success: false };
      expect(validator.validateData(params)).toMatchObject(
        UNSUCCESSFUL_RESPONSE,
      );
    });
  });
});
