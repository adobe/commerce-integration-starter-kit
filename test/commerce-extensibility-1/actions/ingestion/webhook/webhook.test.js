import { CommerceSdkValidationError } from "@adobe/aio-commerce-sdk/core/error";

vi.mock("@adobe/aio-lib-core-logging", () => ({
  default: vi.fn(),
}));

import AioLogger from "@adobe/aio-lib-core-logging";

vi.mock("@adobe/aio-commerce-lib-app", () => ({ publishEvent: vi.fn() }));

import { publishEvent } from "@adobe/aio-commerce-lib-app";

vi.mock("@adobe/aio-commerce-sdk/events/io-events", () => ({
  createAdobeIoEventsApiClient: vi.fn(() => ({ id: "events-client" })),
}));

import { createAdobeIoEventsApiClient } from "@adobe/aio-commerce-sdk/events/io-events";

vi.mock("@adobe/aio-commerce-sdk/auth", () => ({
  resolveImsAuthParams: vi.fn(() => ({ ims: "auth" })),
}));

import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";

import * as action from "#src/ingestion/webhook/index";

const mockLoggerInstance = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};
AioLogger.mockReturnValue(mockLoggerInstance);

afterEach(() => {
  vi.clearAllMocks();
});

const validData = {
  event: "be-observer.catalog_product_create",
  uid: "product-123",
  value: {
    description: "Test webhook description",
    name: "Test webhook test",
    price: 52,
    sku: "TEST_WEBHOOK_2",
  },
};

describe("Given external backoffice events ingestion webhook", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });

  describe("When received data information is valid", () => {
    test("Then publishes the event and returns success response", async () => {
      publishEvent.mockResolvedValueOnce(undefined);

      const response = await action.main({ data: validData });

      expect(createAdobeIoEventsApiClient).toHaveBeenCalledWith({
        auth: { ims: "auth" },
      });
      expect(resolveImsAuthParams).toHaveBeenCalled();
      expect(publishEvent).toHaveBeenCalledWith({
        client: { id: "events-client" },
        event: validData.event,
        payload: validData.value,
        provider: "backoffice",
      });
      expect(response).toEqual({
        body: {
          response: {
            message: "Event published successfully",
            success: true,
          },
          type: validData.event,
        },
        statusCode: 200,
        type: "success",
      });
    });
  });

  describe("When received data information is invalid", () => {
    test("Then returns error response", async () => {
      const response = await action.main({ data: {} });

      expect(publishEvent).not.toHaveBeenCalled();
      expect(response).toEqual({
        error: {
          body: {
            message: "missing parameter(s) 'data.uid,data.event,data.value'",
          },
          statusCode: 400,
        },
        type: "error",
      });
    });
  });

  describe("When publishing the event fails", () => {
    test("Then returns error response", async () => {
      publishEvent.mockRejectedValueOnce(new Error("fake error"));

      const response = await action.main({ data: validData });

      expect(response).toEqual({
        error: {
          body: { message: "fake error" },
          statusCode: 500,
        },
        type: "error",
      });
    });

    test("Then logs the details of a CommerceSdkValidationError", async () => {
      publishEvent.mockRejectedValueOnce(
        new CommerceSdkValidationError("Invalid event data", { issues: [] }),
      );

      const response = await action.main({ data: validData });

      expect(response).toEqual({
        error: {
          body: { message: "Invalid event data" },
          statusCode: 500,
        },
        type: "error",
      });
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        "Server error: Invalid event data",
      );
    });
  });
});
