import * as action from "#src/order/commerce/created/index";

vi.mock("#src/order/commerce/created/validator");

import { validateData } from "#src/order/commerce/created/validator";

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

describe("Given order commerce created action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When the record is not newly created", () => {
    test("Then skips execution and returns success", async () => {
      const response = await action.main({ data: { value: EXISTING_RECORD } });

      expect(response).toEqual({
        body: { message: "Skipped: order is not newly created" },
        statusCode: 200,
        type: "success",
      });
      expect(validateData).not.toHaveBeenCalled();
    });
  });
  describe("When order event data is invalid", () => {
    test("Then returns action error response", async () => {
      const params = {
        data: { value: NEW_RECORD },
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
  // @TODO Here you can add unit tests to cover the cases implemented in the order created runtime action
});
