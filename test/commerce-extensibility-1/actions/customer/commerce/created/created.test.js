import * as action from "#src/customer/commerce/created/index";

vi.mock("#src/customer/commerce/created/validator");

import { validateData } from "#src/customer/commerce/created/validator";

const NEW_RECORD = {
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};
const EXISTING_RECORD = {
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-06-01T00:00:00.000Z",
};

beforeAll(() => {
  process.env.__AIO_DEV = "false";
});

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("Given customer commerce created action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When the record is not newly created", () => {
    test("Then skips execution and returns success", async () => {
      const response = await action.main({
        data: { value: EXISTING_RECORD },
        ENABLE_TELEMETRY: true,
      });

      expect(response).toEqual({
        statusCode: 200,
        body: {
          success: true,
          message: "Skipped: customer is not newly created",
        },
      });
      expect(validateData).not.toHaveBeenCalled();
    });
  });
  describe("When invalid customer created event data is received", () => {
    test("Then returns action error response", async () => {
      const params = {
        data: { value: NEW_RECORD },
        ENABLE_TELEMETRY: true,
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
  // @TODO Here you can add unit tests to cover the cases implemented in the customer created runtime action
});
