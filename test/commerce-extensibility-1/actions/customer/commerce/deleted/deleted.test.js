import * as action from "#src/customer/commerce/deleted/index";

vi.mock("#src/customer/commerce/deleted/validator");

import { validateData } from "#src/customer/commerce/deleted/validator";

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("Given customer commerce deleted action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When invalid customer deleted event data is received", () => {
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

  // @TODO Here you can add unit tests to cover the cases implemented in the customer deleted runtime action
});
