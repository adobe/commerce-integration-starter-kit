import * as validator from "#src/order/external/updated/validator";

describe("Given order external updated validator", () => {
  describe("When method validateData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(validator.validateData).toBeInstanceOf(Function);
    });
  });
  describe("When data to validate is valid", () => {
    it.each([
      [{ data: { id: 99, status: "completed" } }],
      [{ data: { id: 99, status: "completed", notifyCustomer: true } }],
      [
        {
          data: {
            id: 99,
            status: "completed",
            notifyCustomer: true,
            extra: "EXTRA",
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
      [{ data: { id: 99 } }],
      [{ data: { id: 99, status: "completed", notifyCustomer: 1 } }],
    ])("Then for %o,  returns error response", (params) => {
      const UNSUCCESSFUL_RESPONSE = { success: false };
      expect(validator.validateData(params)).toMatchObject(
        UNSUCCESSFUL_RESPONSE,
      );
    });
  });
});
