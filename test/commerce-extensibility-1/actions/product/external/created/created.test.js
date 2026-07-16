vi.mock("#src/product/external/created/validator");

import { validateData } from "#src/product/external/created/validator";

vi.mock("#src/product/external/created/sender");

import { HTTP_BAD_REQUEST, HTTP_INTERNAL_ERROR, HTTP_OK } from "#lib/constants";
import * as action from "#src/product/external/created/index";
import { sendData } from "#src/product/external/created/sender";

describe("Given product external created action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When product event data is invalid", () => {
    test("Then returns action error response", async () => {
      const IGNORED_PARAMS = { data: {} };
      const FAILED_VALIDATION_RESPONSE = {
        success: false,
        message: "Data provided does not validate with the schema",
      };
      const ERROR_RESPONSE = {
        statusCode: HTTP_BAD_REQUEST,
        body: {
          success: false,
          error: "Data provided does not validate with the schema",
        },
      };
      validateData.mockReturnValue(FAILED_VALIDATION_RESPONSE);
      expect(await action.main(IGNORED_PARAMS)).toMatchObject(ERROR_RESPONSE);
    });
  });
  describe("When an exception is thrown", () => {
    test("Then return action error response", async () => {
      const IGNORED_PARAMS = { data: {} };
      const SUCCESSFUL_VALIDATION_RESPONSE = {
        success: true,
      };
      const ERROR = new Error("generic error");
      const ERROR_RESPONSE = {
        statusCode: HTTP_INTERNAL_ERROR,
        body: {
          success: false,
          error: ERROR.message,
        },
      };
      validateData.mockReturnValue(SUCCESSFUL_VALIDATION_RESPONSE);
      sendData.mockRejectedValue(ERROR);
      expect(await action.main(IGNORED_PARAMS)).toMatchObject(ERROR_RESPONSE);
    });
  });

  describe("When product event data is valid", () => {
    test("Then returns action success response", async () => {
      const IGNORED_PARAMS = { data: {} };
      const SUCCESSFUL_VALIDATION_RESPONSE = {
        success: true,
      };
      const SUCCESSFUL_SEND_DATA_RESPONSE = {
        success: true,
        response: "anything",
      };
      const SUCCESS_RESPONSE = {
        statusCode: HTTP_OK,
        body: {
          success: true,
        },
      };
      validateData.mockReturnValue(SUCCESSFUL_VALIDATION_RESPONSE);
      sendData.mockReturnValue(SUCCESSFUL_SEND_DATA_RESPONSE);
      expect(await action.main(IGNORED_PARAMS)).toMatchObject(SUCCESS_RESPONSE);
    });
  });
});
