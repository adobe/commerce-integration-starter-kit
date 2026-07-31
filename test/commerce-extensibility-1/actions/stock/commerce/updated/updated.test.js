import * as action from "#src/stock/commerce/updated/index";

vi.mock("#src/stock/commerce/updated/validator");

import { validateData } from "#src/stock/commerce/updated/validator";

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});
describe("Given stock item commerce updated action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When invalid stock item updated event data is received", () => {
    test("Then returns action error response", async () => {
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
  // @TODO Here you can add unit tests to cover the cases implemented in the stock item updated runtime action
});
