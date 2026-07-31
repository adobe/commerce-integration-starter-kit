vi.mock("#src/customer/external/group-created/validator");

import { validateData } from "#src/customer/external/group-created/validator";

vi.mock("#src/customer/external/group-created/sender");

import {
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
} from "@adobe/aio-commerce-sdk/core/responses";

import * as action from "#src/customer/external/group-created/index";
import { sendData } from "#src/customer/external/group-created/sender";

describe("Given customer group external created action", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When customer event data is invalid", () => {
    test("Then returns action error response", async () => {
      const IGNORED_PARAMS = { data: {} };
      const FAILED_VALIDATION_RESPONSE = {
        message: "Data provided does not validate with the schema",
        success: false,
      };
      const ERROR_RESPONSE = {
        error: {
          body: { message: "Data provided does not validate with the schema" },
          statusCode: HTTP_BAD_REQUEST,
        },
        type: "error",
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
        error: {
          body: { message: ERROR.message },
          statusCode: HTTP_INTERNAL_SERVER_ERROR,
        },
        type: "error",
      };
      validateData.mockReturnValue(SUCCESSFUL_VALIDATION_RESPONSE);
      sendData.mockRejectedValue(ERROR);
      expect(await action.main(IGNORED_PARAMS)).toMatchObject(ERROR_RESPONSE);
    });
  });
  describe("When customer event data is valid", () => {
    test("Then returns action success response", async () => {
      const IGNORED_PARAMS = { data: {} };
      const SUCCESSFUL_VALIDATION_RESPONSE = {
        success: true,
      };
      const SUCCESSFUL_SEND_DATA_RESPONSE = {
        response: "anything",
        success: true,
      };
      const SUCCESS_RESPONSE = { statusCode: HTTP_OK, type: "success" };
      validateData.mockReturnValue(SUCCESSFUL_VALIDATION_RESPONSE);
      sendData.mockReturnValue(SUCCESSFUL_SEND_DATA_RESPONSE);
      expect(await action.main(IGNORED_PARAMS)).toMatchObject(SUCCESS_RESPONSE);
    });
  });
});
