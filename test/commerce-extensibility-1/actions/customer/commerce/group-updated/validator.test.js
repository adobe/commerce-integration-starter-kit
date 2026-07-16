import { validateData } from "#src/customer/commerce/group-updated/validator";

describe("Validator of Customer group commerce updated action", () => {
  describe("When data received is valid", () => {
    test("Then returns success response", async () => {
      const response = await validateData({
        customer_group_code: "CODE",
      });

      expect(response).toEqual({
        success: true,
      });
    });
  });
  describe("When data received is invalid", () => {
    test("Then returns error response", async () => {
      const response = await validateData({});

      expect(response).toEqual({
        success: false,
        message: "missing parameter(s) 'customer_group_code'",
      });
    });
  });
  // @TODO Here you can add unit tests to cover the validation cases implemented in the customer updated validator file
});
