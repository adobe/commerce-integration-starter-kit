import { updateShipment } from "#src/order/commerce-shipment-api-client";
import * as sender from "#src/order/external/shipment-updated/sender";

vi.mock("#src/order/commerce-shipment-api-client");

describe("Given order external shipment updated sender", () => {
  describe("When method sendData is defined", () => {
    it("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    it("Then update order shipment is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(updateShipment).toHaveBeenCalled();
    });
  });
});
