vi.mock("#src/order/commerce-shipment-api-client");

import { updateShipment } from "#src/order/commerce-shipment-api-client";
import * as sender from "#src/order/external/shipment-updated/sender";

describe("Given order external shipment updated sender", () => {
  describe("When method sendData is defined", () => {
    test("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    test("Then update order shipment is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(updateShipment).toHaveBeenCalled();
    });
  });
});
