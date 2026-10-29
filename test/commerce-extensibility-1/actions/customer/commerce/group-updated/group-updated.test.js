import * as action from "#src/customer/commerce/group-updated/index";
import { validateData } from "#src/customer/commerce/group-updated/validator";

vi.mock("#src/customer/commerce/group-updated/validator");

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("Given customer group commerce updated action", () => {
  describe("When method main is defined", () => {
    it("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When invalid customer group updated event data is received", () => {
    it("Then returns action error response", async () => {
      const params = {
        data: {},
      };

      const ERROR_MESSAGE = "Invalid data";
      validateData.mockReturnValue({
        message: ERROR_MESSAGE,
        success: false,
      });

      const response = await action.main(params);

      expect(response).toEqual({
        error: { body: { message: ERROR_MESSAGE }, statusCode: 400 },
        type: "error",
      });
    });
  });

  // @TODO Here you can add unit tests to cover the cases implemented in the customer updated runtime action
});
