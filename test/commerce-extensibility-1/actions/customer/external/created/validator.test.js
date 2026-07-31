import * as validator from "#src/customer/external/created/validator";

describe("Given customer external created validator", () => {
  describe("When method validateData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(validator.validateData).toBeInstanceOf(Function);
    });
  });
  describe("When data to validate is valid", () => {
    it.each([
      [{ data: { email: "john@doe.com", lastname: "Doe", name: "John" } }],
      [
        {
          data: {
            email: "john@doe.com",
            extra: "EXTRA",
            lastname: "Doe",
            name: "John",
          },
        },
      ],
    ])("Then for %o,  returns successful response", (params) => {
      const SUCCESSFUL_RESPONSE = { success: true };
      expect(validator.validateData(params)).toMatchObject(SUCCESSFUL_RESPONSE);
    });
  });
  describe("When data to validate is not valid", () => {
    it.each([
      [{ data: { lastname: "Doe", name: "John" } }],
      [
        {
          data: {
            email: { domain: "doe.com", username: "john" },
            lastname: "Doe",
            name: "John",
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
