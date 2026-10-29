import { updateStock } from "#src/stock/commerce-stock-api-client";
import * as sender from "#src/stock/external/updated/sender";

vi.mock("#src/stock/commerce-stock-api-client");

describe("Given stock external updated sender", () => {
  describe("When method sendData is defined", () => {
    it("Then is an instance of Function", () => {
      expect(sender.sendData).toBeInstanceOf(Function);
    });
  });
  describe("When method sendData is called", () => {
    it("Then update stock is called", async () => {
      const params = {};
      const transformed = {};
      const preprocess = {};
      await sender.sendData(params, transformed, preprocess);
      expect(updateStock).toHaveBeenCalled();
    });
  });
});
