import { CommerceSdkValidationError } from "@adobe/aio-commerce-lib-core/error";

vi.mock("@adobe/aio-sdk", () => ({
  Core: { Logger: vi.fn() },
}));

import { Core } from "@adobe/aio-sdk";

vi.mock("@adobe/aio-commerce-lib-app", () => ({ publishEvent: vi.fn() }));

import { publishEvent } from "@adobe/aio-commerce-lib-app";

vi.mock("@adobe/aio-commerce-lib-events/io-events", () => ({
  createAdobeIoEventsApiClient: vi.fn(() => ({ id: "events-client" })),
}));

import { createAdobeIoEventsApiClient } from "@adobe/aio-commerce-lib-events/io-events";

vi.mock("@adobe/aio-commerce-sdk/auth", () => ({
  resolveImsAuthParams: vi.fn(() => ({ ims: "auth" })),
}));

import { resolveImsAuthParams } from "@adobe/aio-commerce-sdk/auth";

import * as action from "#src/ingestion/webhook/index";

const mockLoggerInstance = {
  info: vi.fn(),
  debug: vi.fn(),
  error: vi.fn(),
};
Core.Logger.mockReturnValue(mockLoggerInstance);

afterEach(() => {
  vi.clearAllMocks();
});

const validData = {
  uid: "product-123",
  event: "be-observer.catalog_product_create",
  value: {
    sku: "TEST_WEBHOOK_2",
    name: "Test webhook test",
    price: 52,
    description: "Test webhook description",
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
        provider: "backoffice",
        event: validData.event,
        payload: validData.value,
      });
      expect(response).toEqual({
        statusCode: 200,
        body: {
          response: {
            success: true,
            message: "Event published successfully",
          },
          type: validData.event,
        },
      });
    });
  });

  describe("When received data information is invalid", () => {
    test("Then returns error response", async () => {
      const response = await action.main({ data: {} });

      expect(publishEvent).not.toHaveBeenCalled();
      expect(response).toEqual({
        error: {
          statusCode: 400,
          body: {
            error: "missing parameter(s) 'data.uid,data.event,data.value'",
          },
        },
      });
    });
  });

  describe("When publishing the event fails", () => {
    test("Then returns error response", async () => {
      publishEvent.mockRejectedValueOnce(new Error("fake error"));

      const response = await action.main({ data: validData });

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: { error: "fake error" },
        },
      });
    });

    test("Then logs the details of a CommerceSdkValidationError", async () => {
      publishEvent.mockRejectedValueOnce(
        new CommerceSdkValidationError("Invalid event data", { issues: [] }),
      );

      const response = await action.main({ data: validData });

      expect(response).toEqual({
        error: {
          statusCode: 500,
          body: { error: "Invalid event data" },
        },
      });
      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        "Server error: Invalid event data",
      );
    });
  });
});
