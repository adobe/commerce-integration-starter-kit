vi.mock("#src/order/commerce-shipment-api-client");

import { createShipment } from "#src/order/commerce-shipment-api-client";
import * as sender from "#src/order/external/shipment-created/sender";

describe("Given order external shipment created sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then create order shipment is called", async () => {
      const params = { data: { id: 99 } };
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(createShipment).toHaveBeenCalled();
    });
  });
});
