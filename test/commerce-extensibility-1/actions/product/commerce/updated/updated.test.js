import * as action from "#src/product/commerce/updated/index";

vi.mock("#src/product/commerce/updated/validator");

import { validateData } from "#src/product/commerce/updated/validator";

const NEW_RECORD = {
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};
const EXISTING_RECORD = {
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-06-01T00:00:00.000Z",
};

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("Given product commerce updated action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When the record was not updated", () => {
    test("Then skips execution and returns success", async () => {
      const response = await action.main({ data: { value: NEW_RECORD } });

      expect(response).toEqual({
        statusCode: 200,
        type: "success",
        body: { message: "Skipped: product was not updated" },
      });
      expect(validateData).not.toHaveBeenCalled();
    });
  });
  describe("When invalid product updated event data is received", () => {
    test("Then returns action error response", async () => {
      const params = {
        data: { value: EXISTING_RECORD },
      };

      const ERROR_MESSAGE = "Invalid data";
      validateData.mockReturnValue({
        success: false,
        message: ERROR_MESSAGE,
      });

      const response = await action.main(params);

      expect(response).toEqual({
        type: "error",
        error: { statusCode: 400, body: { message: ERROR_MESSAGE } },
      });
    });
  });
  // @TODO Here you can add unit tests to cover the cases implemented in the product updated runtime action
});
