import * as action from "#src/customer/commerce/updated/index";
import { validateData } from "#src/customer/commerce/updated/validator";

vi.mock("#src/customer/commerce/updated/validator");

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

describe("Given customer commerce updated action", () => {
  describe("When method main is defined", () => {
    it("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When the record was not updated", () => {
    it("Then skips execution and returns success", async () => {
      const response = await action.main({ data: { value: NEW_RECORD } });

      expect(response).toEqual({
        body: { message: "Skipped: customer was not updated" },
        statusCode: 200,
        type: "success",
      });
      expect(validateData).not.toHaveBeenCalled();
    });
  });
  describe("When invalid customer updated event data is received", () => {
    it("Then returns action error response", async () => {
      const params = {
        data: { value: EXISTING_RECORD },
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
