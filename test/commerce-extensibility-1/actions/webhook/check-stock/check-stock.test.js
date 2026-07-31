import * as action from "#src/webhook/check-stock/index";

vi.mock("#src/webhook/check-stock/stock", () => ({
  checkAvailableStock: vi.fn(),
}));

import { checkAvailableStock } from "#src/webhook/check-stock/stock";

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("Given synchronous webhook action to check stock availability", () => {
  describe("When method main is defined", () => {
    test("Then is an instance of Function", () => {
      expect(action.main).toBeInstanceOf(Function);
    });
  });
  describe("When received data is valid", () => {
    test("Then returns webhook success response", async () => {
      const params = {
        data: {
          cart_id: "CART_ID",
          items: [
            {
              item_id: "ITEM_ID",
              qty: 1,
              sku: "SKU",
            },
          ],
        },
      };

      checkAvailableStock.mockResolvedValueOnce(
        Promise.resolve({
          success: true,
        }),
      );

      const response = await action.main(params);

      expect(response).toEqual({
        body: {
          op: "success",
        },
        statusCode: 200,
        type: "success",
      });
    });
  });
  describe("When received data is invalid", () => {
    test("Then returns webhook error response", async () => {
      const params = {};

      const response = await action.main(params);

      expect(response).toEqual({
        body: {
          message: "missing parameter(s) 'data.cart_id,data.items'",
          op: "exception",
        },
        statusCode: 200,
        type: "success",
      });
    });
  });
  describe("When check-stock downstream fails", () => {
    test("Then returns webhook error response", async () => {
      const params = {
        data: {
          cart_id: "CART_ID",
          items: [
            {
              item_id: "ITEM_ID",
              qty: 1,
              sku: "SKU",
            },
          ],
        },
      };

      checkAvailableStock.mockResolvedValueOnce(
        Promise.resolve({
          message: "no stock found",
          success: false,
        }),
      );

      const response = await action.main(params);

      expect(response).toEqual({
        body: {
          message: "no stock found",
          op: "exception",
        },
        statusCode: 200,
        type: "success",
      });
    });
  });
});
